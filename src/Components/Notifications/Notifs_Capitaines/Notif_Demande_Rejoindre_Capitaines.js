import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import DatesHelpers  from '../../../Helpers/DatesHelpers'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'
import firebase from 'firebase'
import '@firebase/firestore'

const ACCEPTER  = "ACCEPTER"
const REFUSER = "REFUSER"
/**
 * Notifiction affichée si un on a demander au joueur de devenir capitaine d'une équipe.
 */
class Notif_Demande_Rejoindre_Capitaines extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            equipe: undefined,
            emetteur : undefined,
            isLoading : true,
            a_accepte : false,
            a_refuse : false,
        }
    }

    componentDidMount(){
        this.getData()
    }


    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {

        // Données de l'équipe concernée
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données de la partie 
        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")

        var a_accepte = equipe.capitaines.includes(LocalUser.data.id)
        var a_refuse = ! equipe.capitaines.includes(LocalUser.data.id) && ! equipe.capitainesAttentes.includes(LocalUser.data.id)
        this.setState({ emetteur : emetteur, equipe : equipe,isLoading : false, a_accepte : a_accepte, a_refuse : a_refuse})
    }

    gotoFicheEquipe() {
        this.props.navigation.navigate("Profil_Equipe", {equipeId : this.state.equipe.id})
    }
   

    alertAccepterRefuser(option) {
        var txt = "accepter"
        if(option == REFUSER) txt = "refuser"
        Alert.alert(
            '',
            'Tu souhaites ' + txt  + " d'être capitaine de l'équipe " + this.nomEquipe() ,
            [
                {text: 'Confirmer', onPress: async() =>  {
                    if(option == ACCEPTER) this.accepter()
                    if(option == REFUSER) this.refuser()
                }},
                {
                  text: 'Annuler',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ], 
        )
    }

    /**
     * Fonction qui enlève l'utilisateur des capitaines en attente et l'ajoute dans 
     * la liste des capitaines
     */
    async accepter() {
        this.setState({isLoading : true})
        var db = Database.initialisation()
        var equipeRef = db.collection("Equipes").doc(this.state.equipe.id)
        
        await equipeRef.update({
            capitainesAttentes :  firebase.firestore.FieldValue.arrayRemove(LocalUser.data.id)
        })

        await equipeRef.update({
            capitaines :  firebase.firestore.FieldValue.arrayUnion(LocalUser.data.id)
        })

        await this.envoyerNotifAccepter()

        this.setState({isLoading : false, a_accepte : true})

    }

    /**
     * Fonction qui enlève l'utilisateur des capitaines en attente 
     */
    async refuser() {
        this.setState({isLoading : true})
        var db = Database.initialisation()
        var equipeRef = db.collection("Equipes").doc(this.state.equipe.id)
        
        await equipeRef.update({
            capitainesAttentes :  firebase.firestore.FieldValue.arrayRemove(LocalUser.data.id)
        })


        await this.envoyerNotifRefuser()

        this.setState({isLoading : false, a_refuse : true})

    }

     
    // ===========================================================================
    // ========================== NOTIFICATIONS ==================================
    // ===========================================================================
    
    

    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    async sendPushNotification(token , title,body ) {
        return fetch('https://exp.host/--/api/v2/push/send', {
          body: JSON.stringify({
            to: token,
            title: title,
            body: body,
            data: { message: `${title} - ${body}` },
           
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }).catch(function(error) {
            console.log("ERROR :", error)
        }).then(function(error) {
            console.log("THEN", error)
        });
    }



    /**
     * Fonction qui envoie une notifications à l'éméteur pour lui dire que l'utilisateur
     * a accepté la demande, et envoie aussi la notif à tous les joueurs de l'équipe.
     */
    async envoyerNotifAccepter() {

        var db = Database.initialisation()
        var titre = "Nouvelle notif"
        var corps = LocalUser.data.pseudo + " a accepté  d'être capitaine de l'équipe " + this.nomEquipe()
        var tokens = []
        if(this.state.emetteur.tokens != undefined) tokens = this.state.emetteur.tokens
        for(var k = 0; k < tokens.length; k++) {
            await this.sendPushNotification(tokens[k],titre,corps)
        }
        await this.storeNotifAccepterInDb(this.state.emetteur.id)
        

        for(var i = 0; i < this.state.equipe.joueurs.length; i++){
            var corps =  LocalUser.data.pseudo + " est maintenant capitaine de l'équipe " + this.nomEquipe()
            var joueurId = this.state.equipe.joueurs[i]
            if(joueurId != this.state.emetteur.id && joueurId != LocalUser.data.id){
                await this.storeNotifNewCap(joueurId)
                var joueur = await Database.getDocumentData(joueurId, "Joueurs")
                var tokens = []
                

                if(joueur.tokens != undefined) tokens = joueur.tokens
                for(var k = 0; k < tokens.length; k++) {
                    await this.sendPushNotification(tokens[k],titre,corps)
                }
            }
        }
    }


    async storeNotifAccepterInDb(recepteur) {
        var db = Database.initialisation()
        
        await db.collection("Notifs").add({
            time : new Date(),
            dateParse : Date.parse(new Date()),
            emetteur : LocalUser.data.id,
            recepteur : recepteur,
            equipe : this.state.equipe.id,
            type : Types_Notification.ACCEPTE_DEMANDE_CAPITAINE
        }).then(console.log("notif store"))
        .catch(function(error) {console.log(error)})
    }


    async storeNotifNewCap(recepteur) {
        var db = Database.initialisation()
        
        await db.collection("Notifs").add({
            time : new Date(),
            dateParse : Date.parse(new Date()),
            emetteur : LocalUser.data.id,
            recepteur : recepteur,
            equipe : this.state.equipe.id,
            type : Types_Notification.NEW_CAP
        }).then(console.log("notif store"))
        .catch(function(error) {console.log(error)})
    }



    /**
     * Fonction qui envoie une notifications à l'éméteur pour lui dire que l'utilisateur
     * a refusé la demande
     */
    async envoyerNotifRefuser() {

        var db = Database.initialisation()
        var titre = "Nouvelle notif"
        var corps = LocalUser.data.pseudo + " a refusé  d'être capitaine de l'équipe " + this.nomEquipe()
        var tokens = []
        if(this.state.emetteur.tokens != undefined) tokens = this.state.emetteur.tokens
        for(var k = 0; k < tokens.length; k++) {
            await this.sendPushNotification(tokens[k],titre,corps)
        }
        await this.storeNotifRefuserInDb(this.state.emetteur.id)

     
    }


    async storeNotifRefuserInDb(recepteur) {
        var db = Database.initialisation()
        
        await db.collection("Notifs").add({
            time : new Date(),
            dateParse : Date.parse(new Date()),
            emetteur : LocalUser.data.id,
            recepteur : recepteur,
            equipe : this.state.equipe.id,
            type : Types_Notification.REFUS_DEMANDE_CAPITAINE
        }).then(console.log("notif store"))
        .catch(function(error) {console.log(error)})
    }



    renderPhotoEquipe() {
        if(this.state.equipe != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.equipe.photo}} 
                        style = {{height : hp('8%'), width : hp('8%'), borderRadius : hp('4%'), marginRight : wp('3%'), marginLeft: wp('3%')}}   
                    />
                    </View>
                    
            )
        } else {
            return(
                <View
                    style = {{height : hp('8%'), width : hp('8%'), borderRadius : hp('4%'), backgroundColor : "gray", marginRight : wp('3%'),marginLeft : wp('3%'), justifyContent : 'center'}}   
                /> 
            )
        }
    }

    nomEquipe(){
        if(this.state.equipe != undefined) {
            return this.state.equipe.nom
        } else {
            return '___'
        }
    }

    nomEmetteur(){
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.pseudo
        } else {
            return '___'
        }
    }

    

    chooseOptionToRender(){
        if(this.state.a_accepte) {
            return(
                <Text style = {{marginTop : hp('1%')}}>{"Tu es devenu capitaine de l'équipe\n"+ this.nomEquipe()}</Text>
            )
        } else if(this.state.a_refuse) {
            return(
                <Text style = {{marginTop : hp('1%')}}>{"Tu as refusé d'être capitaine de l'équipe\n" + this.nomEquipe()}</Text>
            )
        } else {
            return(
                <View>
                    <Text>Le capitaine {this.nomEmetteur()} souhaite t'ajouter</Text>
                        <Text>en capitaine de l'équipe {this.nomEquipe()}</Text>
                        
                        <TouchableOpacity 
                        onPress = {() => this.gotoFicheEquipe()}>
                            <Text style = {styles.txtBtn}>Consulter</Text>
                        </TouchableOpacity>
                  

                    <View style = {{flexDirection : "row"}}>
                        <TouchableOpacity
                            onPress = {() => this.alertAccepterRefuser(ACCEPTER)}>
                            <Text style = {styles.txtBtn}>Accepter</Text>
                        </TouchableOpacity>

                        <Text>   /   </Text>

                        <TouchableOpacity
                            onPress = {() => this.alertAccepterRefuser(REFUSER)}>
                            <Text style = {styles.txtBtn}>Refuser</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    render(){
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('3%')}
                />
            )
        } else {
            return(
                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEquipe()}
                    </View>
                    <View>
                        {this.chooseOptionToRender()}
                    </View>
                </View>
            )
        }
    }
} 
const styles = {
    txtBtn : {
        fontWeight : "bold"
    }
}
export default withNavigation(Notif_Demande_Rejoindre_Capitaines)
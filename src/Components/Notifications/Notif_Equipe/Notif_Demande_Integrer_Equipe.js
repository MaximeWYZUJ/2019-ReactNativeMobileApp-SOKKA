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


class Notif_Demande_Integrer_Equipe extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            emetteur: undefined,
            equipe : undefined, 
            isLoading : true,
            a_accepte : false,
            a_refuse : false
        }
    }

    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {

        console.log("in get data")
        // Données de l'équipe concernée
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données de la partie 
        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")

        var a_accepte = equipe.joueurs.includes(emetteur.id) && ! equipe.joueursAttentes.includes(emetteur.id)
        var a_refuse = ! equipe.joueurs.includes(emetteur.id) && ! equipe.joueursAttentes.includes(emetteur.id)
        this.setState({ emetteur : emetteur, equipe : equipe,isLoading : false, a_accepte : a_accepte, a_refuse : a_refuse})
    }


    componentDidMount() {
        this.getData()
    }

    async goToProfilJoueur() {
        if(this.state.emetteur!= undefined) {
            var emetteur = this.state.emetteur

            emetteur.naissance = new Date(emetteur.naissance.toDate());

            var equipes = await Database.getArrayDocumentData(emetteur.equipes, "Equipes")
            this.props.navigation.push("ProfilJoueur", {id: this.state.emetteur.id, joueur : emetteur, equipes : equipes, reseau : []})
        }
    }



    /**
     * Fonction appellée si l'utilisateur refuse l'invitation à rajoindre l'équipe
     */
    async RefuserConvocation() {
        this.setState({isLoading : true})
        await this.sendNotifRefu()
        if(this.state.equipe.id != undefined) {
            // Supprimer le joueur de la liste des joueurs de l'équipe
            var db = Database.initialisation()
            var equipeRef = db.collection("Equipes").doc(this.state.equipe.id)
            equipeRef.update({
                //joueurs : firebase.firestore.FieldValue.arrayRemove(this.state.emetteur.id),
                joueursAttentes : firebase.firestore.FieldValue.arrayRemove(this.state.emetteur.id)

            }).then(console.log("ok doc  joueur"))
            .catch(function(error) {console.log(error)})

            // Supprimer l'équipe de la liste des équipe du joueur
            var joueurRef = db.collection("Joueurs").doc(this.state.emetteur.id)
            joueurRef.update({
                equipes : firebase.firestore.FieldValue.arrayRemove(this.state.equipe.id)
            }).then(console.log("ok doc equipes du joueur "))
            .catch(function(error) {console.log(error)})
        }


        // On enregistre dans la base de données les notifications
        db.collection("Notifs").add({
            emetteur : LocalUser.data.id,
            recepteur : this.state.emetteur.id,
            type : Types_Notification.REFUSER_DEMANDE_INTEGRATION_EQUIPE,
            time : new Date(),
            dateParse : Date.parse(new Date()),
            equipe : this.state.equipe.id
        }).then(console.log("ok doc "))
        .catch(function(error) {console.log(error)})
        
        this.setState({a_refuse : true, isLoading : false})

    }


    async accepterInvitation() {
        this.setState({isLoading : true})

        await this.sendNotifAccepter()
        if(this.state.equipe.id != undefined) {
            // Supprimer le joueur de la liste des joueurs en attente et l'ajouter aux joueurs de l'équipe
            var db = Database.initialisation()
            var equipeRef = db.collection("Equipes").doc(this.state.equipe.id)
            equipeRef.update({
                joueurs : firebase.firestore.FieldValue.arrayUnion(this.state.emetteur.id),
                joueursAttentes : firebase.firestore.FieldValue.arrayRemove(this.state.emetteur.id),
                nbJoueurs  : this.state.equipe.nbJoueurs +1

            }).then(console.log("ok doc  EQUIPE"))
            .catch(function(error) {console.log(error)})

            var joueurRef = db.collection("Joueurs").doc(this.state.emetteur.id)
            joueurRef.update({
                equipes : firebase.firestore.FieldValue.arrayUnion(this.state.equipe.id)
            }).then(console.log("ok doc equipes du joueur "))

        }


        // On enregistre dans la base de données les notifications
        db.collection("Notifs").add({
            emetteur : LocalUser.data.id,
            recepteur : this.state.emetteur.id,
            type : Types_Notification.ACCEPTER_DEMANDE_INTEGRATION_EQUIPE,
            time : new Date(),
            dateParse : Date.parse(new Date()),
            equipe : this.state.equipe.id
        }).then(console.log("ok doc notif "))
        .catch(function(error) {console.log(error)})
        
        this.setState({a_accepte : true, isLoading : false})
    }

    alertRefuser() {
        Alert.alert(
            '',
            "Tu souhaites refuser d'intégrer "+ this.renderNomEmetteur() + " dans ton équipe " + this.renderNomEquipe(),
            [
                {text: 'Confirmer', onPress: async() =>  await this.RefuserConvocation()},
                {
                  text: 'Annuler',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ], 
        )
    }

    alertAccepter() {
        Alert.alert(
            '',
            "Tu souhaites accepter d'intégrer "+ this.renderNomEmetteur() + " dans ton équipe " + this.renderNomEquipe(),
            [
                {text: 'Confirmer', onPress: async() =>  await this.accepterInvitation()},
                {
                  text: 'Annuler',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ], 
        )
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
     * Fonction qui envoie une notification de refus à chaque capitaine de l'équipe
     */
    async sendNotifRefu() {
        var titre = "Nouvelle notif"
        var corps = "L'équipe " + this.renderNomEquipe() + " a refusé ton intégration dans l'équipe"
        var tokens = []
        if(this.state.emetteur.tokens != undefined) tokens = this.state.emetteur.tokens
        for(var i =0 ; i < tokens.length; i++) {
            await this.sendPushNotification(tokens[i], titre,corps)
        }        
    }



    /**
     * Fonction qui envoie une notification de refus à chaque capitaine de l'équipe
     */
    async sendNotifAccepter() {
        var titre = "Nouvelle notif"
        var corps = "L'équipe " + this.renderNomEquipe() + " a accepté ton intégration dans l'équipe"
        var tokens = []
        if(this.state.emetteur.tokens != undefined) tokens = this.state.emetteur.tokens
        for(var i =0 ; i < tokens.length; i++) {
            await this.sendPushNotification(tokens[i], titre,corps)
        }     


        // Envoyer l'info à tous les autres joueurs
        corps = this.renderNomEmetteur() + " a intégré ton équipe "
        corps   = corps + this.state.equipe.nom + "." 
        for(var i = 0; i <this.state.equipe.joueurs.length; i++) {
            id = this.state.equipe.joueurs[i]
            console.log("id ", id)
            if(id != this.state.emetteur.id && ! this.state.equipe.capitaines.includes(id)) {
                var joueur = await Database.getDocumentData(id,"Joueurs")
                var tokens = [] 
                if(joueur.tokens != undefined) tokens = joueur.tokens
                console.log("before boucle send notif", tokens)
                console.log("before boucle send notif", tokens.length)

                for(var k = 0; k < tokens.length; k++) {
                    console.log("==== ", tokens[k])
                    await this.sendPushNotification(tokens[k], titre, corps)
                }
            }
        }
    }





    renderPhotoEmetteur() {
        if(this.state.emetteur != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.emetteur.photo}} 
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


    renderNomEmetteur() {
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.pseudo
        } else {
            return "__"
        }
    }

   

    renderNomEquipe() {
        if(this.state.equipe != undefined) {
            return(this.state.equipe.nom)
        } else {
            return "___"
        }
    }

    choseOptionToRender() {
        if(!this.state.a_accepte && ! this.state.a_refuse) {
            return(
                <View>
                        <Text> {this.renderNomEmetteur()} souhaite intégrer ton équipe </Text>
                        <Text>{this.renderNomEquipe()}</Text>

                        <TouchableOpacity
                            onPress = {() => this.goToProfilJoueur()}
                            >
                            <Text style = {styles.txtBtn}>Consulter</Text>
                        </TouchableOpacity>

                        <View style = {{flexDirection : "row"}}>
                            <TouchableOpacity
                                onPress = {() => this.alertAccepter()}
                                >
                                <Text style = {styles.txtBtn}>Accepter</Text>
                            </TouchableOpacity>
                        
                            <Text>  /  </Text>

                            <TouchableOpacity
                                onPress = {() => this.alertRefuser()}
                                >
                                <Text style = {styles.txtBtn}>Refuser</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            )
        } else if(this.state.a_accepte) {
            return(
                <View>
                    <Text>Tu as accepté la demande de {this.state.emetteur.pseudo} pour</Text>
                    <Text>intégrer ton équipe {this.state.equipe.nom}</Text>
                </View>
            )
        } else if(this.state.a_refuse) {
            return(
                <View>
                    <Text>Tu as refusé la demande de {this.state.emetteur.pseudo} pour</Text>
                    <Text>intégrer ton équipe {this.state.equipe.nom}</Text>
                </View>
            )
        }
    }


    render() {
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
                        {this.renderPhotoEmetteur()}
                    </View>
                    <View>
                        {this.choseOptionToRender()}
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
export default withNavigation(Notif_Demande_Integrer_Equipe)
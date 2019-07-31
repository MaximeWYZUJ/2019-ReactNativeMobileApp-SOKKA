
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'

/**
 * Classe qui permet d'afficher les notfications pour accèpter ou non une
 * équipe qui à relevée un défi posté par une des équipes dont l'utilisateur
 * est capitaine
 */
class Notif_Accepter_Releve_Defi extends React.Component {

    constructor(props) {
        super(props) 
        this.state = {
            isLoading : true,
            emetteur : undefined,
            equipeEmettrice : undefined,
            defi : undefined,
            equipeReceptrice : undefined,
            defis_valide : false,
            defis_refuse : false
        }
    }
    componentDidMount() {
        this.getData()
    }


    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {

       
        // Données des équipes concernées
        var equipeEmettrice = await Database.getDocumentData(this.props.notification.equipeEmettrice, "Equipes")
        var equipeReceptrice = await Database.getDocumentData(this.props.notification.equipeReceptrice, "Equipes")
        
        // Données de l'émeteur 
        //var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        console.log("after emeteur equipe")
        // Données du défi 
        var defi = await Database.getDocumentData(this.props.notification.defi, "Defis")
        this.setState({equipeEmettrice :equipeEmettrice , equipeReceptrice : equipeReceptrice, defi : defi, defis_valide : defi.defis_valide, defis_refuse  : defi.defis_refuse, isLoading : false})
    }

     
    /**
     * Pour se rendre dans la fiche du defi
     */
    goToFicheDefi() {
       
        var defi = this.state.defi
        defi["defis_valide"] = this.state.defis_valide
        defi["defis_refuse"] = this.state.defis_refuse

        this.setState({defi : defi})
        this.props.navigation.navigate("FicheDefiRejoindre",
            {
                defi : this.state.defi,
                equipeOrganisatrice : this.state.equipeReceptrice,
                equipeDefiee : this.state.equipeEmettrice
            } 
        )
        
    }


     /**
     * Fonction qui va être appelée au moment où l'utilisateur annule sa
     * présence. 
     */
    handleConfirmerNon() {
        if(new Date(this.state.defi.jour.seconds *1000) > new Date())  {
            Alert.alert(
                '',
                "Tu souhaites refuser le défi relevé par l'équipe " + this.state.equipeEmettrice.nom,
                [
                    {text: 'Oui', onPress: () => this.refuserDefis()},
                    {
                    text: 'Non',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                    },
                ],
            )
        }else {
            Alert.alert(
                '',
                "Le défi est déja passé"
                
            )  
        }

    }

    /**
     * Fonction qui va être appelée au moment où l'utilisateur confirme sa
     * présence. 
     */
    handleConfirmerOui() {
        if(new Date(this.state.defi.jour.seconds *1000) > new Date())  {

            Alert.alert(
                '',
                "Tu souhaites accepter le défi relevé par l'équipe " + this.state.equipeEmettrice.nom,
                [
                    {text: 'Oui', onPress: () => this.accepterDefis()},
                    {
                    text: 'Non',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                    },
                ],
            )
        }else {
            Alert.alert(
                '',
                "Le défi est déja passé"
                
            )  
        }

    }

    /**
     * Fonction qui permet d'accepter le défi
     */
    async accepterDefis() {
        await this.storeNotifDefis(Types_Notification.ACCEPTER_EQUIPE_DEFIEE)
        var db = Database.initialisation()
        if(this.state.defi != undefined) {
            this.setState({defis_valide : true, defis_refuse : false})
            db.collection("Defis").doc(this.state.defi.id).update({
                defis_valide : true,
                defis_refuse : false
            })
        }
    }

    /**
     * Fonction qui permet de refuser le défi
     */
    async refuserDefis() {
        await this.storeNotifDefis(Types_Notification.REFUSER_EQUIPE_DEFIEE)
        var db = Database.initialisation()
        if(this.state.defi != undefined) {
            this.setState({defis_valide : false, defis_refuse : true})
            db.collection("Defis").doc(this.state.defi.id).update({
                defis_valide : false,
                defis_refuse : true
            })
        }
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
     * Fonction qui va permettre d'envoyer les notifications aux capitaines
     * de l'équipe défiee
     */
    async sendNotifsToCapitainesDefiee(type){
        var txt = "accepté"
        if(type == Types_Notification.REFUSER_EQUIPE_DEFIEE) {
            txt = "refusé"
        }
        var titre = "Nouvelle notif"
        var corps = "L'équipe " + this.state.equipeReceptrice.nom + " a " + txt + " de vous défier"
        for(var i = 0; i < this.state.equipeEmettrice.capitaines.length; i++) {
            console.log("début boucle")

            var id = this.state.equipeEmettrice.capitaines[i]

            var cap = await Database.getDocumentData(id, "Joueurs")
            console.log("after get cap in db")
            var tokens = []
            if(cap.tokens != undefined) tokens = cap.tokens
            for(var k = 0; k < tokens.length; k++) {
                await this.sendPushNotification(tokens[k], titre,corps)
            }
        }
    }



    /**
     * Fonction qui va permettre de sauvegarder les notifications dans la base de données.
     */
    async storeNotifDefis(type) {
        await this.sendNotifsToCapitainesDefiee(type)
        var db = Database.initialisation()
        if(this.state.equipeEmettrice != undefined) {
            for(var i = 0 ; i < this.state.equipeEmettrice.capitaines.length ; i++) {

            
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        defi : this.state.defi.id,
                        emetteur :  LocalUser.data.id,
                        recepteur : this.state.equipeEmettrice.capitaines[i] ,
                        time : new Date(),
                        equipeEmettrice : this.state.equipeReceptrice.id ,
                        type :type,
                        equipeReceptrice : this.state.equipeEmettrice.id,
                    }
                )
            } 
        }
    }

  

    //  =================================================================================





    renderPhotoEquipeEmetteur() {
        if(this.state.equipeEmettrice != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.equipeEmettrice.photo}} 
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

    renderBtnConfirmer() {
        return(
            <View style = {{flexDirection : "row"}}>
                <TouchableOpacity
                    onPress = { () => this.handleConfirmerOui()}>
                    <Text style = {styles.txtBtn}>Accepter</Text>
                </TouchableOpacity>

                <Text>/</Text>

                <TouchableOpacity
                    onPress = {() => this.handleConfirmerNon()}>
                    <Text style = {styles.txtBtn}>Refuser</Text>
                </TouchableOpacity>
            </View>
        )

    }



    renderNomEquipeEmettrice() {
        if(this.state.equipeEmettrice != undefined) {
            return this.state.equipeEmettrice.nom
        } else {
            return '__'
        }
    }

    renderNomEquipeReceptrice() {
        if(this.state.equipeReceptrice != undefined) {
            return this.state.equipeReceptrice.nom
        } else {
            return '__'
        }
    }




    renderNotif() {
        console.log("this.state.defi.defis_valide =====", this.state.defi.defis_valide)
        if(this.state.defis_valide) {
            return(
                <View style =  {{ marginTop : hp('1.5%')}}>
                    <Text> Tu as accepté le défi relevé par l'équipe </Text>
                    <Text> {this.renderNomEquipeEmettrice()} </Text> 
                </View>
            )
        } else if(this.state.defis_refuse) {
            return(
                <View style =  {{ marginTop : hp('1.5%')}}>
                    <Text> Tu as refusé le défi relevé par l'équipe </Text>
                    <Text> {this.renderNomEquipeEmettrice()} </Text> 
                </View>
            )
        } else {
            return(
                <View>
                    <Text> L'équipe {this.renderNomEquipeEmettrice()} souhaite relever le</Text>
                    <Text> défi posté par ton équipe {this.renderNomEquipeReceptrice()} </Text>

                    <TouchableOpacity
                        onPress = {() => this.goToFicheDefi()}
                        >
                        <Text style = {styles.txtBtn}>Consulter</Text>
                    </TouchableOpacity>
                    {this.renderBtnConfirmer()}
                    
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
                        {this.renderPhotoEquipeEmetteur()}
                    </View>
                    {this.renderNotif()}
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

export default withNavigation (Notif_Accepter_Releve_Defi)


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

class Notif_Invitation_Equipe extends React.Component {
    
    
    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            emetteur : undefined,
            equipe : undefined,
            a_refuse : false 
        }
    }

    componentDidMount() {
        this.getData()
    }




    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {

       console.log("IN COMPO NOTIF ", this.props.notification)
        // Données de l'émeteur 
        console.log("before  emetteur", this.props.notification.emetteur)
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données du défi 
        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")
        console.log(':::::::::::', equipe.joueurs)
        this.setState({emetteur : emetteur, equipe : equipe,isLoading : false, a_refuse : ! equipe.joueurs.includes(LocalUser.data.id)})
    }

    goToProfilEquipe() {
        this.props.navigation.push("Profil_Equipe", {equipeId : this.state.equipe.id})
    }


    /**
     * Fonction appellée si l'utilisateur refuse l'invitation à rajoindre l'équipe
     */
    async RefuserConvocation() {
        console.log("in refuser convocation ")
        await this.sendNotifRefu()
        console.log("after send notif !!!")
        if(this.state.equipe.id != undefined) {
            // Supprimer le joueur de la liste des joueurs de l'équipe
            var db = Database.initialisation()
            var equipeRef = db.collection("Equipes").doc(this.state.equipe.id)
            equipeRef.update({
                joueurs : firebase.firestore.FieldValue.arrayRemove(LocalUser.data.id)
            }).then(console.log("ok doc  joueur"))
            .catch(function(error) {console.log(error)})

            // Supprimer l'équipe de la liste des équipe du joueur
            var joueurRef = db.collection("Joueurs").doc(LocalUser.data.id)
            joueurRef.update({
                equipes : firebase.firestore.FieldValue.arrayRemove(this.state.equipe.id)
            }).then(console.log("ok doc equipes du joueur "))
            .catch(function(error) {console.log(error)})
        }


        // On enregistre dans la base de données les notifications
        for(var i = 0; i < this.state.equipe.capitaines.length; i++) {
            db.collection("Notifs").add({
                emetteur : LocalUser.data.id,
                recepteur : this.state.equipe.capitaines[i],
                type : Types_Notification.REFUSER_INVITATION_REJOINDRE_EQUIPE,
                time : new Date(),
                dateParse : Date.parse(new Date())
            }).then(console.log("ok doc "))
            .catch(function(error) {console.log(error)})
        }
        this.setState({a_refuse : true})

    }

    alertRefuser() {
        Alert.alert(
            '',
            "Tu souhaites refuser d'intégrer l'équipe " + this.renderNomEquipe() + "?",
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
        console.log("IN SEND NOTIF REFU !!!")
        var titre = "Nouvelle notif"
        var corps = LocalUser.data.pseudo + " a refusé de rejoindre ton équipe "
        corps   = corps + this.state.equipe.nom + "."
        console.log("this.state.equipe.capitaines.length",this.state.equipe.capitaines.length)
        for(var i = 0; i <this.state.equipe.capitaines.length; i++) {
            id = this.state.equipe.capitaines[i]
            console.log("id ", id)
            if(id != LocalUser.data.id) {
                var cap = await Database.getDocumentData(id,"Joueurs")
                var tokens = [] 
                if(cap.tokens != undefined) tokens = cap.tokens
                console.log("before boucle send notif", tokens)
                console.log("before boucle send notif", tokens.length)

                for(var k = 0; k < tokens.length; k++) {
                    console.log("==== ", tokens[k])
                    await this.sendPushNotification(tokens[k], titre, corps)
                }
            }
        }
    }


    // ===========================================================================



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

    renderNomEmetteur() {
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.pseudo
        } else {
            return "__"
        }
    }

    renderNomEquipe() {
        if(this.state.equipe != undefined) {
            return this.state.equipe.nom
        } else {
            return "__"
        }
    }

    /**
     * Fonction qui affiche le message de la notification en fonction de si l'utilisateur à refusé
     * le convocation ou non 
     */
    chosseOptionTorender(){
        if(! this.state.a_refuse) {
            return(
                <View>
                    <Text>Le capitaine {this.renderNomEmetteur()}  de l'équipe  </Text>
                        <Text>{this.renderNomEquipe()} souhaite t'intégrer dans </Text>
                        
                        <View style = {{flexDirection : "row"}}>
                            <Text>son équipe. </Text>
                                <TouchableOpacity
                                    onPress = {() => this.goToProfilEquipe()}
                                    >
                                    <Text style = {styles.txtBtn}>Consulter</Text>
                                </TouchableOpacity>
                        </View>
                            <TouchableOpacity
                                onPress = {() => this.alertRefuser()}
                                >
                                <Text style = {styles.txtBtn}>Refuser</Text>
                            </TouchableOpacity>
                </View>
            )
        } else {
            return(
                <View>
                    <Text>Tu as refusé l'invitation de {this.state.emetteur.pseudo} </Text>
                    <Text>pour rejoindre l'équipe {this.state.equipe.nom}</Text>
                </View>
            )
        }
    }

    render(){
        if(this.state.isLoading) {
            console.log("IS LOADING")
            return(
                <Simple_Loading
                    taille = {hp('3%')}
                />
            )
        } else {
            console.log("ELSE RENDER")
            return(
                <View style = {{flexDirection : 'row',marginTop : hp('2.5%'), borderWidth : 0, alignContent:"center"}}>
                    <View>
                        {this.renderPhotoEquipe()}
                    </View>
                    <View>
                        {this.chosseOptionTorender()}
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

export default withNavigation(Notif_Invitation_Equipe)
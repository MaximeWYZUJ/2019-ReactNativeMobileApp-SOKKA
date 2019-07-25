
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

/**
 * Classe qui permet d'afficher une notification de convocation ou relance
 * à une partie
 */
class Notif_Convocation_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            emetteur : undefined,
            partie : undefined
        }
    }

    componentDidMount() {
        this.getData()
    }




    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {

        // Données de l'émeteur 
        console.log("before  emetteur", this.props.notification.emetteur)
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données du défi 
        var partie = await Database.getDocumentData(this.props.notification.partie, "Defis")
        this.setState({emetteur : emetteur, partie : partie,isLoading : false})
    }


    /**
     * Pour se rendre dans la fiche de la partie
     */
    goToFichePartie() {
        this.props.navigation.push("FichePartieRejoindre", 
            {
                id : this.state.partie.id,
                /*jour : this.buildDate(),
                duree : this.props.duree,
                terrain : this.findTerrain(),
                nbJoueursRecherche : this.state.partie.nbJoueursRecherche,
                message_chauffe : this.props.message_chauffe,
                joueurs  : this.props.joueurs,
                joueursWithData : this.state.joueurs     // Les 3 premiers joueurs du défi (on a deja leur données donc pas besoin de les rechercher)*/
            })
    }


    //===================================================================================
    //========================== FONCTIONS POUR LES NOTIFICATIONS =======================
    //===================================================================================


    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    async sendPushNotification(token , title,body ) {
        console.log("________ "+ body +  " _____")
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
     * Fonction qui va permettre d'envoyer une notification à l'organisateur en indiquant
     * que l'utilisateur est indisponible pour cette partie.
     */
    async sendNotifIndispo(date) {
  
        this.storeNotifAnnulerInDB()
        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " est indisponible pour une partie le "
        corps = corps +  DatesHelpers.buildDate(new Date(date))


        var tokens = this.state.emetteur.tokens
        if(tokens != undefined) {
            for(var k =0; k < tokens.length; k ++) {
                await this.sendPushNotification(tokens[k], titre, corps)
            }
        }
    }


    /**
     * Fonction qui va permettre d'envoyer une notification à l'organisateur en indiquant
     * que l'utilisateur confirme sa présence pour cette partie.
     */
    async sendNotifConfirmer(date) {
        this.storeNotifConfirmerInDB()

        console.log("in send notif confirme")
        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " est confirme sa présence pour une partie le "
        corps = corps +  DatesHelpers.buildDate(new Date(date))

        var tokens = this.state.emetteur.tokens
        if(tokens != undefined) {
            for(var k =0; k < tokens.length; k ++) {
                console.log(tokens[k])
                await this.sendPushNotification(tokens[k], titre, corps)
            }
        }

    }


    //===================================================================================
    //============ FONCTIONS POUR LA CONFIRMATION DE LA PARTICIPATION A UN DEFI =========
    //===================================================================================


    /**
     * Fonction qui va être appelée au moment où l'utilisateur annule sa
     * présence. 
     */
    handleConfirmerNon() {
        console.log("in handle confirmer non")
        Alert.alert(
            '',
            "Tu souhaite annuler ta présence pour ce défi ? ",
            [
                {text: 'Oui', onPress: () => this.annulerJoueurPresence()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )

    }

    /**
     * Fonction qui va être appelée au moment où l'utilisateur confirme sa
     * présence. 
     */
    handleConfirmerOui() {
        Alert.alert(
            '',
            "Tu souhaite confirmer ta présence pour ce Defi ? ",
            [
                {text: 'Oui', onPress: () => this.confirmerJoueurPresence()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )

    }

    /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs ayant 
     * confirmés. Ainsi que  d'enregistrer la partie mise à jour dans la DB.
     */
    async confirmerJoueurPresence()  {

        console.log("IN CONFIRM ER JOUEUR PRESENCE")
        await this.sendNotifConfirmer(this.state.partie.jour.seconds*1000)

        // Ajouter l'id de l'utilisateur dans la liste des confirme (Creation d'un new array pour le re render)
        var j = []
        for(var i = 0 ; i < this.state.partie.confirme.length; i++) {
            j.push(this.state.partie.confirme[i])
            
        }
        if(! j.includes(this.monId)){
            j.push(this.monId) 
        }

        // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
        var att  = []
        for(var i = 0 ; i < this.state.partie.attente.length ; i++) {
            if(this.state.partie.attente[i] != this.monId) {
                att.push(this.state.partie.attente[i])
            }
        }

        // Suppr l'user  des joueurs indispos
        var indispo  = []
        for(var i = 0 ; i < this.state.partie.indisponibles.length ; i++) {
            if(this.state.partie.indisponibles[i] != this.monId) {
                indispo.push(this.state.partie.indisponibles[i])
            } 
        }


        // Enregistrer dans la db
        var db = Database.initialisation()
        var partieRef = db.collection("Defis").doc(this.state.partie.id)
        partieRef.update({
            confirme : j,
            attente : att,
            indisponibles : indispo,
        }).then(
            
        )
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

       


    }


    /**
     * Fonction qui permet de sauvegarder dans la base de données la notification indiquant que 
     * l'utilisateur participe à la partie
     */
    storeNotifConfirmerInDB() {
        
        

        // Store the notifs
        var db = Database.initialisation() 
        console.log()
        db.collection("Notifs").add(
            {
                dateParse : Date.parse(new Date()),
                partie : this.state.partie.id,
                emetteur :  LocalUser.data.id,
                recepteur : this.state.emetteur.id,
                time : new Date(),
                type : Types_Notification.CONFIRMER_PRESENCE_PARTIE,
            }
        ).then(function() {console.log("NOTIF STORE")})
        .catch(function(error) {console.log(error)})
        

    }

    /**
     * Fonction qui permet de sauvegarder dans la base de données la notification indiquant que 
     * l'utilisateu est indisponible pour la partie
     */
    storeNotifAnnulerInDB() {
        

        // Store the notifs
        var db = Database.initialisation() 
        console.log()
        db.collection("Notifs").add(
            {
                dateParse : Date.parse(new Date()),
                partie : this.state.partie.id,
                emetteur :  LocalUser.data.id,
                recepteur : this.state.emetteur.id,
                time : new Date(),
                type : Types_Notification.ANNULER_PRESENCE_PARTIE,
            }
        ).then(function() {console.log("NOTIF STORE")})
        .catch(function(error) {console.log(error)})
        

    }

      /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs 
     * indisponibles, mettre à jour les autres listes 
     * Ainsi que  d'enregistrer la partie mise à jour dans la DB.
     */
    async annulerJoueurPresence() {

        await this.sendNotifIndispo(new Date(this.state.partie.jour.seconds * 1000))

        // Ajouter l'utilisateur a la liste des joueurs indisponibles (new objet pour maj state)
        var indispo = []
        for(var i = 0 ; i < this.state.partie.indisponibles.length; i++) {
            indispo.push(this.state.partie.indisponibles[i])
        }
        if(! indispo.includes(this.monId)) {
            indispo.push(this.monId)
        }

        

        // Le suppr des en attente
        var attente = []
        for(var i = 0; i <this.state.partie.attente.length; i++) {
            if(this.state.partie.attente[i] != this.monId) {
                attente.push(this.state.partie.attente[i])
            }
        }

        // Le suppr des confirmés
        var confirme = []
        for(var i = 0; i <this.state.partie.confirme.length; i++) {
            if(this.state.partie.confirme[i] != this.monId) {
                confirme.push(this.state.partie.confirme[i])
            }
        }

        // Mettre à jour le state.
        var partie = this.state.partie
        partie.confirme = confirme
        partie.attente = attente
        partie.indisponibles = indispo

        this.setState({partie, partie})

        // Enregistrer dans la db
        var db = Database.initialisation()
        var partieRef = db.collection("Defis").doc(this.state.partie.id)
        partieRef.update({
            confirme : confirme,
            attente : attente,
            indisponibles : indispo,
        }).then()
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }


    //==============================================================================
    renderNomEmetteur() {
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.pseudo
        } else {
            return "__"
        }
    }

    renderPhotoEmetteur() {
        if(this.state.emetteur != undefined) {
            console.log("ookokoko")
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

    renderDatePartie() {
        if(this.state.partie != undefined) {
            return DatesHelpers.buildDate(new Date(this.state.partie.jour.seconds * 1000))
        } else {
            return '??'
        }
    }

    renderBtnConfirmer() {
        return(
            <View style = {{flexDirection : "row"}}>
                <Text>Confirmer : </Text>
                <TouchableOpacity
                    onPress = { () => this.handleConfirmerOui()}>
                    <Text style = {styles.txtBtn}>Oui</Text>
                </TouchableOpacity>

                <Text>/</Text>

                <TouchableOpacity
                    onPress = {() => this.handleConfirmerNon()}>
                    <Text style = {styles.txtBtn}>Non</Text>
                </TouchableOpacity>
            </View>
        )

    }

    
    render() {
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
                        {this.renderPhotoEmetteur()}
                    </View>
                    <View style = {{marginTop : hp('0.5%')}}>
                        <Text>{this.renderNomEmetteur()}  t'as convoqué / relancé pour </Text>

                        {/* Date et btn consulter */}
                        <View style = {{flexDirection : "row"}}>
                            <Text>une partie le {this.renderDatePartie()} </Text>
                            
                            <TouchableOpacity
                                onPress = {() => this.goToFichePartie()}
                                >
                                <Text style = {styles.txtBtn}>Consulter</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {this.renderBtnConfirmer()}
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

export default withNavigation (Notif_Convocation_Partie)
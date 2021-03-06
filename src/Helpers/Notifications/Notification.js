import { Constants, Location,Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import Database from '../../Data/Database'


export default class Notification {
    

    /**
     * Méthode qui va renvoyer le token expo du téléphone
     */
    static async registerForPushNotifications() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          if (status !== 'granted') {
            return;
          }
        }
        var token = await Notifications.getExpoPushTokenAsync();
        //this.subscription = Notifications.addListener(this.handleNotification);
    
        return (token)
    }


    /**
     * Fonction qui enregistre le token dans la collection Login
     */
    static async storeTokenInLogin(id) {
        var token = await this.registerForPushNotifications()
        var db = Database.initialisation()
        db.collection("Login").doc(token).set({id : id})
    }


    /**
     * Fonction qui va renvoyer une liste des notifications in app qui 
     * envoyée à l'utilisateur
     * @param {String} id id de l'utilisateur 
     */
    static async getListNotifsInApp(id) {

        let notifications = []

        var db = Database.initialisation()
        var  ref = db.collection("Notifs");
        var query = ref.where("recepteur", "==", id).orderBy("dateParse");
         query.get().then(async (results) => {
           
            for(var i = 0; i < results.docs.length ; i++) {
               notifications.push(results.docs[i].data())
            }


            return notifications            


            
        }).catch(function(error) {
              console.log("Error getting documents partie:", error);
        });   
    }


    /**
     * Pour envoyer une notification
     * @param {*} destinataire 
     * @param {*} titre 
     * @param {*} corps 
     */
    /*static async sendPushNotification(token = "ExponentPushToken[lM7ee8LlQCJWz_6bP7scIp]", title = "this.state.title", body = "this.state.body") {

        console.log("in send push ", destinataire)
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
    }*/


    static async sendPushNotification(destinataire, titre, corps) {
        
        return fetch('https://exp.host/--/api/v2/push/send', {
          body: JSON.stringify({
            to: destinataire,
            title: titre,
            body: corps,
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


    
    
    static test(token = "ExponentPushToken[lM7ee8LlQCJWz_6bP7scIp]", title = "coucou", body = "this.state.body") {
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




    // ==============================================================================
    // ============================= LES NOTIFICATIONS A ENVOYER ===================
    // ==============================================================================


    /**
     * Notification de relance ou invitation à un défi
     * @param {string} destinataire  : token du destinataire
     * @param {objet} defi  : Objet du defi
     * @param {objet} emeteur  : Objet emeteur
     * @param {objet} equipe  : Objet de l'équipe

     */
    static sendNotificationInvitationDefi(destinataire,date,emeteur,equipe) {
        var corps = "Le capitaine " + emeteur.pseudo + " de l'équipe " + equipe.nom 
        corps = corps + " t'a convoqué / relancé pour un un défi le "
        corps = corps + this.buildDate(date)
        
        var titre  = "Nouvelle notification"

        this.sendPushNotification()
        //this.sendPushNotification(destinataire,titre,corps)
    }


    /**
     * Notification de confirmation de présence au défi
     * @param {string} destinataire  : token du destinataire
     * @param {objet} defi  : Objet du defi
     * @param {objet} emeteur  : Objet emeteur
     */
    static sendNotificationConfirmerPresenceDefi(destinataire,defi,emeteur) {
        var corps = emeteur.pseudo + " a confirmé sa présence pour un défi le  "
        corps = corps + this.buildDate(new Date(defi.jour.seconds * 1000))
        
        var titre  = "Nouvelle notification"
        this.sendPushNotification(destinataire,titre,corps)
    }



    /**
     * Notification d'annulation de présence au défi
     * @param {string} destinataire  : token du destinataire
     * @param {objet} defi  : Objet du defi
     * @param {objet} emeteur  : Objet emeteur
     */
    static sendNotificationAnnulerPresenceDefi(destinataire,defi,emeteur) {
        var corps = emeteur.pseudo + " est indisponible pour un défi le  "
        corps = corps + this.buildDate(new Date(defi.jour.seconds * 1000))
        
        var titre  = "Nouvelle notification"

        this.sendPushNotification(destinataire,titre,corps)
    }



    /**
     * Fonction qui envoie une notification à l'organisateur d'une partie en indiquant que 
     * l'utilisateur confirme sa présence.
     * @param {String} destinataire token du destinataire
     * @param {Objet} partie 
     * @param {Objet} emeteur 
     */
    static async sendNotificationConfirmerPresencePartie(destinataire, partie, emeteur) {
        var corps = emeteur.pseudo + " confirme sa présence pour une partie le  "
        corps = corps + this.buildDate(new Date(partie.jour.seconds * 1000))
        
        var titre  = "Nouvelle notification"
        await this.sendPushNotification(destinataire,titre,corps)
    }



    /**
     * Fonction qui va permettre de construire un String correspondant à la 
     * date du défi pour le titre de la vue.
     * @param {Date} date 
     */
    static buildDate(date) {
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        return numJour  + '/' + mois + '/' + an
    }


}


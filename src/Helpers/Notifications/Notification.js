import { Constants, Location, Permissions,Notifications } from 'expo';
import Database from '../../Data/Database'


export default class Notification {
    

    /**
     * Méthode qui va renvoyer le token expo du téléphone
     */
    static async registerForPushNotifications() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log('in register')
        if (status !== 'granted') {
            console.log("1")
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          if (status !== 'granted') {
            console.log("2")
            return;
          }
        }
        console.log("okook")
        var token = await Notifications.getExpoPushTokenAsync();
        console.log("after await token")
        //this.subscription = Notifications.addListener(this.handleNotification);
    
        return (token)
    }


    /**
     * Fonction qui enregistre le token dans la collection Login
     */
    static async storeTokenInLogin(id) {
        var token = await this.registerForPushNotifications()
        var db = Database.initialisation()
        console.log("in store token in login" , id)
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

            console.log(notifications)

            return notifications            


            
        }).catch(function(error) {
              console.log("Error getting documents partie:", error);
        });   
    }
}


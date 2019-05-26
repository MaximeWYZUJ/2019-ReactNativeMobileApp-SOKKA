import React from 'react'
import { View, Text, FlatList } from 'react-native'
import Notifications from '../../Helpers/Notifications/Notification'
import LocalUser from '../../Data/LocalUser.json'
import Notifications_Factory from '../../Components/Notifications/Notifications_Factory'
import Database from '../../Data/Database'

export default class AccueilNotifications extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            notifications: []
        }

        this.changeState = this.changeState.bind(this)
    }

    componentDidMount() {
        this.getNotifications()

    }

    changeState(notifs) {
    }

    async getNotifications() {
        //var notifs =  await Notifications.getListNotifsInApp(LocalUser.data.id)
        //this.setState({notifications : notifs})
        var notifications = []

        var db = Database.initialisation()
        var  ref = db.collection("Notifs");
        var query = ref.where("recepteur", "==", LocalUser.data.id).orderBy("dateParse");
        query.get().then(async (results) => {
           
            for(var i = 0; i < results.docs.length ; i++) {
               notifications.push(results.docs[i].data())
            }

            console.log(notifications)

            this.setState({notifications : notifications})            


            
        }).catch(function(error) {
              console.log("Error getting documents partie:", error);
        });

    }

    _renderNotif = ({item}) => {

        return(
            <Notifications_Factory
                notification = {item}
            />
        )
    }


    render() {
        console.log(" in acceul notif", this.state.notifications)
        return (
            <View style = {{marginTop : 25}}>
                <Text>Accueil Notifications</Text>
                <FlatList
                    data = {this.state.notifications}
                    renderItem = {this._renderNotif}
                />
            </View>
        )
    }

}
import React from 'react'
import { View, Text, FlatList ,ScrollView,RefreshControl} from 'react-native'
import Notifications from '../../Helpers/Notifications/Notification'
import LocalUser from '../../Data/LocalUser.json'
import Notifications_Factory from '../../Components/Notifications/Notifications_Factory'
import Database from '../../Data/Database'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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

    changeState(notif){
        
    }

     /** Fonction appelée au moment où l'utilisateur pull to refresh */
    _onRefresh = async () => {
        this.setState({refreshing: true, notifications : []});
        await this.getNotifications()
        //this.joueur = await Database.getDocumentData(this.joueur.id, "Joueurs")
        this.setState({refreshing : false})
    }


    async getNotifications() {
        //var notifs =  await Notifications.getListNotifsInApp(LocalUser.data.id)
        //this.setState({notifications : notifs})
        var notifications = []

        var db = Database.initialisation()
        var  ref = db.collection("Notifs");
        var query = ref.where("recepteur", "==", LocalUser.data.id).orderBy("dateParse","desc");
        query.get().then(async (results) => {
           
            for(var i = 0; i < results.docs.length ; i++) {
                var notif = results.docs[i].data()
                notif.id = results.docs[i].id
               notifications.push(notif)
            }



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
        return (
            <ScrollView style={styles.main_container}
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    />
                }
            >
                <View style = {{marginTop : 25}}>
                    <Text>Accueil Notifications</Text>
                    <FlatList
                        data = {this.state.notifications}
                        renderItem = {this._renderNotif}
                    />
                </View>
            </ScrollView>
        )
    }

}
const styles = {
    main_container: {
        flex: 1,
        marginTop: hp('1%')
    },

}
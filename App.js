// branche null
import React from 'react';
import { StyleSheet, Text, View ,Alert} from 'react-native';
//import Navigation from './src/Navigation/Navigation'
import FirstStack from './src/Navigation/FirstStackNavigation'

import {createStackNavigator, createAppContainer, StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import Store from './src/Store/ConfigureStore'
import DataBase from './src/Data/Database'
//import Defis_Equipe from './src/Components/Profil_Equipe/Defis_Equipe'
import Calendrier_Joueur from './src/Vues/Jouer/Historique/Calendrier_Joueur'
import { Permissions, Notifications} from 'expo'
import Fiche_Defi_Rejoindre from './src/Vues/Jouer/Rejoindre/Fiche_Defi_Rejoindre'
import firebase from 'firebase'
import { AsyncStorage } from 'react-native';

export default class App extends React.Component {


  constructor(props) {
    super(props)

    /*DataBase.initialisation().collection("Joueurs").doc("aPyjfKVxEU4OF3GtWgQrYksLToxW2")
    .onSnapshot(function(doc) {
     Alert.alert(
       '',
       'notif'
     )

    });*/ 
  }

  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }
    
    console.log("Token :", await Notifications.getExpoPushTokenAsync());

    //this.subscription = Notifications.addListener(this.handleNotification);

    this.setState({
      token,
    });
  }

  async getToken() {
    console.log("in get token")
    //let fcmToken = await AsyncStorage.getItem('fcmToken');
    //if (!fcmToken) {
      console.log('fffffffffffffffff')
        let fcmToken = await firebase.messaging().getToken();
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
        console.log(fcmToken)
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
       // if (fcmToken) {
            // user has a device token
          //  await AsyncStorage.setItem('fcmToken', fcmToken);
        //}
    //}
   }

   sendPushNotification() {
	   body = 'voici une notif',
	   title = "test"
	   console.log("in send push Notification")
    return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: "ExponentPushToken[zNqAkxI17q7G_fDIuJ5ySD]",
        title: "test",
        body: "voici une notif",
        data: { message: `${title} - ${body}` },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }


  componentDidMount() {
    // Test
	//this.registerForPushNotifications()
	//this.sendPushNotification()

  }

  render() {
    return (
        <Provider store={Store}>
          <FirstStack/>
        </Provider>

      );
  }
}



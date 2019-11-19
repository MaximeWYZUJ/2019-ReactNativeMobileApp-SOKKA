// branche null
import React from 'react';
//import Navigation from './src/Navigation/Navigation'
import FirstStack from './src/Navigation/FirstStackNavigation'

import { Provider } from 'react-redux'
import Store from './src/Store/ConfigureStore'
//import Defis_Equipe from './src/Components/Profil_Equipe/Defis_Equipe'
import { Notifications} from 'expo'
import * as Permissions from 'expo-permissions';
import {BackHandler} from "react-native"
import firebase from 'firebase'
import View from 'react-native'

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
    

    //this.subscription = Notifications.addListener(this.handleNotification);

    this.setState({
      token,
    });
  }

  async getToken() {
    //let fcmToken = await AsyncStorage.getItem('fcmToken');
    //if (!fcmToken) {
        let fcmToken = await firebase.messaging().getToken();
        
       // if (fcmToken) {
            // user has a device token
          //  await AsyncStorage.setItem('fcmToken', fcmToken);
        //}
    //}
   }

   sendPushNotification() {
	   body = 'voici une notif',
	   title = "test"
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
    BackHandler.addEventListener('hardwareBackPress', function() {
      // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
      // Typically you would use the navigator here to go to the last state.
    
      console.log()
      return false;
    });

  }


  

  render() {
    return (
        <Provider store={Store}>
        <FirstStack/>

        </Provider>

      );
  }
}



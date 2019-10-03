import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import {View, Text,Image,TouchableOpacity,Alert,Icon} from 'react-native'
import AccueilProfil from './Navigation'
//import AccueilProfil from '../TabBar/TempProfil'
import AccueilNotifs from '../TabBar/Notifications/AccueilNotifications'
import AccueilJouer from './NavigationJouer'
import AccueilRecherche from './Rechercher/RechercherStackNavigator'


const OngletsNavigator = createBottomTabNavigator({

    TabAccueilProfil: {
        screen: AccueilProfil,
        navigationOptions: {
            tabBarLabel: "PROFIL",
            tabBarIcon: ({ tintColor, focused }) => (
               <Image source = {require("../../res/avatar.png")}
               style = {{width : 24, height : 24}}/>
            )
            
        }
    },

    TabAccueilNotifs: {
        screen: AccueilNotifs,
        navigationOptions: {
            tabBarLabel: "NOTIFS",
            tabBarIcon: ({ tintColor, focused }) => (
                <Image source = {require("../../res/notification.png")}
                style = {{width : 24, height : 24}}/>
            )
        }
    },

    TabAccueilJouer: {
        screen: AccueilJouer,
        navigationOptions: {
            tabBarLabel: "JOUER",
            tabBarIcon: ({ tintColor, focused }) => (
                <Image source = {require("../../res/ball.png")}
                style = {{width : 24, height : 24}}/>
            )
            /*tabBarIcon: ({ tintColor, focused }) => (
                <TouchableOpacity
                    onPress = {() => {
                        Alert.alert("ee","ee")
                    }}>
                    <Text>kkkkkk</Text>
                </TouchableOpacity>
            )*/
        }
    },

    TabAccueilRecherche: {
        screen: AccueilRecherche,
        navigationOptions: {
            tabBarLabel: "RECHERCHE",
            tabBarIcon: ({ tintColor, focused }) => (
                <Image source = {require("../../res/search.png")}
                style = {{width : 24, height : 24}}/>
            )
        }
    }

},

{
    lazy: false
})

//export default (createStackNavigator({OngletsNavigator}, {headerMode: "none"}))
export default (OngletsNavigator);
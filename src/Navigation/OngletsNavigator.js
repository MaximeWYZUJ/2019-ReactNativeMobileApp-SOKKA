import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import AccueilProfil from './Navigation'
//import AccueilProfil from '../TabBar/TempProfil'
import AccueilNotifs from '../TabBar/Notifications/AccueilNotifications'
import AccueilJouer from './NavigationJouer'
import AccueilRecherche from './Rechercher/RechercherStackNavigator'


const OngletsNavigator = createBottomTabNavigator({

    TabAccueilProfil: {
        screen: AccueilProfil,
        navigationOptions: {
            tabBarLabel: "PROFIL"
        }
    },

    TabAccueilNotifs: {
        screen: AccueilNotifs,
        navigationOptions: {
            tabBarLabel: "NOTIFS"
        }
    },

    TabAccueilJouer: {
        screen: AccueilJouer,
        navigationOptions: {
            tabBarLabel: "JOUER"
        }
    },

    TabAccueilRecherche: {
        screen: AccueilRecherche,
        navigationOptions: {
            tabBarLabel: "RECHERCHE"
        }
    }

},

{
    lazy: false
})

//export default (createStackNavigator({OngletsNavigator}, {headerMode: "none"}))
export default (OngletsNavigator);
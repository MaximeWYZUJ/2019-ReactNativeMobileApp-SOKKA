import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation';

import AccueilRechercher from '../../Vues/Rechercher/AccueilRechercher'
import RechercherTabNavigator from './RechercherTabNavigator'
import RechercherTabNavigatorDefi from './RechercherTabNavigatorDefi'

const RechercherStackNavigator = createStackNavigator({

    AccueilRechercher : {
        screen : AccueilRechercher
    },

    RechercherTab: {
        screen: RechercherTabNavigator
    },

    RechercherTabDefi: {
        screen: RechercherTabNavigatorDefi
    }

})

export default createAppContainer(RechercherStackNavigator);
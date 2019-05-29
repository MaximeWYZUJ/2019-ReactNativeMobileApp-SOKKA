import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation';

import AccueilRechercher from '../../Vues/Rechercher/AccueilRechercher'
import RechercherTabNavigator from './RechercherTabNavigator'


const RechercherStackNavigator = createStackNavigator({

    Accueil : {
        screen : AccueilRechercher
    },

    RechercherTab: {
        screen: RechercherTabNavigator
    }

})

export default createAppContainer(RechercherStackNavigator);
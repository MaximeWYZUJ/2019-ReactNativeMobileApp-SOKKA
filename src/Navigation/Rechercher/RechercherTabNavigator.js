import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, TabBarTop } from 'react-navigation';

import RechercheAutour from '../../Vues/Rechercher/RechercheAutour'
import RechercheFavoris from '../../Vues/Rechercher/RechercheFavoris'
import RechercheDefaut from '../../Vues/Rechercher/RechercheDefaut'



const RechercherTabNavigator = createAppContainer(createMaterialTopTabNavigator({

    "OngletRecherche_Autour" : {screen: RechercheAutour},
    "OngletRecherche_Favoris" : {screen: RechercheFavoris},
    "OngletRecherche_Defaut" : {screen: RechercheDefaut}

}, {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
}


));


export default RechercherTabNavigator;
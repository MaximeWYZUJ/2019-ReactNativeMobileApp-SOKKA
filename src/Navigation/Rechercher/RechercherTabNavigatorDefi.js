import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, TabBarTop } from 'react-navigation';

import RechercheDefiAutour from '../../Vues/Rechercher/RechercheDefiAutour'
import RechercheDefaut from '../../Vues/Rechercher/RechercheDefaut'



const RechercherTabNavigatorDefi = createAppContainer(createMaterialTopTabNavigator({

    "OngletRechercheDefi_Autour" : {screen: RechercheDefiAutour},
    "OngletRechercheDefi_Defaut" : {screen: RechercheDefaut}

}, {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top'
}


));


export default RechercherTabNavigatorDefi;
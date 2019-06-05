import React from 'react'

import Joueurs_Autours_Partie from './Joueurs_Autours_Partie'
import Joueurs_Reseau_Partie from './Joueurs_Reseau_Partie'
import Rechercher_Joueurs from './Rechercher_Joueurs'
import Colors from '../../../../Components/Colors'
import { createAppContainer, createMaterialTopTabNavigator, TabBarTop} from 'react-navigation';
//import { connect } from 'react-redux'

const TabChoixJoueursDefis = createAppContainer( createMaterialTopTabNavigator({

    "Autours de moi": { screen: Joueurs_Autours_Partie},
    "Mon Réseau": { screen: Joueurs_Reseau_Partie },
    "Rechercher": { screen: Rechercher_Joueurs },

  }, {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
      },
      tabStyle: {
        height: 42,
      },
      style: {
        backgroundColor: Colors.agOOraBlue,
      },
    }
  }
  ));

  

  

export default  (TabChoixJoueursDefis);




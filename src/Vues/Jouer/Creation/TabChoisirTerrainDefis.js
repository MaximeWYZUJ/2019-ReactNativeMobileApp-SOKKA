

import React from 'react'

import Terrains_Autours from './Terrains_Autours'
import Terrains_Reseau from './Terrains_Reseau'
import Rechercher_Terrains_Defis from './Rechercher_Terrains_Defis'
import Colors from '../../../Components/Colors'
//import Joueurs_Rechercher from './Joueurs_Rechercher'
import { createAppContainer, createMaterialTopTabNavigator, TabBarTop} from 'react-navigation';
//import { connect } from 'react-redux'

const TabChoisirTerrainDefis = createAppContainer( createMaterialTopTabNavigator({

    "Autours de moi": { screen: Terrains_Autours },
    "Mes terrains favoris": { screen: Terrains_Reseau },
    "Rechercher": { screen: Rechercher_Terrains_Defis },

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

  

  

export default  (TabChoisirTerrainDefis);




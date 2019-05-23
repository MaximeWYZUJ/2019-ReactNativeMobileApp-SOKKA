import React from 'react'

import Presence_Joueurs_Defi from './Presence_Joueurs_Defi'
import Buteurs_Defi from './Buteurs_Defi'
import Homme_Match_Defi from './Homme_Match_Defi'
import Colors from '../../../Components/Colors'


import { createAppContainer, createMaterialTopTabNavigator, TabBarTop} from 'react-navigation';
import { colors } from 'react-native-elements';
//import { connect } from 'react-redux'

const TabDefiPasse = createAppContainer( createMaterialTopTabNavigator({

    "Présence": { screen: Presence_Joueurs_Defi},
    "Buteurs": { screen: Buteurs_Defi },
    "Homme du match": { screen: Homme_Match_Defi },

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

  

  

export default  (TabDefiPasse);



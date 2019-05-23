import React from 'react'

import Presences_Joueurs from './Presences_Joueurs'
import Buteurs from './Buteurs'
import Homme_Du_Match from './Homme_Du_Match'
import { createAppContainer, createMaterialTopTabNavigator, TabBarTop} from 'react-navigation';
//import { connect } from 'react-redux'

const TabFeuillePasse = createAppContainer( createMaterialTopTabNavigator({

    "Présence": { screen: Presences_Joueurs},
    "Buteurs": { screen: Buteurs },
    "Homme du match": { screen: Homme_Du_Match },

  }, {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    
  }
  ));

  

  

export default  (TabFeuillePasse);



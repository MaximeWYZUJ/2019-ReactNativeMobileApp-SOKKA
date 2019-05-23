import React from 'react'

import Equipes_Autour from './Equipes_Autour'
import Equipes_Fav from './Equipes_Fav'
import Rechercher_Equipe from './Rechercher_Equipe'
import { createAppContainer, createMaterialTopTabNavigator, TabBarTop} from 'react-navigation';
//import { connect } from 'react-redux'

const TabChoixEquipeAdverse = createAppContainer( createMaterialTopTabNavigator({

    "Autours de moi": { screen: Equipes_Autour},
    "Mes équipes favoris": { screen: Equipes_Fav },
    "Rechercher": { screen: Rechercher_Equipe },

  }, {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
  }
  ));

  

  

export default  (TabChoixEquipeAdverse);




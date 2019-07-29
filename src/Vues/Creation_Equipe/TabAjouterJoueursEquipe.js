import React from 'react'

import Joueurs_Autours_De_Moi from './Joueurs_Autours_De_Moi'
import Joueurs_Reseau from './Joueurs_Reseau'
import Joueurs_Rechercher from './Joueurs_Rechercher'
//import Joueurs_Rechercher from './Joueurs_Rechercher'
import { createAppContainer, createMaterialTopTabNavigator, TabBarTop} from 'react-navigation';
//import { connect } from 'react-redux'
import Colors from '../../Components/Colors'

const TabAjouterJoueursEquipe = createAppContainer( createMaterialTopTabNavigator({

    "Autours de moi": { screen: props =>  <Joueurs_Autours_De_Moi{...props}/>},
    "Mon reseau": { screen: Joueurs_Reseau },
    "Rechercher": { screen: Joueurs_Rechercher },

  }, {
    initialRouteName: "Mon reseau",
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

  
  const mapStateToProps = (state) => {
    return{ 
        joueurs : state.joueurs
  } 
  
}
export default  (TabAjouterJoueursEquipe);

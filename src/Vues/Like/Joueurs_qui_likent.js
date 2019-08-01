import React from 'react'
import {View, Text, ScrollView } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Color from '../../Components/Colors'
import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'

import ComposantRechercheTableau from '../../Components/Recherche/ComposantRechercheTableau'
  

 export default  class Joueurs_qui_likent extends React.Component {
  
    constructor(props, context) {
      super(props, context);
      this.joueurs = this.props.navigation.getParam('joueurs', ' ')
    }


    renderItem = ({item}) => {
      return (
        <ItemJoueur
          id={item.id}
          nom={item.pseudo}
          photo={item.photo}
          score={item.score}
          nav={this.props.navigation}
          showLike={true}
        />
      )
    }
    
  
    render() {
        return (
          <ScrollView style = {{flex : 1}}>
            
            {/* Indication du nombre de j'aime */}
            <View style = {{backgroundColor : Color.lightGray, alignItems : 'center', justifyContent: 'center', paddingHorizontal: hp('2%')}}>
              <Text style = {{alignSelf : 'center', fontSize : RF(2.5)}}>{this.joueurs.length} joueurs ont liké ton profil</Text>
            </View>

            <ComposantRechercheTableau
              type={"Joueurs"}
              donneesID={this.joueurs}
              renderItem={this.renderItem}
            />
          </ScrollView>          
      );
    }
}

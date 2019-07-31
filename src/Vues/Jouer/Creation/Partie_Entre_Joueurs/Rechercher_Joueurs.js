
import React from 'react'
import {View, Text} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Joueur_item_Creation_Partie from '../../../../Components/ProfilJoueur/Joueur_item_Creation_Partie'
import { connect } from 'react-redux'
import LocalUser from '../../../../Data/LocalUser.json'

import ComposantRechercheBDD from '../../../../Components/Recherche/ComposantRechercheBDD'

class Rechercher_Joueurs extends React.Component {

    constructor(props) {
        super(props)
        this.id  = LocalUser.data.id 
        this.state = {
            searchedText : 'm',
            joueurs : [],
            query: null,
            displayFiltres: false,
            filtres: null
        }
    }


    isJoueurPresent(liste, joueur) {
        for(var i = 0; i < liste.length ; i++) {
            if(liste[i].id == joueur.id){
                return true 
            }
        }
        return false
    }

    _renderItem = ({item}) => {
        
         return(
            <Joueur_item_Creation_Partie
                pseudo = {item.pseudo}
                id = {item.id}
                photo = {item.photo}
                score = {item.score}
                isChecked = {this.isJoueurPresent(this.props.joueursPartie, item)}
                tokens = {item.tokens}


            />
        )
    }



    render() {
        return(
            <ComposantRechercheBDD
                type={"Joueurs"}
                renderItem={this._renderItem}
            />
        )
    }
}


class SectionHeader extends React.Component {

    render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      color:'black',
      fontWeight:'bold',
      fontSize:RF(2.5),
      marginLeft : wp('2.5%')
    };

    var viewStyle = {
      backgroundColor: '#F7F7F7'
    };
  
    return (
        <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
      
    );
  }
}


class SectionItem extends React.Component {
    render() {
      
  
      return (
          <Text></Text>
      );
    }
}


const mapStateToProps = (state) => {
    return{ 
        joueursPartie : state.joueursPartie,
    } 
}
export default connect(mapStateToProps)  (Rechercher_Joueurs)
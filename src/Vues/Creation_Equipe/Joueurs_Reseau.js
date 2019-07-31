
import React from 'react'

import {View, Text} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux'
import {SkypeIndicator} from 'react-native-indicators';

import LocalUser from '../../Data/LocalUser.json'
import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'

import ComposantRechercheTableau from '../../Components/Recherche/ComposantRechercheTableau'

/**
 * Classe qui va permettre à l'utilisateur permettre de choisir les joueurs de son 
 *  réseau à ajouter à l'équipe qu'il est en train de creer
 */
class Joueurs_Reseau_Final extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            joueurs : [],
            allJoueurs : [],
            joueurFiltres : [],
            distanceMax : 50,
            isLoading : true,
            filtres: null,
            displayFiltres: false
        }
        this.reseau = LocalUser.data.reseau
    }


    renderItem = ({item}) => {
        return (
        <Joueurs_Ajout_Item 
            joueur = {item}
            isShown = {this.props.joueursSelectionnes.includes(item.id)}
            txtDistance = ' '
        />)
    }



    render() {

            return(
                <ComposantRechercheTableau
                    type={"Joueurs"}
                    renderItem={this.renderItem}
                    donneesID={this.reseau}
                />

            )
    }
}
const styles = {
    search_image: {
        width: wp('7%'),
        height: wp('7%'),
    },
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
        joueursSelectionnes : state.joueursSelectionnes

    }
}
  
export default connect(mapStateToProps)(Joueurs_Reseau_Final)
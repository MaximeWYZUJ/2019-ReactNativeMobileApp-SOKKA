
import React from 'react'

import {View, ScrollView, Text} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux'

import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'
import ComposantRechercheBDD from '../../Components/Recherche/ComposantRechercheBDD'


/**
 * Classe qui va permettre à l'utilisateur de rechercher des joueurs à 
 * ajouter à l'équipe qu'il est en train de créer.
 */
class Joueurs_Rechercher extends React.Component {

    
    constructor(props) {
        super(props)

        this.state = {
            joueursFiltres: [],
            displayFiltres: false,
            filtres: null,
            query: null,
        }
    }


    /**
     * Permet d'ajouter un joueur à la liste des joueurs à ajouter si 
     * il n'est pas déja présent, le supprime sinon
     * @param {String} joueur 
    */
    _addJoueur(idJoueur) {
        if(this.props.joueurs.includes(idJoueur)) {
            const action = { type: "SUPPRIMER_JOUEUR_EQUIPE_CREATION", value: idJoueur}
            this.props.dispatch(action)
        }else {
            const action = { type: "AJOUTER_JOUEUR_EQUIPE_CREATION", value: idJoueur}
            this.props.dispatch(action)
        }
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

            <ScrollView style={{flex: 1}}>
                <ComposantRechercheBDD
                    type={"Joueurs"}
                    renderItem={this.renderItem}
                />
            </ScrollView>
    
        )
    }
    
}



const styles = {
    search_image: {
        width: 30,
        height: 30,
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


export default connect(mapStateToProps)(Joueurs_Rechercher)
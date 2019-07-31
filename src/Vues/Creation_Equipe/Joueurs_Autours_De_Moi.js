import React from 'react'
import {View, Text } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux'

import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'
import ComposantRechercheAutour from '../../Components/Recherche/ComposantRechercheAutour'


/**
 * Classe qui va permettre à l'utilisateur de selectionner les joueurs qui 
 * sont autours de lui pour les ajouter à l'équipe qu'il est en train de
 * créer
 */
class Joueurs_Autours_De_Moi_Final extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            joueurs : []
        }
    }


    _renderCell= ({item}) => {
        return(
            <Cell
                item = {item}
                isShown = {this.props.joueursSelectionnes.includes(item.id)}
            />
        )
    }


    render(){
        return(
            <View style = {{flex :1}}>

                <ComposantRechercheAutour
                    type={"Joueurs"}
                    renderItem={this._renderCell}
                />
            </View>
        )
    }
}


class Cell extends React.Component {
  
    render() {
    return (
        <View style = {{marginRight : wp('8%')}}>
        <Joueurs_Ajout_Item 
            joueur = {this.props.item}
            isShown = {this.props.isShown}
            txtDistance = {' '}
        />

            
      </View>
    );
  }
}

    


const mapStateToProps = (state) => {
    return{ 
        joueursSelectionnes : state.joueursSelectionnes
    } 
}
  
export default connect(mapStateToProps)(Joueurs_Autours_De_Moi_Final)

import React from 'react'
import { View, Text } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Joueur_item_Creation_Partie from '../../../../Components/ProfilJoueur/Joueur_item_Creation_Partie'
import { connect } from 'react-redux'
import LocalUser from '../../../../Data/LocalUser.json'

import ComposantRechercheAutour from '../../../../Components/Recherche/ComposantRechercheAutour'



class Joueurs_Autours_Partie extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.ville = LocalUser.data.ville
        this.monId = LocalUser.data.id
        this.state = {
            joueurs : []
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


    _renderCell= ({item}) => {
        return(
            <Cell
                item = {item}
                isChecked= {this.isJoueurPresent(this.props.joueursPartie , item)}
            />
        )
    }


    render(){
        return(
            <ComposantRechercheAutour
                type={"Joueurs"}
                renderItem={this._renderCell}
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
        <Text style={{color:'black'}}>{this.props.title}</Text>
    );
  }
}

class Cell extends React.Component {
  
    render() {
    return (
        <View style = {{marginRight : wp('8%')}}>
            <Joueur_item_Creation_Partie
                pseudo = {this.props.item.pseudo}
                id = {this.props.item.id}
                photo = {this.props.item.photo}
                score = {this.props.item.score}
                isChecked = {this.props.isChecked}
                tokens = {this.props.item.tokens}

            />
      </View>
    );
  }
}



const mapStateToProps = (state) => {
    return{ 
        joueursPartie : state.joueursPartie,
    } 
}
export default connect(mapStateToProps) (Joueurs_Autours_Partie)
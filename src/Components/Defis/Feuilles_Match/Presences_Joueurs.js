import React from 'react'

import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity,FlatList,Alert,ScrollView,Picker} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

/**
 * Composant qui permet d'afficher les presences des joueurs pour un défi ou une partie.
 * C'est à dire la liste des joueurs ayant confirmés, ceux indispo et en attente
 */
export default class Presences_Joueurs extends React.Component {

    constructor(props){
        super(props)
    }


    /**
     * Fonction qui permet d'afficher le cercle de couleur
     * @param {String} color 
     */
    _renderCircleOfColor(color)  {
        return(
            <View>
                <View style = {[{ backgroundColor : color}, styles.circle]}></View>

                

            </View>
        )
    }



    render() {
        if(this.props.isPartie) {
            var txt =  "Confirmés / inscrits" 
        } else {
            var txt = "Confirmés"
        }
        return(
           
            <View>
                
                {/* Nbr de joueurs ayant confirmé */}
                <View style ={styles.bloc_disponibilite_joueurs}>
                    {this._renderCircleOfColor('green')}
                    <Text>{txt} {this.props.nbjoueursConfirmes}</Text>
                </View>

                {/* Nbr de joueurs indisponibles */}
                <View style ={styles.bloc_disponibilite_joueurs}>
                    {this._renderCircleOfColor('red')}
                    <Text>indisponibles : {this.props.nbIndisponibles}</Text>
                </View>

                {/* Nbr de joueurs en attente */}
                <View style ={{...styles.bloc_disponibilite_joueurs, alignItems: 'center'}}>
                    {this._renderCircleOfColor('#C0C0C0')}
                    <Text>En attente : {this.props.nbAttentes}</Text>
                    {this.props.renderBtnRelancer()}
                </View>

                
            </View>
        )
    }
}

const styles = {
    circle  : {
        width : wp('5%'),
        height :wp('5%'),
        borderRadius : wp('2.5%'),
        marginRight : wp('3%'),
        marginLeft : wp('3%')
    },
    bloc_disponibilite_joueurs : {
        flexDirection :'row',
        marginTop : hp('2%')
    },
}

import React from 'react'

import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'

/**
 * Classe qui permet d'afficher les informations pour les récapitulatif de partie ou de défis 
 * 
 * props : 
 *      - format : format du défi ou de la partie
 *      - pseudo : pseudo de l'organisateur 
 *      - jour : jour du défis ou partie 'dd-mm-yyyy'
 *      - heure : heure du défi ou partie 'hh:mm'
 *      - duree : durée du défi ou partie
 *      - nomsTerrain : noms du terrains : {InsNom : ... , EquNom : ...}
 *      - isPartie : Si c'est une partie entre joueurs
 */
export default class Information_Recapitulatif extends React.Component {

    constructor(props) {
        super(props)
    }

    calculHeureFin(){
    

        var heure = parseInt(this.props.heure.split(':')[0]) + Math.trunc(this.props.duree)

        var minutes =    parseInt(this.props.heure.split(':')[1]) +  (this.props.duree -Math.trunc(this.props.duree)) * 60
        if(minutes >= 60) {
            heure ++
            minutes -= 60
        }

        if(heure >= 24) {
            heure = heure - 24
        }

        if(heure.toString().length == 1) {
            heure =  "0" + heure.toString()
        }
        if(minutes.toString().length == 1) {
            minutes = '0'+ minutes.toString()
        }
        return heure + ':' + minutes
    }

    renderTypeDefis(){
        if(this.props.isPartie) {
            return "Partie"
        }else {
            return "Défi"
        }
    }

    render() {
        
        var jour = this.props.jour.split('-')[0]
        var mois = this.props.jour.split('-')[1]
        if(mois.length ==1) {
            mois = '0'+mois
        }

        if(jour.length ==1) {
            jour = '0'+jour
        }

       
        var an = this.props.jour.split('-')[2]
        var heure = this.props.heure.split(':')[0]
        var minutes = this.props.heure.split(':')[1]

        if(heure.length == 1) {
            heure = "0" + heure
        }

        var date = jour +"-" + mois + "-" + an + " - " + heure + ":"+ minutes + " à " + this.calculHeureFin()
        return (
            <View>
                 {/* Information sur le defi */}
                 <Text style = {styles.infoDefis}>{this.renderTypeDefis()} {this.props.format} par {this.props.pseudo}</Text>
                    <Text style = {styles.separateur}>_____________________________________</Text>
                    <Text style = {styles.infoDefis}>{date}</Text>
                    <Text style = {styles.separateur}>_____________________________________</Text>

                    {/* View contenant l'icon terrain et son nom*/}
                    <View style = {{flexDirection : 'row', marginTop : hp('2%'), marginLeft : wp('8%'),alignItems:'center'}}>
                        <Image
                            source = {require('../../../../res/terrain1.jpg')}
                            style = {styles.photo_terrain}
                        />
                        {/* InsNom et EquNom du terrain */}
                        <View style = {{width : wp('70%'), justifyContent:'center', alignSelf : "center"}}>
                            <Text style = {styles.nomTerrains}>{this.props.nomsTerrain.InsNom}</Text>
                            <Text style = {styles.nomTerrains}>{this.props.nomsTerrain.N_Voie} {this.props.nomsTerrain.Voie}</Text>
                            <Text style = {styles.nomTerrains}>{this.props.nomsTerrain.Ville}</Text>
                            <Text style = {styles.nomTerrains}>{this.props.nomsTerrain.distance} km</Text>

                        </View>
                    </View>
                    
            </View>
        )
    }

}
const styles = {
    separateur : {
        alignSelf : "center",
        marginBottom : hp('2%')
    },
    photo_terrain : {
        //marginLeft : wp('3%'),
        marginRight : wp('3%'),
        width : wp('16%'), 
        height : wp('16¨%') 
    },

    infoDefis : {
        alignSelf : "center",
        fontSize : RF(2.2)
    },

    nomTerrains : {
        fontSize : RF(2.2)
    },
}
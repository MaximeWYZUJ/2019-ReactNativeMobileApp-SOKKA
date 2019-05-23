import React from 'react'
import {View, Text,Image,TouchableOpacity, TextInput, ScrollView,FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../Components/Colors'
import Slider from "react-native-slider";
import Joueurs from '../../Helpers/JoueursForAjout'
import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'
import { connect } from 'react-redux'

const latUser = 43.531486   // A suppr quand on aura les vrais coordonnées
const longUser = 1.490306
const DISTANCE_MAX_FROM_USER = 50;

/**
 * Classe qui va permettre à l'utilisateur de selectionner les joueurs qui 
 * sont autours de lui pour les ajouter à l'équipe qu'il est en train de
 * créer
 */
class Joueurs_Autours_De_Moi_Final extends React.Component {

    constructor(props) {
        super(props) ;
        //let maxDistance = this.state.distanceMax;
        let joueurFiltres = Joueurs.filter(function(joueur) {
            let lat_b = joueur.position[0];
            let lon_b = joueur.position[1]
            let rad_lata = (latUser * Math.PI)/180;
            let rad_long = ((longUser- lon_b) * Math.PI)/180;
            let rad_latb = (lat_b * Math.PI)/180;

            let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
            Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371
            return d <= DISTANCE_MAX_FROM_USER ;
        });

        this.state = {
            allJoueurs : joueurFiltres,
            distanceMax : 50,
            valueSlider : 50,
        }
    }

    /**
     * Fonction qui permet de filter les joueurs en fonction de leur distance
     * par rapport à l'utilisateur.
     * 
    */
   filtrerJoueurDistance() {
    let maxDistance = this.state.distanceMax;
    let joueurFiltres = Joueurs.filter(function(joueur) {
        let lat_b = joueur.position[0];
        let lon_b = joueur.position[1]
        let rad_lata = (latUser * Math.PI)/180;
        let rad_long = ((longUser- lon_b) * Math.PI)/180;
        let rad_latb = (lat_b * Math.PI)/180;

        let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
        Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371
        return d <= maxDistance;
    });
    this.setState({allJoueurs : joueurFiltres})
    }



    _calculDistance(lat_b,lon_b) {
        let rad_lata = (latUser * Math.PI)/180;
        let rad_long = ((longUser- lon_b) * Math.PI)/180;
        let rad_latb = (lat_b * Math.PI)/180;

        let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
        Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371
        return d;
    }

    /**
     * Fonction qui permet de filtrer les joueurs en fonction de ce que tappe 
     * l'utilisateur.
     */
    searchedJoueurs = (searchedText) => {
        let searchedJoueurs = this.state.allJoueurs.filter(function(joueur) {
            return joueur.nom.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({allJoueurs: searchedJoueurs});
    }

    renderItem = ({item}) => {
        var distance = this._calculDistance(item.position[0],item.position[1]);
        var txtDistance = distance.toString().split('.')[0];
        txtDistance = txtDistance +','+ distance.toString().split('.')[1][0]
        return (
        <Joueurs_Ajout_Item 
            joueur = {item}
            isShown = {this.props.joueursSelectionnes.includes(item.id)}
            txtDistance = {' - ' + txtDistance + ' km'}
        />)
    }

    render(){
       

        return (
            <View>
    
                {/* View contenant la bare de recherche */}
                <View style = {{flexDirection : 'row', marginTop : hp('2%'), marginLeft : wp('5%'), marginRight : wp('5%')}}>
                    <Image style={styles.search_image}
                        source = {require('app/res/search.png')} />
                    <TextInput
                        style={{flex: 1, borderWidth: 1, marginHorizontal: 15, borderRadius : 10, width : wp('10%')}}
                        onChangeText={this.searchedJoueurs}

                    />
                    <TouchableOpacity onPress={() => this.setState({text: ''})}>
                        <Image style={styles.search_image}
                                source = {require('app/res/cross.png')}/>
                    </TouchableOpacity>
                </View>

                {/* Nombre de km et slider */}
                <View style = {{marginTop : hp('2%')}}>
                    <Text style = {{ alignSelf :"center"}}>{this.state.distanceMax.toString().split('.')[0]} km</Text>
                    <Slider
                        minimumValue={0}
                        maximumValue={DISTANCE_MAX_FROM_USER}
                        style = {{width : wp('65%'), alignSelf :"center"}}
                        onValueChange={(value) => {
                            this.setState({ distanceMax : value, })
                            this.filtrerJoueurDistance()
                        }}
                        minimumTrackTintColor={Colors.agOOraBlue}
                        maximumTrackTintColor= {Colors.agooraBlueStronger}
                        thumbTintColor= {Colors.agooraBlueStronger} 
                    />
                </View>
               
               <ScrollView>
                    <FlatList
                        data = {this.state.allJoueurs}
                        keyExtractor={(item) => item.id}
                        extraData = {this.props.joueursSelectionnes}
                        removeClippedSubviews = {true}
                        renderItem={this.renderItem}
                    />
                </ScrollView>
                <Text> </Text>

            </View>
        )
    }
}

const styles = {
    search_image: {
        width: wp('7%'),
        height: wp('7%'),
    },

}


const mapStateToProps = (state) => {
    return{ 
        joueurs : state.joueurs,
        joueursSelectionnes : state.joueursSelectionnes
    } 
}
  
export default connect(mapStateToProps)(Joueurs_Autours_De_Moi_Final)
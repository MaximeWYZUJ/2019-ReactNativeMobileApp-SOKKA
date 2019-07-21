import React from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import villes from '../../Components/Creation/villes.json'



export default class AccueilRechercher extends React.Component {

    constructor(props) {
        super(props);
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Rechercher',
            tabBarOnPress({jumpToIndex, scene}) {
                jumpToIndex(scene.index);
            }
        }
    }


    /**
     * Fonction qui renvoie la position de la ville à partir de son nom
     * @param {String} Name : Nom de la ville 
     */
    findPositionVilleFromName(name) {
        for(var i  =  0 ; i < villes.length; i++) {
            if(name.toLocaleLowerCase() == villes[i].Nom_commune.toLocaleLowerCase()) {
                var position = villes[i].coordonnees_gps
                var latitude = position.split(',')[0]
                var longitude = position.split(', ')[1]
                 var pos = {
                    latitude : parseFloat(latitude),
                    longitude : parseFloat(longitude)
                }
               return pos

            }
        }
    }


    rechercheJoueur() {
        this.props.navigation.navigate("RechercherTab", {type: "Joueurs"});
    }

    rechercheEquipe() {
        this.props.navigation.navigate("RechercherTab", {type: "Equipes"});
    }

    rechercheTerrain() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                let pos = {
                    latitude : latUser,
                    longitude : longUser
                }
                LocalUser.geolocalisation = pos;
                
                this.props.navigation.navigate("RechercherTab", {type: "Terrains"});
        },
        (error) => {
            
            console.log(error)
            Alert.alert(
                '', 
                "Nous ne parvenons pas à capter votre position, voulez vous utiliser  \n celle de  " + LocalUser.data.ville + " ?",
                [
                    {text: 'Oui', onPress: () => {
                        var pos = this.findPositionVilleFromName(LocalUser.data.ville)
                        LocalUser.geolocalisation = pos;
                        this.props.navigation.navigate("RechercherTab", {type: "Terrains"});
                    } },
                    {
                      text: 'Non',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                ],
                
                )           
        },
        { enableHighAccuracy: true, timeout:    5000, maximumAge :300000}
        )
    }

    rechercheDefi() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                let pos = {
                    latitude : latUser,
                    longitude : longUser
                }
                LocalUser.geolocalisation = pos;
                
                this.props.navigation.navigate("RechercherTabDefi", {type: "Defis"});
        },
        (error) => {
            
            console.log(error)
            Alert.alert(
                '', 
                "Nous ne parvenons pas à capter votre position, voulez vous utiliser  \n celle de  " + LocalUser.data.ville + " ?",
                [
                    {text: 'Oui', onPress: () => {
                        var pos = this.findPositionVilleFromName(LocalUser.data.ville)
                        LocalUser.geolocalisation = pos;
                        this.props.navigation.navigate("RechercherTabDefi", {type: "Defis"});
                    } },
                    {
                      text: 'Non',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                ],
                
                )           
        },
        { enableHighAccuracy: true, timeout:    5000, maximumAge :300000}
        )
    }

    render() {
        return (
            <View style={styles.main_container}>
                <TouchableOpacity
                    style={styles.header_container}
                    onPress={() => this.rechercheJoueur()}>
                    <Text style={styles.header}>Rechercher un joueur</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.header_container}
                    onPress={() => this.rechercheEquipe()}>
                    <Text style={styles.header}>Rechercher une équipe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.header_container}
                    onPress={() => this.rechercheTerrain()}>
                    <Text style={styles.header}>Rechercher un terrain</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.header_container}
                    onPress={() => this.rechercheDefi()}>
                    <Text style={styles.header}>Rechercher un défi</Text>
                </TouchableOpacity>
            </View>
        )
    }

}


const styles =  StyleSheet.create({

    main_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItem: 'center'
    },

    header_container: {
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        borderWidth : 1,
        borderRadius : 8,
        alignSelf : 'center',
        width : wp('80%'),
        paddingVertical : hp('1%'),
        backgroundColor : '#313131'
    },

    header: {
        fontWeight : 'bold',
        fontSize : RF(2.4),
        marginLeft : wp('3%'),
        color : '#DE6868',
        textAlign: 'center'
    }

})
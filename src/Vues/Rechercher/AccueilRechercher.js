import React from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native'

import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import villes from '../../Components/Creation/villes.json'



export default class AccueilRechercher extends React.Component {


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


    async rechercheJoueur() {
        var jFav = await Database.getArrayDocumentData(LocalUser.data.reseau, "Joueurs");
        this.props.navigation.navigate("RechercherTab", {type: "Joueurs", dataFav: jFav});
    }

    async rechercheEquipe() {
        var eFav = await Database.getArrayDocumentData(LocalUser.data.equipesFav, "Equipes");
        this.props.navigation.navigate("RechercherTab", {type: "Equipes", dataFav: eFav});
    }

    async rechercheTerrain() {
        var tFav = await Database.getArrayDocumentData(LocalUser.data.terrains, "Terrains");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                let pos = {
                    latitude : latUser,
                    longitude : longUser
                }
                LocalUser.geolocalisation = pos;
                
                this.props.navigation.navigate("RechercherTab", {type: "Terrains", dataFav: tFav});
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

                        this.props.navigation.navigate("RechercherTab", {type: "Terrains", dataFav: tFav});
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
            <View style={styles.button}>
                <Text>Accueil Rechercher</Text>
                <Button title="Rechercher Joueur" onPress={() => this.rechercheJoueur()}/>
                <Button title="Rechercher Equipe" onPress={() => this.rechercheEquipe()}/>
                <Button title="Rechercher Terrain" onPress={() => this.rechercheTerrain()}/>
            </View>
        )
    }

}


const styles =  StyleSheet.create({

    button: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around'
    }

})
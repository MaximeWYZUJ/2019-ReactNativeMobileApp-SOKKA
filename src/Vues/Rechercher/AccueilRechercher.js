import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'


export default class AccueilRechercher extends React.Component {

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
        this.props.navigation.navigate("RechercherTab", {type: "Terrains", dataFav: tFav});
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
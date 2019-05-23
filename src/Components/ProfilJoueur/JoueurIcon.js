import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import Database from '../../Data/Database'


class JoueurIcon extends React.Component {

    constructor(props){
        super(props)
    }


    gotoProfilJoueur() {
        Database.getDocumentData(this.props.id, 'Joueurs').then(async (docData) => {
             // Traitement de la collection Reseau
             arrayReseau = await Database.getArrayDocumentData(docData.reseau, 'Joueurs');
 
             // Traitement de la collection Equipes
             arrayEquipes = await Database.getArrayDocumentData(docData.equipes, 'Equipes');
 
             // Traitement des données propres
             docData.naissance = new Date(docData.naissance.toDate());
 
             // Envoi
             this.props.nav.push("ProfilJoueur", {id: docData.id, joueur : docData, reseau : arrayReseau, equipes : arrayEquipes})
         
         }).catch(function(error) {
             console.log("Error getting document:", error);
         });
    }
    

    render() {
        const id = this.props.id
        const photo = this.props.photo
        return (
            <TouchableOpacity style={styles.main_container} onPress={() => this.gotoProfilJoueur()}>
                <Image style={{backgroundColor: '#C0C0C0', width: 60, height: 60}} source={{uri: photo}}/>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    main_container: {
    }
})

export default JoueurIcon
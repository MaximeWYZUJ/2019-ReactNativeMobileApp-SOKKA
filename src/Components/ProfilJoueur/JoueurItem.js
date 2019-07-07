import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import StarRating from 'react-native-star-rating'
import { withNavigation } from 'react-navigation'
import Database from '../../Data/Database'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import RF from 'react-native-responsive-fontsize';
class JoueurItem extends React.Component {

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
        const nom = this.props.nom
        const score = this.props.score
        const photo = this.props.photo

        return (
            <TouchableOpacity style={styles.main_container} onPress={() => this.gotoProfilJoueur()}>
                <Image
                    style={{backgroundColor: "#C0C0C0", width: wp('15%'), height: wp('15%'), borderRadius :28, marginLeft : wp('2%'), marginRight : wp('2%')}}
                    source={{uri: photo}}/>
                <View style={{flexDirection: 'column'}}>
                    <Text>{nom}</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={parseInt(score, 10)}
                        starSize={20}
                        fullStarColor='#F8CE08'
                        emptyStarColor='#B1ACAC'
                        containerStyle={{width: 30}}
                    />
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'row',
        marginTop : hp('1.5%'),
        marginBottom : hp('1.5%')
    }
})

export default withNavigation(JoueurItem)

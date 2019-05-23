import React from 'react'
import {View, TouchableOpacity,Image} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Database from '../../Data/Database'

/**
 * Composant qui permet d'afficher la photo d'un joueur dans la page de profil
 * de l'équipe. Une fois qu'on clique sur l'image, on est redirigé vers le
 * profil du joueur correspondant.
 */
export default class Photo_Joueur_Equipe extends React.Component {

    constructor(props) {
        super(props)
    }


    displayCapitanat() {
        if (this.props.isCaptain) {
            return <Image source = {require('app/res/c.png')} style = {styles.c}/>;
        }
    }


    gotoProfilJoueur(id) {
        db = Database.initialisation();
        Database.getDocumentData(id, 'Joueurs').then(async (docData) => {
 
             // Traitement de la collection Equipes
             arrayEquipes = await Database.getArrayDocumentData(docData.equipes, 'Equipes');
 
             // Traitement des données propres
             docData.naissance = new Date(docData.naissance.toDate());
 
             // Envoi
             this.props.nav.push("ProfilJoueur", {id: docData.id, joueur : docData, equipes : arrayEquipes})
         
         }).catch(function(error) {
             console.log("Error getting document:", error);
         });
    }


    render() {
        return (
            <View style = {styles.main_container}>
                <TouchableOpacity
                style = {styles.touchableOpacity}
                onPress={() => this.gotoProfilJoueur(this.props.id)}>
                    <Image source = {{uri : this.props.urlPhoto}} style= {styles.image} borderRadius={30}/>
                    {this.displayCapitanat()}
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = {
    main_container : {
        width: wp('19%'),
        height : wp('19%'),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        elevation : 5,
        //padding : wp('1%')

    },

    touchableOpacity : {

        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 5, width: 5 }, // IOS
        shadowOpacity: 5, // IOS
        shadowRadius: 5, //IOS
        elevation: 5, // Android
    },

    image : {
        width : wp('17%'),
        height : wp('17%'),
        resizeMode:  'cover',
        alignSelf: 'center',

    },
    c : {
        width : wp('7%'),
        height : wp('7%'),
        position : 'absolute',
        bottom : 0,
        right : 0
    }
}

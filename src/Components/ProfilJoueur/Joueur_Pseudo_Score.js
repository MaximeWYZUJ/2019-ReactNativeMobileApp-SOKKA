import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Animated} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import StarRating from 'react-native-star-rating'
import { withNavigation } from 'react-navigation'
import Database from '../../Data/Database'

/**
 * Composant qui permet d'afficher la photo d'un joueurs avec à coté son pseudo 
 * et son score
 * 
 * props : pseudo, id,score,photo, 
 *          tailleImageJoueur (pour choisir la taille de la photo,wp('16%) par default )
 */
class  Joueur_Pseudo_Score extends React.Component {

    constructor(props){
        super(props)
    }


    async gotoProfil() {
        console.log("in gotoprofil")
        console.log(this.props.data.equipes)
        var equipes = await Database.getArrayDocumentData(this.props.data.equipes,"Equipes")
        console.log("after equipe")

    }
    render(){

        var taille = wp('16%')
        if(this.props.tailleImageJoueur != undefined) {
            taille = this.props.tailleImageJoueur
        }
        return(
            <TouchableOpacity style = {[styles.containerItemJoueur, this.props.style]}
            onPress = {() => this.gotoProfil()}>

                <Image
                    source = {{uri : this.props.photo}}
                    style = {[styles.photoJoueur, {height : taille, width : taille, borderRadius : taille/2}]}
                /> 

                {/* View contenant le pseudo est le score*/}
                <View style = {{justifyContent : "center"}}>
                    <Text>{this.props.pseudo}</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.props.score}
                        starSize={hp('2.2%')}
                        fullStarColor='#F8CE08'
                        emptyStarColor='#B1ACAC'
                    />
                </View> 
            </TouchableOpacity>
        )
    }
}


const styles = {
    containerItemJoueur : {
        flexDirection : 'row',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6
    },

    photoJoueur : {
        marginRight : wp('3%')
    },
}

export default withNavigation (Joueur_Pseudo_Score)
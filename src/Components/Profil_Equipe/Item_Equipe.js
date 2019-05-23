import React from 'react'
import {View,Text,TouchableOpacity, Image} from 'react-native'
import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

/**
 * Classe permettant de définir les item pour présenter une équipe
 * au travers d'une liste.
 * 
 * Props : 
 *          - isCaptain : true si l'utilisateur est le capitaine de l'équipe
            - alreadyLike : true si l'utilisateur aime déja l'équipe
            - nom : string nom de l'equipe
            - photo : uri photo de l'equipe
            - nbJoueurs : int nombre de joueurs
            - score : int nombre d'etoiles
            - id
            - nav : props.navigation de l'ecran qui contient ce component
 */
export default class Item_Equipe extends React.Component {

    displayCapitanat() {
        if (this.props.isCaptain) {
            return <Image source = {require('app/res/c.png')} style = {styles.c}/>;
        } 
    }

    displayLike() {
        if(! this.props.alreadyLike) {
            return (
                <TouchableOpacity>
                    <Image source = {require('app/res/icon_like.png')} style = {styles.image_like}/>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return(
            <TouchableOpacity
            style = {styles.main_container}
            onPress={() => this.props.nav.push("Profil_Equipe", {equipeId : this.props.id})}>

                {/* View contenant l'image */}
                <View style = {styles.view_image}>
                        <Image source = {{uri: this.props.photo}} style = {styles.image}/>
                </View>

                {/*View contenant les infos de l'équipe (Nom, étoiles, nb de joueurs */}
                <View style = {styles.infos}>
                        <Text style = {styles.txt}>{this.props.nom}</Text>
                        <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.props.score}
                                starSize={hp('3.5%')}
                                fullStarColor='#F8CE08'
                                emptyStarColor='#B1ACAC'
                                containerStyle={{width: 40}}/>
                        <Text style = {styles.txt}>{this.props.nbJoueurs}</Text>
                </View>

                {/* View contenant le pouce pour le like */}
                <View style = {styles.view_like} >
                    {this.displayLike()}
                </View>
                {this.displayCapitanat()}
            </TouchableOpacity>
        )
    }
}



const styles = {

    main_container : {
        flexDirection : 'row',
        borderWidth : 1,
        flex : 1
    },

    view_image : {
        marginTop:5
    },

    image : {
        width : wp('17%'),
        height : wp('17%'),

    },

    etoiles : {
        width : 83,
        height : 16,
        alignSelf: 'stretch',
        marginBottom : wp('2%')

    },

    infos : {
        marginLeft :8
    },

    txt : {
        fontSize : RF(2.4)
    },

    image_like : {
        height : wp('10%'),
        width : wp('10%'), 
        marginRight : 0,
        alignSelf: 'flex-end',
    }, 

    view_like : {
        alignsItems: 'flex-end',
        flexGrow: 1
    },

    c : {
        width : wp('7%'),
        height : wp('7%'),
        position : 'absolute',
        bottom : 0,
        right : 0
    }
}
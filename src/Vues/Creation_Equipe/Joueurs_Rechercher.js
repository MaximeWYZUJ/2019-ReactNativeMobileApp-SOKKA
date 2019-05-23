
import React from 'react'

import {View, Text,Image,TouchableOpacity, TextInput,ListView, ScrollView,Dimensions,Animated, SectionList,FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Joueurs from '../../Helpers/JoueursForAjout'
import Colors from '../../Components/Colors'
import StarRating from 'react-native-star-rating'
import { connect } from 'react-redux'


/**
 * Classe qui va permettre à l'utilisateur de rechercher des joueurs à 
 * ajouter à l'équipe qu'il est en train de créer.
 */
class Joueurs_Rechercher extends React.Component {

    
    constructor(props) {
        super(props)

        this.state = {
            joueurs : [],
            allJoueurs : Joueurs,
        }
    }


    /**
     * Permet de filter les joueurs en fonction du texte recherché
     */
    searchedJoueurs = (searchedText) => {
        let searchedJoueurs = Joueurs.filter(function(joueur) {
            return joueur.nom.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({allJoueurs: searchedJoueurs});
    }

    /**
     * Permet d'ajouter un joueur à la liste des joueurs à ajouter si 
     * il n'est pas déja présent, le supprime sinon
     * @param {String} joueur 
    */
    _addJoueur(idJoueur) {
        if(this.props.joueurs.includes(idJoueur)) {
            const action = { type: "SUPPRIMER_JOUEUR_EQUIPE_CREATION", value: idJoueur}
            this.props.dispatch(action)
        }else {
            const action = { type: "AJOUTER_JOUEUR_EQUIPE_CREATION", value: idJoueur}
            this.props.dispatch(action)
        }

      
    }

   
    render() {
        return(

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
                <ScrollView>
                <FlatList
                
                removeClippedSubviews = {true}
    
                data = {this.state.allJoueurs}
                keyExtractor={(item) => item.id}
                extraData = {this.props.joueursSelectionnes}
    
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
        width: 30,
        height: 30,
    },
}

const mapStateToProps = (state) => {
    return{ 
        joueurs : state.joueurs
    } 
}


export default connect(mapStateToProps)(Joueurs_Rechercher)
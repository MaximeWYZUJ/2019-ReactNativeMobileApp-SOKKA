
import React from 'react'

import {View, Text,Image,TouchableOpacity, TextInput, ScrollView,FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Joueurs from '../../Helpers/JoueursForAjout'
import { connect } from 'react-redux'
import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'

/**
 * Classe qui va permettre à l'utilisateur permettre de choisir les joueurs de son 
 *  réseau à ajouter à l'équipe qu'il est en train de creer
 */
class Joueurs_Reseau_Final extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            joueurs : [],
            allJoueurs : Joueurs,
            distanceMax : 50,
        }
    }

    testAppartient(x,e) {
        var ok = false;
        for(var i = 0; i < x.length; i ++) {
            if(e == x[i]) {
                ok =  true
            }
        }
        
        return ok
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
        return (
        <Joueurs_Ajout_Item 
            joueur = {item}
            isShown = {this.props.joueursSelectionnes.includes(item.id)}
            txtDistance = ' '
        />)
    }
    render() {
       // const joueursSelectionnes = this.props.joueursSelectionnes;
       // const renderItem = ({ item }) => ( <Joueurs_Ajout_Item 
           // joueur = {item}
           // isShown = {this.testAppartient(joueursSelectionnes,item.id)}
        
       // />);
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
  
export default connect(mapStateToProps)(Joueurs_Reseau_Final)
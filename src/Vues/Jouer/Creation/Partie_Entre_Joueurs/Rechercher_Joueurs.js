
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity, Alert, ScrollView,FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Barre_Recherche_Query from '../../../../Components/Recherche/Barre_Recherche_Query'
import Joueur_item_Creation_Partie from '../../../../Components/ProfilJoueur/Joueur_item_Creation_Partie'
import { connect } from 'react-redux'
import LocalUser from '../../../../Data/LocalUser.json'


class Rechercher_Joueurs extends React.Component {

    constructor(props) {
        super(props)
        this.id  = LocalUser.data.id 
        this.state = {
            searchedText : 'm',
            joueurs : []
        }
    }

    /**
	 * Fonction qui va être passé en props du componant
	 * Bare_Recherche_Query et qui va permettre de mettre à jour le 
     * state en fonction des résultats renvoyés par Bare_Recherche_Query
	 */
    handleResults = (data)  => {
		this.setState({
			joueurs : data
		})
    }

    isJoueurPresent(liste, joueur) {
        for(var i = 0; i < liste.length ; i++) {
            if(liste[i].id == joueur.id){
                return true 
            }
        }
        return false
    }

    _renderItem = ({item}) => {
        
         return(
            <Joueur_item_Creation_Partie
                pseudo = {item.pseudo}
                id = {item.id}
                photo = {item.photo}
                score = {item.score}
                isChecked = {this.isJoueurPresent(this.props.joueursPartie, item)}
                tokens = {item.tokens}


            />
        )
    }

    renderList() {
        if(! this.state.joueurs.length == 0) {
                return(
                    <FlatList
                            data = {this.state.joueurs}
                            keyExtractor={(item) => item.id}
                            renderItem={this._renderItem}
                            extraData = {this.props.joueursPartie}
                            contentContainerStyle={{ paddingBottom: 20}}
                    />
                )
        } else {
            return(
                <Text>Aucun joueur ne correspond à ta recherche</Text>
            )
        }
    }


    render() {
        return(
            <View>
                <Barre_Recherche_Query
                    collection = {"Joueurs"}
                    field = {"queryPseudo"}
                    nbOfChar = {3}
                    handleResults = {this.handleResults}
                    non_pris_en_compte = {this.id}
                    handleFilterQuery = {null}
                />
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return{ 
        joueursPartie : state.joueursPartie,
    } 
}
export default connect(mapStateToProps)  (Rechercher_Joueurs)
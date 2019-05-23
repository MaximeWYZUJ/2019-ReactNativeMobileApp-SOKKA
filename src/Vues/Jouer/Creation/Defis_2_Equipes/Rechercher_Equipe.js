
import React from 'react'
import {Alert, View, Text,Image, ImageBackground,  StyleSheet, FlatList,TouchableOpacity,TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../../Components/Colors'
import DataBase from '../../../../Data/Database'
import Item_Equipe_Creation_Defis from '../../../../Components/Profil_Equipe/Item_Equipe_Creation_Defis'
import { connect } from 'react-redux'

import Barre_Recherche_Query from '../../../../Components/Recherche/Barre_Recherche_Query'

/**
 * Classe qui va permettre à l'utilisateur de faire une recherche (par nom ) d'une équipe
 * à défier. Pour limiter le nombre de requetes on commence à chercher dans la DB à partir 
 * de 4 caractères entrée
 */
class Rechercher_Equipe extends React.Component {

    constructor(props) {
        super(props)
        this.monEquipe = this.props.monEquipe
        this.state = {
            searchedText : 'm',
            equipes : []
        }
    }
    
  

    /**
	 * Fonction qui va être passé en props du componant
	 * Bare_Recherche_Query et qui va permettre de mettre à jour le 
     * state en fonction des résultats renvoyés par Bare_Recherche_Query
	 */
    handleResults = (data)  => {
		this.setState({
			equipes : data
		})
    }

    _renderItem = ({item}) => {
        return(
            <Item_Equipe_Creation_Defis
                id = {item.id}
                nom = {item.nom}
                photo = {item.photo}
                score = {item.score}
                nbJoueurs = {item.joueurs.length}
                isChecked = {this.props.equipeAdverse == item.id}
            />
        )
    }

    /**
     * Méthode qui va permettre d'afficher soit un texte indiquant qu'il n'y a pas de
     * résultat en accord avec la méthode ou la liste des équipes.
     */
    displayList() {
        if(this.state.equipes.length == 0) {
            return(
                <Text>Aucune équipe ne correspond à ta recherche</Text>
            )
        } else {
            return(
                <FlatList
                    data = {this.state.equipes}
                    keyExtractor={(item) => item.id}
                    renderItem = {this._renderItem}
                    extraData = {this.props.equipeAdverse}
                />
            )
        }
    }


    render() {
        return (

            <View style = {{marginTop : hp("1%")}}>
               
               <Barre_Recherche_Query
                    collection = {"Equipes"}
                    field = {"queryName"}
                    nbOfChar = {4}
                    handleResults = {this.handleResults}
                    non_pris_en_compte = {this.monEquipe}
               />

                {/* View contenant la liste des équipes */}
                <View>
                 {this.displayList()}  
                </View>

                
            </View>
        )
    }
}
const styles = {
    view_recherche : {
        flexDirection : 'row', 
        //marginLeft : wp('5%'), 
        //marginRight : wp('5%'), 
        backgroundColor : Colors.grayItem, 
        paddingVertical: hp('2%'),
        paddingHorizontal : wp('4%')
    }
}


const mapStateToProps = (state) => {
    return{ 
        equipeAdverse : state.equipeAdverse,
        monEquipe : state.monEquipe

		
    } 
}
export default connect(mapStateToProps)(Rechercher_Equipe)
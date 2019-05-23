import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import Terrains from '../../../Helpers/Toulouse.json'
import Item_Terrain_creation_defis from '../../../Components/Terrain/Item_Terrain_creation_defis'
import Distance from '../../../Helpers/Distance'
const DISTANCE_MAX = 20
import { connect } from 'react-redux'
import Barre_Recherche from '../../../Components/Recherche/Barre_Recherche'

const reseau = [1,34,3,67,147,20,19,25,26,5]

/**
 * Classe qui permet à l'utilisateur de séléctionner un terrains (de son réseau) sur 
 * lequel organiser un défi.
 */
class Terrains_Reseau extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            terrains : this.buildTerrainsFromList(reseau)
        }
    }

    buildTerrainsFromList(){
        let liste = []
        for(var i = 0 ; i < reseau.length; i++) {
            var t = {
                InsNom : Terrains[i].InsNom,
                N_Voie : Terrains[i].N_Voie,
                Voie : Terrains[i].Voie,
                Ville : Terrains[i].Ville,
                id : Terrains[i].id,
                Payant :  Terrains[i].Payant,

            }
            liste.push(t)
        }
        return liste
    }


    /**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les terrains 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
		this.setState({
			allTerrains : data
		})
	}

    _renderItem = ({item}) => {
       
        return (
			<Item_Terrain_creation_defis
				InsNom = {item.InsNom}
				EquNom = {item.EquNom}
				id = {item.id}
                isShown = {this.props.terrainSelectionne == item.id}
                payant = {item.Payant}
                N_Voie = {item.N_Voie}
                Voie = {item.Voie}
                Ville = {item.Ville}

		/>)
	}

    render() {
        return (
            <View>
               <Barre_Recherche
                    handleTextChange ={this.recherche}
                    data = {this.state.terrains}
                    field = "InsNom"
                />
               <FlatList
                    data= {this.state.terrains}
                    keyExtractor={(item) => item.id}
                    renderItem={this._renderItem}
                    extraData = {this.props.terrainSelectionne}
				/>
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return{ 
        terrainSelectionne : state.terrainSelectionne
    } 
}

export default connect(mapStateToProps) (Terrains_Reseau)
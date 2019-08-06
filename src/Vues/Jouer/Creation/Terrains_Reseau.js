import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import Item_Terrain_creation_defis from '../../../Components/Terrain/Item_Terrain_creation_defis'

import { connect } from 'react-redux'
import LocalUser from '../../../Data/LocalUser.json'
import Distance from '../../../Helpers/Distance'
import ComposantRechercheTab from '../../../Components/Recherche/ComposantRechercheTableau'


/**
 * Classe qui permet à l'utilisateur de séléctionner un terrains (de son réseau) sur 
 * lequel organiser un défi.
 */
class Terrains_Reseau extends React.Component {

    constructor(props) {
        super(props)
    }


    _renderItem = ({item}) => {
        var distance = Distance.calculDistance(item.Latitude, item.Longitude, LocalUser.geolocalisation.latitude, LocalUser.geolocalisation.longitude);
        distance = distance + "";
        var s = distance.split('.');
        var distanceTxt = s[0]+","+s[1][0]+s[1][1];
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
                distance= {distanceTxt}
		/>)
	}

    render() {
        return (
            <ComposantRechercheTab
                type={"Terrains"}
                donneesID={LocalUser.data.terrains}
                renderItem={this._renderItem}
            />
        )
    }
}


const mapStateToProps = (state) => {
    return{ 
        terrainSelectionne : state.terrainSelectionne
    } 
}

export default connect(mapStateToProps) (Terrains_Reseau)
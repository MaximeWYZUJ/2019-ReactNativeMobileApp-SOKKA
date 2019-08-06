import React from 'react'
import {View, FlatList, ScrollView} from 'react-native'
import { connect } from 'react-redux'

import Item_Terrain_creation_defis from '../../../Components/Terrain/Item_Terrain_creation_defis'

import Distance from '../../../Helpers/Distance'
import LocalUser from '../../../Data/LocalUser.json'
import allTerrains from '../../../Helpers/Toulouse.json'

import ComposantRechercheTableau from '../../../Components/Recherche/ComposantRechercheTableau'


class Rechercher_Terrains_Defis extends React.Component {

    constructor(props) {
        super(props)
    }



    renderItem = ({item}) => {
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
                distance = {distanceTxt}
            />
        )
    }



    render() {
        return (
            <ComposantRechercheTableau
                type={"Terrains"}
                renderItem={this.renderItem}
                donnees={allTerrains}
            />
        )
    }

}

const mapStateToProps = (state) => {
    return{ 
        terrainSelectionne : state.terrainSelectionne
    } 
}

export default connect(mapStateToProps) (Rechercher_Terrains_Defis)
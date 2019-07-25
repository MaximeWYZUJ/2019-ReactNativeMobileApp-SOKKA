import React from 'react'
import {View, FlatList, ScrollView} from 'react-native'
import { connect } from 'react-redux'

import Item_Terrain_creation_defis from '../../../Components/Terrain/Item_Terrain_creation_defis'
import BarreRecherche from '../../../Components/Recherche/Barre_Recherche'
import FiltrerTerrains from '../../../Components/Recherche/FiltrerTerrain'
import allTerrains from '../../../Helpers/Toulouse.json'
import Distance from '../../../Helpers/Distance'
import LocalUser from '../../../Data/LocalUser.json'


class Rechercher_Terrains_Defis extends React.Component {

    constructor(props) {
        super(props)

        this.queryFiltre = null;
        this.filtres = null;
        
        // State
        this.state = {
            dataDefaut: [],
            displayFiltres: false,
        }
    }


    // ====================================================



    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        this.handleFilterButton();
        this.queryFiltre = q;
        this.filtres = f;
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            return (<FiltrerTerrains handleValidate={this.handleValidateFilters} init={this.filtres}/>)
        }
    }
    


    renderSearchbar() {
        return (
            <BarreRecherche
                handleTextChange={this.validerRecherche}
                data={allTerrains}
                field={"queryName"}
                filterData={(data) => FiltrerTerrains.filtrerTerrains(data, this.filtres)}
                handleFilterButton={this.handleFilterButton}
            />
        )
    }


    renderItem(item) {
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


    validerRecherche = (data) => {
        console.log("valider recherche")
        this.setState({
            dataDefaut: data
        })
    }


    render() {
        if (this.queryFiltre === null) {
            nbChar = 0;
        } else {
            nbChar = 0;
        }
        return (
            <ScrollView style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 4}}>
                        {this.renderSearchbar()}
                    </View>
                </View>
                {this.displayFiltresComponents()}
                <FlatList
                    data={this.state.dataDefaut}
                    renderItem={({item}) => this.renderItem(item)}
                />
            </ScrollView>
        )
    }

}

const mapStateToProps = (state) => {
    return{ 
        terrainSelectionne : state.terrainSelectionne
    } 
}

export default connect(mapStateToProps) (Rechercher_Terrains_Defis)
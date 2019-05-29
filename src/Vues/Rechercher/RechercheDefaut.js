import React from 'react'
import { View, Text, FlatList } from 'react-native'

import BarreRechercheQuery from '../../Components/Recherche/Barre_Recherche_Query'
import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerEquipes from '../../Components/Recherche/FiltrerEquipe'
import FiltrerTerrains from '../../Components/Recherche/FiltrerTerrain'


export default class RechercheDefaut extends React.Component {

    constructor(props) {
        super(props)

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis

        // Champ(s) sur lequel faire la query
        switch (this.type) {
            case "Joueurs" : this.champNom = "nomQuery"; break;
            case "Equipes" : this.champNom = "queryName"; break;
            case "Terrains": this.champNom = "queryName"; break;
        }

        this.queryFiltre = null;
        
        // State
        this.state = {
            dataDefaut: [],
            displayFiltres: false,
        }

    }


    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        this.handleFilterButton();
        this.queryFiltre = q;
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            switch(this.type) {
                case "Joueurs": return (<FiltrerJoueur handleValidate={this.handleValidateFilters}/>)
                case "Equipes": return (<FiltrerEquipes handleValidate={this.handleValidateFilters}/>)
                case "Terrains": return (<FiltrerTerrains handleValidate={this.handleValidateFilters}/>)
            }
        }
    }


    renderItem(item) {
        switch(this.type) {
            case "Joueurs":
                return (
                    <ItemJoueur
                        id={item.id}
                        nom={item.nom}
                        photo={item.photo}
                        score={item.score}
                        nav={this.props.navigation}    
                    />
                )
            
            case "Equipes":
                return (
                    <ItemEquipe
                        isCaptain={false}
                        alreadyLike={false}
                        nom={item.nom}
                        photo={item.photo}
                        nbJoueurs={item.joueurs.length}
                        score={item.score}
                        id={item.id}
                        nav={this.props.navigation}
                    />
                )
            
            case "Terrains":
                return (
                    <ItemTerrain
                        id={item.id}
                        distance={item.distance}
                        InsNom={item.InsNom}
                        EquNom={item.EquNom}
                    />
                )
        }
    }


    validerRecherche = (data) => {
        console.log(data)
        this.setState({
            dataDefaut: data
        })
    }

    render() {
        console.log(this.type)
        if (this.queryFiltre === null) {
            nbChar = 0;
        } else {
            nbChar = 0;
        }
        return (
            <View style={{flex: 1}}>
                <BarreRechercheQuery
                    handleResults={this.validerRecherche}
                    collection={this.type}
                    field={this.champNom}
                    nbOfChar={nbChar}
                    handleFilterButton={this.handleFilterButton}
                    handleFilterQuery={this.queryFiltre}
                />
                {this.displayFiltresComponents()}
                <FlatList
                    data={this.state.dataDefaut}
                    renderItem={({item}) => this.renderItem(item)}
                />
            </View>
        )
    }

}
import React from 'react'
import { View, Text, FlatList } from 'react-native'

import BarreRecherche from '../../Components/Recherche/Barre_Recherche'
import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'

export default class RechercheFavoris extends React.Component {

    constructor(props) {
        super(props)

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis
        this.allFav = this.props.navigation.getParam("dataFav", []);

        // Champ(s) sur lequel faire la query
        switch (this.type) {
            case "Joueurs" : this.champNom = "nomQuery"; break;
            case "Equipes" : this.champNom = "queryName"; break;
            case "Terrains": this.champNom = "queryName"; break;
        }
        
        // State
        this.state = {
            dataFav: this.allFav,
            displayFiltres: false,
            filtres: null
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


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            return (<FiltrerJoueur handleValidate={this.handleValidateFilters}/>)
        }
    }


    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        this.handleFilterButton();
        switch(this.type) {
            case "Joueurs": {
                this.setState({filtres: f});
                break;
            }
        }
    }


    filtrerJoueurs = (data) => {
        f = this.state.filtres;
        data = data.filter(((elmt) => {return elmt["age"] > f.ageMin}));
        data = data.filter(((elmt) => {return elmt["age"] < f.ageMax}));
        if (f.ville !== "") {
            data = data.filter(((elmt) => {return elmt["ville"] === f.ville}))
        }
        if (f.score !== null) {
            data = data.filter(((elmt) => {return elmt["score"] === f.score}))
        }

        return data;
    }


    filtrerData = (data) => {
        if (this.state.filtres !== null) {
            switch (this.type) {
                case "Joueurs" : return this.filtrerJoueurs(data)
            }
        
        } else {
            return data;
        }
    }


    validerRecherche = (data) => {
        this.setState({
            dataFav: data
        })
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <BarreRecherche
                    handleTextChange={this.validerRecherche}
                    data={this.allFav}
                    field={this.champNom}
                    filterData={this.filtrerData}
                    handleFilterButton={this.handleFilterButton}
                />
                {this.displayFiltresComponents()}
                <FlatList
                    data={this.state.dataFav}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => this.renderItem(item)}
                />
            </View>
        )
    }

}
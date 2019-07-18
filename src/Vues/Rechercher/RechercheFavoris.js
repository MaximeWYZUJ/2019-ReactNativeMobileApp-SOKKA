import React from 'react'
import { View, Text, FlatList } from 'react-native'

import BarreRecherche from '../../Components/Recherche/Barre_Recherche'
import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerTerrain from '../../Components/Recherche/FiltrerTerrain'
import FiltrerEquipe from '../../Components/Recherche/FiltrerEquipe'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'


export default class RechercheFavoris extends React.Component {

    constructor(props) {
        console.log("recherche fav");
        super(props)
        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis
        
        switch(this.type) {
            case "Joueurs" : this.allFavId = LocalUser.data.reseau; break;
            case "Equipes" : this.allFavId = LocalUser.data.equipesFav; break;
            case "Terrains": this.allFavId = LocalUser.data.terrains; break;
        }
        this.allFav = [];

        // Champ(s) sur lequel faire la query
        switch (this.type) {
            case "Joueurs" : this.champNom = "nomQuery"; break;
            case "Equipes" : this.champNom = "queryName"; break;
            case "Terrains": this.champNom = "queryName"; break;
        }
        
        // State
        this.state = {
            dataFav: [],
            displayFiltres: false,
            filtres: null
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: "Favoris"
        }
    }


    // === Manipulation du lifecycle entre les onglets ===
    componentDidMount() {
        Database.getArrayDocumentData(this.allFavId, this.type).then(data => {
            this.allFav = data;
            this.setState({dataFav: data})
        })

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', this.willBlurAction);
    }

    componentWillUnmount() {
        this.willBlurSubscription.remove();
    }

    willBlurAction = () => {
        this.setState({
            dataFav: this.allFav,
            displayFiltres: false,
            filtres: null
        })
    }

    // ====================================================


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
            switch (this.type) {
                case "Joueurs": return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
                case "Equipes": return (<FiltrerEquipe handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
                case "Terrains": return (<FiltrerTerrain handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
            }
            
        }
    }


    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        this.handleFilterButton();
        this.setState({filtres: f});
    }


    filtrerData = (data) => {
        if (this.state.filtres !== null) {
            switch (this.type) {
                case "Joueurs" : return FiltrerJoueur.filtrerJoueurs(data, this.state.filtres)
                case "Equipes" : return FiltrerEquipe.filtrerEquipes(data, this.state.filtres)
                case "Terrains": return FiltrerTerrain.filtrerTerrains(data, this.state.filtres)
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
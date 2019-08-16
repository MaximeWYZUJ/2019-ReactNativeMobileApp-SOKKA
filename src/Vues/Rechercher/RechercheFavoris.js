import React from 'react'
import { View, Text, FlatList } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';


import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'

import LocalUser from '../../Data/LocalUser.json'
import ComposantRechercheTableau from '../../Components/Recherche/ComposantRechercheTableau';
import Distance from '../../Helpers/Distance'


export default class RechercheFavoris extends React.Component {

    constructor(props) {
        super(props)

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis
        
        switch(this.type) {
            case "Joueurs" : this.allFavId = LocalUser.data.reseau; break;
            case "Equipes" : this.allFavId = LocalUser.data.equipesFav; break;
            case "Terrains": this.allFavId = LocalUser.data.terrains; break;
        }
        
        // State
        this.state = {
            dataFav: [],
            dataFavFiltered: [],
            dataFavAlphab: [],
            displayFiltres: false,
            filtres: null
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: "Favoris"
        }
    }

    componentDidMount() {
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', this.willBlurAction);
    }


    componentWillUnmount() {
        //this.willBlurSubscription.remove();
    }

    willBlurAction = () => {
        this.setState({
            dataFav: this.allFav,
            displayFiltres: false,
            filtres: null
        })
    }

    // ====================================================


    renderItem = ({item}) => {
        switch(this.type) {
            case "Joueurs":
                return (
                    <ItemJoueur
                        id={item.id}
                        nom={item.pseudo}
                        photo={item.photo}
                        score={item.score}
                        nav={this.props.navigation}
                        showLike={true}
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
            var distance = Distance.calculDistance(item.Latitude, item.Longitude, LocalUser.geolocalisation.latitude, LocalUser.geolocalisation.longitude);
                
                return (
                    <ItemTerrain
                        id={item.id}
                        distance={distance}
                        InsNom={item.InsNom}
                        EquNom={item.EquNom}
                        N_Voie = {item.N_Voie}
                        Voie = {item.Voie}
                        Ville = {item.Ville}
                        Payant = {item.Payant}
                    />
                )
        }
    }


    render() {
        return (
            <ComposantRechercheTableau
                type={this.type}
                donneesID={this.allFavId}
                renderItem={this.renderItem}
            />
        )
    }

}



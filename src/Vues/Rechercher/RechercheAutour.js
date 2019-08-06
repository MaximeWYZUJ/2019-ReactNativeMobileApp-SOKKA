import React from 'react'
import { View, Text } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import LocalUser from '../../Data/LocalUser.json'

import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'


import Database from '../../Data/Database';
import NormalizeString from '../../Helpers/NormalizeString'

import RechercheTerrainJouer from '../Jouer/Creation/Terrains_Autours'
import ComposantRechercheAutour from '../../Components/Recherche/ComposantRechercheAutour'


export default class RechercheAutour extends React.Component {


    constructor(props) {
        super(props);

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains
        switch (this.type) {
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Autour de moi"
        }
    }




    // Item affiché selon le type de recherche
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
        }
    }


    // ==============
    // === RENDER ===
    // ==============
    render() {

        if (this.type === "Terrains") {
            return (
                <RechercheTerrainJouer
                    gotoItemOnPress={true}
                    latitude={this.selfLat}
                    longitude={this.selfLong}
                />
            )
        }
        else {
            return (
                <ComposantRechercheAutour
                    type={this.type}
                    renderItem={this.renderItem}
                />
            )
        }
    }

}


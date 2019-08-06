import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import ComposantRechercheBDD from '../../Components/Recherche/ComposantRechercheBDD'
import ComposantRechercheTableau from '../../Components/Recherche/ComposantRechercheTableau'

import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie  from '../../Components/Defis/Item_Partie'
import Type_Defis from '../Jouer/Type_Defis'

import allTerrains from '../../Helpers/Toulouse.json'
import Distance from '../../Helpers/Distance'
import LocalUser from '../../Data/LocalUser.json'


export default class RechercheDefaut extends React.Component {

    constructor(props) {
        super(props)

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis

        // Champ(s) sur lequel faire la query
        switch (this.type) {
            case "Joueurs" : {this.champNomQuery = "pseudoQuery"; this.champNom = "pseudo"; break;}
            case "Equipes" : {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
            case "Defis": {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
        }

        this.queryFiltre = null;
        this.filtres = null;
        
        // State
        this.state = {
            dataDefaut: [],
            displayFiltres: false,
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: "Rechercher"
        }
    }
    

    // === Manipulation du lifecycle entre les onglets ===
    componentDidMount() {
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', this.willBlurAction);
    }

    componentWillUnmount() {
        this.willBlurSubscription.remove();
    }

    willBlurAction = () => {
        this.setState({
            dataDefaut: [],
            displayFiltres: false
        })
        this.queryFiltre = null;
    }


    // ====================================================


    buildJoueurs(partie) {
        var liste = []
        for(var i = 0; i < partie.participants.length ; i++) {
            if(! partie.indisponibles.includes(partie.participants[i])) {
                liste.push(partie.participants[i])
            }
        }
        return liste
    }


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

                case "Defis":
                    if(item.type == Type_Defis.partie_entre_joueurs){
                
                        return(
                            <Item_Partie
                                id = {item.id}
                                format = {item.format}
                                jour = {new Date(item.jour.seconds *1000)} 
                                duree = {item.duree}
                                joueurs = {this.buildJoueurs(item)}
                                nbJoueursRecherche =  {item.nbJoueursRecherche}
                                terrain=  {item.terrain}
                                latitudeUser = {LocalUser.geolocalisation.latitude}
                                longitudeUser = {LocalUser.geolocalisation.longitude}
                                message_chauffe  = {item.message_chauffe}
                            />
                        )
                    } else if(item.type == Type_Defis.defis_2_equipes) {
                        return(
                            <Item_Defi
                                format = {item.format}
                                jour = {new Date(item.jour.seconds * 1000)}
                                duree ={item.duree}
                                equipeOrganisatrice = {item.equipeOrganisatrice}
                                equipeDefiee = {item.equipeDefiee}
                                terrain = {item.terrain}
                                allDataDefi = {item}
                                    
                            />
                        )
                    }
            }
        
    }


    renderSpecialButton() {

        if (this.type == "Joueurs") {
            return (
                <TouchableOpacity onPress={() => Alert.alert(
                    '',
                    "Partage au répertoire : Fonctionnalité pas encore implémentée",
                    [
                        {
                            text: 'OK',
                            onPress: () => {},
                            style: 'cancel'
                        }
                    ],
                    )}>
                    <Image source={require('../../../res/fb.png')} style={{width: wp('15%'), height: wp('15%')}}/>
                </TouchableOpacity>
            )
        }

        if (this.type == "Equipes") {
            return (
                <TouchableOpacity onPress={() => Alert.alert(
                    '',
                    "Tu souhaites créer une équipe ?",
                    [
                        {
                            text: 'Annuler',
                            onPress: () => {},
                            style: 'cancel'
                        },
                        {
                            text: 'Continuer',
                            onPress: () => this.props.navigation.navigate("CreationEquipeNom"),
                        },
                    ],
                    )}>
                    <Image source={require('../../../res/icon_team.png')} style={{width: wp('20%'), height: wp('20%')}}/>
                </TouchableOpacity>
            )
        }

        if (this.type === "Terrains") {
            return (
                <TouchableOpacity onPress={() => Alert.alert(
                    '',
                    "Votre terrain n'est pas dans la base SOKKA ?\n\nPas de soucis, vous pouvez proposer d'ajouter votre terrain !",
                    [
                        {
                            text: 'Annuler',
                            onPress: () => {},
                            style: 'cancel'
                        },
                        {
                            text: 'Continuer',
                            onPress: this.handleProposerTerrain,
                        },
                    ],
                    )}>
                    <Image source={require('../../../res/icon_terrain.png')} style={{width: wp('15%'), height: wp('15%')}}/>
                </TouchableOpacity>
            )
        }
    }



    render() {
        if (this.type == "Terrains") {
            return (
                <ComposantRechercheTableau
                    type={this.type}
                    renderItem={this.renderItem}
                    donnees={allTerrains}
                    renderSpecialButton={this.renderSpecialButton}
                />
            )

        } else {

            return (
                <ComposantRechercheBDD
                    type={this.type}
                    renderItem={this.renderItem}
                    renderSpecialButton={this.renderSpecialButton}
                />
            )
        }
    }

}

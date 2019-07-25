import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import BarreRechercheQuery from '../../Components/Recherche/Barre_Recherche_Query'
import BarreRecherche from '../../Components/Recherche/Barre_Recherche'

import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie  from '../../Components/Defis/Item_Partie'
import Type_Defis from '../Jouer/Type_Defis'


import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerEquipes from '../../Components/Recherche/FiltrerEquipe'
import FiltrerTerrains from '../../Components/Recherche/FiltrerTerrain'
import FiltrerDefi from '../../Components/Recherche/FiltrerDefi'

import allTerrains from '../../Helpers/Toulouse.json'
import Distance from '../../Helpers/Distance'
import LocalUser from '../../Data/LocalUser.json'


export default class RechercheDefaut extends React.Component {

    constructor(props) {
        console.log("recherche defaut");
        super(props)

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis

        // Champ(s) sur lequel faire la query
        switch (this.type) {
            case "Joueurs" : this.champNom = "nomQuery"; break;
            case "Equipes" : this.champNom = "queryName"; break;
            case "Terrains": this.champNom = "queryName"; break;
            case "Defis": this.champNom = "queryName"; break;
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



    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        this.handleFilterButton();
        this.queryFiltre = q;
        this.filtres = f;
    
        if (this.type === "Defis" && q != null) {
            q.get().then((results) => {
                var data = [];
                for (var i=0; i<results.docs.length; i++) {
                    data.push(results.docs[i].data());
                }
                this.setState({dataDefaut: data})
            })
        }
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            switch(this.type) {
                case "Joueurs": return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.filtres}/>)
                case "Equipes": return (<FiltrerEquipes handleValidate={this.handleValidateFilters} init={this.filtres}/>)
                case "Terrains": return (<FiltrerTerrains handleValidate={this.handleValidateFilters} init={this.filtres}/>)
                case "Defis": return (<FiltrerDefi handleValidate={this.handleValidateFilters} init={this.filtres}/>)
            }
        }
    }
    


    renderSearchbar() {
        if (this.type === "Defis") {
            return (
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>Appuie sur le bouton à droite pour faire une recherche</Text>
                    <TouchableOpacity
                        style = {{backgroundColor : 'white', flexDirection : 'row', marginLeft : wp('3%'),paddingVertical : hp('1%'), paddingHorizontal :wp('3%')}}
                        onPress={() => {this.handleFilterButton()}}
                        >
                            <Image
                                style={{width : wp('7%'), height : wp('7%'), alignSelf : 'center'}}
                                source = {require('app/res/controls.png')} />
                    </TouchableOpacity>
                </View>
            )
        } else if (this.type === "Terrains") {
            return (
                <BarreRecherche
                    handleTextChange={this.validerRecherche}
                    data={allTerrains}
                    field={this.champNom}
                    filterData={(data) => FiltrerTerrains.filtrerTerrains(data, this.filtres)}
                    handleFilterButton={this.handleFilterButton}
                />
            )
        } else {
            return (
                <BarreRechercheQuery
                    handleResults={this.validerRecherche}
                    collection={this.type}
                    field={this.champNom}
                    nbOfChar={nbChar}
                    handleFilterButton={this.handleFilterButton}
                    handleFilterQuery={this.queryFiltre}
                />
            )
        }
    }


    buildJoueurs(partie) {
        var liste = []
        for(var i = 0; i < partie.participants.length ; i++) {
            if(! partie.indisponibles.includes(partie.participants[i])) {
                liste.push(partie.participants[i])
            }
        }
        return liste
    }


    renderItem(item) {

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


    validerRecherche = (data) => {
        console.log("valider recherche")
        this.setState({
            dataDefaut: data
        })
    }


    renderSpecialButton() {

        if (this.type == "Joueurs") {
            return (
                <TouchableOpacity onPress={() => Alert.alert(
                    '',
                    "Partage sur FB : Fonctionnalité pas encore implémentée\nPartage au répertoire : pas de JEH associée",
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
                    "Ajout d'un terrain dans la BDD : pas de JEH associée",
                    [
                        {
                            text: 'OK',
                            onPress: () => {},
                            style: 'cancel'
                        }
                    ],
                    )}>
                    <Image source={require('../../../res/icon_terrain.png')} style={{width: wp('15%'), height: wp('15%')}}/>
                </TouchableOpacity>
            )
        }
    }


    render() {
        if (this.queryFiltre === null) {
            nbChar = 0;
        } else {
            nbChar = 0;
        }
        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 4}}>
                        {this.renderSearchbar()}
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        {this.renderSpecialButton()}
                    </View>
                </View>
                {this.displayFiltresComponents()}
                <FlatList
                    data={this.state.dataDefaut}
                    renderItem={({item}) => this.renderItem(item)}
                />
            </View>
        )
    }

}
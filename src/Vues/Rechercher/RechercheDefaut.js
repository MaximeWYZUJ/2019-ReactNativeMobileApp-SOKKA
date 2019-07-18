import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import BarreRechercheQuery from '../../Components/Recherche/Barre_Recherche_Query'
import BarreRecherche from '../../Components/Recherche/Barre_Recherche'

import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerEquipes from '../../Components/Recherche/FiltrerEquipe'
import FiltrerTerrains from '../../Components/Recherche/FiltrerTerrain'

import allTerrains from '../../Helpers/Toulouse.json'


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
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            switch(this.type) {
                case "Joueurs": return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.filtres}/>)
                case "Equipes": return (<FiltrerEquipes handleValidate={this.handleValidateFilters} init={this.filtres}/>)
                case "Terrains": return (<FiltrerTerrains handleValidate={this.handleValidateFilters} init={this.filtres}/>)
            }
        }
    }
    


    renderSearchbar() {
        if (this.type === "Terrains") {
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
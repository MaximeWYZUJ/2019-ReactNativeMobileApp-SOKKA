import React from 'react'
import { View, Text, Button } from 'react-native'
import Slider from 'react-native-slider'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import LocalUser from '../../Data/LocalUser.json'

import BarreRecherche from '../../Components/Recherche/Barre_Recherche'
import ItemJoueur from '../../Components/ProfilJoueur/JoueurItem'
import ItemEquipe from '../../Components/Profil_Equipe/Item_Equipe'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'

import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerEquipes from '../../Components/Recherche/FiltrerEquipe'
import FiltrerTerrains from '../../Components/Recherche/FiltrerTerrain'

import AlphabetListView from 'react-native-alphabetlistview'

import Color from '../../Components/Colors'
import Villes from '../../Components/Creation/villes.json'
import Distance from '../../Helpers/Distance'
import Database from '../../Data/Database';
import NormalizeString from '../../Helpers/NormalizeString'

import RechercheTerrainJouer from '../Jouer/Creation/Terrains_Autours'


const SLIDER_DISTANCE_MAX = 20;

export default class RechercheAutour extends React.Component {


    constructor(props) {
        super(props);
        this.selfLat = LocalUser.geolocalisation.latitude;
        this.selfLong = LocalUser.geolocalisation.longitude;

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis
        switch (this.type) {
            case "Joueurs" : {this.champNomQuery = "pseudoQuery"; this.champNom = "pseudo"; break;}
            case "Equipes" : {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
        }

        this.state = {
            //villesTriees: [],

            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: [],
            displayFiltres: false,
            filtres: null,
            sliderValue: 1
        }
        console.log("constructeur");
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Autour de moi"
        }
    }



    // === Manipulation du lifecycle entre les onglets ===
    componentDidMount() {
        console.log("did mount");
        //this.triVilles();

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this.willFocusAction);
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', this.willBlurAction);
    }


    willFocusAction = () => {
        this.selfLat = LocalUser.geolocalisation.latitude;
        this.selfLong = LocalUser.geolocalisation.longitude;

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains, Defis
        switch (this.type) {
            case "Joueurs" : {this.champNomQuery = "nomQuery"; this.champNom = "pseudo"; break;}
            case "Equipes" : {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
        }

        this.state = {
            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: [],
            displayFiltres: false,
            filtres: null,
            //sliderValue: 1
        }
    }

    willBlurAction = () => {
        this.setState({
            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: [],
            displayFiltres: false,
            filtres: null,
            sliderValue: 1
        })
    }


    componentWillUnmount() {
        this.willBlurSubscription.remove();
        this.willFocusSubscription.remove();
    }


    componentWillReceiveProps() {
        console.log("will receive props")
        this.triVilles();
    }

    // ===================================================


    async triVilles() {
        // Tri des villes par distance
        var villesTrieesAvecDoublons = Villes.sort(this.comparaisonDistanceVilles);

        // Suppression des doublons
        var villesTrieesSansDoublons = [];
        villesTrieesSansDoublons.push(villesTrieesAvecDoublons[0]);
        for (var i=1; i<villesTrieesAvecDoublons.length; i++) {
            if (!(villesTrieesAvecDoublons[i].Nom_commune === villesTrieesAvecDoublons[i-1].Nom_commune)) {
                villesTrieesSansDoublons.push(villesTrieesAvecDoublons[i]);
            }
        }

        this.setState({
            villesTriees: villesTrieesSansDoublons,
        })
    }


    // Comparaison de deux villes en fonction de leur distance par rapport à soi
    comparaisonDistanceVilles = (ville1, ville2) => {
        coos1 = ville1.coordonnees_gps.split(',');
        latitude1 = parseFloat(coos1[0]);
        longitude1 = parseFloat(coos1[1]);
        distance1 = Distance.calculDistance(latitude1, longitude1, this.selfLat, this.selfLong);

        coos2 = ville2.coordonnees_gps.split(',');
        latitude2 = parseFloat(coos2[0]);
        longitude2 = parseFloat(coos2[1]);
        distance2 = Distance.calculDistance(latitude2, longitude2, this.selfLat, this.selfLong);

        if (distance1 < distance2) {
            return -1;
        } else if (distance1 > distance2) {
            return 1;
        } else {
            return 0;
        }
    }

    // Renvoie la liste des villes proches de notre position
    getVillesProches(distanceMax) {
        if (this.state.villesTriees != undefined) {
        villesProches = [];
        for (v of this.state.villesTriees) {
            vLat = v.coordonnees_gps.split(',')[0];
            vLong = v.coordonnees_gps.split(',')[1];
            d = Distance.calculDistance(this.selfLat, this.selfLong, vLat, vLong);
            
            if (d < distanceMax) {
                villesProches.push(v);
            } else {
                break;
            }
        }

        return villesProches;
        }
    }

    // Renvoie la liste des joueurs habitant dans une ville proche de notre position
    async updateDataProches(distanceMax) {
        villesProches = this.getVillesProches(distanceMax);

        let db = Database.initialisation();
        let coll = db.collection(this.type);

        let dataProches = [];
        for (v of villesProches) {
            let nomVilleBDD = NormalizeString.normalize(v.Nom_commune);
            let firstLettre = nomVilleBDD[0].toUpperCase();
            nomVilleBDD = firstLettre + nomVilleBDD.substring(1, nomVilleBDD.length);

            let dataRef = coll.where('ville', '==', nomVilleBDD);
            let data = await dataRef.get();

            for (item of data.docs) {
                dataProches.push(item.data());
            }
        }


        // Tri des donnees par ordre alphabetique
        dataFiltrees = this.filtrerData(dataProches);
        dataProchesAlphab = this.buildAlphabetique(dataFiltrees);

        this.setState({
            dataAutour: dataProches,
            dataAutourFiltered: dataFiltrees,
            dataAutourAlphab : dataProchesAlphab
        })
    }

    // Construit le tableau avec les donnees par ordre alphabetique
    buildAlphabetique(donneesBrutes) {
        let  data =  {
            A: [],
            B: [],
            C: [],
            D: [],
            E: [],
            F: [],
            G: [],
            H: [],
            I: [],
            J: [],
            K: [],
            L: [],
            M: [],
            N: [],
            O: [],
            P: [],
            Q: [],
            R: [],
            S: [],
            T: [],
            U: [],
            V: [],
            W: [],
            X: [],
            Y: [],
            Z: [],
        }
        for(var i = 0; i < donneesBrutes.length ; i ++) {
            item = donneesBrutes[i];
            let pseudo = item[this.champNom];
            let lettre = pseudo[0].toUpperCase();
            data[lettre].push(item);
        }
        return data
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


    // ===========================
    // === Gestion des filtres ===
    // ===========================
    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            switch(this.type) {
                case "Joueurs": return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
                case "Equipes": return (<FiltrerEquipes handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
                case "Terrains": return (<FiltrerTerrains handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
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
        var data = this.state.dataAutour;
        var dataFiltree = this.filtrerData2(data, f);
        var dataFiltreeAlphab = this.buildAlphabetique(dataFiltree);
        this.setState({
            filtres: f,
            dataAutourFiltered: dataFiltree,
            dataAutourAlphab: dataFiltreeAlphab
        });
    }



    filtrerData = (data) => {
        if (this.state.filtres !== null) {
            switch (this.type) {
                case "Joueurs" : return FiltrerJoueur.filtrerJoueurs(data, this.state.filtres);
                case "Equipes" : return FiltrerEquipes.filtrerEquipes(data, this.state.filtres);
            }
        
        } else {
            return data;
        }
    }


    filtrerData2 = (data, f) => {
        if (f !== null) {
            switch (this.type) {
                case "Joueurs" : return FiltrerJoueur.filtrerJoueurs(data, f);
                case "Equipes" : return FiltrerEquipes.filtrerEquipes(data, f);
            }
        
        } else {
            return data;
        }
    }


    validerRecherche = (data) => {
        let dataFiltree = this.filtrerData(data);
        let dataAlphab = this.buildAlphabetique(dataFiltree);
        this.setState({
            dataAutourFiltered: dataFiltree,
            dataAutourAlphab: dataAlphab
        })
    }


    // ==============
    // === RENDER ===
    // ==============
    render() {
        console.log("render");

        if (this.type === "Terrains") {
            return (<RechercheTerrainJouer
                        gotoItemOnPress={true}
                        latitude={this.selfLat}
                        longitude={this.selfLong}
                />)
        }
        else {
            return (
                <View style={{flex: 1}}>
                    <BarreRecherche
                        handleTextChange={this.validerRecherche}
                        data={this.state.dataAutour}
                        field={this.champNomQuery}
                        filterData={this.filtrerData}
                        handleFilterButton={this.handleFilterButton}
                    />
                    {this.displayFiltresComponents()}
                    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', marginHorizontal: wp('5%')}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text>{this.state.sliderValue} km</Text>
                        </View>
                        <Slider
                            minimumValue={1}
                            maximumValue={SLIDER_DISTANCE_MAX}
                            onSlidingComplete={(v) => {
                                this.setState({
                                    sliderValue: v,
                                    displayFiltres: false,
                                })
                                this.updateDataProches(v)
                            }}
                            step={1}
                            value={this.state.sliderValue}
                            minimumTrackTintColor={Color.lightGray}
                            maximumTrackTintColor={Color.lightGray}
                            thumbTintColor={Color.agOOraBlue}
                        />
                    </View>
                    <View style = {{flex: 5}}>
                        <AlphabetListView
                            data={this.state.dataAutourAlphab}
                            cell={this.renderItem}
                            cellHeight={30}
                            sectionListItem={SectionItem}
                            sectionHeader={SectionHeader}
                            sectionHeaderHeight={22.5}
                        />
                    </View>
                </View>
            )
        }
    }

}


// Classes internes

class SectionHeader extends React.Component {

    render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      color:'black',
      fontWeight:'bold',
      fontSize:RF(2.5),
      marginLeft : wp('2.5%')
    };

    var viewStyle = {
      backgroundColor: '#F7F7F7'
    };
  
    return (
        <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
      
    );
  }
}

class SectionItem extends React.Component {
  render() {
    

    return (
        <Text style={{color:'black'}}></Text>
    );
  }
}
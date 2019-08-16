import React from 'react'
import { View, Text, ScrollView, Alert, FlatList } from 'react-native'
import { withNavigation } from 'react-navigation'
import Slider from 'react-native-slider'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import LocalUser from '../../Data/LocalUser.json'

import BarreRecherche from '../../Components/Recherche/Barre_Recherche'

import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerEquipes from '../../Components/Recherche/FiltrerEquipe'

import AlphabetListView from 'react-native-alphabetlistview'

import Color from '../../Components/Colors'
import Villes from '../../Components/Creation/villes.json'
import Distance from '../../Helpers/Distance'
import Database from '../../Data/Database';
import NormalizeString from '../../Helpers/NormalizeString'

import Simple_Loading from '../../Components/Loading/Simple_Loading'


const SLIDER_DISTANCE_MAX = 20;

class ComposantRechercheAutour extends React.Component {


    constructor(props) {
        super(props);

        // Collection
        this.type = this.props.type; // Joueurs, Equipes, Defis
        switch (this.type) {
            case "Joueurs" : {this.champNomQuery = "pseudoQuery"; this.champNom = "pseudo"; break;}
            case "Equipes" : {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
        }

        this.state = {
            selfLat: LocalUser.geolocalisation.latitude,
            selfLong: LocalUser.geolocalisation.longitude,

            isLoading: false,

            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: this.buildAlphabetique([]),

            displayFiltres: false,
            filtres: null,
            sliderValue: 1
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Autour de moi"
        }
    }



    // === Manipulation du lifecycle entre les onglets ===
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this.willFocusAction);
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', this.willBlurAction);
        this.didFocusSubscription = this.props.navigation.addListener('didFocus', this.didFocusAction);
    }


    didFocusAction = () => {
        this.demanderGeolocalisation();
    }


    willFocusAction = () => {

        // Collection
        this.type = this.props.type; // Joueurs, Equipes, Defis
        switch (this.type) {
            case "Joueurs" : {this.champNomQuery = "pseudoQuery"; this.champNom = "pseudo"; break;}
            case "Equipes" : {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
        }

        this.setState({
            isLoading: false,

            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: this.buildAlphabetique([]),

            displayFiltres: false,
            filtres: null,
            sliderValue: 1
        })
    }

    willBlurAction = () => {
        this.setState({
            isLoading: false,

            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: this.buildAlphabetique([]),

            displayFiltres: false,
            filtres: null,
            sliderValue: 1
        })
    }


    componentWillUnmount() {
        //this.didFocusSubscription.remove();
        //this.willBlurSubscription.remove();
        //this.willFocusSubscription.remove();
    }


    // ===================================================


    findPositionVilleFromName(name) {
        for(var i  =  0 ; i < Villes.length; i++) {
            if(name.toLocaleLowerCase() == Villes[i].Nom_commune.toLocaleLowerCase()) {
                var position = Villes[i].coordonnees_gps
                var latitude = position.split(',')[0]
                var longitude = position.split(', ')[1]
                 var pos = {
                    latitude : parseFloat(latitude),
                    longitude : parseFloat(longitude)
                }
               return pos

            }
        }
    }


    demanderGeolocalisation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                let pos = {
                    latitude : latUser,
                    longitude : longUser
                }
                LocalUser.geolocalisation = pos;
                this.setState({
                    selfLat: pos.latitude,
                    selfLong: pos.longitude
                })
                this.triVilles();
        },
        (error) => {
            
            Alert.alert(
                '',
                "Nous ne parvenons pas à capter ta position. Nous utiliserons celle de " + LocalUser.data.ville.charAt(0).toUpperCase() + LocalUser.data.ville.slice(1),
            )
            var pos = this.findPositionVilleFromName(LocalUser.data.ville)
            LocalUser.geolocalisation = pos;
            this.setState({
                selfLat: pos.latitude,
                selfLong: pos.longitude
            })
            this.triVilles();
        },
        { enableHighAccuracy: true, timeout:    5000, maximumAge :300000}
        )
    }


    // ===================================================

    async triVilles() {
        this.setState({isLoading: true});

        // Suppression des villes trop loin
        var villesProches = this.getVillesProches(SLIDER_DISTANCE_MAX, Villes, false);

        // Tri des villes par distance
        var villesTrieesAvecDoublons = villesProches.sort(this.comparaisonDistanceVilles);

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
            isLoading: false,
        })
        //this.updateDataProches(1, villesTrieesSansDoublons); // fait planter l'appli si on decommente
    }


    // Comparaison de deux villes en fonction de leur distance par rapport à soi
    comparaisonDistanceVilles = (ville1, ville2) => {
        coos1 = ville1.coordonnees_gps.split(',');
        latitude1 = parseFloat(coos1[0]);
        longitude1 = parseFloat(coos1[1]);
        distance1 = Distance.calculDistance(latitude1, longitude1, this.state.selfLat, this.state.selfLong);

        coos2 = ville2.coordonnees_gps.split(',');
        latitude2 = parseFloat(coos2[0]);
        longitude2 = parseFloat(coos2[1]);
        distance2 = Distance.calculDistance(latitude2, longitude2, this.state.selfLat, this.state.selfLong);

        if (distance1 < distance2) {
            return -1;
        } else if (distance1 > distance2) {
            return 1;
        } else {
            return 0;
        }
    }

    // Renvoie la liste des villes proches de notre position
    getVillesProches(distanceMax, tableau, doBreak) {
        if (tableau != undefined) {
            villesProches = [];
            for (v of tableau) {
                vLat = v.coordonnees_gps.split(',')[0];
                vLong = v.coordonnees_gps.split(',')[1];
                d = Distance.calculDistance(this.state.selfLat, this.state.selfLong, vLat, vLong);
                
                if (d < distanceMax) {
                    villesProches.push(v);
                } else {
                    if (doBreak) {
                        break;
                    }
                }
            }

            return villesProches;
        }
    }

    // Renvoie la liste des joueurs habitant dans une ville proche de notre position
    async updateDataProches(distanceMax, tableauVilles) {
        if (tableauVilles != undefined) {
            this.setState({isLoading: true});

            villesProches = this.getVillesProches(distanceMax, tableauVilles, true);
            var db = Database.initialisation();
            var coll = db.collection(this.type);

            let dataProches = [];
            for (v of villesProches) {
                let nomVilleBDD = NormalizeString.normalize(v.Nom_commune);

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
                dataAutourAlphab : dataProchesAlphab,
                isLoading: false
            })
        }
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
            let lettre = NormalizeString.normalize(pseudo.toLowerCase())[0].toUpperCase();
            data[lettre].push(item);
        }
        return data
    }

    

    // ===========================
    // === Gestion des filtres ===
    // ===========================
    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            switch(this.type) {
                case "Joueurs": return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
                case "Equipes": return (<FiltrerEquipes handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
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



    displayHeader() {
        if (this.props.header != undefined) {
            return (
                <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical : wp('5%'),
                        marginHorizontal: wp('5%'),
                        borderRadius : 15,
                        backgroundColor: Color.agOOraBlue,
                    }}>
                    <Text style={{
                        color: 'white',
                        fontSize: RF(2.7),
                        fontWeight: 'bold',
                        paddingVertical: 4
                    }}>{this.props.header}</Text>
                </View>
            )
        }
    }


    // ==============
    // === RENDER ===
    // ==============
    render() {
        if (this.state.isLoading) {

            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Simple_Loading taille={hp('3%')}/>
                </View>
            )

        } else {
            return (
                <ScrollView>
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
                            onValueChange={(v) => this.setState({sliderValue: v})}
                            onSlidingComplete={(v) => {
                                this.setState({
                                    sliderValue: v,
                                    displayFiltres: false,
                                })
                                this.updateDataProches(v, this.state.villesTriees)
                            }}
                            step={1}
                            value={this.state.sliderValue}
                            minimumTrackTintColor={Color.lightGray}
                            maximumTrackTintColor={Color.lightGray}
                            thumbTintColor={Color.agOOraBlue}
                        />
                    </View>
                    {this.displayHeader()}
                    <AlphabetListView
                        data={this.state.dataAutourAlphab}
                        cell={this.props.renderItem}
                        cellHeight={30}
                        sectionListItem={SectionItem}
                        sectionHeader={SectionHeader}
                        sectionHeaderHeight={22.5}
                    />
                </ScrollView>
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


export default withNavigation(ComposantRechercheAutour)
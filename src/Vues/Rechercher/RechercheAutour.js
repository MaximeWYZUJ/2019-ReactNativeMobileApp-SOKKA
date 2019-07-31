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
        this.selfLat = LocalUser.geolocalisation.latitude;
        this.selfLong = LocalUser.geolocalisation.longitude;

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains
        switch (this.type) {
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
        }

        this.state = {
            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: [],

            displayFiltres: false,
            filtres: null,
            sliderValue: 2
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Autour de moi"
        }
    }



    // === Manipulation du lifecycle entre les onglets ===
    componentDidMount() {
        //this.triVilles();

        this.willFocusSubscription = this.props.navigation.addListener('willFocus', this.willFocusAction);
        this.willBlurSubscription = this.props.navigation.addListener('willBlur', this.willBlurAction);
    }


    willFocusAction = () => {
        this.selfLat = LocalUser.geolocalisation.latitude;
        this.selfLong = LocalUser.geolocalisation.longitude;

        // Collection
        this.type = this.props.navigation.getParam("type", null); // Joueurs, Equipes, Terrains
        switch (this.type) {
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
        }

        this.state = {
            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: [],

            displayFiltres: false,
            filtres: null,
            sliderValue: 2
        }
    }

    willBlurAction = () => {
        this.setState({
            dataAutour: [],
            dataAutourFiltered: [],
            dataAutourAlphab: [],

            displayFiltres: false,
            filtres: null,
            sliderValue: 2
        })
    }


    componentWillUnmount() {
        this.willBlurSubscription.remove();
        this.willFocusSubscription.remove();
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
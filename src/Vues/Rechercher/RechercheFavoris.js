import React from 'react'
import { View, Text, FlatList } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import AlphabetListView from 'react-native-alphabetlistview'

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
            case "Joueurs" : {this.champNomQuery = "pseudoQuery"; this.champNom = "pseudo"; break;}
            case "Equipes" : {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
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


    // === Manipulation du lifecycle entre les onglets ===
    componentDidMount() {
        Database.getArrayDocumentData(this.allFavId, this.type).then(data => {
            this.allFav = data;
            var dataF = this.filtrerData(data);
            var dataFA = this.buildAlphabetique(dataF);
            this.setState({
                dataFav: data,
                dataFavFiltered: dataF,
                dataFavAlphab: dataFA
            })
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
        var dataF = this.filtrerData2(this.allFav, f);
        var dataFA = this.buildAlphabetique(dataF);
        this.setState({
                dataFavFiltered: dataF,
                dataFavAlphab: dataFA,
                filtres: f
            })
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


    filtrerData2 = (data, f) => {
        if (f !== null) {
            switch (this.type) {
                case "Joueurs" : return FiltrerJoueur.filtrerJoueurs(data, f);
                case "Equipes" : return FiltrerEquipe.filtrerEquipes(data, f);
                case "Terrains": return FiltrerTerrain.filtrerTerrains(data, f)
            }
        
        } else {
            return data;
        }
    }


    validerRecherche = (data) => {
        var dataF = this.filtrerData(data);
        var dataFA = this.buildAlphabetique(dataF);
        this.setState({
            dataFav: data,
            dataFavFiltered: dataF,
            dataFavAlphab: dataFA
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


    render() {
        return (
            <View style={{flex: 1}}>
                <BarreRecherche
                    handleTextChange={this.validerRecherche}
                    data={this.allFav}
                    field={this.champNomQuery}
                    filterData={this.filtrerData}
                    handleFilterButton={this.handleFilterButton}
                />
                {this.displayFiltresComponents()}
                <View style = {{flex: 5}}>
                    <AlphabetListView
                        data={this.state.dataFavAlphab}
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
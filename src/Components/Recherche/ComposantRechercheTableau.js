import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Color from '../../Components/Colors'

import AlphabetListView from 'react-native-alphabetlistview'

import BarreRecherche from '../../Components/Recherche/Barre_Recherche'
import Simple_Loading from '../../Components/Loading/Simple_Loading'

import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerTerrain from '../../Components/Recherche/FiltrerTerrain'
import FiltrerEquipe from '../../Components/Recherche/FiltrerEquipe'

import Database from '../../Data/Database'
import NormalizeString from '../../Helpers/NormalizeString'


class ComposantRechercheTableau extends React.Component {

    constructor(props) {
        super(props)

        // Collection
        this.type = this.props.type; // Joueurs, Equipes, Terrains
        if (this.props.donnees != undefined) {
            this.allFav = this.props.donnees;
        } else {
            this.allFav = [];
        }

        // Champ(s) sur lequel faire la query
        switch (this.type) {
            case "Joueurs" : {this.champNomQuery = "pseudoQuery"; this.champNom = "pseudo"; break;}
            case "Equipes" : {this.champNomQuery = "queryName"; this.champNom = "nom"; break;}
            case "Terrains": {this.champNomQuery = "queryName"; this.champNom = "InsNom"; break;}
        }
        
        // State
        this.state = {
            dataFav: this.allFav,
            dataFavFiltered: this.allFav,
            dataFavAlphab: this.buildAlphabetique(this.allFav),

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
        if (this.props.donneesID != undefined) {
            Database.getArrayDocumentData(this.props.donneesID, this.type).then(data => {
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
            let lettre = NormalizeString.normalize(pseudo.toLowerCase())[0].toUpperCase();
            data[lettre].push(item);
        }
        return data
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


    renderSpecialButton() {
        if (this.props.renderSpecialButton != undefined) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {this.props.renderSpecialButton()}
                </View>
            );
        }
    }



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
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            <BarreRecherche
                                handleTextChange={this.validerRecherche}
                                data={this.state.dataFav}
                                field={this.champNomQuery}
                                filterData={this.filtrerData}
                                handleFilterButton={this.handleFilterButton}
                            />
                        </View>
                        {this.renderSpecialButton()}
                    </View>    
                    {this.displayFiltresComponents()}
                    {this.displayHeader()}
                    <View style = {{flex: 5}}>
                        <AlphabetListView
                            data={this.state.dataFavAlphab}
                            cell={this.props.renderItem}
                            cellHeight={30}
                            sectionListItem={SectionItem}
                            sectionHeader={SectionHeader}
                            sectionHeaderHeight={22.5}
                        />
                    </View>
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


export default withNavigation(ComposantRechercheTableau);
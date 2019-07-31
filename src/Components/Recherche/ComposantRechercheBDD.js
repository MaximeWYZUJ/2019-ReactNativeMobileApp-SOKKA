import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import Email from 'react-native-email'

import BarreRechercheQuery from '../../Components/Recherche/Barre_Recherche_Query'
import Simple_Loading from '../../Components/Loading/Simple_Loading'

import AlphabetListView from 'react-native-alphabetlistview'

import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import FiltrerEquipes from '../../Components/Recherche/FiltrerEquipe'
import FiltrerTerrains from '../../Components/Recherche/FiltrerTerrain'
import FiltrerDefi from '../../Components/Recherche/FiltrerDefi'

import NormalizeString from '../../Helpers/NormalizeString'


class ComposantRechercheBDD extends React.Component {

    constructor(props) {
        super(props)

        // Collection
        this.type = this.props.type; // Joueurs, Equipes, Terrains, Defis

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
            isLoading: false,
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


    handleSearchStart = () => {
        this.setState({isLoading: true});
    }


    handleSearchEnd = () => {
        this.setState({isLoading: false});
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
        } else {
            return (
                <BarreRechercheQuery
                    handleResults={this.validerRecherche}
                    collection={this.type}
                    field={this.champNomQuery}
                    nbOfChar={nbChar}
                    handleFilterButton={this.handleFilterButton}
                    handleFilterQuery={this.queryFiltre}
                    handleSearchStart={this.handleSearchStart}
                    handleSearchEnd={this.handleSearchEnd}
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


    validerRecherche = (data) => {
        this.setState({
            dataDefaut: data
        })
    }


    handleProposerTerrain = () => {
        const to = "contact@sokka.app"
        Email(to, {
            subject : "Proposition de terrain",
            body : "Bla bla"
        }).catch(console.error)
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
            let lettre = NormalizeString.normalize(pseudo)[0].toUpperCase();
            data[lettre].push(item);
        }
        return data
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


    displayResultList() {
        if (this.type == "Defis") {
            return (
                <FlatList
                    data={this.state.dataDefaut}
                    keyExtractor={(data) => data.id}
                    renderItem={this.props.renderItem}
                />
            )
        } else {
            return (
                <AlphabetListView
                    data={this.buildAlphabetique(this.state.dataDefaut)}
                    cell={this.props.renderItem}
                    cellHeight={30}
                    sectionListItem={SectionItem}
                    sectionHeader={SectionHeader}
                    sectionHeaderHeight={22.5}
                />
            )
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
            if (this.queryFiltre === null) {
                nbChar = 0;
            } else {
                nbChar = 0;
            }
            return (
                <ScrollView>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 4}}>
                            {this.renderSearchbar()}
                        </View>
                        {this.renderSpecialButton()}
                    </View>
                    {this.displayFiltresComponents()}
                    {this.displayHeader()}

                    <View style = {{flex: 5}}>
                        {this.displayResultList()}
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


export default withNavigation(ComposantRechercheBDD);
import React from 'react'
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native'
import RF from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation'
import AlphabetListView from 'react-native-alphabetlistview'
import BarreRecherche from './Recherche/Barre_Recherche'

import FiltrerEquipe from './Recherche/FiltrerEquipe'
import FiltrerJoueur from './Recherche/FiltrerJoueur'
import FiltrerTerrain from './Recherche/FiltrerTerrain'


class SearchList extends React.Component {

    constructor(props) {
        super(props)
        this.monProfil = this.props.monProfil != undefined && this.props.monProfil == true;

        this.state = {
            text: '',
            filtres: null,
            displayFiltres: false,
            dataFiltree: this.props.data
        }

        // Champ(s) sur lequel faire la query
        switch (this.props.type) {
            case "Joueurs" : this.champNom = "pseudoQuery"; break;
            case "Equipes" : this.champNom = "queryName"; break;
            case "EquipesFav" : this.champNom = "queryName"; break;
            case "Terrains": this.champNom = "queryName"; break;
        }
    }


    /**
     * Fonction qui permet de trier les joueurs en fonction de l'ordre laphabethique
     * de leur pseudo.
     * @param {*} dataVrac 
     */
    buildJoueurs(dataVrac) {
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
        for(var i = 0; i < dataVrac.length ; i ++) {
            d = dataVrac[i]
            let lettre;
            switch(this.props.type) {
                case "Joueurs": {lettre = d.pseudo[0].toUpperCase(); break;}
                case "Equipes": {lettre = d.nom[0].toUpperCase(); break;}
                case "EquipesFav": {lettre = d.nom[0].toUpperCase(); break;}
                case "Terrains": {lettre = d.InsNom[0].toUpperCase(); break;}
            }
            let arrayj = data[lettre];
            arrayj.push(dataVrac[i])
            data[lettre] = arrayj
        }
        return data
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            switch (this.props.type) {
                case "Joueurs": return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
                case "Equipes": return (<FiltrerEquipe handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
                case "EquipesFav": return (<FiltrerEquipe handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
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
        this.setState({filtres: f});
    }


    filtrerData = (data) => {
        if (this.state.filtres !== null) {
            switch (this.props.type) {
                case "Joueurs" : return FiltrerJoueur.filtrerJoueurs(data, this.state.filtres)
                case "Equipes" : return FiltrerEquipe.filtrerEquipes(data, this.state.filtres)
                case "EquipesFav" : return FiltrerEquipe.filtrerEquipes(data, this.state.filtres)
                case "Terrains": return FiltrerTerrain.filtrerTerrains(data, this.state.filtres)
            }
        
        } else {
            return data;
        }
    }


    validerRecherche = (data) => {
        this.setState({
            dataFiltree: data
        })
    }


    getPlusButtonJoueursFav() {
        return (
            <TouchableOpacity
                style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%'), width: wp('8%')}}
                onPress={() => Alert.alert(
                                '',
                                "Tu souhaites ajouter de nouveaux joueurs à ton réseau",
                                [
                                    {
                                        text: 'Confirmer',
                                        onPress: () => this.props.navigation.navigate("RechercherTab", {type: "Joueurs"})
                                    },
                                    {
                                        text: 'Annuler',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
        )
    }


    getPlusButtonEquipesFav() {
        return (
            <TouchableOpacity
                style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%'), width: wp('8%')}}
                onPress={() => Alert.alert(
                                '',
                                "Tu souhaites ajouter de nouvelles équipes dans tes équipes favorites",
                                [
                                    {
                                        text: 'Confirmer',
                                        onPress: () => this.props.navigation.navigate("RechercherTab", {type: "Equipes"})
                                    },
                                    {
                                        text: 'Annuler',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
        )
    }


    getPlusButtonTerrainsFav() {
        return (
            <TouchableOpacity
                style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%'), width: wp('8%')}}
                onPress={() => Alert.alert(
                                '',
                                "Tu souhaites ajouter de nouveaux terrains dans tes terrains favoris",
                                [
                                    {
                                        text: 'Confirmer',
                                        onPress: () => this.props.navigation.navigate("RechercherTab", {type: "Terrains"})
                                    },
                                    {
                                        text: 'Annuler',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
        )
    }


    getPlusButtonEquipes() {
        return (
            <TouchableOpacity
                style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%'), width: wp('8%')}}
                onPress={() => Alert.alert(
                                '',
                                "Que veux-tu faire ? Créer une équipe ou rechercher une équipe à intégrer ?",
                                [
                                    {
                                        text: 'Créer',
                                        onPress: () => this.props.navigation.push("CreationEquipeNom")
                                    },
                                    {
                                        text: 'Rechercher',
                                        onPress: () => this.props.navigation.navigate("RechercherTab", {type: "Equipes"}),
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
        )
    }


    renderBtnPlus() {
        if (this.monProfil) {
            switch(this.props.type) {
                case "Equipes": return this.getPlusButtonEquipes();
                case "EquipesFav": return this.getPlusButtonEquipesFav();
                case "Joueurs": return this.getPlusButtonJoueursFav();
                case "Terrains": return this.getPlusButtonTerrainsFav();
            }
        }
    }


    render() {
        const title = this.props.title        

        return (
            <ScrollView style={styles.main_container}>
                {/* Barre de recherche */}
                <BarreRecherche
                    handleTextChange={this.validerRecherche}
                    data={this.props.data}
                    field={this.champNom}
                    filterData={this.filtrerData}
                    handleFilterButton={this.handleFilterButton}
                />
                {this.displayFiltresComponents()}

                {/* Liste des joueurs de mon reseau */}
                <View style={{flex: 7}}>
                    {/* HEADER */}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}>
                            <Text style={styles.header}>{title}</Text>
                        </View>
                        {this.renderBtnPlus()}
                    </View>

                    {/* LISTE */}
                    <View style={{flex: 1}}>
                        <AlphabetListView
                            data={this.buildJoueurs(this.state.dataFiltree)}
                            cell={this.props.renderItem}
                            cellHeight={30}
                            sectionListItem={SectionItem}
                            sectionHeader={SectionHeader}
                            sectionHeaderHeight={22.5}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    search_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    search_image: {
        width: 30,
        height: 30,
    },
    header_container: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        //width : wp('88%'),
        height: hp('10%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
        borderRadius : 15,
        backgroundColor:'#52C3F7',
    },

    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
})

export default withNavigation(SearchList)



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
    

    return (<View></View>);
  }
}
import React from 'react'
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native'
import RF from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation'
import BarreRecherche from './Recherche/Barre_Recherche'

import FiltrerEquipe from './Recherche/FiltrerEquipe'
import FiltrerJoueur from './Recherche/FiltrerJoueur'
import FiltrerTerrain from './Recherche/FiltrerTerrain'


class SearchList extends React.Component {

    constructor(props) {
        super(props)


        this.state = {
            text: '',
            filtres: null,
            displayFiltres: false,
            dataFiltree: this.props.data
        }

        // Champ(s) sur lequel faire la query
        switch (this.props.type) {
            case "Joueurs" : this.champNom = "nomQuery"; break;
            case "Equipes" : this.champNom = "queryName"; break;
            case "EquipesFav" : this.champNom = "queryName"; break;
            case "Terrains": this.champNom = "queryName"; break;
        }
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
                                        onPress: () => this.props.navigation.navigate("OngletRecherche_Autour", {type: "Joueurs"})
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
                                        onPress: () => this.props.navigation.navigate("OngletRecherche_Autour", {type: "Equipes"})
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
                                        onPress: () => this.props.navigation.navigate("OngletRecherche_Autour", {type: "Terrains"})
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
                                "Que veux-tu faire ? CREER UNE EQUIPE ou RECHERCHER UNE EQUIPE A INTEGRER",
                                [
                                    {
                                        text: 'Créer',
                                        onPress: () => this.props.navigation.push("CreationEquipeNom")
                                    },
                                    {
                                        text: 'Rechercher',
                                        onPress: () => this.props.navigation.navigate("OngletRecherche_Autour", {type: "Equipes"}),
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
        )
    }


    renderBtnPlus() {
        switch(this.props.type) {
            case "Equipes": return this.getPlusButtonEquipes();
            case "EquipesFav": return this.getPlusButtonEquipesFav();
            case "Joueurs": return this.getPlusButtonJoueursFav();
            case "Terrains": return this.getPlusButtonTerrainsFav();
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
                    <FlatList
                        data={this.state.dataFiltree}
                        keyExtractor={(item) => item.id}
                        renderItem={this.props.renderItem}
                    />
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
import React from 'react'
import {View, Text,Image, FlatList, ImageBackground,  StyleSheet, Animated,TouchableOpacity, ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Barre_Recherche from '../../../../Components/Recherche/Barre_Recherche'
import Database from '../../../../Data/Database'
import Joueur_item_Creation_Partie from '../../../../Components/ProfilJoueur/Joueur_item_Creation_Partie'
import { connect } from 'react-redux'
import AlphabetListView from 'react-native-alphabetlistview'
import LocalUser from '../../../../Data/LocalUser.json'
import FiltrerJoueur from '../../../../Components/Recherche/FiltrerJoueur'



/**
 * Classe qui permet à l'utilisateur de choisir des joueurs de son réseau lors
 *  de la création d'une partie 
 */
class Joueurs_Reseau_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.reseau = LocalUser.data.reseau
        this.state = {
            displayFiltres: false,
            filtres: null,
            joueurs : [],
            joueursFiltres : []
        }
    }


    componentDidMount() {
        this.getJoueursFromDB() 
    }



    async getJoueursFromDB() {
        var joueursArray = await Database.getArrayDocumentData(this.reseau, "Joueurs")
        this.setState({joueurs : joueursArray , joueursFiltres : joueursArray})
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
        }
    }


    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        var dataF = FiltrerJoueur.filtrerJoueurs(this.state.joueurs, f);
        this.setState({
            joueursFiltres: dataF,
            filtres: f,
            displayFiltres: false
        })
    }

    validerRecherche = (data) => {
        var dataF = FiltrerJoueur.filtrerJoueurs(data, this.state.filtres);
        this.setState({
            joueursFiltres: dataF,
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
            let pseudo = item["pseudo"];
            let lettre = pseudo[0].toUpperCase();
            data[lettre].push(item);
        }
        return data
    }


    isJoueurPresent(liste, joueur) {
        for(var i = 0; i < liste.length ; i++) {
            if(liste[i].id == joueur.id){
                return true 
            }
        }
        return false
    }


    _renderItem = ({item}) => {       
         return(
            <Joueur_item_Creation_Partie
                pseudo = {item.pseudo}
                id = {item.id}
                photo = {item.photo}
                score = {item.score}
                isChecked = {this.isJoueurPresent(this.props.joueursPartie ,item)}
                tokens = {item.tokens}
            />
        )
    }

    renderList() {
        if(! this.state.joueurs.length == 0) {
            if( !this.state.joueursFiltres == 0){
                return(
                    <AlphabetListView
                        data = {this.buildAlphabetique(this.state.joueursFiltres)}
                        cell={this._renderItem}
                        cellHeight={30}
                        sectionListItem={SectionItem}
                        sectionHeader={SectionHeader}
                        sectionHeaderHeight={22.5}
                    />
                    
                )
            } else {
                return(
                    <Text>Aucun joueur ne correspond à ta recherche</Text>
                )
            } 
        } else {
            return(
                <Text>Tu n'as pas encore de joueurs dans ton réseau</Text>
            )
        }
    }


    render() {
        return (
            <ScrollView>
                <Barre_Recherche
                    handleTextChange ={this.validerRecherche}
                    data = {this.state.joueurs}
                    field = {"pseudoQuery"}
                    filtrerData = {(data) => FiltrerJoueur.filtrerJoueurs(data, this.state.filtres)}
                    handleFilterButton = {this.handleFilterButton}
                />
                {this.displayFiltresComponents()}
                {this.renderList()}
            </ScrollView>

         
                


        )
    }
} 
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
          <Text></Text>
      );
    }
}


const mapStateToProps = (state) => {
    return{ 
        joueursPartie : state.joueursPartie,
    } 
}
export default connect(mapStateToProps) (Joueurs_Reseau_Partie)
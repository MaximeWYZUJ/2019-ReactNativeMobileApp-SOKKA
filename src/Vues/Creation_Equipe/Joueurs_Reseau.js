
import React from 'react'

import {View, Text, ScrollView} from 'react-native'
import AlphabetListView from 'react-native-alphabetlistview'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux'
import {SkypeIndicator} from 'react-native-indicators';

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Barre_Recherche from '../../Components/Recherche/Barre_Recherche'
import FiltrerJoueur from '../../Components/Recherche/FiltrerJoueur'
import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'


/**
 * Classe qui va permettre à l'utilisateur permettre de choisir les joueurs de son 
 *  réseau à ajouter à l'équipe qu'il est en train de creer
 */
class Joueurs_Reseau_Final extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            joueurs : [],
            allJoueurs : [],
            joueurFiltres : [],
            distanceMax : 50,
            isLoading : true,
            filtres: null,
            displayFiltres: false
        }
        this.reseau = LocalUser.data.reseau
    }

    testAppartient(x,e) {
        var ok = false;
        for(var i = 0; i < x.length; i ++) {
            if(e == x[i]) {
                ok =  true
            }
        }
        
        return ok
    }

    componentDidMount() {
        this.downloadDataJoueur()
    }

    /**
     * Fonction qui permet de trier les joueurs en fonction de l'ordre laphabethique
     * de leur pseudo.
     * @param {*} joueurs 
     */
    buildJoueurs(joueurs) {
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
        for(var i = 0; i < joueurs.length ; i ++) {
            joueur = joueurs[i]
            let lettre = joueur.pseudo[0].toUpperCase()
            let arrayj = data[lettre]
            let j = {
                pseudo : joueur.pseudo,
                photo : joueur.photo,
                score : joueur.score,
                id : joueur.id
            }
            arrayj.push(j)
            data[lettre] = arrayj
        }
        return data
    }



    /**
     * Fonction qui permet de télécharger les données des joueurs du réseau 
     * de l'utilisateur
     */
    async downloadDataJoueur() {
        var liste = []
        for(var i = 0 ; i < this.reseau.length; i++) {
            var joueur = await Database.getDocumentData(this.reseau[i], "Joueurs")
            liste.push(joueur)
        }

        this.setState({allJoueurs : liste, joueurFiltres : liste, isLoading : false})
    }

    /**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les equipes 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
        var dataF = FiltrerJoueur.filtrerJoueurs(data, this.state.filtres);
		this.setState({
            joueurFiltres : dataF,
		})
    }

    handleValidateFilters = (q, f) => {
        var data = this.state.allJoueurs;
        var dataF = FiltrerJoueur.filtrerJoueurs(data, f);
        this.setState({
            joueurFiltres: dataF,
            filtres: f,
            displayFiltres: false
        })
    }

    handleFilterButton = () => {
        this.setState({displayFiltres: !this.state.displayFiltres})
    }

    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            return (
                <FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.state.filtres}/>
            )
        }
    }

    renderItem = ({item}) => {
        return (
        <Joueurs_Ajout_Item 
            joueur = {item}
            isShown = {this.props.joueursSelectionnes.includes(item.id)}
            txtDistance = ' '
        />)
    }


    buildJoueurs(joueurs) {
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
        for(var i = 0; i < joueurs.length ; i ++) {
            joueur = joueurs[i]
            let lettre = joueur.pseudo[0].toUpperCase()
            let arrayj = data[lettre]
            arrayj.push(joueur)
            data[lettre] = arrayj
        }
        return data
    }


    render() {
       // const joueursSelectionnes = this.props.joueursSelectionnes;
       // const renderItem = ({ item }) => ( <Joueurs_Ajout_Item 
           // joueur = {item}
           // isShown = {this.testAppartient(joueursSelectionnes,item.id)}
        

       // />);
       if(! this.state.isLoading) {

            return(
                <ScrollView>
                    {/* View contenant la bare de recherche */}
                    <Barre_Recherche
                        handleTextChange ={this.recherche}
                        data = {this.state.allJoueurs}
                        field = "pseudoQuery"
                        filtrerData = {(data) => FiltrerJoueur.filtrerJoueurs(data, this.state.filtres)}
                        handleFilterButton = {this.handleFilterButton}
                    />
                    {this.displayFiltresComponents()}
                    <AlphabetListView
                        data={this.buildJoueurs(this.state.joueurFiltres)}
                        cell={this.renderItem}
                        cellHeight={30}
                        sectionListItem={SectionItem}
                        sectionHeader={SectionHeader}
                        sectionHeaderHeight={22.5}
                    />
                </ScrollView>

            )
        } else {
            return(
                <View style = {{marginTop : hp('15%')}}>
                    <SkypeIndicator 
                     color='#52C7FD'
                     size = {hp('10%')} />
                 </View>
            )
        }
    }
}
const styles = {
    search_image: {
        width: wp('7%'),
        height: wp('7%'),
    },
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
        joueursSelectionnes : state.joueursSelectionnes

    }
}
  
export default connect(mapStateToProps)(Joueurs_Reseau_Final)
import React from 'react'
import {View, Text,Image, FlatList, ImageBackground,  StyleSheet, Animated,TouchableOpacity, ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Barre_Recherche from '../../../../Components/Recherche/Barre_Recherche'
import  Database from '../../../../Data/Database'
import Joueur_item_Creation_Partie from '../../../../Components/ProfilJoueur/Joueur_item_Creation_Partie'
import { connect } from 'react-redux'
import AlphabetListView from 'react-native-alphabetlistview'
import LocalUser from '../../../../Data/LocalUser.json'

// A SUPPR QUAND ACCES FICHIER LOCAL

/**
 * Classe qui permet à l'utilisateur de choisir des joueurs de son réseau lors
 *  de la création d'une partie 
 */
class Joueurs_Reseau_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.reseau = LocalUser.data.reseau
        this.state = {
            
            joueurs : [],
            joueursFiltres : []
        }
    }


    componentDidMount() {
        this.getJoueursFromDB() 
    }



    async getJoueursFromDB() {
        var joueursArray = await Database.getArrayDocumentData(this.reseau, "Joueurs")
        var j = this.buildJoueurs(joueursArray)
        this.setState({joueurs : joueursArray , joueursFiltres : j})
    }


    /**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les joueurs 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
		this.setState({
			joueursFiltres : this.buildJoueurs(data)
		})
    }

    isJoueurPresent(liste, joueur) {
        for(var i = 0; i < liste.length ; i++) {
            if(liste[i].id == joueur.id){
                return true 
            }
        }
        return false
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
                id : joueur.id,
                tokens : joueur.tokens
            }
            arrayj.push(j)
            data[lettre] = arrayj
        }
        return data
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
                        data = {this.state.joueursFiltres}
                        cell={this._renderCell}
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

    _renderCell= ({item}) => {
        return(
            <Cell
                item = {item}
                isChecked= {this.isJoueurPresent(this.props.joueursPartie , item)}
            />
        )
    }

    render() {
        return (
            <View style = {{flex :1}}>
                <Barre_Recherche
                    handleTextChange ={this.recherche}
                    data = {this.state.joueurs}
                    field = "pseudo"
                />
                
                {this.renderList()}

                
            </View>

         
                


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
          <Text style={{color:'black'}}>{this.props.title}</Text>
      );
    }
}

class Cell extends React.Component {
  
    render() {
    return (
        <View style = {{marginRight : wp('8%')}}>
            <Joueur_item_Creation_Partie
                pseudo = {this.props.item.pseudo}
                id = {this.props.item.id}
                photo = {this.props.item.photo}
                score = {this.props.item.score}
                isChecked = {this.props.isChecked}
                tokens = {this.props.item.tokens}


            />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
    return{ 
        joueursPartie : state.joueursPartie,
    } 
}
export default connect(mapStateToProps) (Joueurs_Reseau_Partie)
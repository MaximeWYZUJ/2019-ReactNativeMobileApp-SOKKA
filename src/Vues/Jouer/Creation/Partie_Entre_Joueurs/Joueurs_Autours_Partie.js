
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../../Components/Colors'
import AlphabetListView from 'react-native-alphabetlistview'
import Joueur_item_Creation_Partie from '../../../../Components/ProfilJoueur/Joueur_item_Creation_Partie'
import { connect } from 'react-redux'
import DataBase from '../../../../Data/Database'
import LocalUser from '../../../../Data/LocalUser.json'

    
/**
 * Classe qui va permettre de choisir les joueurs présent dans la même ville que l'utilisateur
 * lors de la création d'une partie entre joueur.
 * ATTENTION : pour limiter le nbr de requette on va pas afficher tout les joueurs d'une même ville
 */
class Joueurs_Autours_Partie extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.ville = LocalUser.data.ville
        this.monId = LocalUser.data.id
        this.state = {
            joueurs : []
        }
    }

    componentDidMount() {
        this.getJoueursFromDB()
    }

    /**
     * Fonction qui va faire une query sur la base de donnée et renvoyer 20 joueurs (aléatoirement)
     * qui sont dans la même ville que l'utilisateur. 
     */
    getJoueursFromDB() {
        var joueurArray = []
        var db = DataBase.initialisation()

        var ref = db.collection("Joueurs");
        var query = ref.where("ville", "==", this.ville).limit(20);
        query.get().then(async (results) => {
            if(results.empty) {
              console.log("No documents found!");   
            } else {
              // go through all results
              for(var i = 0; i < results.docs.length ; i++) {
                if(results.docs[i].data().id != this.monId) {
                    joueurArray.push(results.docs[i].data())

                }
              }
             
              var j = this.buildJoueurs(joueurArray)
              this.setState({joueurs : j})

              

            }

        
          }).catch(function(error) {
              console.log("Error getting documents:", error);
          });
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



    _renderCell= ({item}) => {
        return(
            <Cell
                item = {item}
                isChecked= {this.isJoueurPresent(this.props.joueursPartie , item)}
            />
        )
    }


    render(){
        return(
            <View style = {{flex :1}}>

                <AlphabetListView
                    data={this.state.joueurs}
                    cell={this._renderCell}
                    cellHeight={30}
                    sectionListItem={SectionItem}
                    sectionHeader={SectionHeader}
                    sectionHeaderHeight={22.5}
                />
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
export default connect(mapStateToProps) (Joueurs_Autours_Partie)
import React from 'react'
import {View, Text,Image,TouchableOpacity, TextInput, ScrollView,FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../Components/Colors'
import RF from 'react-native-responsive-fontsize';

import Joueurs from '../../Helpers/JoueursForAjout'
import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'
import { connect } from 'react-redux'
import AlphabetListView from 'react-native-alphabetlistview'
import LocalUser from '../../Data/LocalUser.json'
import DataBase from '../../Data/Database'

const latUser = 43.531486   // A suppr quand on aura les vrais coordonnées
const longUser = 1.490306
const DISTANCE_MAX_FROM_USER = 50;


/**
 * Classe qui va permettre à l'utilisateur de selectionner les joueurs qui 
 * sont autours de lui pour les ajouter à l'équipe qu'il est en train de
 * créer
 */
class Joueurs_Autours_De_Moi_Final extends React.Component {
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
                id : joueur.id
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
                isShown = {this.props.joueursSelectionnes.includes(item.id)}
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
        <Joueurs_Ajout_Item 
            joueur = {this.props.item}
            isShown = {this.props.isShown}
            txtDistance = {' '}
        />

            
      </View>
    );
  }
}

    


const mapStateToProps = (state) => {
    return{ 
        joueurs : state.joueurs,
        joueursSelectionnes : state.joueursSelectionnes
    } 
}
  
export default connect(mapStateToProps)(Joueurs_Autours_De_Moi_Final)
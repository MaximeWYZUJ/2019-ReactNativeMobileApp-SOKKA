import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Animated} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import { connect } from 'react-redux'
import StarRating from 'react-native-star-rating'
import { CheckBox } from 'react-native-elements'
import actions from '../../../Store/Reducers/actions'
import LocalUser from '../../../Data/LocalUser.json'

import Joueur_Pseudo_Score from '../../../Components/ProfilJoueur/Joueur_Pseudo_Score'

/**
 * Classe qui permet d'afficher l'ecran présentant les buteurs pour une feuille de match d'une 
 * partie passé.
 */
class Buteurs extends React.Component {

    
    constructor(props) {
        super(props)
        this.monId =LocalUser.data.id
        this.state = {
            buteurs : this.props.partie.buteurs
        }
    }
    /**
     * Fonction qui permet de récupérer les données du créateur de la partie.
     * On parcours la liste des joueurs jusqu'a retrouver le créateur. 
     */
    getOrganisateur() {
        for(var i  = 0; i < this.props.joueursInvites.length; i ++) {
            if(this.props.joueursInvites[i].id = this.props.partie.organisateur) {
                return this.props.joueursInvites[i]
            }
        }
        return undefined
    }

    /**
     * Fonction qui va renvoyer la liste des joueurs ayant confirmé par ordre alphabethique
     * sans l'organisateur
     */
    buildListOfJoueur(){
        var joueurs = []
        for(var i  = 0; i < this.props.joueursInvites.length; i ++) {
            if(this.props.joueursInvites[i].id != this.props.partie.organisateur) {
                joueurs.push(this.props.joueursInvites[i])
            }
        }
        joueurs = joueurs.sort(function (a, b) {
            if(a.pseudo == b.pseudo ) {
                return 0
            } else {
                return a.pseudo.toLowerCase().localeCompare(b.pseudo.toLowerCase())
            }
        })

        var organisateur = this.getOrganisateur()
        if(organisateur != null) joueurs =  [organisateur].concat(joueurs)
        return joueurs
    }

    /**
     * Fonction qui permet d'ajouter un but à un joueur et sauvagarder la new value
     * dans le state global
     * @param {String} id 
     */
    ajouterUnBut(id) {
        var adejaMarque = false
        for(var i = 0; i <this.props.buteurs.length; i++) {
            if(id == this.props.buteurs[i].id) {
                var obj = {
                    id : this.props.buteurs[i].id,
                    newNbButs : this.props.buteurs[i].nbButs + 1
                }
                const action = { type: actions.MAJ_BUTEUR, value: obj}
                this.props.dispatch(action)
                adejaMarque = true

            }
        }
        if(! adejaMarque) {
            var obj = {
                id : id,
                newNbButs : 1
            }
            const action = { type: actions.MAJ_BUTEUR, value: obj}
            this.props.dispatch(action)
        }
    }

      /**
     * Fonction qui permet d'ajouter un but à un joueur et sauvagarder la new value
     * dans le state global
     * @param {String} id 
     */
    enleverUnBut(id) {
        for(var i = 0; i <this.props.buteurs.length; i++) {
            if(id == this.props.buteurs[i].id) {
                if(this.props.buteurs[i].nbButs > 0 ) {
                    var obj = {
                        id : this.props.buteurs[i].id,
                        newNbButs : this.props.buteurs[i].nbButs - 1
                    }
                    const action = { type: actions.MAJ_BUTEUR, value: obj}
                    this.props.dispatch(action)
                }
                
            }
        }
    }


    _buildItemJoueur= ({item}) => {
        if(item != undefined) {
            return(
           
                <View style = {styles.containerItemJoueur}>
                    <Joueur_Pseudo_Score
                          pseudo = {item.pseudo}
                          photo = {item.photo}
                          score = {item.score}
                    />

                    {this.rendersButtonNbBut(item.id)}
      
                    {this.renderNbBut(item.id)}
                </View> 
              )
        }
    }


    /**
     * Fonction qui permet d'afficher les boutons pour séléctionner le nombres de
     * buts inscris par un joueur.
     * id  : id du joueur
     */
    rendersButtonNbBut(id) {
        if(this.monId == this.props.partie.organisateur) {
            return(
                <View style = {{flexDirection : "row", alignItems:'center', justifyContent:'center',}}>
                    
                    {/* Btn plus */}
                    <TouchableOpacity 
                        style = {styles.containerBouton}
                        onPress = {()=> this.ajouterUnBut(id)}>
                        <Text style = {styles.txtBtn}>+</Text>
                    </TouchableOpacity>

                    {/*Btn moins*/}
                    <TouchableOpacity 
                    onPress = {() => this.enleverUnBut(id)}
                    style = {styles.containerBouton}>
                        <Text style = {styles.txtBtn}>-</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    /**
     * Fonction qui affiche le nombre de but d'un joueurs
     */
    renderNbBut(idJoueur) {
        var nbButs = 0
        if(this.props.buteurs != undefined) {
            for(var i = 0; i <this.props.buteurs.length; i++) {
                if(this.props.buteurs[i].id == idJoueur) {
                    nbButs = this.props.buteurs[i].nbButs
                }
            }

        }
        return(
            <View style = {{alignItems:'center', justifyContent:'center',marginRight : wp('2%')}}>
                <Text>{nbButs} buts</Text>
            </View>
            
        )
        

    }
    render() {
        console.log(this.props.buteurs)
        return(
            <FlatList
                data = {this.buildListOfJoueur()}
                renderItem = {this._buildItemJoueur}
                keyExtractor={(item) => item.id}
            />
        )
    }


}

const styles = {
    containerItemJoueur : {
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6,
    },

    photoJoueur : {
        width : wp('16%'), 
        height : wp('16%'), 
        borderRadius : wp('8%'),
        marginRight : wp('3%')
    },

    containerBouton : {
        paddingLeft : wp('4%'),
        paddingRight : wp('4%'),
        borderRadius : 4,
        borderWidth : 1,
        borderColor : Colors.agOOraBlue,
        height : hp('5%'),
        alignItems:'center',        
        justifyContent:'center',
    },

    txtBtn : {
        color : Colors.agOOraBlue,
        fontWeight : "bold"
    }


}


const mapStateToProps = (state) => {
    return{ 
        joueursInvites : state.joueursInvites,
        partie : state.partie,
        buteurs : state.buteurs
    } 
}
export default connect(mapStateToProps) (Buteurs)
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
 * Classe qui permet d'afficher les joueurs présent à une partie passée
 */
class Presences_Joueurs extends React.Component {

    constructor(props) {
        console.log("in presence joueurs")
        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            joueursPresent : this.props.partie.confirme
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
     * Fonction qui permet de supprimer un joueur de la liste des joueurs présents
     * et donc renvoyer un nouveau array dans le state 
     */
    removePlayerFromListePresents(joueur){
        var liste = [] 
        for(var i = 0; i <this.state.joueursPresent.length; i++) {
            if (this.state.joueursPresent[i] != joueur.id) liste.push(this.state.joueursPresent[i])
        }
        this.setState({joueursPresent : liste})
        const action = { type: actions.STORE_JOUEURS_PRESENT, value:liste}
        this.props.dispatch(action)
    }

    /**
     * Fonction qui permet d'ajouter un joueur de la liste des joueurs présents
     * et donc renvoyer un nouveau array dans le state 
     */
    addPlayerFromListePresents(joueur){
        var liste = [] 
        for(var i = 0; i <this.state.joueursPresent.length; i++) {
            liste.push(this.state.joueursPresent[i])
        }
        liste.push(joueur.id)
        
        this.setState({joueursPresent : liste})
        

        const action = { type: actions.STORE_JOUEURS_PRESENT, value: liste}
        this.props.dispatch(action)
    }


    _renderCheckBox(joueur) {
        if(this.monId == this.props.partie.organisateur) {
            var isCheck = this.state.joueursPresent.includes(joueur.id)

            return(
                <CheckBox
                    right
                    title=' '
                    checkedColor = {Colors.agOOraBlue}
                    
                    containerStyle={{backgroundColor: 'white', borderWidth :0, justifyContent : 'center'}}                    
                    checked={isCheck}
                    onPress = {()=> {
                        if(this.monId == this.props.partie.organisateur ){
                            if(isCheck) {
                            
                                this.removePlayerFromListePresents(joueur)
                            } else {
                                this.addPlayerFromListePresents(joueur)
                            }   
                        }
                        
                    }} 
            />
            )
        }
    }

    
    _buildItemJoueur(joueur) {
        if(joueur != undefined) {
            return(
           
                <View style = {styles.containerItemJoueur}>
                    <Joueur_Pseudo_Score
                          pseudo = {joueur.pseudo}
                          photo = {joueur.photo}
                          score = {joueur.score}
                          style = {{marginRight : wp('30%')}}
                          data = {joueur}
                          
                    />
                    {this._renderCheckBox(joueur)}
                   
                </View> 
              )
        }
    }

    _renderItem = ({item}) => {
        return(this._buildItemJoueur(item))
    }

    render() {
        return(
            <View>

                <FlatList
                    data = {this.buildListOfJoueur()}
                    renderItem = {this._renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        )
    }


}

const styles = {
    containerItemJoueur : {
        flexDirection : 'row',
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
}


const mapStateToProps = (state) => {
    return{ 
        joueursInvites : state.joueursInvites,
        partie : state.partie
    } 
}
export default connect(mapStateToProps) (Presences_Joueurs)
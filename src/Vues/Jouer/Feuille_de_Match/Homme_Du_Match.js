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

class Homme_Du_Match extends React.Component {
    
    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id,
        this.state = {
           joueurVote : this.joueurVoteParUtilisateur()
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
     * Fonction qui renvoie l'id de l'utilisateur pour lequel à voté l'utilisateur,
     * undefined si l'utilisateur n'a pas encore voté.
     */
    joueurVoteParUtilisateur() {
        for(var i = 0; i < this.props.votes.length; i++) {
            

            if(this.monId == this.props.votes[i].idVotant) {
                return this.props.votes[i].idVote
            }
        } 
        return undefined
    }

    /**
     * Fonction qui va permettre à l'utilisateur de voter pour un joueur en tant
     * qu'homme du match
     * @param {String} id 
     */
    votePourUnJoueur(id){
        if(id != this.monId) {
            if(id != this.state.joueurVote) {
                var obj = {
                    idVote :id,
                    idVotant : this.monId
                }
                this.setState({joueurVote : id})
                const action = { type: actions.MAJ_VOTE, value: obj}
                this.props.dispatch(action)
            } else {
                this.setState({joueurVote : undefined})
                
            }
            
            
        } else {
            Alert.alert(
                '',
                "Tu ne peux pas voter pour toi même "
            )
        }
    }


    _buildItemJoueur= ({item}) => {
        if(item != undefined) {
            var isCheck = (item.id == this.state.joueurVote)
            return(
           
                <View style = {styles.containerItemJoueur}>
                    <Joueur_Pseudo_Score
                          pseudo = {item.pseudo}
                          photo = {item.photo}
                          score = {item.score}
                    />

                    <CheckBox
                        right
                        title=' '
                        checkedColor = {Colors.agOOraBlue}
                        
                        containerStyle={{backgroundColor: 'white', borderWidth :0, justifyContent : 'center', marginRight : wp('4%')}}                    
                        checked={isCheck}
                        onPress = {() => this.votePourUnJoueur(item.id)}
                    />
                   
                </View> 
              )
        }
    }

  


    render() {
        console.log(this.state)
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
        alignsItems : 'center',
        justifyContent: 'space-between',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6,
    },
}

const mapStateToProps = (state) => {
    return{ 
        joueursInvites : state.joueursInvites,
        partie : state.partie,
        votes : state.votes
        
    } 
}
export default connect(mapStateToProps) (Homme_Du_Match)
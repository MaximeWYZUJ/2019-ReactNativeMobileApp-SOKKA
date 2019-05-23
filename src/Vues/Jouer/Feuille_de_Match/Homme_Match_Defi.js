import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Animated} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import LocalUser from '../../../Data/LocalUser.json'
import Database from '../../../Data/Database'
import { connect } from 'react-redux'
import Joueur_Pseudo_Score from '../../../Components/ProfilJoueur/Joueur_Pseudo_Score'
import {SkypeIndicator} from 'react-native-indicators';
import actions from '../../../Store/Reducers/actions'
import { CheckBox } from 'react-native-elements'

/**
 * Classe qui permet à l'utilisateur de voter pour l'homme du match de son équipe
 */
class Homme_Match_Defi extends React.Component {
    
    
    constructor(props) {
        console.log("in constructore")
        super(props)
        this.monId = LocalUser.data.id,
        this.state = {
            joueurs : [],
            joueurVote : this.joueurVoteParUtilisateur(), // Joueur pour lequel l'utilisateur a voté
            isLoading : true
        }
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

    componentDidMount() {
        this.buildListOfJoueur()
    }


    /**
     * Fonction qui va renvoyer la liste des joueurs convoqué triée par ordre alphabethique avec 
     * les capitaines en première position
     */
    buildListOfJoueur(){
        var j = []
        var capitaines = []
        for(var i = 0; i < this.props.dataJoueursDefi.length ; i++) {
            var joueur = this.props.dataJoueursDefi[i]
            console.log(joueur.pseudo)

            // Ajouter le joueur à la bonne liste
            if(this.props.equipeUserDefi.capitaines.includes(joueur.id)) {
                capitaines.push(joueur)
            } else {
                j.push(joueur)
            }

            // Trouver l'équipe concernée
            /*if(this.props.equipeUserDefi.id == this.props.defi.equipeOrganisatrice) {
                if(this.props.defi.confirmesEquipeOrga.includes(joueur.id)) confirme.push(joueur.id)
            } else {
                if(this.props.defi.confirmesEquipeDefiee.includes(joueur.id)) confirme.push(joueur.id)
            }*/

            
        }

        j = j.sort(function (a, b) {
            if(a.pseudo == b.pseudo ) {
                return 0
            } else {
                return a.pseudo.toLowerCase().localeCompare(b.pseudo.toLowerCase())
            }
        })

        
        capitaines = capitaines.sort(function (a, b) {
            if(a.pseudo == b.pseudo ) {
                return 0
            } else {
                return a.pseudo.toLowerCase().localeCompare(b.pseudo.toLowerCase())
            }
        })
        console.log("end get all data joueur")
        this.setState({joueurs : capitaines.concat(j),isLoading : false, })

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
        console.log(this.props.votes)
        return(
            <FlatList
                data = {this.state.joueurs}
                renderItem = {this._buildItemJoueur}
                keyExtractor={(item) => item.id}
                extraData = {this.props.votes}
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
        defi : state.defi,
        equipeUserDefi: state.equipeUserDefi,
        joueursDefi : state.joueursDefi,
        dataJoueursDefi : state.dataJoueursDefi,
        votes : state.votes
    } 
}

export default connect(mapStateToProps) (Homme_Match_Defi)
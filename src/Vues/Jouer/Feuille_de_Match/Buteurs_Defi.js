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

class Buteurs_Defi extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id
        this.state = {
            buteurs :   this.props.defi.buteurs,
            joueurs : [],
            isLoading : true
        }
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
        this.setState({joueurs : capitaines.concat(j),isLoading : false, })

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


     /**
     * Fonction qui permet d'afficher les boutons pour séléctionner le nombres de
     * buts inscris par un joueur.
     * id  : id du joueur
     */
    rendersButtonNbBut(id) {
        if(this.props.equipeUserDefi.capitaines.includes(this.monId)) {
        
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



    _renderItem = ({item}) => {
        
        return(
            <View style = {{flexDirection : "row", justifyContent : "space-between"}}>
                <Joueur_Pseudo_Score
                    pseudo = {item.pseudo}
                    score = {item.score}
                    photo = {item.photo}/>

                {this.rendersButtonNbBut(item.id)}
                
                {this.renderNbBut(item.id)}
            </View>
        )
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



    render(){
        if( !this.state.isLoading) {
            return(

                <View>
                    <FlatList
                        data = {this.state.joueurs}
                        renderItem = {this._renderItem}
                        extraData = {this.props.buteurs}
                    />                
                </View>
            )
        } else {
            return(
                <View style = {{marginTop : hp('9%')}}>
                    <SkypeIndicator 
                     color='#52C7FD'
                     size = {hp('10%')} />
                 </View>
            )
        }
        
    }
}

const styles = {
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
        defi : state.defi,
        equipeUserDefi: state.equipeUserDefi,
        joueursDefi : state.joueursDefi,
        dataJoueursDefi : state.dataJoueursDefi,
        buteurs : state.buteurs

    } 
}

export default connect(mapStateToProps) (Buteurs_Defi)
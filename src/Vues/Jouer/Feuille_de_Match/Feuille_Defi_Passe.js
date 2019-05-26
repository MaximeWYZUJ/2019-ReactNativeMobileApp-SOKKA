
import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Button,Animated} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Database from '../../../Data/Database'
import Equipe_Nom_Score from '../../../Components/Profil_Equipe/Equipe_Nom_Score'
import Color from '../../../Components/Colors';
import {SkypeIndicator} from 'react-native-indicators';
import actions from '../../../Store/Reducers/actions'
import { connect } from 'react-redux'
import TabDefiPasse from './TabDefiPasse'
import LocalUser from '../../../Data/LocalUser'
const ORGA  = "ORGA"
const DEFIEE = "DEFIEE"


/**
 * Classe qui permet d'afficher la feuille de match d'un défi passé 
 */
class Feuille_Defi_Passe extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id
        this.state = {
            defi : this.props.navigation.getParam('defi', undefined),
            equipeOrganisatrice :  this.props.navigation.getParam('equipeOrganisatrice', undefined),
            equipeDefiee :  this.props.navigation.getParam('equipeDefiee', undefined),
            nbButEquOrga : this.props.navigation.getParam('defi', undefined).butsEquipeOrganisatrice,
            nbButEquDefiee : this.props.navigation.getParam('defi', undefined).butsEquipeDefiee,
            scoreRenseigne : this.props.navigation.getParam('defi', undefined).scoreRenseigne,
            displayBtnBut : ! this.props.navigation.getParam('defi', undefined).scoreRenseigne,
            scoreConfirme : this.props.navigation.getParam('defi', undefined).scoreConfirme
        }

        this.equipe1Animation = new Animated.ValueXY({ x: -wp('100%'), y:0 })
        this.equipe2Animation = new Animated.ValueXY({ x: wp('100%'), y:0 })

        this.goBackToFiche = this.goBackToFiche.bind(this)
       
    }


    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;
        return {
            title: `${state.params.title}`,
        };
    };
      

    ChangeThisTitle = (titleText) => {
        const {setParams} = this.props.navigation;
        setParams({ title: titleText })
    }


    componentDidMount(){
        this.ChangeThisTitle('Defi ' +this.buildDate(new Date(this.state.defi.jour.seconds * 1000)))
        this._moveEquipe1()
        this._moveEquipe2()

    }



    /**
     * Fonction qui renvoie vers la fiche du défi avec les informations
     * mises à jour
     */
    goBackToFiche() {

        // Trouver si c'est l'équipe orga ou non 
        if(this.state.equipeOrganisatrice.joueurs.includes(this.monId)) {

            var defi = this.state.defi
            defi["votes"] = this.props.votes
            defi["buteurs"] = this.props.buteurs
            defi["confirmesEquipeOrga"] = this.props.joueursPresents
            defi["scoreRenseigne"] = this.state.scoreRenseigne
            defi["butsEquipeDefiee"] = this.state.nbButEquDefiee,
            defi["butsEquipeOrganisatrice"] = this.state.nbButEquOrga
            defi["scoreRenseigneParOrga"] =  this.state.scoreRenseigne,
            defi["scoreConfirme"] = this.state.scoreConfirme

            this.props.navigation.push("FicheDefiRejoindre", 
                {
                    retour_arriere_interdit : true,
                    equipeDefiee : this.state.equipeDefiee,
                    equipeOrganisatrice : this.state.equipeOrganisatrice,
                    defi : defi
                    /*defi : {
                        ...defi,
                        confirmesEquipeDefiee : defi.confirmesEquipeDefiee.concat(this.findCapitaines()),
                        attenteEquipeDefiee : joueursEquipe.concat(this.buildListOfJoueurWithoutCapitaines()),
                        joueursEquipeDefiee : this.state.joueursSelectionnes.concat(joueursEquipe),
                        participants : defi.participants.concat(this.state.joueursSelectionnes)
                    }*/
                }
            )
        } else {
            var defi = this.state.defi
            defi["votes"] = this.props.votes
            defi["buteurs"] = this.props.buteurs
            defi["confirmesEquipeDefiee"] = this.props.joueursPresents
            defi["scoreRenseigne"] = this.state.scoreRenseigne
            defi["butsEquipeDefiee"] = this.state.nbButEquDefiee,
            defi["butsEquipeOrganisatrice"] = this.state.nbButEquOrga
            defi["scoreRenseigneParDefiee"] =  this.state.scoreRenseigne,
            defi["scoreConfirme"] = this.state.scoreConfirme
             
            this.props.navigation.push("FicheDefiRejoindre", 
                {
                    retour_arriere_interdit : true,
                    equipeDefiee : this.state.equipeDefiee,
                    equipeOrganisatrice : this.state.equipeOrganisatrice,
                    defi : defi
                    /*defi : {
                        ...defi,
                        confirmesEquipeDefiee : defi.confirmesEquipeDefiee.concat(this.findCapitaines()),
                        attenteEquipeDefiee : joueursEquipe.concat(this.buildListOfJoueurWithoutCapitaines()),
                        joueursEquipeDefiee : this.state.joueursSelectionnes.concat(joueursEquipe),
                        participants : defi.participants.concat(this.state.joueursSelectionnes)
                    }*/
                }
            )
        }
    }




    /**
     * Fonction qui va mettre à jour le défi dans la base de données pas besoin de changer 
     *  les listes des joueurs en attente car vu le fait qu'un joueurs soit dans les confirmé suffit.
     */
    enregistrer() {
        var db = Database.initialisation()
        var defisRef = db.collection("Defis").doc(this.state.defi.id);
        
        if(this.state.equipeOrganisatrice.joueurs.includes(this.monId)) {
            defisRef.update({
                votes : this.props.votes,
                buteurs : this.props.buteurs,
                confirmesEquipeOrga : this.props.joueursPresents,
                scoreRenseigne : this.state.scoreRenseigne  ,
                butsEquipeDefiee : this.state.nbButEquDefiee,
                butsEquipeOrganisatrice : this.state.nbButEquOrga,
                scoreRenseigneParOrga : this.state.scoreRenseigne,
                scoreRenseigneParDefiee: ! this.state.scoreRenseigne,
                scoreConfirme : this.state.scoreConfirme
             })
             .then(this.goBackToFiche)
             .catch(function(error) {
                 // The document probably doesn't exist.
                 console.error("Error updating document: ", error);
             });
        } else {
            defisRef.update({
                votes : this.props.votes,
                buteurs : this.props.buteurs,
                confirmesEquipeDefiee : this.props.joueursPresents,
                scoreRenseigne : this.state.scoreRenseigne ,
                butsEquipeDefiee : this.state.nbButEquDefiee,
                butsEquipeOrganisatrice : this.state.nbButEquOrga,
                scoreRenseigneParDefiee: this.state.scoreRenseigne,
                scoreRenseigneParOrga : !this.state.scoreRenseigne,
                scoreConfirme : this.state.scoreConfirme

             })
             .then(this.goBackToFiche).catch(function(error) {
                 // The document probably doesn't exist.
                 console.error("Error updating document: ", error);
             });
        }
        
    }


    /**
     * Fonction qui permet de fair bouger l'équipe organisatrice 
     */
    _moveEquipe1 = () => {
        Animated.spring(this.equipe1Animation, {
          toValue: {x: 0, y: 0},
        }).start()

    }

    /**
     */
    _moveEquipe2 = () => {
        Animated.spring(this.equipe2Animation, {
          toValue: {x: 0, y: 0},
        }).start()

    }

    /**
     * Fonction qui va permettre de construire un String correspondant à la 
     * date du défi pour le titre de la vue.
     * @param {Date} date 
     */
    buildDate(date) {
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        return numJour  + '/' + mois + '/' + an
    }

    /**
     * Permet d'afficher l'équipe défiée
     */
    _renderEquipeDefie(){

        if(this.state.equipeDefiee != undefined) {
            return(
                <Animated.View
                    style = {[this.equipe2Animation.getLayout(), {alignSelf : "flex-end"}]}>

                    <View style = {{ alignItems : "flex-end"}}>
                        {this.chooseBtnButToRender(this.state.equipeDefiee.id)}
                    </View>

                    <Equipe_Nom_Score
                        photo = {this.state.equipeDefiee.photo}
                        score = {this.state.equipeDefiee.score}
                        nom = {this.state.equipeDefiee.nom}
                        direction = {"row-revrse"}
                    />

                </Animated.View>
            )
        } else {
            return(
                <Animated.View
                    style = {this.equipe2Animation.getLayout()}>
                    <View
                        style = {styles.circleEquipeVide}
                    />
                </Animated.View>
            )
        }
    }

    

    //======================================================================================
    //========================== FONCTIONS RELATIFS AU SCORE ===============================
    //======================================================================================

    /**
     * Fonction qui permet d'ajouter un but à un joueur et sauvagarder la new value
     * dans le state global
     * @param {String} equipe : 
     */
    ajouterUnBut(equipe) {
        
        if(equipe ==this.state.equipeOrganisatrice.id) {
            var nb = this.state.nbButEquOrga
            this.setState({nbButEquOrga : nb+1})
        } else {
            console.log("in else ajout but !")
            var nb = this.state.nbButEquDefiee
            this.setState({nbButEquDefiee : nb+1})
        }
        if(!this.state.scoreRenseigne) this.setState({scoreRenseigne : true})   
    }

    /**
     * Fonction qui permet d'ajouter un but à une equipe 
     * @param {String} id 
     */
    enleverUnBut(equipe) {
        if(equipe == this.state.equipeOrganisatrice.id) {
            var nb = this.state.nbButEquOrga
            if(nb != 0) this.setState({nbButEquOrga : nb-1})
        } else {
            var nb = this.state.nbButEquDefiee
            if(nb != 0) this.setState({nbButEquDefiee : nb-1})
        }
       
    }

    /**
     * Fonction qui permet à un utilisateur de modifier le score
     * du défi
     */
    modifierLeSocre() {
        Alert.alert(
            '',
            'Tu souhaites modifier le score renseigné ?',
            [
                {text: 'Oui', onPress: () => this.setState({displayBtnBut : true})},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )
    }

    /**
     * Fonction qui permet au cap qui n'a pas renseigné le score de le
     * confirmer
     */
    confirmeLeScore() {

        // Si le score est renseigné par l'équipe organisatrice
        if(this.state.defi.scoreRenseigneParOrga) {
            if(this.state.equipeDefiee != undefined && this.state.equipeDefiee.capitaines.includes(this.monId)) {
                this.setState({scoreConfirme : true})
            }
        } else {
            if(this.state.equipeOrganisatrice.capitaines.includes(this.monId)) {
                this.setState({scoreConfirme : true})
            }
        }
    }



    /**
     * Fonction qui permet d'afficher le bouton de confirmation du score
     */
    renderBtnConfirmerScore() {
        if(this.state.defi.scoreRenseigne ) {
            if( ! this.state.scoreConfirme) {
                return(
                    <TouchableOpacity 
                        style ={styles.btnConfirmerScore}
                        onPress = {() => this.confirmeLeScore()}
                    >
                        <Text>Confirmer</Text>
                        <Text>Le score</Text>
                    </TouchableOpacity>
                )
            }
        }
    }
    

    /**
     * Fonction qui permet d'afficher le bouton de modification du score
     */
    renderBtnModifierScore() {
        if(this.state.defi.scoreRenseigne ) {
            if(! this.state.scoreConfirme) {
                return(
                    <TouchableOpacity style ={styles.btnConfirmerScore} 
                        onPress = {() =>this.modifierLeSocre()}>
                        <Text>Modifier</Text>
                        <Text>Le score</Text>
                    </TouchableOpacity>
                )
            }
        }
    }

    


    /**
     * Fonction qui permet d'afficher soit le bouton de confirmation ou soit
     * le bouton de modification du score en fonction de l'id de l'équipe
     * concernée passé en param
     */
    chooseBtnButToRender(idEquipe) {
        console.log("in choose bnt but to render")
        if(idEquipe == this.state.equipeOrganisatrice.id) {
            if(this.state.defi.scoreRenseigneParOrga) {
                console.log("in if render btn but")
                return(<View>{this.renderBtnModifierScore()}</View>)
            } else {
                return(<View>{this.renderBtnConfirmerScore()}</View>)
            }
        } else {
            if(this.state.defi.scoreRenseigneParDefiee) {
                return(<View>{this.renderBtnModifierScore()}</View>)
            } else {
                return(<View>{this.renderBtnConfirmerScore()}</View>)
            }
        }
    }
    



    /**
     * Fonction qui permet d'afficher les boutons pour renseigner le nbr de buts
     */
    _renderBtnBut(equipe) {

        if(this.state.displayBtnBut) {
            return(
                    
                <View style = {{flexDirection : "row", alignItems:'center', justifyContent:'center', marginLeft : wp('3%'), marginRight : wp('3%')}}>
                    
                    {/* Btn plus */}
                    <TouchableOpacity 
                        style = {styles.containerBouton}
                        onPress = {()=> this.ajouterUnBut(equipe.id)}>
                        <Text style = {styles.txtBtn}>+</Text>
                    </TouchableOpacity>

                    {/*Btn moins*/}
                    <TouchableOpacity 
                    onPress = {() => this.enleverUnBut(equipe.id)}
                    style = {styles.containerBouton}>
                        <Text style = {styles.txtBtn}>-</Text>
                    </TouchableOpacity>
                </View>
                
            )
        }
    }


    /**
     * Fonction qui permety d'afficher le nombre de but 
     * @param {*} nb 
     */
    _renderNbBut(nb) {
        if(nb != undefined) return(<Text>{nb}</Text>)
        else  return(<Text> - </Text>)
        
    }

    /**
     * Fonction qui permet d'afficher le score du match
     */
    renderTxtBut() {
        if(this.state.scoreRenseigne) {
            return(


                <Text style = {styles.txtBut}>{this.state.nbButEquOrga} - {this.state.nbButEquDefiee}</Text>

            )
        } else {
            return(
                <Text style = {styles.txtBut}>- Score - </Text>
            )
        }
    }

    renderScore() {
        if(this.state.displayBtnBut) {
            return(
                <View style = {{flexDirection : "row", justifyContent: 'space-between'}}>
                        {this._renderBtnBut(this.state.equipeOrganisatrice)}
                            {this.renderTxtBut()}
                        {this._renderBtnBut(this.state.equipeDefiee)}

                </View>
            )
        } else if(! this.state.scoreConfirme) {
            return(
                <View style = {{justifyContent : "space-around"}}>
                    {this.renderTxtBut()}
                </View>
            )
        } else {
            return(
                <View style = {{justifyContent : "space-around"}}>
                    {this.renderTxtBut()}
                    <Text style = {{alignSelf : "center"}}>Score confirmé</Text>
                </View>
            )
        }
    }


    // =====================================================================

    render() {
        return(
            <View style = {{flex : 1}}> 
                {/* Bandeau superieur */}
                <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('1%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        >
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>

                    <Text> Feuille de match </Text>
                    
                    <TouchableOpacity
                        onPress= {() => this.enregistrer()}
                        >
                        <Text style = {styles.txtBoutton}>Enregister</Text>
                    </TouchableOpacity>
                </View>

                {/* View contenant les équipes */}
                <View >

                    <Animated.View
                        style = {this.equipe1Animation.getLayout()}
                        >
                        <Equipe_Nom_Score
                            photo = {this.state.equipeOrganisatrice.photo}
                            score = {this.state.equipeOrganisatrice.score}
                            nom = {this.state.equipeOrganisatrice.nom}
                            
                        />
                        {this.chooseBtnButToRender(this.state.equipeOrganisatrice.id)}
                    </Animated.View>

                    {this.renderScore()}

                    
                    {this._renderEquipeDefie()}

                </View>

                


                <Text>Statistiques joueurss</Text>

                <TabDefiPasse/>
            </View>
        )
    }
}

const styles = {
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },
    texte : {
        fontSize : RF('2.6'),
        alignSelf : "center"
    },

    containerJoueur : {
        borderWidth : 1,
        marginLeft  : wp('2%'),
        marginRight : wp('2%')
    },

    containerBouton : {
        paddingLeft : wp('4%'),
        paddingRight : wp('4%'),
        borderRadius : 4,
        borderWidth : 1,
        borderColor : Colors.agOOraBlue,
        height : hp('4%'),
        alignItems:'center',        
        justifyContent:'center',
    },

    txtBtn : {
        color : Colors.agOOraBlue,
        fontWeight : "bold"
    },

    txtBut : {
        fontSize : RF(2.6),
        fontWeight : "bold",
        alignSelf :"center"
    },

    btnConfirmerScore : {
        borderWidth : 1,
        width : wp('25%')
    }
}


const mapStateToProps = (state) => {
    return{ 
        joueurDefi : state.joueurDefi,
        joueursPresents : state.joueursPresents,
        buteurs : state.buteurs,
        votes : state.votes



    } 
}
export default connect(mapStateToProps) (Feuille_Defi_Passe)
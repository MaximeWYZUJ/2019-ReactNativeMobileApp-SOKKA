
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux'
import Colors from '../../../../Components/Colors'
import TabChoixJoueursDefis from './TabChoixJoueursDefis'
import Database from '../../../../Data/Database'
import LocalUser from '../../../../Data/LocalUser.json'
import actions from '../../../../Store/Reducers/actions';
import DatesHelpers from '../../../../Helpers/DatesHelpers'

/**
 * Classe qui va permettre à l'utilisateur de choisir des joueurs lors 
 * de la création d'une partie
 */
class Choix_Joueurs_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id
        this.userData = {
            id : LocalUser.data.id,
            photo : LocalUser.data.photo
        }
        this.state = {
            goToFichePartie : false
        }

        this.goToFichePartie = this.goToFichePartie.bind(this)
    }

    // ===========================================================================
    // ========================== NOTIFICATIONS ==================================
    // ===========================================================================
    
    
    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    async sendPushNotification(token , title,body ) {
        console.log('in send push !!')
        return fetch('https://exp.host/--/api/v2/push/send', {
          body: JSON.stringify({
            to: token,
            title: title,
            body: body,
            data: { message: `${title} - ${body}` },
           
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }).catch(function(error) {
            console.log("ERROR :", error)
        }).then(function(error) {
            console.log("THEN", error)
        });
    }


    /**
     * Fonction qui va permettre d'envoyer des notifications à chaque 
     * joueur convoqué
     */
    async sendNotifToAllPlayer(date) {

        console.log("DATE : ",date)

        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " t'as invité / relancé pour une partie le "
        corps = corps + DatesHelpers.buildDate(date)

        for(var i  = 0; i < this.props.joueursPartie.length; i++) {
            if(this.props.joueursPartie[i].id != LocalUser.data.id) {
                var tokens = this.props.joueursPartie[i].tokens
                console.log("TOKENS !!, ", this.props.joueursPartie[i].pseudo + ' -> ' + tokens)

                if(tokens != undefined) {
                    for(var k =0; k < tokens.length; k ++) {
                        await this.sendPushNotification(tokens[k], titre, corps)
                    }
                }
            }
        }
    }
    // ======================================================





    goToFichePartie() {
        d =this.props.navigation.getParam("date", new Date())
        Alert.alert(
            '',
            'Tu as bien rejoins cette partie, les joueurs avec qui tu seras vont recevoir une notification pour confirmer leur participation',
            [
              {text: 'Ok',  onPress: async () => {
               
                await this.sendNotifToAllPlayer(new Date(d.seconds * 1000))
                // Remettre à zéro la liste des joueurs séléctionnés  
                const action = { type: actions.RESET_JOUEURS_PARTIE, value: []}
                this.props.dispatch(action)               
                this.props.navigation.push("FichePartieRejoindre",
                {
                    download_All_Data_Partie : true,
                    id :  this.props.navigation.getParam('id_partie', ''),
                    retour_arriere_interdit : true
                })
            }
                        
              },
             
            ],
            {cancelable: false},
        ); 
        
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Proposer une partie'
        }
    }

    /**
     * Fonction qui renvoie vrai si l'utilisateur est déja présent dans la liste
     * @param {liste de joueur} liste 
     */
    checkIfUserPresent(liste) {
        for(var i = 0 ; i < liste.length; i++) {
            if(liste[i].id == this.userData.id) {
                return true
            }
        }
        return  false
    }


    goToNextScreen() {
        
        /*
            Cas où on choisit des joueurs pour ajouter des joueurs à une partie qui est crée. 
        */
        if(! this.props.navigation.getParam('ajout_Partie_existante', '')){
            var j = this.props.joueursPartie
            if(! this.checkIfUserPresent(j)) {
                let user = {
                    id : this.userData.id,
                    photo : this.userData.photo,
                    tokens : this.userData.token
                }
                
                j.push(user)
                j = j.reverse()     // Pour mettre le créateur en premier
            }
            
            // Remetre à zéro les joueurs séléctionés
            const action = { type: actions.RESET_JOUEURS_PARTIE, value: []}
            this.props.dispatch(action)     
            this.props.navigation.push("ChoixNbrJoueursPartie",
                {
                                        
                    format : this.props.navigation.getParam('format', ''),
                    type : this.props.navigation.getParam('type', ''),
                    jour : this.props.navigation.getParam('jour', ''),
                    heure : this.props.navigation.getParam('heure', ''),
                    duree : this.props.navigation.getParam('duree', ''),
                    terrain : this.props.navigation.getParam('terrain', ''),
                    nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' '),
                    joueurs : j  ,
                }
            )
        
        /*
            Cas où on choisit des joueurs pour rejoindre une partie déja crée.
        */
        } else {
            this.updateParticipantsDefis()
        }
    }


    /**
     * Fonction qui va permettre de rajouter les joueurs séléctionnés dans la liste des 
     * participants à un défis. 
     */
    updateParticipantsDefis() {
     
        var id = this.props.navigation.getParam('id_partie', 'erreur')
        var joueursEnPlus = this.props.joueursPartie.length 
        if(  ! this.props.navigation.getParam('invite',  false)) {
            joueursEnPlus = joueursEnPlus + 1
        }
        var array = this.props.JoueursParticipantsPartie
        var enAttente = this.props.navigation.getParam('enAttente',  [])
        var inscris = this.props.navigation.getParam('inscris',  [])

        var db = Database.initialisation()
        console.log(this.props.joueursPartie.length)
        // Mettre à jour les participants
        for(var i = 0 ; i< this.props.joueursPartie.length ; i++) {
            array.push(this.props.joueursPartie[i].id)
            enAttente.push(this.props.joueursPartie[i].id)

            // Si c'est pas le créateur qui invite des joueurs 
            if(! this.props.navigation.getParam('invite',  false)) {
                inscris.push(this.props.joueursPartie[i].id)
            }
        }

        // Si c'est pas le créateur qui invite des joueurs 
        if(! this.props.navigation.getParam('invite',  false)) {
            array.push(this.monId)        
            enAttente.push(this.monId)
            inscris.push(this.monId)
        } 
        

        var recherche = ( (this.props.nbJoueursRecherchesPartie - joueursEnPlus) != 0)
        var defisRef = db.collection("Defis").doc(id);
        
        
        defisRef.update({
            participants: array,
            nbJoueursRecherche : this.props.nbJoueursRecherchesPartie - joueursEnPlus ,
            attente : enAttente,
            inscris : inscris,
            recherche : recherche
        })
        .then(this.goToFichePartie)
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

    }
    
    _renderBtnSuivant() {
        if(this.props.joueursPartie.length > 0) {
            return(
                <TouchableOpacity
                        onPress ={() =>{this.goToNextScreen()}}>
                        <Text style = {styles.txtBoutton}>Suivant</Text>
                </TouchableOpacity>
            )
        } else {
            return(
                <TouchableOpacity
                    onPress ={() =>{this.goToNextScreen()}}>
                    <Text style = {styles.txtBoutton}>Je suis seul</Text>
                </TouchableOpacity>
            )   
        }
    }
   

    render() {
      
        return(
            <View style = {{ flex : 1}}>

                 {/* Bandeau superieur */}
                 <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        onPress ={() => Alert.alert(
                                '',
                                "Es-tu sûr de vouloir quitter ?",
                                [
                                    {
                                        text: 'Oui',
                                        onPress: () => this.props.navigation.push("AccueilJouer")},
                                    {
                                        text: 'Non',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                            )}>
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>

                    <Text> Avec qui </Text>
                    
                    {this._renderBtnSuivant()}

                </View>
                <Text style = {{alignSelf : "center", fontSize : RF(2.6) , marginBottom : hp('2%') , marginTop : hp('1%')}}>Quels joueurs souhaites-tu inviter</Text>
                <Text style = {{fontSize :RF(2.6), marginBottom : hp('1%')}}> {this.props.joueursPartie.length} {this.props.joueursPartie.length > 1 ? "joueurs sélectionnés" : "joueur sélectionné"}</Text>
                
                <TabChoixJoueursDefis/>

            </View>
        )
    }
}
const styles = {
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },
  
}
const mapStateToProps = (state) => {
    return{ 
        joueursPartie : state.joueursPartie,

        // Joueurs qui participent déjà à la partie pour laquelle l'user veut s'inscrire
        JoueursParticipantsPartie : state.JoueursParticipantsPartie,

        // Nbr de joueurs recherchés pour une partie donnée.
        nbJoueursRecherchesPartie : state.nbJoueursRecherchesPartie
    } 
}
export default connect(mapStateToProps) (Choix_Joueurs_Partie)

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
import Types_Notification from '../../../../Helpers/Notifications/Types_Notification'
import firebase from 'firebase'
import '@firebase/firestore'
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
        console.log("JOUEURS CONCERNES ",this.props.navigation.getParam("joueursConcernes",[]))
        
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


        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " t'a invité / relancé pour une partie le "
        corps = corps + DatesHelpers.buildDate(date)

        for(var i  = 0; i < this.props.joueursPartie.length; i++) {
            if(this.props.joueursPartie[i].id != LocalUser.data.id) {
                var tokens = this.props.joueursPartie[i].tokens

                if(tokens != undefined) {
                    for(var k =0; k < tokens.length; k ++) {
                        await this.sendPushNotification(tokens[k], titre, corps)
                    }
                }
            }
        }
        console.log("! this.props.navigation.getParam(invite,false)",! this.props.navigation.getParam("invite",false))
        if(! this.props.navigation.getParam("invite",false)) {
            this.sendNotifToOrganisateur(date)
        }
    }


    async sendNotifToOrganisateur(date) {
        var nbInvite = " "
        console.log("joueur length" ,this.props.joueursPartie.length )
        if(this.props.joueursPartie.length  > 0) {
            nbInvite = " et à invité " + this.props.joueursPartie.length + " joueur(s)"
        }
        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " s’est inscrit" + nbInvite + "pour une partie le " 
        corps = corps + DatesHelpers.buildDate(date)

        var orga = await Database.getDocumentData(this.props.navigation.getParam("organisateur","erreur"), "Joueurs")
        
        var tokens = orga.tokens
        if(tokens != undefined) {
            for(var k =0; k < tokens.length; k ++) {
                await this.sendPushNotification(tokens[k], titre, corps)
            }
        }
        this.storeNotifInscription(corps)
    }

    async storeNotifInscription(text) {
        console.log("in store notif")
        var db = Database.initialisation() 
        var partie = await Database.getDocumentData(this.props.navigation.getParam('id_partie', 'erreur'),"Defis")
        console.log("after get partie")
        db.collection("Notifs").add({
            recepteur : partie.organisateur,
            emetteur :  LocalUser.data.id,
            dateParse : Date.parse(new Date()),
            partie : partie.id,
            time : new Date(),
            type : Types_Notification.INSCRIPTION_PARTIE,
            texte : text
        })
    }


     /**
     * Fonction qui va sauvagarder dans la base de données les notifications
     * pour la convocation à la partie
     */
    storeNotificationInDb(id) {
        var db = Database.initialisation() 
        for(var i  = 0; i < this.props.joueursPartie.length; i++) {
            if(this.props.joueursPartie[i].id!= LocalUser.data.id) {
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        partie : id,
                        emetteur :  LocalUser.data.id,
                        recepteur : this.props.joueursPartie[i].id,
                        time : new Date(),
                        type : Types_Notification.CONVOCATION_RELANCE_PARTIE,
                    }
                )  
            }
        }
    }
    // ======================================================





    goToFichePartie() {
        console.log("in go to fiche partie")
        var msg = "Tu es bien inscrit à cette partie"
        if(this.props.joueursPartie.length > 0) {
            msg = ' Tu es bien inscrit à cette partie, les joueurs invités vont recevoir une notification pour confirmer leur participation '
        }
        console.log(msg)
        d =this.props.navigation.getParam("date", new Date())
       
        Alert.alert(
            '',
            msg,
            [
              {text: 'Ok',  onPress: async () => {
              
                console.log("on press alert")
                await this.sendNotifToAllPlayer(new Date(d.seconds * 1000))
                await this.storeNotificationInDb( this.props.navigation.getParam('id_partie', ''))
                console.log("after store notif")
                // Remettre à zéro la liste des joueurs séléctionnés  
                const action = { type: actions.RESET_JOUEURS_PARTIE, value: []}
                this.props.dispatch(action)               
                this.props.navigation.push("FichePartieRejoindre",
                {
                    download_All_Data_Partie : true,
                    id :  this.props.navigation.getParam('id_partie', ''),
                    retour_arriere_interdit : true,
                    prix: this.props.navigation.getParam('prix', null)
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
        console.log("in go to next screen")
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
                    joueurs : j,
                    prix: this.props.navigation.getParam('prix', null)
                }
            )
        
        /*
            Cas où on choisit des joueurs pour rejoindre une partie déja crée.
        */
        } else {
            console.log("in else")
            this.updateParticipantsDefis()
        }
    }


    /**
     * Fonction qui va permettre de rajouter les joueurs séléctionnés dans la liste des 
     * participants à un défis. 
     */
    async updateParticipantsDefis() {
        console.log("updateParticipantsDefis")
        var id = this.props.navigation.getParam('id_partie', 'erreur')
        var joueursEnPlus = this.props.joueursPartie.length 
        if(  ! this.props.navigation.getParam('invite',  false)) {
            joueursEnPlus = joueursEnPlus + 1
        }
        var array = this.props.JoueursParticipantsPartie
        var enAttente = this.props.navigation.getParam('enAttente',  [])
        var inscris = this.props.navigation.getParam('inscris',  [])

        var db = Database.initialisation()
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
            //enAttente.push(this.monId)
            inscris.push(this.monId)
        } 
        

        var recherche = ( (this.props.nbJoueursRecherchesPartie - joueursEnPlus) != 0)
        var defisRef = db.collection("Defis").doc(id);
        
        var nbRecherche = this.props.nbJoueursRecherchesPartie - joueursEnPlus
        if(nbRecherche < 0) {
            nbRecherche =  0,
            recherche = false
        }

        
        defisRef.update({
            participants: array,
            nbJoueursRecherche : nbRecherche ,
            attente : enAttente,
            inscris : inscris,
            recherche : recherche,
            confirme : firebase.firestore.FieldValue.arrayUnion(this.monId),
            joueursConcernes : array

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
            //if(!this.props.navigation.getParam('ajout_Partie_existante', '')) {
                return(
                    <TouchableOpacity
                        onPress ={() =>{this.goToNextScreen()}}>
                        <Text style = {styles.txtBoutton}>Je suis seul</Text>
                    </TouchableOpacity>
                )
            
        }
    }
   

    render() {
      console.log("LENGTH," , this.props.joueursPartie.length )
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
                <Text style = {{alignSelf : "center", fontSize : RF(2.6) , marginBottom : hp('2%') , marginTop : hp('1%')}}>Quels joueurs souhaites-tu inviter ?</Text>
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
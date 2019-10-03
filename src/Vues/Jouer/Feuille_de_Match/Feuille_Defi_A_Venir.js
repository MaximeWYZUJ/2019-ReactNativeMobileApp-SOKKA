
import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Button} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Database from '../../../Data/Database'
import Presences_Joueurs from '../../../Components/Defis/Feuilles_Match/Presences_Joueurs'
import Joueur_Pseudo_Score from '../../../Components/ProfilJoueur/Joueur_Pseudo_Score'
import Color from '../../../Components/Colors';
import {SkypeIndicator} from 'react-native-indicators';
import actions from '../../../Store/Reducers/actions'
import { connect } from 'react-redux'
import { StackActions, NavigationActions } from 'react-navigation';
import LocalUser from '../../../Data/LocalUser.json'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'
import Notification from '../../../Helpers/Notifications/Notification'

// Rememttre à Zéro le stack navigator pour empecher le retour en arriere
const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [
      NavigationActions.navigate({ routeName: 'AccueilJouer' }),
    ],
  });

/**
 * Classe qui permet d'afficher la feuille de match d'un Défi à venir 
 */
class Feuille_Defi_A_Venir extends React.Component {

    constructor(props) {
        super(props)

        console.log("CONSTRUCTEUR FEUILLE DEFI A VENIR !")
        

        this.monId = LocalUser.data.id
        this.state = {
            defi : this.props.navigation.getParam('defi',undefined),
            equipeDefiee : this.props.navigation.getParam('equipeDefiee', undefined),
            equipeOrganisatrice : this.props.navigation.getParam('equipeOrganisatrice', undefined),

            joueurs : [],
            isLoading : true

        }
        console.log("in constructor")
    }

    componentDidMount() {

        console.log("in did mount")
        this.ChangeThisTitle('Defi ' +this.buildDate(new Date(this.state.defi.jour.seconds * 1000)))
        this.downloadDataAllJoueurs()
    }

     //=========================================================================================
    //=============================== POUR LA NAVIGATION =====================================
    //=========================================================================================


    /**
     * Fonction qui va permettre de gérer la bare de navigation, si la props reçu 
     * interdit le retour en arriere on affiche pas de bare, mais on va afficher 
     * notre propre composant bare de navigation où la flèche retour mène là où on 
     * veux
     */
    static navigationOptions = ({ navigation }) => {

        // Le retour en arriere est autorisé
        if(! navigation.getParam("retour_arriere_interdit",false)) {
            const {state} = navigation;
            return { title: `${state.params.title}`, };
        } else {
            const {state} = navigation;
            return { title: `${state.params.title}`, 
            headerLeft: (

               <TouchableOpacity
                onPress = {() =>navigation.dispatch(resetAction)} >
                   <Image
                    style = {{width : 20, height : 20, marginLeft :15}}
                    source = {require('../../../../res/right-arrow-nav.png')}
                   />
               </TouchableOpacity>
              ),
                };
        }
        
        
    };

    handleResetNavigationToRoute = (routeName) => { 
        const resetAction = NavigationActions.reset({ 
         index: 0, 
         key: null, 
         actions: [ 
          NavigationActions.navigate({routeName}) 
         ] 
        }) 
        this.props.navigation.dispatch(resetAction) 
    }; 

    ChangeThisTitle = (titleText) => {
        const {setParams} = this.props.navigation;
        setParams({ title: titleText })
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
     * Fonction qui va télécharger les données de chaque joueurs participants au défi
     * et les enregistrer dans le state
     */
    async downloadDataAllJoueurs() {
        
        var participants = []
        var capitaines = []

        // Si l'utilisateur fais partie de l'équipe organisatrice 
        if(this.state.defi.joueursEquipeOrga.includes(this.monId) || this.state.equipeOrganisatrice.capitaines.includes(this.monId)) {
            // Recuprerer les données des joueurs et séparer les capitaines
            for(var i = 0; i <this.state.defi.joueursEquipeOrga.length; i++) {
                var j = await Database.getDocumentData(this.state.defi.joueursEquipeOrga[i], "Joueurs")
                if(this.state.equipeOrganisatrice != undefined && this.state.equipeOrganisatrice.capitaines.includes(j.id)) {
                    capitaines.push(j)
                    
                }else {
                    participants.push(j)
                }
            }

            

        // Si il fait partie de l'équipe defiee
        } else if(this.state.equipeDefiee != undefined && this.state.defi.joueursEquipeDefiee.includes(this.monId) || this.state.equipeDefiee.capitaines.includes(this.monId)) {
            // Recuprerer les données des joueurs et séparer les capitaines
            for(var i = 0; i <this.state.defi.joueursEquipeDefiee.length; i++) {
                var j = await Database.getDocumentData(this.state.defi.joueursEquipeDefiee[i], "Joueurs")
                if(this.state.equipeDefiee != undefined && this.state.equipeDefiee.capitaines.includes(j.id)) {
                    capitaines.push(j)
                    
                }else {
                    participants.push(j)
                }
            }        
        }

      
        // trier et concatener les deux array
        participants = participants.sort(function (a, b) {
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
        var joueurs = capitaines.concat(participants)

        this.setState({joueurs : joueurs, isLoading : false})
        
        

    }

    

    /**
     * Fonction qui va permettre de se rendre vers la page pour convoquer des joueurs. 
     * L'utilisateur ne pourra convoquer que des joueurs de l'équipe avec laquelle il 
     * a relevé le défi.
     */
    inviterPlusdeJoueur() {

        var nbMinJoueurEquipe = parseInt(this.state.defi.format.split(" ")[0])
        console.log("nbMin ", nbMinJoueurEquipe)
        var nbAtteint = false

        // Trouver l'équipe dont l'user est capitaine
        var equipe = undefined
        var joueurs  = []
        if(this.state.equipeDefiee != undefined && this.state.equipeDefiee.capitaines.includes(this.monId)) {
            equipe = this.state.equipeDefiee
            joueurs  = this.state.defi.joueursEquipeDefiee
            nbAtteint = this.state.defi.joueursEquipeDefiee.length >= nbMinJoueurEquipe
            console.log("NB Attein", nbAtteint)
            console.log("length ", this.state.defi.joueursEquipeDefiee.length)
            console.log("nbMinJoueurEquipe", nbMinJoueurEquipe)
        } else if(this.state.equipeOrganisatrice.capitaines.includes(this.monId)) {
            equipe = this.state.equipeOrganisatrice
            nbAtteint = this.state.defi.joueursEquipeOrga.length >= nbMinJoueurEquipe
            joueurs  = this.state.defi.joueursEquipeOrga
        }

        // Sauvegarder dans le state global les joueurs participants déja au défi
        //const action = { type: actions.STORE_PARTICIPANTS_PARTIE, value:  this.state.defi.participants}
        //this.props.dispatch(action)
        this.props.navigation.push("ChoixJoueursDefis2Equipes",
        {
            convocation : true,
            allDataEquipe :  equipe,
            format : this.state.defi.format,
            defi : this.state.defi,
            nbJoueurMinatteint : nbAtteint,
            joueursEquipe : joueurs,
            participants : this.state.defi.participants,
            equipeDefiee :this.state.equipeDefiee,
            equipeOrganisatrice : this.state.equipeOrganisatrice
        })
        /*const action = { type: actions.STORE_PARTICIPANTS_PARTIE, value:  this.state.partie.participants}
            this.props.dispatch(action)
        const action2 = { type: actions.STORE_NB_JOUEURS_RECHERCHES_PARTIES, value:  this.state.partie.nbJoueursRecherche}
        this.props.dispatch(action2)

        this.props.navigation.push("ChoixJoueursPartie",
        {
            ajout_Partie_existante : true,
            id_partie :  this.state.partie.id,
            enAttente : this.state.partie.attente,
            inscris : this.state.partie.inscris,
            invite : true                          // c'est le créateur qui invite
        })*/
    }

    /**
     * Fonction qui va être appelée au moment où l'utilisateur annule sa
     * présence. 
     */
    handleConfirmerNon() {
        console.log("in handle confirmer non")
        Alert.alert(
            '',
            "Tu souhaites annuler ta présence pour ce défi ? ",
            [
                {text: 'Oui', onPress: () => this.annulerJoueurPresence()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )

    }

    /**
     * Fonction qui va être appelée au moment où l'utilisateur confirme sa
     * présence. 
     */
    handleConfirmerOui() {
        Alert.alert(
            '',
            "Tu souhaites confirmer ta présence pour ce defi ? ",
            [
                {text: 'Oui', onPress: () => this.confirmerJoueurPresence()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )

    }

    /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs ayant 
     * annuler . Ainsi que  d'enregistrer le defi mis à jour dans la DB.
     */
    annulerJoueurPresence() {

        console.log("in anulee")
        // Trouver l'équipe dont l'utilisateur est membre 
        if(this.state.defi.joueursEquipeOrga.includes(this.monId)) {

            // Ajouter l'id de l'utilisateur dans la liste des indisponible (Creation d'un new array pour le re render)
            var j = []
            
            for(var i = 0 ; i < this.state.defi.indisponiblesEquipeOrga.length; i++) {
                j.push(this.state.defi.indisponiblesEquipeOrga[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }
            console.log("indispo ok ", j)

            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeOrga.length ; i++) {
                if(this.state.defi.attenteEquipeOrga[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeOrga[i])
                }
            }
            console.log("att ok ", att)

            // Suppr l'user  des joueurs confirme
            var  conf  = []
            
            for(var i = 0 ; i <this.state.defi.confirmesEquipeOrga.length ; i++) {
                if(this.state.defi.confirmesEquipeOrga[i] != this.monId) {
                    conf.push(this.state.defi.confirmesEquipeOrga[i])
                } 
            }
            console.log("conf ok ", conf)

            // Mettre à jour le state.
            var defi = this.state.defi
            defi.confirmesEquipeOrga = conf
            defi.attenteEquipeOrga = att
            defi.indisponiblesEquipeOrga = j

            this.setState({defi, defi})

            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeOrga : conf,
                attenteEquipeOrga : att,
                indisponiblesEquipeOrga : j,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

        // Cas où le joueur est dans l'équipe défiée
        } else {
            console.log("in elese")
            // Ajouter l'id de l'utilisateur dans la liste des indispo (Creation d'un new array pour le re render)
            var j = []
            for(var i = 0 ; i < this.state.defi.indisponiblesEquipeDefiee.length; i++) {
                j.push(this.state.defi.indisponiblesEquipeDefiee[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }
            console.log("indispo ok ")
            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeDefiee.length ; i++) {
                if(this.state.defi.attenteEquipeDefiee[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeDefiee[i])
                }
            }
            console.log("att ok ")


            // Suppr l'user  des joueurs confirmés
            var conf  = []
            for(var i = 0 ; i <this.state.defi.confirmesEquipeDefiee.length ; i++) {
                if(this.state.defi.confirmesEquipeDefiee[i] != this.monId) {
                    conf.push(this.state.defi.confirmesEquipeDefiee[i])
                } 
            }
            console.log("conf ok ")


            // Mettre à jour le state.
            var defi = this.state.defi
            console.log("after var defi")
            defi.confirmesEquipeDefiee = conf
            defi.attenteEquipeDefiee = att
            defi.indisponiblesEquipeDefiee = j

            this.setState({defi, defi})
            console.log("after set state")
            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeDefiee : conf,
                attenteEquipeDefiee : att,
                indisponiblesEquipeDefiee : j,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        }
         
        this.storeNotifAnnulerInDB()
   
    }


    /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs ayant 
     * confirmés. Ainsi que  d'enregistrer le def mise à jour dans la DB.
     */
    confirmerJoueurPresence() {

        // Trouver l'équipe dont l'utilisateur est membre 
        if(this.state.defi.joueursEquipeOrga.includes(this.monId)) {

            // Ajouter l'id de l'utilisateur dans la liste des confirme (Creation d'un new array pour le re render)
            var j = []
            for(var i = 0 ; i < this.state.defi.confirmesEquipeOrga.length; i++) {
                j.push(this.state.defi.confirmesEquipeOrga[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }

            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeOrga.length ; i++) {
                if(this.state.defi.attenteEquipeOrga[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeOrga[i])
                }
            }

            // Suppr l'user  des joueurs indispos
            var indispo  = []
            for(var i = 0 ; i <this.state.defi.indisponiblesEquipeOrga.length ; i++) {
                if(this.state.defi.indisponiblesEquipeOrga[i] != this.monId) {
                    indispo.push(this.state.defi.indisponiblesEquipeOrga[i])
                } 
            }

            // Mettre à jour le state.
            var defi = this.state.defi
            defi.confirmesEquipeOrga = j
            defi.attenteEquipeOrga = att
            defi.indisponiblesEquipeOrga = indispo

            this.setState({defi, defi})

            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeOrga : j,
                attenteEquipeOrga : att,
                indisponiblesEquipeOrga : indispo,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

        // Cas où le joueur est dans l'équipe défiée
        } else {
            // Ajouter l'id de l'utilisateur dans la liste des confirme (Creation d'un new array pour le re render)
            var j = []
            for(var i = 0 ; i < this.state.defi.confirmesEquipeDefiee.length; i++) {
                j.push(this.state.defi.confirmesEquipeDefiee[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }

            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeDefiee.length ; i++) {
                if(this.state.defi.attenteEquipeDefiee[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeDefiee[i])
                }
            }

            // Suppr l'user  des joueurs indispos
            var indispo  = []
            for(var i = 0 ; i <this.state.defi.indisponiblesEquipeDefiee.length ; i++) {
                if(this.state.defi.indisponiblesEquipeDefiee[i] != this.monId) {
                    indispo.push(this.state.defi.indisponiblesEquipeDefiee[i])
                } 
            }

            // Mettre à jour le state.
            var defi = this.state.defi
            defi.confirmesEquipeDefiee = j
            defi.attenteEquipeDefiee = att
            defi.indisponiblesEquipeDefiee = indispo

            this.setState({defi, defi})

            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeDefiee : j,
                attenteEquipeDefiee : att,
                indisponiblesEquipeDefiee : indispo,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        }

        console.log("before store notif")
        this.storeNotifConfirmerInDB()
        console.log("after store notif")
        
         
    }



    /**
     * Fonction qui va permettre d'aficher l'alerte permettant à l'utilisateur
     * de confirmer si il souhaite relancer les joueurs de son équipe.
     * @param {*} equipe 
     */
    alerteRelancerJoueur(equipe) {
        Alert.alert(
            '',
            'Tu souhaites relancer les joueurs en attente ?',
            [
                {text: 'Oui', onPress: () =>this.storeNotifRelanceInDB()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressedm'),
                  style: 'cancel',
                },
            ],
        )
    }


    /**
     * Fonction qui permet d'afficher le boutton relancer si l'utilisateur est 
     * capitaine
     */
    _renderBtnRelancer = () => {
        if(this.state.equipeOrganisatrice.capitaines.includes(this.monId) && this.state.defi.attenteEquipeOrga.length > 0) {
            return(
                <TouchableOpacity 
                    style = {styles.btnRelancer}
                    onPress = {() => this.alerteRelancerJoueur(this.state.equipeOrganisatrice)} >
                            <Text>Relancer</Text>
                </TouchableOpacity>
            )
        } else if(this.state.equipeDefiee != undefined && this.state.equipeDefiee.capitaines.includes(this.monId) && this.state.defi.attenteEquipeDefiee.length > 0) {
            console.log("okoko in _renderbtnrelancer")
            return(
                <TouchableOpacity
                 style = {styles.btnRelancer}
                 onPress = {() => this.alerteRelancerJoueur(this.state.equipeDefiee)} >
                
                            <Text>Relancer</Text>
                </TouchableOpacity>
            )
        }
    }

    //================================================================================
    //========================  FONCTION POUR LES NOTIFICATIONS ======================
    //================================================================================


    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    sendPushNotification(token , title,body ) {
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
     * On va stocker une notification qui correspond a la confirmation 
     * de la présence du joueur
     */
    async storeNotifConfirmerInDB() {

        var db = Database.initialisation() 
        // Trouver l'équipe dont l'utilisateur est membre 
        if(this.state.defi.joueursEquipeOrga.includes(this.monId)) {
            // Envoyer à chaque capitaines de l'équipe
            for(var i = 0 ; i < this.state.equipeOrganisatrice.capitaines.length ; i++) {

                if(this.state.equipeOrganisatrice.capitaines[i] != this.monId) {
                    // Envoyer une push notif a chaque token dans l'array tokens
                    var cap = await Database.getDocumentData(this.state.equipeOrganisatrice.capitaines[i], "Joueurs")
                    if(cap.tokens != undefined) {
                        for(var j = 0; j < cap.tokens.length; j++) {
                            var titre = "Nouvelle notif"
                            var corps = LocalUser.data.pseudo + " a confirmé sa présence pour un défi le " +  this.buildDate(new Date(this.state.defi.jour.seconds * 1000))
                            this.sendPushNotification(cap.tokens[j],titre,corps)
                        }
                    }
                    db.collection("Notifs").add(
                        {
                            dateParse : Date.parse(new Date()),
                            defi : this.state.defi.id,
                            emetteur :  LocalUser.data.id,
                            recepteur : this.state.equipeOrganisatrice.capitaines[i] ,
                            time : new Date(),
                            type : Types_Notification.CONFIRMER_PRESENCE_DEFI,
                            equipe : this.state.equipeOrganisatrice.id,
                        }
                    ) 
                }  
            }
        } else  {
            // Envoyer à chaque capitaines de l'équipe
            for(var i = 0 ; i < this.state.equipeDefiee.capitaines.length ; i++) {
                if(this.state.equipeDefiee.capitaines[i] != this.monId) {
                    
                    // Envoyer une push notif a chaque token dans l'array tokens
                    var cap = await Database.getDocumentData(this.state.equipeDefiee.capitaines[i], "Joueurs")
                    if(cap.tokens != undefined) {
                        for(var j = 0; j < cap.tokens.length; j++) {
                            var titre = "Nouvelle notif"
                            var corps = LocalUser.data.pseudo + " a confirmé sa présence pour un défi le " +  this.buildDate(new Date(this.state.defi.jour.seconds * 1000))
                            this.sendPushNotification(cap.tokens[j],titre,corps)                        
                        }
                    }
                    
                
                    db.collection("Notifs").add(
                        {
                            dateParse : Date.parse(new Date()),
                            defi : this.state.defi.id,
                            emetteur :  LocalUser.data.id,
                            recepteur : this.state.equipeDefiee.capitaines[i] ,
                            time : new Date(),
                            type : Types_Notification.CONFIRMER_PRESENCE_DEFI,
                            equipe : this.state.equipeDefiee.id,
                        }
                    ) .then(function() {console.log("ok notif")})
                }  
            }
        }
        
    }


    /**
     * On va stocker une notification qui correspond a l'annulation 
     * de la présence du joueur
     */
    async storeNotifAnnulerInDB() {

        var db = Database.initialisation() 
        // Trouver l'équipe dont l'utilisateur est membre 
        if(this.state.defi.joueursEquipeOrga.includes(this.monId)) {
            // Envoyer à chaque capitaines de l'équipe
            for(var i = 0 ; i < this.state.equipeOrganisatrice.capitaines.length ; i++) {
                if(this.state.equipeOrganisatrice.capitaines[i] != this.monId) {
                    // Envoyer une push notif a chaque token dans l'array tokens
                    var cap = await Database.getDocumentData(this.state.equipeOrganisatrice.capitaines[i], "Joueurs")
                    if(cap.tokens != undefined) {
                        for(var j = 0; j < cap.tokens.length; j++) {
                            var titre = "Nouvelle notif"
                            var corps = LocalUser.data.pseudo + " est indisponible pour un défi le " +  this.buildDate(new Date(this.state.defi.jour.seconds * 1000))
                            this.sendPushNotification(cap.tokens[j],titre,corps)
                        }
                    }

                    db.collection("Notifs").add(
                        {
                            dateParse : Date.parse(new Date()),
                            defi : this.state.defi.id,
                            emetteur :  LocalUser.data.id,
                            recepteur : this.state.equipeOrganisatrice.capitaines[i] ,
                            time : new Date(),
                            type : Types_Notification.ANNULER_PRESENCE_DEFI,
                            equipe : this.state.equipeOrganisatrice.id,
                        }
                    ) 
                }  
            }
        } else  {
            // Envoyer à chaque capitaines de l'équipe
            for(var i = 0 ; i < this.state.equipeDefiee.capitaines.length ; i++) {
                if(this.state.equipeDefiee.capitaines[i] != this.monId) {
                    // Envoyer une push notif a chaque token dans l'array tokens
                    var cap = await Database.getDocumentData(this.state.equipeDefiee.capitaines[i], "Joueurs")
                    if(cap.tokens != undefined) {
                        for(var j = 0; j < cap.tokens.length; j++) {
                            var titre = "Nouvelle notif"
                            var corps = LocalUser.data.pseudo + " est indisponible pour un défi le " +  this.buildDate(new Date(this.state.defi.jour.seconds * 1000))
                            this.sendPushNotification(cap.tokens[j],titre,corps)
                        }
                    }
                    db.collection("Notifs").add(
                        {
                            dateParse : Date.parse(new Date()),
                            defi : this.state.defi.id,
                            emetteur :  LocalUser.data.id,
                            recepteur : this.state.equipeDefiee.capitaines[i] ,
                            time : new Date(),
                            type : Types_Notification.ANNULER_PRESENCE_DEFI,
                            equipe : this.state.equipeDefiee.id,
                        }
                    ) .then(function() {console.log("ok notif")})
                }  
            }
        }
        
    }


    /**
     * Fonction qui va sauvegarder une notification par joueur convoque
     */
    storeNotifRelanceInDB() {
        console.log("in store notif relancer")
        var db = Database.initialisation() 

        // Si je suis de l'equipe orga
        //if(this.state.equipeOrganisatrice.capitaines.includes(this.monId)) {
        if(this.state.defi.joueursEquipeOrga.includes(this.monId)){
            console.log("before send notif")

            // Envoyer les notif
            for(var i = 0 ; i < this.state.joueurs.length ; i++) {
                console.log("in for ")
                if(this.state.defi.attenteEquipeOrga.includes(this.state.joueurs[i].id)) {
                    console.log("in if For Notif !!!!!!!")
                    var tokens = this.state.joueurs[i].tokens
                    if(tokens != undefined) {
                        for(var k = 0 ; k < tokens.length; k++) {
                            var title = "Nouvelle notif"
                            var corps = "Le capitaine " + LocalUser.data.pseudo + " de l'équipe " + this.state.equipeOrganisatrice.nom 
                            corps = corps + " t'as convoqué / relancé pour un un défi le " +
                            this.sendPushNotification(tokens[k], title, corps) 
                        }
                    }
                }
            }

            // Enregistrer notif dans la db
            for(var i = 0 ; i < this.state.defi.attenteEquipeOrga.length; i++) {
                if(this.state.defi.attenteEquipeOrga[i] != this.monId) { 
                    db.collection("Notifs").add(
                        {
                            dateParse : Date.parse(new Date()),
                            defi : this.state.defi.id,
                            emetteur : this.monId,
                            recepteur : this.state.defi.attenteEquipeOrga[i],
                            time : new Date(),
                            type : Types_Notification.CONVOCATION_RELANCE_DEFI,
                            equipe : this.state.equipeOrganisatrice.id
                        }
                    )
                }
            }
        } else if(this.state.equipeDefiee != undefined && this.state.defi.joueursEquipeDefiee.includes(this.monId)) {
            
            for(var i = 0 ; i < this.state.joueurs.length ; i++) {
                console.log("in for ")
                if(this.state.defi.attenteEquipeDefiee.includes(this.state.joueurs[i].id)) {
                    console.log("in if For Notif !!!!!!!")
                    var tokens = this.state.joueurs[i].tokens
                    if(tokens != undefined) {
                        for(var k = 0 ; k < tokens.length; k++) {
                            var title = "Nouvelle notif"
                            var corps = "Le capitaine " + LocalUser.data.pseudo + " de l'équipe " + this.state.equipeDefiee.nom 
                            corps = corps + " t'as convoqué / relancé pour un un défi le " + this.buildDate(new Date(this.state.defi.jour.seconds * 1000))
                            this.sendPushNotification(tokens[k], title, corps) 
                        }
                    }
                }
            }

            for(var i = 0 ; i < this.state.defi.attenteEquipeDefiee.length; i++) {
                if(this.state.defi.attenteEquipeDefiee[i] != this.monId) {
                    db.collection("Notifs").add(
                        {
                            dateParse : Date.parse(new Date()),
                            defi : this.state.defi.id,
                            emetteur : this.monId,
                            recepteur : this.state.defi.attenteEquipeDefiee[i],
                            time : new Date(),
                            type : Types_Notification.CONVOCATION_RELANCE_DEFI,
                            equipe : this.state.equipeDefiee.id
                        }
                    )
                }
            }
        }

        Alert.alert('', "Les joueurs en attente ont été relancés")
    }

   

    //=========================================================================================

    /**
     * Fonction qui permet d'afficher le cercle de couleur correspondant
     * à la présence d'un joueur
     * @param {String} color 
     */
    _renderCircleOfColor(color)  {
        return(
            <View>
                <View style = {[{ backgroundColor : color}, styles.circle]}></View>
            </View>
        )
    }

    /**
     * Fonction qui permet d'afficher le bouton "Convoquer plus de joueurs"
     * si l'utilisateur est capitaine d'une des deux équipes
     */
    renderBtnConvoquerPlusJoueur() {
        if(this.state.defi != undefined) {
            var cap1 = this.state.equipeOrganisatrice.capitaines.includes(this.monId)
            var cap2 = false 
            if(this.state.equipeDefiee != undefined) {
                cap2 = this.state.equipeDefiee.capitaines.includes(this.monId)
            }
            if(cap1 || cap2) {
                return(
                    <TouchableOpacity 
                        style = {styles.btnConvoquer}
                        onPress = {() => this.inviterPlusdeJoueur()}>
                            <Text style = {{alignSelf : "center"}}>Convoquer des joueurs</Text>
                    </TouchableOpacity>
                )
            }
        }
    }


    _renderItemJoueur= ({item}) => {
        if(this.state.defi != undefined) {
            var color  = "red"
            var defi = this.state.defi
            if(defi.confirmesEquipeDefiee.includes(item.id) || defi.confirmesEquipeOrga.includes(item.id)) {
                color = "green"
            } else if(defi.attenteEquipeDefiee.includes(item.id) || defi.attenteEquipeOrga.includes(item.id)) {
                color = "#C0C0C0"

            } 

            
            return(
                <View style = {styles.containerItemJoueur}>
                    <Joueur_Pseudo_Score
                        photo = {item.photo}
                        score = {item.score}
                        pseudo = {item.pseudo}
                    />

                    {this.btnsConfirmer(item.id)}

                    {/* View contenant le cercle de couleur */}
                    <View style = {styles.containerCircle}>
                        
                        <View style = {{alignSelf : "flex-end"}}>
                            {this._renderCircleOfColor(color)}
                        </View>
                    </View>

                   
                </View>
            
            )
        }
    }


    renderListPlayer() {
        if(this.state.isLoading) {
         return (
             <View style = {{marginTop : hp('8%')}}>
                 {/* Indicateur de chargement */}
                 <SkypeIndicator 
                     color='#52C7FD'
                     size = {hp('10%')} />
             </View>
         )
        } else {
            console.log("in render player liste")
            console.log(this.state.joueurs)
             return(
                 <View>
                    <View style = {{backgroundColor : Color.lightGray, marginBottom : hp('2%')}}>
                            <FlatList
                                data = {this.state.joueurs}
                                renderItem = {this._renderItemJoueur}
                                extraData = {this.state}

                            />
                         </View>
 
                         {this.renderBtnConvoquerPlusJoueur()}
          
                 </View>
            )
        }

    }


    _renderNavHeader() {
        return(
            <View>

            </View>

        )
    }

    btnsConfirmer(id) {
        if(id == this.monId) {
            return(
                <View style = {{marginLeft : wp('10%'),justifyContent : "center"}}>
                    <Text>Confirmer</Text>

                    <View style = {{flexDirection : 'row'}}>
                        <TouchableOpacity
                            onPress = {() => this.handleConfirmerOui()}>
                            <Text style = {styles.txtConfirmer}>Oui</Text>
                        </TouchableOpacity>

                        <Text> / </Text>

                        <TouchableOpacity
                            onPress = {() => this.handleConfirmerNon()}>
                            <Text style = {styles.txtConfirmer} >Non</Text>
                        </TouchableOpacity>
                    </View>
                </View>
               
            )
        }
    }


    render() {

        if(this.state.defi != undefined) {
            if(this.state.defi.joueursEquipeDefiee.includes(this.monId)) {
                var confirme = this.state.defi.confirmesEquipeDefiee
                var indisponibles =  this.state.defi.indisponiblesEquipeDefiee
                var attente =  this.state.defi.attenteEquipeDefiee
            } else {
                var confirme = this.state.defi.confirmesEquipeOrga
                console.log("CONFIRME  : " , confirme)
                var indisponibles =  this.state.defi.indisponiblesEquipeOrga
                var attente =  this.state.defi.attenteEquipeOrga 
            }
           
            
            return(
                <View>
                    <ScrollView>
                        <View>
                            <Text style = {{alignSelf : "center", marginTop : hp('1%')}}>Feuille de match</Text> 
                            <Text>Joueurs convoqués : {confirme.length + indisponibles.length + attente.length }</Text>
                            <View style = {{flexDirection : 'row'}}>
                                <Presences_Joueurs
                                    nbjoueursConfirmes = {confirme.length}
                                    nbIndisponibles = {indisponibles.length}
                                    nbAttentes = {attente.length}
                                    isPartie  = {false}
                                    renderBtnRelancer={this._renderBtnRelancer}
                                />
                            </View>
                        
                            {this.renderListPlayer()}
                        </View>
                    </ScrollView>
                    </View>
            )
        } else {
            return (
                <View>
                    <Text>Une erreur est survenue</Text>
                </View>
            )
        }
        
    }

    
    
}
const styles = {
    containerItemJoueur : {
        flexDirection : 'row',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginLeft : wp('3%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6
    },

    containerCircle : {
        flex: 1,
        justifyContent: 'center',
        marginRight : wp('2%')
    },

    circle  : {
        width : wp('5%'),
        height :wp('5%'),
        borderRadius : wp('2.5%'),
        marginRight : wp('3%'),
        marginLeft : wp('3%')
    },

    btnConvoquer : {
        backgroundColor : "white",
        alignSelf : "center",
        width : wp('75%'),
        borderWidth :2,
        borderColor  : Colors.agooraBlueStronger,
        borderRadius :5,
        paddingHorizontal : wp('2%'),
        paddingVertical : hp('1%'),
        marginBottom : hp('1%'),
        marginTop : hp('1%')

    }, 

    txtConfirmer : {
        fontWeight : "bold",
        fontSize : RF(2.5)
    },

    btnRelancer : {
        borderWidth :2,
        borderColor  : Colors.agooraBlueStronger,
        borderRadius :5,
        marginLeft : wp('5%'),
        paddingHorizontal : wp('2%'),
        paddingVertical : hp('1%'),
        alignSelf : "flex-end",
        marginRight : wp('5%')

    },

}

const mapStateToProps = (state) => {
    return{ 
        JoueursParticipantsPartie : state.JoueursParticipantsPartie,
    } 
}
export default connect(mapStateToProps) (Feuille_Defi_A_Venir)
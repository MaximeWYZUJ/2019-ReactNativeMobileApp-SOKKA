import React from 'react'
import {View,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../.././../../Components/Colors'
import Barre_Recherche from '../../../../Components/Recherche/Barre_Recherche'
import Joueur_Item_Creation_Defis from '../../../../Components/ProfilJoueur/Joueur_Item_Creation_Defis'
import Database from '../../../../Data/Database'
import LocalUser from '../../../../Data/LocalUser.json'
import FiltrerJoueur from '../../../../Components/Recherche/FiltrerJoueur'
import CheckBox from 'react-native-checkbox';
import firebase from 'firebase'
import '@firebase/firestore'
import DatesHelpers from '../../../../Helpers/DatesHelpers'
import Types_Notification from '../../../../Helpers/Notifications/Types_Notification'
import { connect } from 'react-redux'


/**
 * Classe qui va permettre à l'utilisateur de choisir les joueurs à convoquer lors de la
 * création d'un défi.
 */
class Choix_Joueurs_Defis_2_Equipes extends React.Component {

    /**
     * Constructeur
     * @param {*} props 
     */
    constructor(props) {
        super(props)

        this.equipe = this.props.navigation.getParam('allDataEquipe', ' ')
        this.format = this.props.navigation.getParam('format', ' ')
        this.nbMaxJoueur = this.format.split("x")[0]
        this.participants = this.props.navigation.getParam('participants', [])
        this.state = {
            joueursSelectionnes : [],           // Liste des joueurs séléctionnés
            //capitainesSelectionnes : [],        // Liste des capit
            allJoueurs : [],
            joueurFiltres : [],
            capitaineFiltres: [],
            capitaines : [],
            selectedAllCapitnaines : false,
            selectedAllPlayer : false,
            selectedEveryone : false,
            nbCaptainsSelected : 0,
            displayFiltres: false,
            filtres: null
        }
        this.goBackToFiche = this.goBackToFiche.bind(this)

    }


   
    static navigationOptions = ({ navigation }) => {

        
        if(navigation.getParam("convocation",false)) {
            var defi  = navigation.getParam("defi",undefined)
            var date = new Date(defi.jour.seconds *1000)
            var j = date.getDay()
            var numJour = date.getDate()
            var mois  =(date.getMonth() + 1).toString()
            if(mois.length == 1) {
                mois = '0' + mois 
            }
            var an  = date.getFullYear()
            return {
                title : "Défi " + numJour  + '/' + mois + '/' + an
            }
        } else {
            return {
                title: 'Proposer un défi'
            }
        }
        
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
     * Méthode appelée après que le composant soit rendu, c'est à ce moment là 
     * que l'on va récuperer les données depuis la base de données.
     */
    componentDidMount() {
        let joueursArray = []
        var db = Database.initialisation();

        for(var i = 0; i < this.equipe.joueurs.length; i++) {
            var docRef = db.collection('Joueurs').doc(this.equipe.joueurs[i]);
            docRef.get().then(async (doc) => {
                if (doc.exists) {
                    
                    var joueur = doc.data()
            
                    // Vérifier si c'est pas un des capitaines d'équipe
                    if( ! this.equipe.capitaines.includes(joueur.id)) {
                        joueursArray.push(joueur)
                       
                    }

                    this.setState({allJoueurs : joueursArray, joueurFiltres : joueursArray})
                } else {
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }   

        let capitainesArray = []
        for(var i = 0; i < this.equipe.capitaines.length; i++) {
            var docRef = db.collection('Joueurs').doc(this.equipe.capitaines[i]);

            docRef.get().then(async (doc) => {
                if (doc.exists) {
                    
                    var joueur = doc.data()
            
                    capitainesArray.push(joueur)
                    
                    this.setState({capitaines : capitainesArray, capitaineFiltres: capitainesArray})
                } else {
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }   
    }



     /**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les equipes 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
        // on separe les joueurs et les capitaines
        var capitaines = [];
        var joueurs = [];
        for (var i=0; i<data.length; i++) {
            var d = data[i];
            var isCaptain = false;
            for (c of this.state.capitaines) {
                if (c.id == d.id) {
                    capitaines.push(d);
                    isCaptain = true;
                    break;
                }
            }
            if (!isCaptain) {
                joueurs.push(d);
            }
        }
		this.setState({
            joueurFiltres : joueurs,
            capitaineFiltres : capitaines
		})
    }


    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        var dataJ = this.state.allJoueurs;
        var dataC = this.state.capitaines;
        var dataJF = FiltrerJoueur.filtrerJoueurs(dataJ, f);
        var dataCF = FiltrerJoueur.filtrerJoueurs(dataC, f);

        this.setState({
            joueurFiltres: dataJF,
            capitaineFiltres: dataCF,
            filtres: f,
            displayFiltres: false
        })
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            return (<FiltrerJoueur handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)    
        }
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
     * Fonction qu'on va passer en props du composant item joueurs, elle va nous
     * permettre prendre en charge la selection d'un joueur par l'utilisateur.
     */
    handleJoueurSelectionne = (id) => {

        var participe = this.participants.includes(id)
        if(! participe) {
            // On crée un new Array car sinon le state fait ref vers le meme objet et 
            // les composant ne se re rendent pas 

            var j  = []

            /* 1ier cas : le joueur n'a pas déja été sélectioné */
            if(! this.state.joueursSelectionnes.includes(id)) {


                // On recopie la liste dans une nouvelle pour que le state se maj
                for(var i = 0 ; i < this.state.joueursSelectionnes.length ; i++) {
                    j.push(this.state.joueursSelectionnes[i])
                }
                j.push(id)

            // Le joueur est séléctionné et on veut le déselectionner
            } else {
                for(var i = 0 ; i < this.state.joueursSelectionnes.length ; i++) {
                    if(this.state.joueursSelectionnes[i] != id) {
                        j.push(this.state.joueursSelectionnes[i])
                    }
                }
            }
            this.setState({joueursSelectionnes : j, selectedAllCapitnaines : this.allTheCaptainsAreSelected()})
        } else {
            Alert.alert(
               '',
               'Ce joueur participe déja au défi, tu ne peux pas le séléctionner'
            )
        }
            
        
        
        
    }

    /**
     * Fonction qui va permettre de selectionner tout les joueurs (filtrés par la recherche) 
     * à condition que le format permette de tous les selectionner
     */
    handleToutSelectionner() {
        if(!this.state.selectedEveryone) {
                var j = []

                // Selectionner les joueurs 
                for(var i = 0 ; i <this.state.joueurFiltres.length; i++) {
                    var participe = this.participants.includes(this.state.joueurFiltres[i].id)
                    if(! participe) j.push(this.state.joueurFiltres[i].id)
                }

                // Selectionner les capitaines
                for(var i = 0 ; i <this.state.capitaineFiltres.length; i++) {
                    var participe = this.participants.includes(this.state.capitaineFiltres[i].id)
                    if(!participe) j.push(this.state.capitaineFiltres[i].id)
                }
                this.setState({joueursSelectionnes : j,selectedAllCapitnaines : true, selectedAllPlayer : true, selectedEveryone : true})
            
        } else {
            this.setState({joueursSelectionnes : [] ,selectedAllCapitnaines : false, selectedAllPlayer : false, selectedEveryone : false})
        }
    }


    /**
     * Fonction qui va permettre de selectionner tous les capitaines si le format 
     * le permet 
     */
    handleSelectCapitaines() {

        // Si les capitaines ne sont pas déja tous selectionnés
        if(! this.state.selectedAllCapitnaines) {
            var j = []

            // Ajouter les capitaines à j
            for(var i = 0 ; i <this.state.capitaineFiltres.length; i++) {
                var participe = this.participants.includes(this.state.capitaineFiltres[i].id)
                if(! participe) j.push(this.state.capitaineFiltres[i].id)
            }

            // Ajouter les joueurs déja sélectionnées
            for(var i = 0 ; i <this.state.joueursSelectionnes.length; i++) {
                j.push(this.state.joueursSelectionnes[i])
            }
            
            this.setState({joueursSelectionnes : j, selectedAllCapitnaines : true})

        // Si les capitaines sont déja selectionnées
        } else {

            var j = []

            // Enlever les capitaines
            for(var i =0 ; i < this.state.joueursSelectionnes.length; i++) {
                if( !this.equipe.capitaines.includes(this.state.joueursSelectionnes[i])) {
                    j.push(this.state.joueursSelectionnes[i])
                }
            }
            this.setState({joueursSelectionnes : j, selectedAllCapitnaines : false})
        }
       
        
    }

    /**
     * Fonction qui va permettre de selectionner tous les joueurs (pas les capitaines) si 
     * le format le permet
     */
    handleSelectPlayer() {

        if( ! this.state.selectedAllPlayer ) {
            var j = []

            // Selectionner les joueurs filtrés
            for(var i = 0 ; i <this.state.joueurFiltres.length; i++) {
                var participe = this.participants.includes(this.state.joueurFiltres[i].id)
                if( (! this.equipe.capitaines.includes(this.state.joueurFiltres[i])) && ! participe) {
                    j.push(this.state.joueurFiltres[i].id)
                }
            }
            
            // Ajouter les capitaines à la liste déja sélectionnées
            for(var i = 0 ; i <this.state.joueursSelectionnes.length; i++) {
                if(! j.includes(this.state.joueursSelectionnes[i] )) {
                    j.push(this.state.joueursSelectionnes[i])

                }
            }
            
            
            this.setState({joueursSelectionnes : j, selectedAllPlayer : true})
            
        } else {
            var j = []
            for(var i =0 ; i < this.state.joueursSelectionnes.length; i++) {
                if( this.equipe.capitaines.includes(this.state.joueursSelectionnes[i])) {
                    j.push(this.state.joueursSelectionnes[i])
                }
            }
            this.setState({joueursSelectionnes : j, selectedAllPlayer : false})

        }
        
    }

    /**
     * Fonction qui renvoie true si tout les capitaines ont été séléctionés
     */
    allTheCaptainsAreSelected() {
        var nbCapitaine = 0
        for(var i = 0; i < this.state.joueursSelectionnes.length; i ++) {
            if(this.equipe.capitaines.includes(this.state.joueursSelectionnes[i])) {
                nbCapitaine ++
            }
        }
        if(nbCapitaine == this.equipe.capitaines.length) {
            //this.setState({selectedAllCapitnaines : true})
            return true
        } else {
            
            return false

        }
    }

     /**
     * Fonction qui renvoie true si tout les joueurs (sauf les cap) ont été séléctionés
     */
    allThePlayerAreSelected() {
        var nbJoueur = 0
        for(var i = 0; i < this.state.joueursSelectionnes.length; i ++) {
            if(! this.equipe.capitaines.includes(this.state.joueursSelectionnes[i])) {
                nbJoueur ++
            }
        }
        if(nbJoueur == (this.state.joueurFiltres -this.equipe.capitaines.length)) {
            //this.setState({selectedAllCapitnaines : true})
            return true
        } else {
            
            return false

        }
    }


    //========================== NOTIFICATION ==========================

   
    
     /**
     * Fonction qui va sauvagarder dans la base de données les notifications
     * pour la convocation à la partie
     */
    storeNotificationInDb() {
        var db = Database.initialisation() 
        var defi = this.props.navigation.getParam("defi",undefined)
        var txt = "Le capitaine " + LocalUser.data.pseudo + " de l'équipe " + this.equipe.nom 
        txt = txt + " t'a convoqué / relancé pour un un défi le " + this.buildDate(new Date(defi.jour.seconds * 1000))
        console.log(txt)
        for(var i  = 0; i <this.state.joueursSelectionnes.length; i++) {
            if(this.state.joueursSelectionnes[i]!= LocalUser.data.id) {
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        defi :defi.id,
                        emetteur :LocalUser.data.id,
                        recepteur :this.state.joueursSelectionnes[i],
                        time : new Date(),
                        type : Types_Notification.CONVOCATION_RELANCE_DEFI,
                        equipe :this.equipe.id,
                        dateHeure : DatesHelpers.buildDateNotif(new Date()),
                        texte : txt,
                        heure: DatesHelpers.buildDateNotif(new Date()),
                        show_boutons : true
                    }
                )  
            }
        }
    }

        /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    sendPushNotification(token , title,body ) {
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

    //===================================================================



    gotoNextScreen() {
        
        this.props.navigation.push(
            "Defis2EquipesContreQui", 
            {
                format : this.format,
                type : this.props.navigation.getParam('type', ' '),
                jour : this.props.navigation.getParam('jour', ' '),
                heure :this.props.navigation.getParam('heure', ' '),
                duree : this.props.navigation.getParam('duree', ''),
                terrain : this.props.navigation.getParam('terrain', ' '),
                allDataEquipe : this.equipe,
                userData : this.props.navigation.getParam('userData', ' '),
                joueursSelectionnes : this.state.joueursSelectionnes,
                nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' '),
                prix: this.props.navigation.getParam('prix', null)
            }
            
        )
    }


    /**
     * Fonction qui amène l'utilisateur sur la fiche du défi pour lequel il a inviter des joueurs
     */
    goBackToFiche() {
        var defi  =this.props.navigation.getParam('defi', undefined)
        var joueursEquipe = this.props.navigation.getParam('joueursEquipe',[])
        
        this.storeNotificationInDb()
        // Envoyer les notif
        var defi  = this.props.navigation.getParam("defi",undefined)
        for(var i = 0; i < this.state.allJoueurs.length ; i++) {
            if(this.state.joueursSelectionnes.includes(this.state.allJoueurs[i].id)) {
                var tokens = this.state.allJoueurs[i].tokens
                if(tokens != undefined) {
                    for(var k = 0 ; k < tokens.length; k++) {

                        var title = "Nouvelle notif"
                        var corps = "Le capitaine " + LocalUser.data.pseudo + " de l'équipe " + this.equipe.nom 
                        console.log(defi.jour)
                        corps = corps + " t'a convoqué / relancé pour un un défi le " + this.buildDate(new Date(defi.jour.seconds * 1000))
                        this.sendPushNotification(tokens[k], title, corps)
                    }
                }
            }
        }

        // Stocker les notif dans la db 
        if(this.equipe.id == defi.equipeDefiee) {

            // Mettre  à jour les champs du défi
            defi["confirmesEquipeDefiee"] = defi.confirmesEquipeDefiee.concat(this.findCapitaines()),
            defi["attenteEquipeDefiee"] = defi.attenteEquipeDefiee.concat(this.buildListOfJoueurWithoutCapitaines())
            defi["joueursEquipeDefiee"] = this.state.joueursSelectionnes.concat(joueursEquipe)
            defi["participants"] = defi.participants.concat(this.state.joueursSelectionnes)
            
            // Se rendre sur la fiche du défi
            this.props.navigation.push("FeuilleDefiAVenir", 
                {
                    retour_arriere_interdit : true,
                    equipeDefiee : this.props.navigation.getParam('equipeDefiee',undefined),
                    equipeOrganisatrice : this.props.navigation.getParam('equipeOrganisatrice',undefined),
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

            // Mettre  à jour les champs du défi
            defi["confirmesEquipeOrga"] = defi.confirmesEquipeOrga.concat(this.findCapitaines()),
            defi["attenteEquipeOrga"] =  defi.attenteEquipeOrga.concat(this.buildListOfJoueurWithoutCapitaines())
            defi["joueursEquipeOrga"] = this.state.joueursSelectionnes.concat(joueursEquipe)
            defi["participants"] = defi.participants.concat(this.state.joueursSelectionnes)

            this.props.navigation.push("FeuilleDefiAVenir", 
                {
                    retour_arriere_interdit : true,
                    equipeDefiee : this.props.navigation.getParam('equipeDefiee',undefined),
                    equipeOrganisatrice : this.props.navigation.getParam('equipeOrganisatrice',undefined),
                    defi : defi
                    /*defi : {
                        ...defi,
                        confirmesEquipeOrga : defi.confirmesEquipeOrga.concat(this.findCapitaines()),
                        attenteEquipeOrga : joueursEquipe.concat(this.buildListOfJoueurWithoutCapitaines()),
                        joueursEquipeOrga : this.state.joueursSelectionnes.concat(joueursEquipe),
                        participants : defi.participants.concat(this.state.joueursSelectionnes)
                    }*/
                }
            )
        }
        
    }


    /**
     * Fonction qui va renvoyer la liste des joueurs en attente
     * pour le défi
     */
    findJoueurAttente() {

    }


    /**
     * Fonction qui va mettre à jour les participants d'un défi
     */
    updateDefiExistant() {
        console.log("in updateDefiExistant")
        var defi =this.props.navigation.getParam('defi', undefined)
        var joueursEquipe = this.props.navigation.getParam('joueursEquipe',[])
        if(defi != undefined) {

            // 1ier cas : il s'agit de l'équipe défiée 
            if(this.equipe.id == defi.equipeDefiee) {
                console.log("in if")
                var db = Database.initialisation()
                var DefiRef = db.collection("Defis").doc(defi.id) 
                DefiRef.update({
                    confirmesEquipeDefiee : defi.confirmesEquipeDefiee.concat(this.findCapitaines()),
                    attenteEquipeDefiee : defi.attenteEquipeDefiee.concat(this.buildListOfJoueurWithoutCapitaines()),
                    joueursEquipeDefiee : this.state.joueursSelectionnes.concat(joueursEquipe),
                    participants : defi.participants.concat(this.state.joueursSelectionnes),
                    joueursConcernes : defi.joueursConcernes.concat(this.state.joueursSelectionnes)

                }).then(this.goBackToFiche)
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });

            } else if(this.equipe.id == defi.equipeOrganisatrice) {
                console.log("in else if")
                console.log("this.state.joueursSelectionnes",  this.state.joueursSelectionnes)
                var db = Database.initialisation()
                var DefiRef = db.collection("Defis").doc(defi.id) 
                
                DefiRef.update({
                    confirmesEquipeOrga : defi.confirmesEquipeOrga.concat(this.findCapitaines()),
                    attenteEquipeOrga : defi.attenteEquipeOrga.concat(this.buildListOfJoueurWithoutCapitaines()),
                    joueursEquipeOrga : this.state.joueursSelectionnes.concat(joueursEquipe),
                    participants : defi.participants.concat(this.state.joueursSelectionnes),
                    joueursConcernes : defi.joueursConcernes.concat(this.state.joueursSelectionnes)
                }).then(this.goBackToFiche)
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            }
        }
        
    }

    
    /**
     * Fonction qui va permettre d'afficher une alerte à l'utilisateur
     * au moment de valider la convocation des joueurs
     */
    alertConvocation() {
        Alert.alert(
            '',
            'Tu souhaites convoquer les joueurs séléctionnés ?',
            [
                {text: 'Confirmer', onPress: () => this.updateDefiExistant()},
                {
                  text: 'Annuler',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )
    }

    /**
     * Fonction qui permet de savoir si un ou plusieur joueurs sont les capitaines 
     * de l'équipe convoquée
     */
    findCapitaines() {
        var joueurs =  this.state.joueursSelectionnes
        var capitaines = []
        for(var i = 0 ; i < joueurs.length; i++) {
            if(this.equipe.capitaines.includes(joueurs[i])) {
                capitaines.push(joueurs[i])
            }
        }
        return capitaines
    }

    /**
     * Fonction qui va permettre de construire une liste d'id des joueurs 
     * sans le capitaine
     */
    buildListOfJoueurWithoutCapitaines() {
        var joueurs =  this.state.joueursSelectionnes
        var liste = []
        for(var i = 0 ; i < joueurs.length; i++) {
            if( ! this.equipe.capitaines.includes(joueurs[i])) {
                liste.push(joueurs[i])
            }
        }
        return liste

    }


    

    //=========================================================================
    //================================ RENDER FONCTIONS =======================
    //=========================================================================


    buttonNext(){
        var nbAtteint = this.props.navigation.getParam("nbJoueurMinatteint", false)
        // PASSER EN PROPS USER DATA (Toutes les donnes de l'user)

        // Calculer le nbr de joueurs total pour le defi
        var joueursEquipe = this.props.navigation.getParam("joueursEquipe", [])
        var nbJoueurs = this.state.joueursSelectionnes.length +joueursEquipe.length
        
        if(this.props.navigation.getParam("convocation", false) &&this.state.joueursSelectionnes.length == 0 ) {
            return <Text>Suivant</Text>
        } else {
            if( this.state.joueursSelectionnes.length > 0 && (nbAtteint || nbJoueurs >= parseInt(this.format.split("x")[0])) ) {
                return( 
                    <TouchableOpacity
                        onPress ={() => {
                            // Si on convoque des joueurs à un défi existant               
                            if(this.props.navigation.getParam("convocation", false)) {
                                this.alertConvocation()
                            // Si on crée un nouveau défi
                            } else {
                                this.gotoNextScreen()
                            }
                        }}
                        >
                        <Text style = {styles.txtBoutton}>Convoquer</Text>
                    </TouchableOpacity>
                ) 
            } else if(this.state.joueursSelectionnes.length == 0) {
                return (
                    <TouchableOpacity
                        onPress ={() => {
                            // Si on convoque des joueurs à un défi existant               
                            if(this.props.navigation.getParam("convocation", false)) {
                                this.alertConvocation()
                            // Si on crée un nouveau défi
                            } else {
                                this.gotoNextScreen()
                            }
                        }}
                        >
                        <Text style = {styles.txtBoutton}>Plus tard</Text>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity
                        onPress ={() => {
                            // Si on convoque des joueurs à un défi existant               
                            if(this.props.navigation.getParam("convocation", false)) {
                                this.alertConvocation()
                            // Si on crée un nouveau défi
                            } else {
                                this.gotoNextScreen()
                            }
                        }}
                        >
                        <Text style = {styles.txtBoutton}>Le reste plus tard</Text>
                    </TouchableOpacity>
                )   
            }
        }
    }

    _renderItem = ({item}) => {
            return(
                <Joueur_Item_Creation_Defis
                    id = {item.id}
                    pseudo = {item.pseudo}
                    score = {item.score}
                    photo = {item.photo}
                    isChecked = {this.state.joueursSelectionnes.includes(item.id)}
                    handleSelectJoueur = {this.handleJoueurSelectionne} 
                />
            )
        

    }


    render() {
        // Fusion des joueurs et capitaines pour la recherche
        var unionJC = [];
        for (d of this.state.allJoueurs) {
            unionJC.push(d);
        }
        for (d of this.state.capitaines) {
            unionJC.push(d);
        }

        return(
            <View style = {{ flex: 1}}>

                {/* Bandeau superieur */}
                <View style = {{backgroundColor : Colors.grayItem, flexDirection : 'row', justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%'), marginBottom : hp('2%')}}>
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

                    <Text>Convocation</Text>

                    {this.buttonNext()}
			    </View>

                <Text style = {styles.text}>Quels joueurs de ton équipe</Text>
                <Text style = {styles.text}>{this.equipe.nom} souhaites-tu convoquer ?</Text>

                {/* View contenant le nombre de joueurs selectionnes*/}
                <View style = {styles.bloc_nbJoueurs_selectionnes}>

                    <Text >Joueurs convoqués : </Text>
                    <Text>{this.state.joueursSelectionnes.length}/{this.format.split("x")[0]}</Text>
                </View>

                <ScrollView>
                    <Barre_Recherche
                        handleTextChange ={this.recherche}
                        data = {unionJC}
                        field = {"pseudoQuery"}
                        filterData = {(data) => FiltrerJoueur.filtrerJoueurs(data)}
                        handleFilterButton = {this.handleFilterButton}
                    />
                    {this.displayFiltresComponents()}

                    {/* Tout selectionner*/}
                    <View style = {{flexDirection : 'row', justifyContent : "space-between"}}>
                        <Text>Tout sélectionner</Text>
                        <CheckBox
                            label=' '
                            checkedColor = {Colors.agOOraBlue}
                            right
                            containerStyle={styles.checkBox}                    
                            checked={this.state.selectedEveryone}
                            onChange = {() => this.handleToutSelectionner()}

                        />
                    </View>

                        {/* View contenant la liste des capitaines */}
                        <View>
                            <View  style = {styles.header_container}>
                                <Text  style = {styles.header} >Capitaines</Text>
                                <CheckBox
                                    label=' '
                                    checkedColor = "white"
                                    right
                                    containerStyle={styles.checkBox_header}                    
                                    checked={this.allTheCaptainsAreSelected() }
                                    onChange = {() => this.handleSelectCapitaines()}

                                />
                                
                            </View>
                            <FlatList
                                data = {this.state.capitaineFiltres}
                                keyExtractor={(item) => item.id}
                                extraData = {this.state.joueursSelectionnes}
                                renderItem = {this._renderItem}
                            />
                        </View>

                        {/* View contenant la liste des joueurs */}
                        <View>
                            <View style = {styles.header_container}>
                                <Text style = {styles.header}>Joueurs</Text>
                                <CheckBox
                                    label=' '
                                    checkedColor = "white"
                                    right
                                    containerStyle={styles.checkBox_header}                    
                                    checked={this.state.selectedAllPlayer }
                                    onChange = {() => this.handleSelectPlayer()}

                                />
                            </View>
                            <FlatList
                                keyExtractor={(item) => item.id}
                                data = {this.state.joueurFiltres}
                                extraData = {[this.state.joueursSelectionnes, this.state.joueurFiltres]}
                                renderItem = {this._renderItem}
                            />
                        </View>
                
                    </ScrollView>
                
            </View>
        )
    }
}
const styles = {
    header_container: {
        backgroundColor:Colors.agOOraBlue,
        width : wp('100%'),
        justifyContent: 'center',
        flexDirection : 'row',
        alignItems: 'center',
        marginBottom : hp('2%'),
        //marginLeft : wp('5%'),
        //marginRight : wp('5%'),
        marginTop : hp('3%'),
        //borderRadius : 15,

    },
    bloc_nbJoueurs_selectionnes : {
        backgroundColor : Colors.grayItem, 
        flexDirection : "row", 
        justifyContent: "space-between",
        marginTop : hp('2%'), 
        marginHorizontal :wp('3%')
    },

    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 2
    },
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },
    checkBox : {
        backgroundColor : 'white',
        borderWidth :0, 
        alignSelf : 'center' 
    },
    text : {
        fontSize : RF(2.4), 
        alignSelf : 'center', 
    },

    checkBox_header : {
        backgroundColor : Colors.agOOraBlue,
        borderWidth :0, 
        alignSelf : 'center' ,
        color : "white"
    }
}

const mapStateToProps = (state) => {
    return{ 
        JoueursParticipantsPartie : state.JoueursParticipantsPartie,
    } 
}
export default connect(mapStateToProps)  (Choix_Joueurs_Defis_2_Equipes)
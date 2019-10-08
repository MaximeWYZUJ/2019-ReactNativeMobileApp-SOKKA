import React from 'react'

import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity,FlatList,Alert,ScrollView,Picker,TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../../Data/Database'
const DAY = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Terrains from '../../../Helpers/Toulouse.json'
import {SkypeIndicator} from 'react-native-indicators';
import Equipe_Nom_Score from '../../../Components/Profil_Equipe/Equipe_Nom_Score'
import Color from '../../../Components/Colors';
import { connect } from 'react-redux'
import actions from '../../../Store/Reducers/actions'
import Joueur_Pseudo_Score from '../../../Components/ProfilJoueur/Joueur_Pseudo_Score';
import LocalUser from '../../../Data/LocalUser.json'
import { StackActions, NavigationActions } from 'react-navigation';
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'
import firebase from 'firebase'
import '@firebase/firestore'
import Distance from '../../../Helpers/Distance';


// Rememttre à Zéro le stack navigator pour empecher le retour en arriere
const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [
      NavigationActions.navigate({ routeName: 'AccueilJouer' }),
    ],
});


/**
 * Classe qui va permettre d'afficher les informations d'un défi et permettre à l'utilisateur
 * d'y participer si il est capitaine d'une équipe.
 */
class Fiche_Defi_Rejoindre extends React.Component {

    constructor(props) {
        super(props)

        console.log("IN CONSTRUCTOR FICHE DEFI REJOINDRE")
        this.idDefi = this.props.navigation.getParam('id','erreur')
        console.log("this.idDefi", this.idDefi)
        this.equipe1Animation = new Animated.ValueXY({ x: -wp('100%'), y:0 })
        this.equipe2Animation = new Animated.ValueXY({ x: wp('100%'), y:0 })
        this.userData = {
            id : LocalUser.data.id ,
            isCapitaine : true
        }

        console.log("defi", this.props.navigation.getParam('defi',undefined) )
       
        this.state = {
            defi : this.props.navigation.getParam('defi',undefined), 
            isLoading : true,
            InsNom : " ",
            N_Voie : ' ',
            Voie : ' ',
            CodePostal : ' ',
            Ville : ' ',
            organisateur : {pseudo: ""},
            equipeOrganisatrice : this.props.navigation.getParam('equipeOrganisatrice',undefined),
            equipeDefiee : this.props.navigation.getParam('equipeDefiee',undefined),
            show_equipe : false,
            equipes : [],
            buteurDefiee : [],
            buteurOrga: [],
            hommeOgra : undefined,
            hommeDefiee: undefined,
            nbVotantOrga : 0,
            nbVotantDefiee : 0,
            commentaires : [],
            currentCommentaire : ""
        }
        console.log("fin constructor")
    }


  

    componentDidMount() {
        console.log("in component did mount")
        this.findTerrain(this.state.defi.terrain)
        console.log("after find terrain")
        this.ChangeThisTitle('Defi ' +this.buildDate(new Date(this.state.defi.jour.seconds * 1000)))

        console.log("after change title")
        //this.downloadAllDataDefi()
        this._moveEquipe1()
        this._moveEquipe2()
        this.getButeurs()
        this.getHommeMatch()
        this.getCommentaire(this.state.defi)

        Database.getDocumentData(this.state.defi.organisateur, "Joueurs")
        .then((org) => {
            this.setState({organisateur: org, isLoading: false})
        })
    }

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
      

    ChangeThisTitle = (titleText) => {
        console.log("in change title")
        console.log(titleText)
        const {setParams} = this.props.navigation;
        setParams({ title: titleText })
    }


  

    



    /**
     * Fonction qui permet de trouver les noms du terrains correspondant à 
     * celui sur lequel est organisé le défi.
     */
    findTerrain(id) {
        for(var i  = 0 ; i < Terrains.length ; i ++) {
            if(Terrains[i].id == id) {
                var d = Distance.calculDistance(LocalUser.geolocalisation.latitude, LocalUser.geolocalisation.longitude, Terrains[i].Latitude, Terrains[i].Longitude)+"";
                var dTxt = d.split(".")[0]+","+d.split(".")[1][0];
                this.setState({
                    InsNom : Terrains[i].InsNom,
                    N_Voie : Terrains[i].N_Voie,
                    Voie : Terrains[i].Voie,
                    CodePostal : Terrains[i].CodePostal,
                    Ville : Terrains[i].Ville,
                    terrainDistance : dTxt
                })
            }
        }
    }



    /**
     * Fonction qui permet de construire un String représentant la date du défi pour 
     * l'afficher dans la vue
     * ex : Dimanche 28/04/2019 - 17h à 19h
     * @param {Date} date 
     */
    buildDateString(date) {
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        var heure = date.getHours()

        var minute = (date.getMinutes()).toString()
        if(minute.length == 1) {
            minute = '0' + mois
        }
        var heureFin = this.calculHeureFin(heure,minute,this.state.defi.duree)

        return DAY[j] + ' ' + numJour  + '/' + mois + '/' + an + ' - ' +  heure + 'h' +minute + ' à ' + heureFin
    }



    /**
     * Fonction qui permet de calculer l'heure de fin d'un défi
     * @param {String} heure 
     * @param {String} minutes 
     * @param {String} duree 
     */
    calculHeureFin(heure,minutes, duree){
    
        var heure = parseInt(heure) + Math.trunc(duree)

        var minutes =    parseInt(minutes) +  (duree -Math.trunc(duree)) * 60
        if(minutes >= 60) {
            heure ++
            minutes -= 60
        }
        if(minutes.toString().length == 1) {
            minutes = '0'+ minutes.toString()
        }
        return heure + 'h' + minutes
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
     * Fonction qui permet d'enregister la participation dans la db. 
     * On enregistre l'id de l'équipe dans le champ equipeDefiee. Si 
     * l'organisateur ne souhaite pas jouer contre cette équipe il faudra 
     * juste la suppr. On ajoute de plus l'id du joueur dans la liste des 
     * joueurs de l'équipe défiée.
     */
    async saveParticipationInDb(idEquipe, nom) {
        
        var db = Database.initialisation()

        
        var defiRef = db.collection("Defis").doc(this.state.defi.id)
        await this.sendNotifsToCapitainesOrga(nom)
        this.storeNotifDefisReleve(idEquipe)
        defiRef.update({
            equipeDefiee : idEquipe,
            recherche : false,
            joueursEquipeDefiee : [this.userData.id],
            confirmesEquipeDefiee : [this.userData.id],
            participants : this.state.defi.participants.concat([this.userData.id]),
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
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
     * Fonction qui va permettre d'envoyer les notifications aux capitaines
     * de l'équipe organisatrice
     */
    async sendNotifsToCapitainesOrga(nom){
        var titre = "Nouvelle notif"
        var corps = "L'équipe " + nom + " souhaite relever le défi posté par ton équipe" + this.state.equipeOrganisatrice.nom
        for(var i = 0; i < this.state.equipeOrganisatrice.capitaines.length; i++) {
            var id = this.state.equipeOrganisatrice.capitaines[i]

            var cap = await Database.getDocumentData(id, "Joueurs")
            var tokens = []
            if(cap.tokens != undefined) tokens = cap.tokens
            for(var k = 0; k < tokens.length; k++) {
                await this.sendPushNotification(tokens[k], corps, titre)
            }
        }
    }



    /**
     * Fonction qui va permettre de sauvegarder les notifications dans la base de données.
     */
    async storeNotifDefisReleve(idEquipe) {

        var db = Database.initialisation()
        if(this.state.equipeOrganisatrice != undefined) {
            for(var i = 0 ; i < this.state.equipeOrganisatrice.capitaines.length ; i++) {

            
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        defi : this.state.defi.id,
                        emetteur :  LocalUser.data.id,
                        recepteur : this.state.equipeOrganisatrice.capitaines[i] ,
                        time : new Date(),
                        equipeEmettrice : idEquipe ,
                        type : Types_Notification.ACCEPTER_DEFI_RELEVE,
                        equipeReceptrice : this.state.equipeOrganisatrice.id,
                    }
                )
            } 
        }
    }

  

    //  =================================================================================


    /**
     * Fonction qui va permettre à l'utilisateur de relever le defi. Si il 
     * n'est pas capitaine alors il y aura une alerte, sinon on lui propose
     * avec quelle équipe il veut relever le défi. 
     */
    releverLeDefi() {
        this.setState({show_equipe : true})
        // Rechercher les équipes dont il est capitaine (à voir si limite le nbr de résultat)
        var equipesArray = []
        var db = Database.initialisation()

        var ref = db.collection("Equipes");
        console.log("in relever Defi !! ")
        // Query sur les partie
        var query = ref.where("capitaines", "array-contains", this.userData.id)
        query.get().then(async (results) => {
            var equipes = []
            console.log("docs length : ", results.docs.length)
            for(var i = 0; i < results.docs.length ; i++) {
                equipes.push(results.docs[i].data())
            }
            this.setState({equipes : equipes, show_equipe : true})

            console.log("after query")
        })
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
     * Fonction qui renvoie la liste des buteurs du défi et les mets dans les bon 
     * objets du state (buteursOrga ou buteurDefi)
     */
    async getButeurs() {
        var buteurOrga = []
        var buteurDefiee = []
        for(var i =0; i < this.state.defi.buteurs.length; i++) {
            if(this.state.defi.joueursEquipeOrga.includes(this.state.defi.buteurs[i].id)) {
                var j = await Database.getDocumentData(this.state.defi.buteurs[i].id, "Joueurs")
                // Ajout du nombre de but
                j.nbButs = this.state.defi.buteurs[i].nbButs
                buteurOrga.push(j)
            } else {

                var j = await Database.getDocumentData(this.state.defi.buteurs[i].id, "Joueurs")
                // Ajout du nombre de but
                j.nbButs = this.state.defi.buteurs[i].nbButs
                buteurDefiee.push(j)
            }
        }
        this.setState({buteurDefiee : buteurDefiee, buteurOrga : buteurOrga})
    }


    /**
     * Fonction qui permet de trouver les hommes du match de chaque équipe et
     * qui met à jour le state
     */
    async getHommeMatch() {
        console.log("in get homme match")
        var votesOrga = []
        var votesDefiee = []
        var nbVotantDefiee = 0
        var nbVotantOrga = 0
        //Trier les votes en fonction de l'équipe concernée 
        for(var i = 0 ; i < this.state.defi.votes.length ; i++) {
            if(this.state.defi.joueursEquipeOrga.includes(this.state.defi.votes[i].idVote)) {
                votesOrga.push(this.state.defi.votes[i].idVote)
                nbVotantOrga = nbVotantOrga +1
            } else {
                votesDefiee.push(this.state.defi.votes[i].idVote)
                nbVotantDefiee = nbVotantDefiee +1
            }
        }

        // Trouver les hommes du matchs des deux équipes
        var idOrga = this.maxOccurence(votesOrga)
        var hommeOgra = undefined

        if(idOrga != undefined) hommeOgra = await Database.getDocumentData(idOrga, "Joueurs")
        var idDefie = this.maxOccurence(votesDefiee)
        var hommeDefiee = undefined
        if(idDefie != undefined) hommeDefiee = await Database.getDocumentData(idDefie, "Joueurs")
        
        this.setState({hommeOgra : hommeOgra, hommeDefiee : hommeDefiee, nbVotantDefiee : nbVotantDefiee,nbVotantOrga : nbVotantOrga })
    }

  

    /**
     * Fonction qui renvoie l'objet ayant le maximul d'occurence d'un 
     * élément dans un array.
     */
    maxOccurence(array){
        if(array.length == 0)
            return undefined;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    /**
     * Fonction appelée après le click par l'utilisateur sur un de ses équipe, elle
     * va permettre de séléctionner l'équipe passée en param pour relever le défi.
     */
    chooseEquipe(equipe) {
        var defi = this.state.defi
        defi.equipeDefiee = equipe
        this.setState({equipeDefiee : equipe, show_equipe : false, defi: defi})

                        
    }


    async getCommentaire(partie){
        var liste = []
        console.log("in get commentaire", partie.commentaires)
        for(var i = 0 ; i <partie.commentaires.length; i++) {
            var id = partie.commentaires[i].id
            var txt = partie.commentaires[i].txt
            var j = await Database.getDocumentData(id,"Joueurs")
            var com = {
                id : id,
                photo : j.photo,
                pseudo : j.pseudo,
                txt : txt
            }
            liste.push(com)
        }  
        console.log(liste)
        this.setState({commentaires : liste}) 
    }

    /**
     * Fonction qui va permettre de se rendre sur la feuille de match du défi
     * si il est passé. La fonction va de plus sauvegarder la liste des joueurs
     * de l'équipe de l'utilisateur dands le state global
     */
    async goToFeuilleDefiPasse() {
        var joueurs = []
        var equipe = undefined
        var presents = []

        //if(this.state.equipeOrganisatrice.joueurs.includes(this.userData.id)) {
        if(this.state.defi.joueursEquipeOrga.includes(this.userData.id)){
            joueurs = this.state.defi.joueursEquipeOrga
            equipe = this.state.equipeOrganisatrice
            presents = this.state.defi.confirmesEquipeOrga
        } else if(this.state.equipeDefiee != undefined && this.state.defi.joueursEquipeDefiee.includes(this.userData.id)) {
            joueurs=  this.state.defi.joueursEquipeDefiee
            equipe = this.state.equipeDefiee
            presents = this.state.defi.confirmesEquipeDefiee
        }
        const action = { type: actions.STORE_LISTE_JOUEURS_DEFI, value: joueurs}
        this.props.dispatch(action)

        const actionDefi = { type: actions.STORE_ALL_DATA_DEFI, value: this.state.defi}
        this.props.dispatch(actionDefi)

        const actionEq = { type: actions.STORE_EQUIPE_USER, value: equipe}
        this.props.dispatch(actionEq)

        var joueurs = await  Database.getArrayDocumentData(joueurs, "Joueurs")
        const actionDataJ = { type: actions.STORE_DATA_JOUEURS_DEFI, value: joueurs}
        this.props.dispatch(actionDataJ)

        const actionPresent = {type : actions.STORE_JOUEURS_PRESENT, value : presents}
        this.props.dispatch(actionPresent)


        this.props.navigation.push("FeuilleDefiPasse", {
            defi : this.state.defi,
            equipeOrganisatrice : this.state.equipeOrganisatrice,
            equipeDefiee : this.state.equipeDefiee
        })    
    }
    


        async saveCommentaire() {
            console.log("in save commentaire", this.state.currentCommentaire)
            if(this.state.currentCommentaire.length > 0) {
                console.log("in if")
                var com = {id : LocalUser.data.id, txt : this.state.currentCommentaire}
                var db = Database.initialisation()
                db.collection("Defis").doc(this.state.defi.id).update({
                    commentaires : firebase.firestore.FieldValue.arrayUnion(com)
                })
                var liste = []
                for(var i =0; i < this.state.commentaires.length; i++) {
                    liste.push(this.state.commentaires[i])
                }
                var obj = {
                    id : LocalUser.data.id,
                    photo : LocalUser.data.photo,
                    pseudo : LocalUser.data.pseudo,
                    txt : this.state.currentCommentaire
                }
                liste.push(obj)
                console.log(liste)
                this.setState({commentaires : liste, currentCommentaire : ""})
            }
        }
        
        
    /**
     * Fonction qui renvoie les données du joueurs à partir de son id. 
     * On ne va pas chercher les données depuis la DB car on les a deja.
     * @param {String} id 
     */
    findPlayerFromId(id) {
        for(var i = 0; i < this.state.joueursData.length; i++) {
            if(this.state.joueursData[i].id == id) {
                return this.state.joueursData[i]
            }
        }
        return undefined
    }

    textPrixDefi() {
        if(this.state.defi != undefined) {
            if(this.state.defi.prix_par_equipe == 0) {
                return "Gratuit"
            }  else {
                return  this.state.defi.prix_par_equipe + " € (à regler sur place)"
            }
        } else {
            return " "
        }
    }


    //=====================================================================
    //=========================== FONCTIONS SI DEFI PASSEE ==============
    //=====================================================================


    /**
     * Fonction qui permet d'afficher un item représentant un buteur de l'équipe 
     * organisatrice
     */
    _renderItemButeurOrga = ({item}) => {
        return(
            <View style = {{flexDirection : 'row', justifyContent : "center",alignsItems : 'center'}}>
                <Joueur_Pseudo_Score
                    pseudo = {item.pseudo} 
                    score = {item.score}
                    photo = {item.photo}
                    id = {item.id}
                    tailleImageJoueur = {wp('12%')}
                    data = {item}

                />
                <View style  = {{alignItems:'center', justifyContent:'center'}}>
                    <Text style = {{justifyContent : "center"}}>{item.nbButs}</Text>
                </View>
            </View>
        )

    }

    /**
     * Fonction qui permet d'afficher un item représentant un buteur de l'équipe 
     * défiee
     */
    _renderItemButeurDefiee = ({item}) => {
        return(
            <View style = {{flexDirection : 'row', justifyContent : "center",alignsItems : 'center'}}>
                <View style  = {{alignItems:'center', justifyContent:'center'}}>
                    <Text style = {{justifyContent : "center"}}>{item.nbButs}</Text>
                </View>

                <Joueur_Pseudo_Score
                    pseudo = {item.pseudo} 
                    score = {item.score}
                    photo = {item.photo}
                    id = {item.id}
                    tailleImageJoueur = {wp('12%')}
                    data = {item}
                />
    
            </View>
        )

    }

    
    /**
     * Fonction qui permet d'afficher les butteurs si la partie est passée et 
     * si la feuille de match a été complétée.
     */
    _renderListButeurs() {
        var date = new Date( this.state.defi.jour.seconds * 1000)
        if(date < new Date()) {
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

                    // Si les buteurs ont été renseignés
                if(this.state.defi.buteurs.length > 0) {
                    return(
                        <View>
                            <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Buteurs : </Text>
                            
                            {/* View contenant les buteurs*/}
                            <View style = {{flexDirection : 'row', justifyContent : "space-between"}}>

                                {/* View qui contient les buteurs de l'équipe organisatrice */}
                                <View>
                                    <FlatList
                                        data = {this.state.buteurOrga}
                                        renderItem = {this._renderItemButeurOrga}
                                        keyExtractor={(item) => item.id}
                                    />
                                </View>
                                {/* Séaparation */}
                                <View style = {{width : wp('1%'), backgroundColor : 'black'}}/>

                                {/* View qui contient les buteurs de l'équipe Défiée */}
                                <View>
                                    <FlatList
                                        data = {this.state.buteurDefiee}
                                        renderItem = {this._renderItemButeurDefiee}
                                        keyExtractor={(item) => item.id}
                                    />
                                </View>
                            </View>
                        </View>
                    ) 

                } else {
                    return(
                        <View>
                            <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Buteurs : Non renseigné </Text>
                            
                        </View>
                    ) 
                }
            }
           
        } else {
            return (
                <View>
                </View>
            )
        }
    }

        
    /**
     * Item de la forme  :
     *      {
     *          photo : String
     *          id : Stirng
     *          pseudo : String 
     *          txt : String
     *      }
     */
    _renderItemCommentaire= ({item}) => {

        return(
            <View style=  {{flexDirection : "row", justifyContent  : "center"  , alignContent : "center",marginBottom : hp('1.5%')}}>
                <Image
                    source  = {{uri : item.photo}}
                    style = {{ alignSelf : "center",width : wp('10%'), height : wp('10%'), borderRadius : wp('5%'), marginRight : wp('3%')}} />

                <Text style = {{width : wp('75%'), alignSelf : "center"}}>{item.txt} </Text>

            </View>
        )
    }




    /**
     * Fonction qui affiche un seul homme du match
     * @param {*} joueur
     */
    _renderHomme(joueur) {

        if(joueur != undefined) {
            // Trouver le nbr de vote pour le joueur
            var nbVote = 0
            var votantEq = 0
            console.log("before nbVote calcul")
            for(var i = 0; i < this.state.defi.votes.length; i++) {
                if(this.state.defi.votes[i].idVote == joueur.id) {
                    nbVote  = nbVote +1
                }
            }
            if(this.state.defi.joueursEquipeDefiee.includes(joueur.id)) {
                votantEq = this.state.nbVotantDefiee
            } else {
                votantEq = this.state.nbVotantOrga
            }
            console.log(nbVote)

            return(
                <View>
                    <Joueur_Pseudo_Score
                        id = {joueur.id}
                        pseudo = {joueur.pseudo}
                        photo = {joueur.photo}
                        score = {joueur.score}
                        data = {joueur}

                    />

                    <Text>{nbVote} voix sur {votantEq} votant</Text>
                </View>
            )

        } else {
            return(
                <Text>Pas encore de votes</Text>
            )
        }
    }


    /**
     * Fonction qui permet d'afficher l'homme du match de chaque équipes
     */
    _renderHommesMatch() {
        var date = new Date( this.state.defi.jour.seconds * 1000)
        if(date < new Date()) {
            return(
                <View>
                    <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Homme du match : </Text>

                    <View style = {{flexDirection : 'row', justifyContent : "space-between"}}>
                        {this._renderHomme(this.state.hommeOgra)}
                        {this._renderHomme(this.state.hommeDefiee)}
                    </View>
                </View>
                
            )
        }
    }

    /* =======================================================================================
    =================================== FONCTIONS RENDER =====================================
    ==========================================================================================
    */



    _renderTxtMillieu(){
        console.log("in render txtMILLIEU")
        if(new Date(this.state.defi.jour.seconds * 1000) < new Date) {
            if(this.state.defi.scoreConfirme) {
                return(
                    <Text style = {styles.txtBut}>{this.state.defi.butsEquipeOrganisatrice} - {this.state.defi.butsEquipeDefiee}</Text>
                )
            } else if(this.state.defi.scoreRenseigne) {
                return(
                    <Text style = {styles.txtButNonConfirme}>{this.state.defi.butsEquipeOrganisatrice} - {this.state.defi.butsEquipeDefiee}</Text>
                )
            } else {
                return (
                    <Text style = {styles.txtBut}>{"score non \n renseigné"}</Text>
                )
            }
                
        } else  {
            if(this.state.defi.equipeDefiee == undefined) {
                return(
                    <Text style = {styles.textRechercheEquipe}>Cherche une équipe à défier</Text>
                )
            } else {
                return(
                    <Image
                        source = {require('../../../../res/vs.png')}
                        style = {styles.vs}
                        />
                )
            }
        }
    }


    /**
     * Permet d'afficher l'équipe défiée
     */
    _renderEquipeDefie(){
        console.log("in render equipe defiee")

        if(this.state.equipeDefiee != undefined) {
            return(
                <Animated.View
                    style = {[this.equipe2Animation.getLayout(), {alignSelf : "flex-end"}]}>

                    <Equipe_Nom_Score
                        photo = {this.state.equipeDefiee.photo}
                        score = {this.state.equipeDefiee.score}
                        nom = {this.state.equipeDefiee.nom}
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


    /**
     * Permet d'afficher le bouton "relever le défi" ou feuille de match;
     * attention pas les même onPress en fonction des cas ?
     */
    _renderBtn(){

        var estPasse = (new Date(this.state.defi.jour.seconds * 1000) < new Date())
        var cap1 =  this.state.equipeOrganisatrice.capitaines.includes(this.userData.id)
        var cap2 = false 
        if( this.state.equipeDefiee != undefined) cap2 =  this.state.equipeDefiee.capitaines.includes(this.userData.id)

        console.log("NON CAP1 et this.state.equipeDefiee == undefined",this.state.equipeDefiee == undefined && (!cap1) )
        var participe1 =this.state.defi.joueursEquipeOrga.includes(this.userData.id)
        var participe2  = this.state.defi.joueursEquipeDefiee.includes(this.userData.id)
        /*if(this.state.defi.defis_refuse) {
            return(
                <Text style = {{color : 'red'}}> Défi refusé</Text>
            )
        }*/


        // Si le défi est passé
        if(estPasse) {
            return(
                <TouchableOpacity
                    style = {styles.btn_feuille_de_match} 
                    onPress = {() => this.goToFeuilleDefiPasse()} >
                    <Text>Feuille de match</Text>
                </TouchableOpacity>
            
            )

        
        // Si il est capitaine de l'équipe defiee et le défi à été validé
        } else if(cap2 && this.state.defi.defis_valide) {
            return(
                <TouchableOpacity
                    style = {styles.btn_feuille_de_match}
                    onPress = {() => this.props.navigation.push("FeuilleDefiAVenir",
                        {
                            equipeDefiee : this.state.equipeDefiee,
                            equipeOrganisatrice : this.state.equipeOrganisatrice,
                            defi : this.state.defi
                        })}>
                    <Text>Feuille de match</Text>
                </TouchableOpacity>
            )


        // Si c'est le capitaine de l'équipe organisatrice ou si il participe
        }else if(cap1 || participe1) {
            return(
                <TouchableOpacity
                    style = {styles.btn_feuille_de_match}
                    onPress = {() => this.props.navigation.push("FeuilleDefiAVenir",
                        {
                            equipeDefiee : this.state.equipeDefiee,
                            equipeOrganisatrice : this.state.equipeOrganisatrice,
                            defi : this.state.defi
                        })}
                    >
                    <Text>Feuille de match</Text>
                </TouchableOpacity>
            )
        
        // Si il joue avecl'équipe défiée mais que le défi a pas été validé
        } else if(participe2 && ! this.state.defi.defis_valide) {
            return(
                <View>
                    <Text>Attente de validation du défi</Text>
                </View>
            )
        
        // Si pas encore d'équipe défiée
        } else if(this.state.equipeDefiee == undefined && (!cap1)) {
            return(
                <TouchableOpacity
                    style = {styles.btn_relever_defi}
                    onPress = {()=> this.releverLeDefi()}>

                    <Text>Relever le defi</Text>
                </TouchableOpacity>
            )
        
        // Joueur pas impliqué dans le défi
        } else {
            return(
                <View>
                    <Text></Text>
                </View>
            )
        }
    }


    


    /**
     * Va permettre de render les équipes dont l'utilisateur est capitaine
     */
    _renderItemEquipe =({item}) => {  
        if(this.state.show_equipe) {
            return(

                <TouchableOpacity 
                    onPress = {() => {
                        if( parseFloat(this.state.defi.format.split(' ')[0]) > item.nbJoueurs) {
                            this.chooseEquipe(item)
                            this.saveParticipationInDb(item.id,item.nom)
                            
                            Alert.alert(
                                ' ',
                                "Ta demande de relever le défi avec ton équipe " +
                                item.nom + " a bien été envoyée à l’équipe " + this.state.equipeOrganisatrice.nom + 
                                '\n' + '\n'
                                + "Tu seras informé dès que l’équipe " + this.state.equipeOrganisatrice.nom + " aura accepté ou refusé"
                            )
                        } else {
                            Alert.alert(" ",
                            "Tu dois séléctionner une équipe avec au moins " + parseFloat(this.state.defi.format.split(' ')[0]) + " joueurs")
                        }
                       
                    }}>
                   <View style = {{flexDirection : "row"}}>
                        <Image
                            source = {{uri : item.photo}}
                            style = {styles.photoEquipe}
                        /> 

                        {/* View contenant le pseudo est le score*/}
                        <View style = {{justifyContent : "center"}}>
                            <Text>{item.nom}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item.score}
                                starSize={hp('2.2%')}
                                fullStarColor='#F8CE08'
                                emptyStarColor='#B1ACAC'
                            />

                            
                        </View> 
                   </View>
                </TouchableOpacity>
                
            )
        }

    }


    /**
     * Fonction qui permet d'afficher la liste des équipes ou message "d'erreur" si la
     * liste est vide 
     */
    _show_equipes_cap() {
        if(this.state.equipes.length != 0) {
            <FlatList
                style={{alignSelf : "center"}}
                data={this.state.equipes}
                
                renderItem={this._renderItemEquipe}
            />  
        }  else {
            return(
                <Text style={{alignSelf : "center"}}>
                   {"Seuls les capitaines d’une équipe \n peuvent relever les défis"}
                </Text>
            )
        }
    }

    /**
     * Fonction qui permet d'afficher un cadre montrant les équipes dont l'utilisateur est 
     * capitaine.
     */
    _renderListEquipe() {
        if(this.state.show_equipe) {
            return(
                <View style = {styles.containerListEquipe}>
                    <Text>
                        Tu souhaites relever le défi avec quelle équipe
                    </Text>

                    <FlatList
                            style={{alignSelf : "center"}}
                            data={this.state.equipes}
                            
                            renderItem={this._renderItemEquipe}
                        />
                    <TouchableOpacity
                        onPress = {() => this.setState({show_equipe : false})} >
                        <Text style = {{fontWeight : "bold"}}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    
    /**
     * Pour accepeter ou non une équipe qui relève le défi, pour le moment 
     * juste du texte ! Ne pas suppr !!
     */
    renderAcepterEquipe() {
        /*console.log("in renderAZccepterZEquoe")
        console.log(this.state.equipeDefiee != undefined &&  !this.state.defi.defis_valide)
        if(this.state.equipeDefiee != undefined &&  !this.state.defi.defis_valide) {
            return(
                <View>
                    <Text style = {{color : 'red'}}>L'équipe {this.state.equipeDefiee.nom} souhaite relever </Text>
                    <Text style = {{color : 'red'}}>le défi posté</Text>
                    <View style = {{flexDirection : 'row'}}>
                        <TouchableOpacity>
                            <Text style = {{color : 'red'}}>Oui</Text>
                        </TouchableOpacity>
                        <Text style = {{color : 'red'}}> / </Text>
                        <TouchableOpacity>
                            <Text style = {{color : 'red'}}>Non</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }*/
    }
    


    displayRender() {

        var seconds =this.state.defi.jour.seconds
        var date = this.buildDateString(new Date(seconds* 1000))
        return(
            <ScrollView>
                <View style = {{marginTop : hp('0.5%')}}>


                    <View>
                        {/* Information sur le defi */}
                        <Text style = {styles.infoDefis}
                            onPress={async () => {
                                if (this.state.organisateur.id != undefined) {
                                    var equipes = await Database.getArrayDocumentData(this.state.organisateur.equipes, "Equipes");
                                    this.props.navigation.navigate("ProfilJoueur", {id: this.state.organisateur.id, joueur: this.state.organisateur, equipes: equipes});
                                }
                            }}
                            > Defi {this.state.defi.format} par {this.state.organisateur.pseudo}</Text>
                        <Text style = {styles.separateur}>_____________________________________</Text>
                        <Text style = {styles.infoDefis}> {date}</Text>
                        <Text style = {styles.separateur}>_____________________________________</Text>
                    </View>

                    {/* View contenant l'icon terrain et son nom*/}
                    <TouchableOpacity style = {{flexDirection : 'row', marginTop : hp('2%'), marginLeft : wp('8%')}}
                        onPress={() => {
                            this.props.navigation.push("ProfilTerrain", {id: this.state.defi.terrain, header: this.state.InsNom})
                        }}
                        >
                        <Image
                            source = {require('../../../../res/terrain1.jpg')}
                            style = {styles.photo_terrain}
                        />
                        {/* InsNom et EquNom du terrain */}
                        <View style = {{width : wp('70%'), justifyContent:'center'}}>
                            <Text style = {styles.nomTerrains}>{this.state.InsNom}</Text>
                            <Text style = {styles.nomTerrains}>{this.state.N_Voie == " " ? "" : this.state.N_Voie+" "}{this.state.Voie == "0" ? "adresse inconnue" : this.state.Voie}</Text>
                            <Text style = {styles.nomTerrains}>{this.state.CodePostal} {this.state.Ville} - {this.state.terrainDistance} km</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Bloc contenant les équipes */}
                    <View style = {styles.containerEquipe}>
                        <Animated.View
                            style = {this.equipe1Animation.getLayout()}
                            >
                            <Equipe_Nom_Score
                                photo = {this.state.equipeOrganisatrice.photo}
                                score = {this.state.equipeOrganisatrice.score}
                                nom = {this.state.equipeOrganisatrice.nom}
                                id = {this.state.equipeOrganisatrice.id}
                                
                            />
                        </Animated.View>
                        

                    {this. _renderTxtMillieu()}

                    {this._renderEquipeDefie()}

                    {this.renderAcepterEquipe()}
                    {this._renderBtn()}

                    </View>

                    <Text style = {{marginTop : hp('1%'), alignSelf : "center"}}>
                        Prix par équipe : {this.textPrixDefi()}
                    </Text>


                    {this._renderListButeurs()}
                    {this._renderHommesMatch()}
                    
                    <View style = {{alignSelf : "center", width : wp('85%'), marginBottom : hp('2%')}}>
                        <Text style = {styles.txt_message_chauffe}>{this.state.defi.message_chauffe}</Text>

                    </View>

                    {this._renderListEquipe()}
                    

                      <FlatList

                        data = {this.state.commentaires}
                        renderItem ={this._renderItemCommentaire}

                        />

                        <TextInput
                            placeholder = {"commentaire"}
                            value = {this.state.currentCommentaire}
                            style = {{marginLeft : wp('3%'),width : wp('75%') , borderBottomWidth : 1, marginBottom : hp('70%')}}
                            onChangeText={(t) =>  this.setState({currentCommentaire : t})}
                            onSubmitEditing = {() =>  this.saveCommentaire()}/>



                    
                </View>
            </ScrollView>
        )

        
           
    }

    render() {
        return(
            <View style = {{marginTop : hp('4%')}}>
                {this.displayRender()}
            </View>
        )
    }
}

const styles = {
    containerEquipe : {
        borderWidth : 1,
        borderRadius : 5,
        marginTop : wp('5%'), 
        marginLeft : wp('3%'),
        marginRight : wp('3%'), 
        paddingTop : hp('2%'), 
        paddingBottom : hp('2%'),
        paddingLeft : wp('3%')
    },
    rating: {
        width: 40,
    },

    nomEquipe : {
        fontSize : RF(2.3)
    },

    textRechercheEquipe : {
       alignSelf : "center"
    },

    btnRejoindre : {
        alignSelf : "center",
        paddingHorizontal : wp('2%'),
        paddingVertical : hp('2%'),
        borderRadius : 15,
        borderWidth  : 1
    },
    
    txt_message_chauffe : {
        fontSize : RF(2.7),
        fontStyle : 'italic',
        marginTop : hp('5%'),
        alignSelf : "center"
    },
    separateur : {
        alignSelf : "center",
        marginBottom : hp('2%')
    },
    photo_terrain : {
        //marginLeft : wp('3%'),
        marginRight : wp('3%'),
        width : wp('16%'), 
        height : wp('16¨%') 
    },

    photoEquipe : {
        width : wp('18%'),
        height :wp('18%'),
        marginLeft : wp('2%'),
        marginRight : wp('2%'),
        marginTop : hp('1%'),
        marginBottom : hp('1%')
    },
    infoDefis : {
        alignSelf : "center",
        fontSize : RF(2.2)
    },

    nomTerrains : {
        fontSize : RF(2.2)
    },

    vs : {
        height : wp('7%'),
        width : wp('8.12%'),
        alignSelf : "center"
    },

    circleEquipeVide : {
        width : wp('16%'), 
        height : wp('16%'), 
        borderRadius : wp('8%'),
        marginRight : wp('3%'),
        borderWidth :1, 
        alignSelf : "flex-end"
    },
    btn_feuille_de_match : {
        alignSelf : "center",
        paddingHorizontal : wp('16%'),
        paddingVertical : hp('2%'),
        borderRadius : 15,
        borderWidth  : 1,
        backgroundColor : Color.gold,
        marginTop : hp('1%')
    },

    btn_relever_defi : {
        alignSelf : "center",
        paddingHorizontal : wp('16%'),
        paddingVertical : hp('2%'),
        borderRadius : 15,
        borderWidth  : 1,
        marginTop : hp('1%')
    },

    containerListEquipe : {
        position : "absolute", 
        backgroundColor : "white", 
        top :100,
        width :wp('90%'), 
        alignItems :"center" ,
        paddingTop : hp('3%'),
        paddingBottom : hp('3%'),
        alignSelf : "center",
        borderWidth : 1,
        borderRadius : 5
    },
    txtBut : {
        fontSize : RF(2.6),
        fontWeight : "bold",
        alignSelf :"center"
    },

    txtButNonConfirme : {
        fontSize : RF(2.6),
        fontStyle : "italic",
        alignSelf :"center"
    },

}

  
  
export default connect() (Fiche_Defi_Rejoindre)
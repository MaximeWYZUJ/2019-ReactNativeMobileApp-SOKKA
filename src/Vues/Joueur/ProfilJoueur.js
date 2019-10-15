import React from 'react'
import { StyleSheet, Text,Image, ScrollView, Button, TouchableOpacity, View, FlatList,RefreshControl, Alert } from 'react-native'
import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Distance from '../../Helpers/Distance'
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import { Constants, Location,Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Type_Defis from '../../Vues/Jouer/Type_Defis'
import Types_Notification from '../../Helpers/Notifications/Types_Notification'
import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie from '../../Components/Defis/Item_Partie'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'
import firebase from 'firebase'
import '@firebase/firestore'
import Icon_Message from '../../Components/Conversation/Icon_Message';
import Villes from '../../Components/Creation/villes.json'
import NormalizeString from '../../Helpers/NormalizeString'
import Photo_Equipe from '../../Components/Profil_Equipe/Photo_Equipe'
import {AsyncStorage} from 'react-native';
import DatesHelpers from '../../Helpers/DatesHelpers';
import { NavigationActions, StackActions } from 'react-navigation';


class ProfilJoueur extends React.Component {

    constructor(props) {
        super(props)
        console.log("in constructeur profil")
        this.id = this.props.navigation.getParam('id', LocalUser.data.id)
        this.monProfil= Database.isUser(this.id);
        this.equipes = this.props.navigation.getParam('equipes', [])
        this.joueur = this.props.navigation.getParam('joueur', LocalUser.data)
        this.goToFirstScreen  = this.goToFirstScreen.bind(this)

        if (this.joueur.AKA != undefined && this.joueur.AKA != "") {
            this.AKA = this.joueur.AKA;
        } else {
            if (this.monProfil) {
                this.AKA = "Tu n'as pas de AKA ! Pense à compléter ton profil dans les réglages...";
            } else {
                this.AKA = "";
            }
        }

        // Si On a pas encore sauvegardé les données des équipes 
        if(this.monProfil) {
            if(LocalUser.dataEquipesUser.length  == 0) {
                for(var i = 0 ; i < this.equipes.length; i++) {
                    console.log(this.equipes[i].nom)
                }
                LocalUser.dataEquipesUser =  this.equipes
            } else {
                this.equipes = LocalUser.dataEquipesUser
            }
        }
        
        this.state = {
            allDefis : [],
            refreshing: false,
            displayFullPicture: false,
			show_equipe : false,
            equipesCap : [],
            isLoading : false,
            nbMessagesNonLu : this.joueur.nbMessagesNonLu,
        }

        if (this.joueur.sexe === "masculin") {
            this.sexeIcon = require('app/res/masculine.png');
        } else {
            this.sexeIcon = require('app/res/femenine.png');
        }
    }



    componentDidMount() {
        this.getAllDefisAndPartie()
      
    }





       

    static navigationOptions = ({ navigation }) => {
        if(! navigation.getParam("retour_arriere_interdit",false)) {
            var joueur  = navigation.getParam('joueur', undefined)
            var titre = ""
            if (joueur == undefined) {
                titre = LocalUser.data.pseudo
            } else {
                titre = joueur.pseudo
            }
            return {
                title: titre,

                tabBarOnPress({jumpToIndex, scene}) {
                    jumpToIndex(scene.index);
                },
                headerRight: (
    
                    <Icon_Message
                        id = {navigation.getParam('joueur', ' ').id}
                        nbMessagesNonLu = { navigation.getParam('joueur', ' ').nbMessagesNonLu}/>
                ),
            }
            
        } else {
            const {state} = navigation;
            var joueur  = navigation.getParam('joueur', undefined)
            var titre = ""
            if (joueur == undefined) {
                titre = LocalUser.data.pseudo
            } else {
                titre = joueur.pseudo
            }
            return { 
                title:titre,
                
                tabBarOnPress({jumpToIndex, scene}) {
                    jumpToIndex(scene.index);
                },
                headerRight: (
                        <Icon_Message
                        id = {navigation.getParam('joueur', ' ').id}
                        nbMessagesNonLu = { navigation.getParam('joueur', ' ').nbMessagesNonLu}/>
                ),
                headerLeft: (<View></View>),
            };
        }

    }

    _displayReglages() {
        if (this.monProfil) {
            return;/* (
                <TouchableOpacity
                    style={{flex: 1, alignItems: 'center'}}
                    onPress={() => this.props.navigation.push('ProfilJoueurReglagesScreen', {id: this.id, joueur: this.joueur, equipes: this.equipes, header: this.joueur.nom})}>
                    <Image
                        style={styles.image_param}
                        source = {require('app/res/icon_reglage.png')}/>
                </TouchableOpacity>
            )*/
        } else {
            return(
                <TouchableOpacity
                onPress = {() => this.buildAlertIntegerEquipe()}>
                    
                    <Image
                        source = {require('app/res/icon_plus.png')}
                        style = {styles.icon_plus} />
                </TouchableOpacity>
            )
		}
    }

    goToFirstScreen() {
       this.props.navigation.navigate("first", {deconexion : true})  
    }

    deco() {
    
        this.deconexion()
    }

    async deconexion() {
        this.setState({isLoading : true})
     
        var token = await this.registerForPushNotifications()
        var db = Database.initialisation()
        db.collection("Login").doc(token).delete().catch(function(error) {
            console.error("Error removing document: ", error);
        });

        var newTokens = []
        if(LocalUser.data.tokens != undefined) {        
            // Supprimer le token de la liste
            var tokens = LocalUser.data.tokens 
            for(var i =0; i < tokens.length; i ++) {
                if(tokens[i].localeCompare(token) != 0) {
                    newTokens.push(tokens[i])
                }
            }
        }
        
        console.log("after supr token in array")
        db.collection("Joueurs").doc(this.id).update({
            tokens : newTokens
        }).then(() => {
            console.log("after suppr token in db")
            AsyncStorage.clear()
            firebase.auth().signOut().then(() => {
                // Sign-out successful.
                this.setState({isLoading : false})
                this.props.navigation.navigate("first", {deconexion : true})  
    
              }).catch(function(error) {
                  console.log(error)
              });
        })
       
        
       

    }




    async registerForPushNotifications() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (status !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          if (status !== 'granted') {
            return;
          }
        }
        var token = await Notifications.getExpoPushTokenAsync();
        //this.subscription = Notifications.addListener(this.handleNotification);
    
        return (token)
    }

    renderItemEquipe(id, data) {
        return (
            <TouchableOpacity
                onPress = {() => this.props.navigation.push("Profil_Equipe", {equipeId : id})}>


                <Photo_Equipe
                    urlPhoto = {data.photo}
                    />
                
                {/*<Image
                    style={{width: wp('18%'), height: wp('18%'), marginLeft : wp('2%'), marginRight : wp('2%'), backgroundColor: 'grey'}}
                    source = {{
                        uri : data.photo,
                    }}/>*/}
            </TouchableOpacity>
        )
    }

     /**
     * Fonction qui permet de renvoyer une liste  contenant les informations
     * utiles pour l'affichage des defis de l'équipe;
     * @param {*} defis
     */
    getDefis(defis) {

        var liste = [];
        for(var i= 0; i < defis.length; i++){
            j = {
                id : defis[i].id,
                format : defis[i].format,
                photo1 : defis[i].photo1,
                photo2 : defis[i].photo2,
                nom1 : defis[i].nom1,
                nom2 : defis[i].nom2,
                date : defis[i].date


            }
            liste.push(j)
        }

        return(liste)
    }


    //================================================================================
    //=================================== POUR LES DEFIS =============================
    //================================================================================


    /** Fonction qui va permettre de trouver tous les défis et parties à venir auxquels 
     * participes l'utilisateur
     */
    getAllDefisAndPartie() {
        var db = Database.initialisation()
        var allDefis = []
        var index = 1
        var now = new Date()

        var ref = db.collection("Defis");
        var query = ref.where("joueursConcernes", "array-contains", this.id).where("dateParse", ">=", Date.parse(now)).orderBy("dateParse")
        query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                var defi = results.docs[i].data()
                defi.jour.seconds = defi.jour.seconds -7200 
                allDefis.push(defi)

            }
            this.setState({allDefis : allDefis})

        })
        // On regarde si l'utilisateur participe à un defi
       /* query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                var defi = results.docs[i].data()
                defi.jour.seconds = defi.jour.seconds -7200 
                allDefis.push(defi)

            }
            this.setState({allDefis : allDefis})


            // Itérer sur toutes les équipes dont il est capitaine
            for(var i = 0 ; i < this.equipes.length ; i++) {
                var equipe = this.equipes[i]
                
                // Vérifier si il est capitaine
                if(equipe.capitaines.includes(this.id)) {

                    // Regarder si cette équipe organise un défi
                    var queryEqOrga = ref.where("equipeOrganisatrice", "==", equipe.id)
                                        .where("dateParse", ">=",Date.parse(now))
                    queryEqOrga.get().then(async (resultsDefiOrga) => {
                        for(var i = 0; i < resultsDefiOrga.docs.length ; i++) {
                            var defi =resultsDefiOrga.docs[i].data()
                            defi.jour.seconds = defi.jour.seconds -7200 
                            if(! this.allreaddyDownloadDefi(allDefis, defi )) {
                                allDefis.push(defi)
                            }
                            
                        }
                    })

                    // Regarder si cette équipe est defiée 
                    var queryEqDefiee = ref.where("equipeDefiee", "==", equipe.id)
                                        .where("dateParse", ">=",Date.parse(now))
                    queryEqDefiee.get().then(async (resultsDefiDefiee) => {

                        for(var i = 0; i < resultsDefiDefiee.docs.length ; i++) {
                            var defi =resultsDefiDefiee.docs[i].data()
                            defi.jour.seconds = defi.jour.seconds -7200 
                            if(! this.allreaddyDownloadDefi(allDefis,defi )) { 
                                allDefis.push(defi)
                            }
                        }
                    })

                    this.setState({allDefis : allDefis})
                }
            }

            
        }).catch(function(error) {
              console.log("Error getting documents partie:", error);
        }); */  
    }


    /**
     * Fonction qui renvoie true si le défi à déja été ajouté à la liste
     * des défi ou partie téléchargés.
     */
    allreaddyDownloadDefi(liste, defi) {
        for(var i = 0; i < liste.length; i++) {
            if(liste[i].id == defi.id)  {
                return true
            }
        }
        return false
    }

    // ===============================================================================
    // ===================== METHODES POUR LE RESEAU =================================
    // ===============================================================================

    async gotoReseau() {
        let reseau = await Database.getArrayDocumentData(this.joueur.reseau, 'Joueurs');

        this.props.navigation.push('ProfilJoueurMonReseauScreen', {joueur: this.joueur, reseau: reseau, header: this.joueur.pseudo, monProfil: this.monProfil});
    }


    
    // ==============================================================================
    // ============================ NOTIFICATIONS ===================================
    // ==============================================================================
    
    

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
     * Fonction qui va envoyer la notification d'ajout de réseau au joueur concerné
     */
    async sendNotifAjoutReseau() {
        var titre = "Nouvelle notif"
        var corps = LocalUser.data.pseudo + " t'a ajouté à son réseau"

        var tokens = []
        if(this.joueur.tokens != undefined) tokens = this.joueur.tokens
        for(var i = 0; i < tokens.length; i++) {
           await  this.sendPushNotification(tokens[i],titre,corps)
        }
    }

    /**
     * Fonction qui va envoyer la notification puis la  sauvegarder
     * dans la base de données.
     */
    async storeNotifAjoutInDb() {
        await this.sendNotifAjoutReseau()
        var db = Database.initialisation()
        db.collection("Notifs").add({
            emetteur : LocalUser.data.id,
            recepteur : this.joueur.id,
            type : Types_Notification.AJOUT_RESEAU,
            time : new Date(),
            dateParse : Date.parse(new Date())
        })
    }
	
	
	async storeNotifIntegrerInDb(idEquipe) {
        var db = Database.initialisation()
        db.collection("Notifs").add({
            emetteur : LocalUser.data.id,
            recepteur : this.joueur.id,
            equipe : idEquipe,
            type : Types_Notification.INVITATION_REJOINDRE_EQUIPE,
            time : new Date(),
            dateParse : Date.parse(new Date())
        })
    }


    async sendNotifIntegrerJoueur(equipeNom) {
        var titre = "Nouvelle Notif"
        var corps = "Le capitaine " + LocalUser.data.pseudo + " de l'équipe " + equipeNom
        + " souhaite t'intégrer dans son équipe"
        var tokens = []
        if(this.joueur.tokens != undefined) tokens = this.joueur.tokens
        for(var i = 0; i < tokens.length; i++) {
            await this.sendPushNotification(tokens[i], titre,corps)
        }
    }


    // ===============================================================================
    // ================ METHODES POUR LES EQUIPES FAVORITES ==========================
    // ===============================================================================

    async gotoEquipesFav() {
        equipesFav = [];
        for (idEquipeFav of this.joueur.equipesFav) {
            equipeFavData = await Database.getDocumentData(idEquipeFav, 'Equipes');
            equipesFav.push(equipeFavData);
        }

        this.props.navigation.push('ProfilJoueurMesEquipesFavScreen', {joueur: this.joueur, equipesFav: equipesFav, header: this.joueur.pseudo, monProfil: this.monProfil});
    }


    // ===============================================================================
    // ================ METHODES POUR LES JOUEURS QUI LIKENT LE PROFIL ===============
    // ===============================================================================


    /**
     * Méthode qui va permettre de récuperer les joueurs qui 
     * likent le joueur et d'afficher la vue.
     */
    async gotoJoueursQuiLikent() { 
        this.props.navigation.push("JoueursQuiLikent", {joueurs: this.joueur.aiment, titre: this.joueur.pseudo});
    }

    /**
     * Méthode qui renvoie l'objet à afficher ou non, qui permet de liker
     * le profil d'un autre joueur et de l'ajouter à notre réseau
     */
    likeJoueur() {
        if (!Database.isUser(this.id)) {
            if (LocalUser.data.reseau.some(elmt => elmt === this.id)) {
                // On aime deja ce profil, donc on le retirera des likes
                return (
                    <TouchableOpacity
                            style={{marginLeft: 10, marginRight: 15, width: 30, height: 30}}
                            onPress={() => {
                                Database.changeSelfToOtherArray_Aiment(this.id, "Joueurs", false);
                                Database.changeOtherIdToSelfArray_Reseau(this.id, false);

                                this.joueur.aiment = this.joueur.aiment.filter(v => !(v === LocalUser.data.id));
                                this.forceUpdate();
                            }}>
                        <Image
                            style={{width: 30, height: 30}}
                            source = {require('app/res/icon_already_like.png')}/>
                    </TouchableOpacity>
                )
            } else {
                // On n'aime pas encore ce profil, donc on l'ajoutera aux likes
                return (
                    <TouchableOpacity
                            style={{marginLeft: 10, marginRight: 15, width: 30, height: 30}}
                            onPress={() => {
                                Database.changeSelfToOtherArray_Aiment(this.id, "Joueurs", true);
                                Database.changeOtherIdToSelfArray_Reseau(this.id, true);

                                this.joueur.aiment.push(LocalUser.data.id);
                                this.storeNotifAjoutInDb()
                                this.forceUpdate();
                            }}>
                        <Image
                            style={{width: 30, height: 30}}
                            source = {require('app/res/icon_like.png')}/>
                    </TouchableOpacity>
                )
            }
        } else {
            // C'est notre profil
            return (
                <View style={{marginLeft: 10, marginRight: 15, width: 30, height: 30}}>
                    <Image
                        style={{width: 30, height: 30}}
                        source = {require('app/res/icon_like_gray.png')}/>
                </View>
            )
        }
    }


    // ===============================================================================
    // ================ METHODES POUR LES TERRAINS FAVORIS ===========================
    // ===============================================================================



    /**
     * Méthode qui va permettre de récuperer les joueurs qui 
     * likent le terrains et d'afficher la vue.
     */
    async gotoTerrainsFav() {
        var latUser;
        var longUser;
        if (LocalUser.geolocalisation == undefined) {
            villeTab = Villes.filter(elmt => NormalizeString.normalize(elmt.Nom_commune) === NormalizeString.normalize(LocalUser.data.ville));
            var position = villeTab[0].coordonnees_gps;
            latUser = position.split(',')[0]
            longUser = position.split(', ')[1]
        } else {
            latUser = LocalUser.geolocalisation.latitude;
            longUser = LocalUser.geolocalisation.longitude;
        }

        var terrainsData = await Database.getArrayDocumentData(this.joueur.terrains, "Terrains");
        for (var i=0; i<terrainsData.length; i++) {
            var distance = Distance.calculDistance(latUser, longUser, terrainsData[i].Latitude, terrainsData[i].Longitude);
            terrainsData[i].distance = distance;
        }
        

        this.props.navigation.push("ProfilJoueurMesTerrainsFavScreen", {terrains : terrainsData, header : this.joueur.pseudo, monProfil: this.monProfil})
    }

    async getDocumentJoueur() {
        var j  = await Database.getDocumentData(this.id, "Joueurs")
        return j
    }


    /** Fonction appelée au moment où l'utilisateur pull to refresh */
    _onRefresh = async () => {
        this.setState({refreshing: true});
        var j = await this.getDocumentJoueur()
        this.joueur = j 
        
        this.getAllDefisAndPartie()
        //this.joueur = await Database.getDocumentData(this.joueur.id, "Joueurs")
		this.equipes = await Database.getArrayDocumentData(this.joueur.equipes, "Equipes")

        
       
        this.setState({refreshing: false});
       
        

    }
    

    // ==========================================================================

	async integrerJoueur(idEquipe, nomEquipe) {
        
        await this.sendNotifIntegrerJoueur(nomEquipe)
        await this.storeNotifIntegrerInDb(idEquipe)

        var db = Database.initialisation()
        this.setState({equipes : [], show_equipe : false})
        await db.collection("Equipes").doc(idEquipe).update({
            joueursAttentes : firebase.firestore.FieldValue.arrayUnion(this.joueur.id)
        }).then(console.log("ok update"))
        .catc(function(error) {
            console.log("ERROR UPDATE !! ", error)
        })
    }


    /**
     * Fonction qui va chercher dans la base de données toutes les équipes dont l'utilisateur 
     * est capitaine.
     */
    getEquipesUserCap() {
        this.setState({isLoading : true,show_equipe : true})
        var equipes = []
        var db = Database.initialisation()
        var ref = db.collection("Equipes");
        var query = ref.where("capitaines", "array-contains", LocalUser.data.id)

        query.get().then(async (results) => {
            // go through all results
            for(var i = 0; i < results.docs.length ; i++) {
                if( !results.docs[i].data().joueurs.includes(this.id)) {// && ! results.docs[i].data().joueursAttentes.includes(this.id)) {
                    equipes.push(results.docs[i].data());
                }
            }
            this.setState({equipes : equipes, isLoading : false})
        })
    }

     /**
     * Fonction qui affiche l'alerte pour confirmer ou non l'integration du joueur dans une équipe
     */
    async buildAlertIntegerEquipe(){

        var db = Database.initialisation();
        var query = await db.collection("Equipes").where("capitaines", "array-contains", LocalUser.data.id).get();

        if (query.docs.length == 0) {
            Alert.alert(
                '',
                "Pour intégrer " + this.joueur.pseudo + " dans une de tes équipes, tu dois être capitaine d'au moins une équipe"  ,
                [
                    {
                    text: "D'accord",
                    onPress: () => {},
                    style: 'cancel',
                    },
                ],
            )
        } else {
            var equipes = query.docs;
            var pasDansToutesLesEquipes = false;
            for (var i=0; i<equipes.length; i++) {
                if (!equipes[i].data().joueurs.includes(this.id)) {
                    pasDansToutesLesEquipes = true;
                }
            }

            if (pasDansToutesLesEquipes) {
                Alert.alert(
                    '',
                    "Tu souhaites intégrer " + this.joueur.pseudo + " dans une de tes équipes ?"  ,
                    [
                        {text: 'Confirmer', onPress: () => this.getEquipesUserCap()},
                        {
                        text: 'Annuler',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                        },
                    ],
                )
            } else {
                Alert.alert(
                    '',
                    this.joueur.pseudo + " fait déjà partie de tes équipes dont tu es capitaine"  ,
                    [
                        {
                        text: "D'accord",
                        onPress: () => {},
                        style: 'cancel',
                        },
                    ],
                )
            }
        }
    }
	
	
    /**
     * Fonction qui permet de construire la liste des participants à une partie, elle 
     * enlève de la liste les joueurs indisponibles
     * @param {*} item 
     */
    buildJoueurs(item) {
        var liste = []
        for(var i = 0; i < item.participants.length ; i++) {
            if(! item.indisponibles.includes(item.participants[i])) {
                liste.push(item.participants[i])
            }
        }
        return liste
    }
    displayDefis(){
        if(this.state.allDefis == undefined || this.state.allDefis.length == 0) {
            return (
                <View style={{alignItems: 'center'}}>
                    <Text>aucun défi / partie programmé</Text>
                </View>
            )
        }else {
            return(
                <FlatList style = {{marginLeft : wp('2%')}}
                        data={this.state.allDefis}
                        numColumns={1}
                        keyExtractor={(item) => item.id}
                        renderItem={this._renderItemDefi}
                />
            )
        }
    }

    _renderItemDefi =({item}) => {   
        if(item.type == Type_Defis.partie_entre_joueurs){
          
            return(
                <Item_Partie
                    id = {item.id}
                    format = {item.format}
                    jour = {new Date(item.jour.seconds *1000)} 
                    duree = {item.duree}
                    joueurs = {this.buildJoueurs(item)}
                    nbJoueursRecherche =  {item.nbJoueursRecherche}
                    terrain=  {item.terrain}
                    latitudeUser = {this.state.latitude}
                    longitudeUser = {this.state.longitude}
                    message_chauffe  = {item.message_chauffe}
                    dateString = {item.dateString}
                    partieData = {item}
                />
            )
        } else if(item.type == Type_Defis.defis_2_equipes) {
            return(
                <Item_Defi
                    format = {item.format}
                    jour = {new Date(item.jour.seconds * 1000)}
                    duree ={item.duree}
                    equipeOrganisatrice = {item.equipeOrganisatrice}
                    equipeDefiee = {item.equipeDefiee}
                    terrain = {item.terrain}
                    allDataDefi = {item}
                    dateString = {item.dateString}

                        
                />
            )
        } else {
            return(
                <Text>oooo</Text>
            )
        }  
    }

    renderBtnDeco() {
        if(this.monProfil) {
            return(
                <Button
                onPress={() => this.deco()}
                title="Déconnexion"
                color= {Color.agOOraBlue}
                />
            )
        }
    }

    renderBtnCreerEquipe() {
        if(this.monProfil) {
            return(
                <TouchableOpacity
                style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%')}}
                onPress={() => Alert.alert(
                                '',
                                "Que veux-tu faire ? Créer une équipe ou rechercher une équipe à intégrer ?",
                                [
                                    {
                                        text: 'Créer',
                                        onPress: () => this.props.navigation.push("CreationEquipeNom")
                                    },
                                    {
                                        text: 'Rechercher',
                                        onPress: () => this.props.navigation.navigate("OngletRecherche_Defaut", {type: "Equipes"}),
                                        style: 'cancel',
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
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
                        if (item.joueursAttentes.includes(this.joueur.id)) {
                            Alert.alert(
                                '',
                                this.joueur.pseudo  + " est déjà en attente pour intégrer " + item.nom
                            )
                        } else {
                            // this.chooseEquipe(item)
                            //this.saveParticipationInDb(item.id,item.nom)
                            this.integrerJoueur(item.id, item.nom)
                            Alert.alert(
                                '',
                                "Ta demande pour intégrer " + this.joueur.pseudo  + " à l'équipe " + item.nom
                                + " a bien été envoyée. Tu seras informé quand le joueur aura accepté ou non"
                            )
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
     * Fonction qui permet d'afficher un cadre montrant les équipes dont l'utilisateur est 
     * capitaine pour y intégrer un nouveau joueur.
     */
    _renderListEquipe() {
        if(this.state.show_equipe) {
            return(
                <View style = {styles.containerListEquipe}>
                    <Text>
                        Dans quelle équipe souhaites-tu intégrer {this.joueur.pseudo} ?
                    </Text>

                    {this.renderListEquipesLoading()}
                    
                    <TouchableOpacity
                        onPress = {() => this.setState({show_equipe : false})} >
                        <Text style = {{fontWeight : "bold"}}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )           
        }
    }

    /**
     * Fonction qui affiche soit la liste des équipes dont l'utilisateur est capitaine soit 
     * l'indication de chargement
     */
    renderListEquipesLoading(){
        if(! this.state.isLoading) {
            return(
                <ScrollView>
                    <FlatList
                        style={{alignSelf : "center"}}
                        data={this.state.equipes}
                        renderItem={this._renderItemEquipe}
                    />
                </ScrollView>
                
            )
        } else {
            return(
                <Simple_Loading
                    taille = {hp('6%')}
                />
            )
        }
    }

    renderIconMessage() {
        if(this.monProfil){
            return(
                <View style = {{position : "absolute" , right : wp('1%')}}>
                    <Icon_Message
                        nbMessagesNonLu = {this.state.nbMessagesNonLu}/>
                </View>
            )
        }
    }


    renderIconCapitaine() {
        var isCaptain = false;
        for (var i=0; i<this.equipes.length; i++) {
            if (this.equipes[i].capitaines.includes(this.id)) {
                isCaptain = true;
            }
        }

        if (isCaptain) {
            return (
                <Image
                    style={{width: 30, height: 30}}
                    source={require('app/res/c.png')}
                />
            )
        }
    }
    
    renderIconMessage(){
        if(! this.monProfil) {
            return(
                <TouchableOpacity
                style = {{position : "absolute", top  : hp('0.7%'), right : wp('1%')}}
                    onPress = {() =>this.creerSimpleConv(this.joueur)} >
                    <Image
                        style = {{width : 30, height : 30, marginRight :15}}
                        source = {require('../../../res/write.png')}
                    />
                </TouchableOpacity>
            )
        }
    }


    async creerSimpleConv(joueur){
        this.setState({isLoading : true})
        // Verifier si la conv existe pas déja 
        var db = Database.initialisation()
        var refConv  = db.collection("Conversations");
        var query = refConv.where("participants", 'array-contains' , LocalUser.data.id).where("estUnGroupe", "==",false)
        query.get().then(async (results) => {
            console.log("query ok !!!")
            var pasResultat = results.docs.length == 0
            var existePas = true
            for( var i  = 0 ; i < results.docs.length; i++) {
                existePas = existePas && !results.docs[i].data().participants.includes(joueur.id)
                if(results.docs[i].data().participants.includes(joueur.id)) {
                    var conv = results.docs[i].data()
                    conv.joueur = joueur
                }
            }
            console.log("==== pseudo  §§§ ====", joueur.pseudo)
           if(pasResultat || existePas) {
               var ref = db.collection("Conversations").doc()
                await ref.set({
                    aLue : false,
                    id : ref.id,
                    lecteurs : [],
                    participants : [joueur.id, LocalUser.data.id],
                    estUnGroupe : false
                })
                var conv = {
                    aLue : false,
                    id : ref.id,
                    lecteurs:[],
                    participants : [id, LocalUser.data.id],
                    estUnGroupe : false,
                    joueur : joueur
                }
                this.props.navigation.push("ListMessages", {conv : conv})
           } else {
                this.props.navigation.push("ListMessages", {conv : conv})
           }
        })
        
        
    }

    newMessage(){

    }


    getTextePoste() {
        if (this.joueur.sexe == "feminin") {
            switch(this.joueur.poste) {
                case "offensif" : return "Joueuse offensive";
                case "defensif" : return "Joueuse défensive";
                case "mixte" : return "Joueuse mixte";
                case "gardien" : return "Gardienne";
                default : return "Poste non renseigné"
            }
        } else {
            switch(this.joueur.poste) {
                case "offensif" : return "Joueur offensif";
                case "defensif" : return "Joueur défensif";
                case "mixte" : return "Joueur mixte";
                case "gardien" : return "Gardien";
                default : return "Poste non renseigné"
            }
        }
    }


    renderAge(){
        console.log("ID JOUEURS !!!!!",this.joueur.id )
        console.log("NAISSANCE",this.joueur.naissance )
        if(this.joueur.naissance.seconds == undefined) {
            var naissance = new Date(this.joueur.naissance)
        } else {
            naissance = new Date(this.joueur.naissance.seconds * 1000)
        }
        return DatesHelpers.calculAge(naissance)
    }
	

    render() {
        console.log("render")
        if(this.state.isLoading ) {
            return(
                <View>

                    <Simple_Loading
                        taille = {hp("10%")}/>
                </View>
                    
            )
        } else {
            if (this.state.displayFullPicture) {
                return(
                    <View style= {{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height : hp('100%')}}>
                        <TouchableOpacity
                            onPress = {() => this.setState({displayFullPicture: false})}
                        >
                            <Image
                                source = {{uri :this.joueur.photo}}
                                style = {{
                                    width : wp('97%'),
                                    height : hp('97%'),
                                    resizeMode : 'contain'
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                )
            } else {
                return (
                    <ScrollView style={styles.main_container}
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        />
                    }>
                    
                        {/* Caracteristiques du joueur */}
                        <View style={[styles.perso_container]}>
                            {this.renderIconMessage()}
                            <View style={styles.top_infos_container}>
                                <TouchableOpacity
                                    style={{justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => this.setState({displayFullPicture: true})}>
                                    <Image
                                        style={styles.image_photo}
                                        source = {{uri : this.joueur.photo} } />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.nom_container}
                                    onPress={() => {
                                        if (this.monProfil) {
                                            this.props.navigation.push('ProfilJoueurReglagesScreen', {id: this.id, joueur: this.joueur, equipes: this.equipes, header: this.joueur.pseudo});
                                        }
                                    }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image
                                            style={{width: 15, height: 15, marginHorizontal: 2}}
                                            source={this.sexeIcon}
                                            />
                                        <Text style={{margin: 5, fontSize : RF(3.25)}}>{this.renderAge()} ans, {this.joueur.ville.charAt(0).toUpperCase() + this.joueur.ville.slice(1)}</Text>
                                    </View>
                                    {/*<Text style={{margin: 5,  fontSize : RF(3.25)}}>{this.joueur.pseudo}</Text>*/}
                                    <Text>{this.getTextePoste()}</Text>
                                </TouchableOpacity>
                                {this._displayReglages()}
                            </View>

                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={styles.bot_infos_container}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        rating={parseInt(this.joueur.score)}
                                        starSize={hp('3.5%')}
                                        fullStarColor='#F8CE08'
                                        emptyStarColor='#B1ACAC'
                                        containerStyle={styles.rating}/>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>

                                    <TouchableOpacity
                                        style={{}}
                                        onPress = {()=> {this.gotoJoueursQuiLikent()}}>
                                        <Text style={{paddingVertical: 10, paddingHorizontal: 5}}>{this.joueur.aiment.length}</Text>
                                    </TouchableOpacity>
                                    {this.likeJoueur()}
                                    {this.renderIconCapitaine()}
                                </View>
                            </View>
                            <Text style={{fontStyle: 'italic'}}>{this.AKA}</Text>
                        </View>


                        {/* Equipes dont il fait partie */}
                        <View style={[styles.equipes_container, styles.additional_style_container]}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}
                                    onPress={() => this.props.navigation.push('ProfilJoueurMesEquipesScreen', {joueur: this.joueur, header: this.joueur.pseudo, monProfil: this.monProfil, equipes: this.equipes})}>
                                    <Text style={styles.header}>{this.monProfil ? "Mes Equipes" : "Equipes"}</Text>
                                </TouchableOpacity>
                                {this.renderBtnCreerEquipe()}
                            </View>
                            <View style={{flex: 3}}>
                                <FlatList
                                    style={{flex: 1}}
                                    horizontal= {true}
                                    data={this.equipes}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({item}) => this.renderItemEquipe(item.id, item)}

                                />
                            </View>
                        </View>


                        {/* Favoris */}
                        <View style={[styles.favoris_container, styles.additional_style_container]}>
                            <TouchableOpacity
                                style={styles.header_container}
                                onPress={() => this.props.navigation.push('ProfilJoueurMesFavorisScreen', {joueur: this.joueur, header: this.joueur.pseudo, monProfil: this.monProfil, id: this.id})}>
                                <Text style={styles.header}>{this.monProfil ? "Mes Favoris" : "Favoris"}</Text>
                            </TouchableOpacity>
                            <ScrollView
                                horizontal={true}>
                                <View style={styles.favoris_categories}>
                                    <Image style={styles.favoris_categorie_icone} source = {require('app/res/icon_joueurs.png')}/>
                                    <Button title="Reseau" onPress={() => this.gotoReseau()}/>
                                    <Image style={styles.favoris_categorie_icone} source = {require('app/res/icon_team.png')} />
                                    <Button title="Equipes" onPress={() => this.gotoEquipesFav()}/>
                                    <Image style={styles.favoris_categorie_icone} source = {require('app/res/icon_terrain.png')}/>
                                    <Button  title="Terrains" onPress={() => this.gotoTerrainsFav()}/>
                                </View>
                            </ScrollView>

                        </View>

                        {/* Defis*/} 
                        <View style = {[styles.defis_container, styles.additional_style_container]}>
                            <TouchableOpacity style={styles.header_container} onPress={() => {console.log("profil : ", this.joueur.pseudo); this.props.navigation.push("CalendrierJoueur", {id: this.id, header: this.joueur.pseudo})}}>
                                <Text style={styles.header}>Calendrier</Text>
                            </TouchableOpacity>
                            {this.displayDefis()}
                        </View>
                        {this.renderBtnDeco()}
                        {this._renderListEquipe()}

                    </ScrollView>
                )
            }
        }
    }

}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: hp('1%')
    },

    additional_style_container : {
        width : wp('98%'),
        marginLeft : wp('1%'),
        marginRight : wp('1%'),
        borderRadius : 15,
        marginBottom : hp('1%'),
        paddingBottom : hp('1.5%'),
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 5, width: 5 }, // IOS
        shadowOpacity: 5, // IOS
        shadowRadius: 5, //IOS
       // elevation: 2, // Android
    },

    // Styles de nos caracteristiques
    perso_container: {
        flex: 4,
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingLeft : wp('3%'),
        paddingTop : hp('1.5%')

    },
    top_infos_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bot_infos_container: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    rating: {
        width: 40,
    },
    nom_container: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    image_photo: {
        width : wp('25%'),
        height :wp('25%'),
        borderRadius : 42,
        backgroundColor: 'gray',
    },
    image_param: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        margin: 5
    },

    // Styles de notre liste d'equipes
    equipes_container: {
        flex: 4,
        justifyContent: 'space-evenly',
        alignItems: 'stretch',

    },

    equipe_item: {
        width: 100,
        height: 100,
        margin: 10,
        backgroundColor: 'gray'
    },

    // Styles des categories de favoris
    favoris_container: {
        flex: 3,
        justifyContent: 'space-evenly',
        alignItems: 'stretch',

    },
    favoris_categories: {
        flex: 2,
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    favoris_categorie_icone: {
        width: wp('11%'),
        height: wp('11%'),
        resizeMode:  'cover',
        marginLeft : wp('4%'),
        marginRight : wp('4%')

    },



    // Text styles
    header_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        width : wp('88%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
       // marginVertical: 10,
        //marginHorizontal: 10,
        borderRadius : 15,

       // borderWidth : 1,
       backgroundColor:'#52C3F7',
       //elevation : 5


    },
    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
	
	
	icon_plus : {
        width : 30,
        height : 30,
        marginBottom : hp('1.5%')

    },
    
    containerListEquipe : {
        position : "absolute", 
        backgroundColor : "white", 
        top :100,
        width :wp('90%'), 
        alignItems :"center" ,
        paddingTop : hp('3%'),
        paddingBottom : hp('4%'),
        alignSelf : "center",
        borderWidth : 1,
        borderRadius : 5
    },

    
    photoEquipe : {
        width : wp('18%'),
        height :wp('18%'),
        marginLeft : wp('2%'),
        marginRight : wp('2%'),
        marginTop : hp('1%'),
        marginBottom : hp('1%')
    },

})


export default ProfilJoueur;

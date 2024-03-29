import React from 'react'
import {View, ScrollView,TouchableOpacity,Image,Text,FlatList,Alert} from 'react-native'
import Photo_Joueur_Equipe from './Photo_Joueur_Equipe';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from "react-native-responsive-fontsize"
import Defis_Equipe from './Defis_Equipe'
import StarRating from 'react-native-star-rating'
import Database from '../../Data/Database'
import LocalUser from 'app/src/Data/LocalUser.json'
import Type_Defis from '../../Vues/Jouer/Type_Defis'
import firebase, { database } from 'firebase'
import Simple_Loading from '../../Components/Loading/Simple_Loading'
//import '@firebase/firestore'

import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie from '../../Components/Defis/Item_Partie'
import Types_Notification from '../../Helpers/Notifications/Types_Notification';



/**
 * Classe permettant de définir la vue du profil d'une Equipe.
 */
export default class Profil_Equipe extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;

        return {
          title: `${state.params && state.params.title ? state.params.title : ' '}`,
        };
    };

    /*******************************************************************************
    ********************************   CONSTRUCTOR   *******************************
    *******************************************************************************/
    constructor(props) {
        super(props)

        
        this.state = {
            equipe : undefined,
            joueur : 'e',
            url : 'e',
            txt_identite :'erreur',
            citation : 'erreur',
            sexe : 'erreur',
            nbJoueur : 'erreur',
            nbEtoile : 'erreur',
            fiabilite : 'erreur',
            nbAime : 'erreur',
            nbDefitCree : 'erreur',
            nbDefitParticipe :'erreur',
            fullPicture : false,
            like : false,
            isLoadingJoueurs : true,
            isLoadingDefis : true,
            getData : false,
            isaMember : true,
            isCaptain : true,
            nom :' ',
            joueurs :[],
            defis : 'erreur',
            id : ''  ,           // Utile pour accéder aux joueurs qui likent 
            allDefis : [],
            isLoading : false
        }
    }

    componentDidMount(){
        this.getEquipeWithId(this.props.navigation.getParam('equipeId', null));
    }
    


    //================================================================================
    //=================================== POUR LES DEFIS =============================
    //================================================================================


    /** Fonction qui va permettre de trouver tous les défis et parties à venir auxquels 
     * participes l'équipe
     */
    getAllDefisAndPartie() {
        var db = Database.initialisation()
        var allDefis = []
        var now = new Date()
        var ref = db.collection("Defis");
        var query = ref.where("equipesConcernees", "array-contains" ,this.state.id).orderBy("dateParse")

        query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                var defi = results.docs[i].data()
                allDefis.push(defi)
                //defisArray.push(results.docs[i].data())
            }

            this.setState({
                allDefis : allDefis,
                isLoading : false,
            })
        }).catch(function(error) {
              console.log("Error getting documents partie:", error);
        });    
    }



    /*******************************************************************************
    *********************   FONCTIONS POUR LA BASE DE DONNEES   ********************
    *******************************************************************************/

    /**
     * Fonction qui permet l'initialisation de la base de données.
     */
    initialisation() {
        if (!firebase.apps.length) {
            firebase.initializeApp(Database.config);
        };
        var db = firebase.firestore();
        return db;
    }




    /**
    * Méthode qui permet de récupérer les données d'une équipe depuis firebase
    * @param {*} id
    */
    getEquipeWithId(id) {
        Database.getDocumentData(id, 'Equipes').then(async (doc) => {
            if (doc.joueurs.length > 1) {
                var nbJ = doc.joueurs.length + " joueurs";
            } else {
                var nbJ = doc.joueurs.length + " joueur";
            }

            // Lecture des données propres de l'équipe
            this.setState({
                equipe : doc,
                isaMember : doc.joueurs.some(elmt => elmt === LocalUser.data.id),
                id: id,
                equipeData: doc,
                txt_identite : doc.age + ' ans, ' + doc.ville.charAt(0).toUpperCase() + doc.ville.slice(1),
                citation : doc.citation,
                sexe : doc.sexe,
                nbJoueur : nbJ,
                nbEtoile : 0,
                nbDefitCree : doc.nbDefisCrees,
                nbDefitParticipe : doc.nbDefisParticipe,
                url : doc.photo,
                fiabilite : doc.fiabilite,
                nbAime : doc.nbAime,
                nom : doc.nom,
                isCaptain : doc.capitaines.some(elmt => elmt === LocalUser.data.id),
                isaMember : doc.joueurs.some(elmt => elmt === LocalUser.data.id),
                isLoadingJoueurs : true,
                isLoadingDefis : true,
                stylePhoto : {
                    position :'relative',
                    width : wp('90%')
                }
            });

            this.getDefis(doc.defis);
            this.getInfosJoueursEquipe(doc.joueurs, doc);
            this.getAllDefisAndPartie(id)

            title = doc.nom;
            this.props.navigation.setParams({ title });
        })
    }


    /**
     * Fonction qui permet de renvoyer une liste  contenant les informations
     * utiles pour l'affichage des joueurs de l'équipe;
     * @param {*} e // equipe
     */
    async getInfosJoueursEquipe(jArray, equipe) {
        var liste = [];
        for (jId of jArray){
            j = await Database.getDocumentData(jId, 'Joueurs');
            tokens = []
            if(j.tokens != undefined) tokens = j.tokens
            j2 = {
                id: jId,
                isCaptain: equipe.capitaines.some(elmt => elmt === jId),
                photo: j.photo,
                tokens : tokens,
                pseudo : j.pseudo,
                fullData: j,
                score : parseInt(j.score+"")
            }

            liste.push(j2)
        }

        var listeBuild = this.buildJoueursCapNonCap(liste);

        this.setState({
            isLoadingJoueurs: false,
            joueurs: listeBuild,
        })
    }


    /**
     * Fonction qui permet de renvoyer une liste  contenant les informations
     * utiles pour l'affichage des defis de l'équipe;
     * @param {*} defis
     */
    async getDefis(defis) {
        var liste = [];
        for(var i = 0; i< defis.length; i++) {
            let d = await Database.getDocumentData(defis[i], 'Defis');

            defiBeginDate = d.dateDebut.toDate();
            defiEndDate = d.dateFin.toDate();
            

            dateObj = {
                annee: defiBeginDate.getFullYear(),
                heureDebut: defiBeginDate.getHours(),
                heureFin: defiEndDate.getHours(),
                jours: defiBeginDate.getDate(),
                minutesDebut: defiBeginDate.getMinutes(),
                minutesFin: defiEndDate.getMinutes(),
                mois: defiBeginDate.getMonth() + 1
            }

            eq1 = await Database.getDocumentData(d.equipe1, 'Equipes');
            eq2 = await Database.getDocumentData(d.equipe2, 'Equipes');
            
            j = {
                id : d.id,
                format : d.format,
                photo1 : eq1.photo,
                photo2 : eq2.photo,
                nom1 : eq1.nom,
                nom2 : eq2.nom,
                date : dateObj
            }
            liste.push(j)
            
        }
        this.setState({
            isLoadingDefis: false,
            defis: liste
        })
    }



    /**
     * Pour aller sur la vue présentant les joueurs de l'équipe
     */
    goToJoueursEquipes() {
        if (!this.state.isLoadingJoueurs) {
            this.props.navigation.navigate("JoueursEquipe",{equipe : this.state.equipe, joueurs : this.state.joueurs})
        }
    }
    
    /*******************************************************************************
    *************   FONCTIONS POUR ALLER VERS LES JOUEURS QUI LIKENT   ***************
    *******************************************************************************/

     /**
     * Méthode qui va permettre de récuperer les joueurs qui 
     * likent le terrains et d'afficher la vue.
     */
    gotoJoueursQuiLikent() {
        this.props.navigation.push("JoueursQuiLikent", {joueurs: this.state.equipeData.aiment, titre: this.state.equipeData.nom});
    }


    /*******************************************************************************
    *************   FONCTIONS POUR L'AFFICHAGE EN GRAND DE L'IMAGE   ***************
    *******************************************************************************/

    /**
    * Fonction qui permet d'inversser le state fullPicture.
    */
    changeStateFullPicture() {
        this.setState(
            {fullPicture : ! this.state.fullPicture}
        )
    }


    /**
    * Fonction qui va permettre de changer le state fullPicture en fonction
    * d'un booléen passé en paramètre.
    * @param {*} bool
    */
   changeStateFullPictureWithBool(bool) {
       this.setState({fullPicture : bool})
   }


   /**
    * Fonction qui va permettre d'afficher la photo de profil de l'équipe en
    * grand écran.
    */
   displayFullPicture() {
       return(
           <View style= {{
               justifyContent: 'center',
               alignItems: 'center',
               height : hp('100%')}}>
                <TouchableOpacity
                   onPress = {() => this.changeStateFullPictureWithBool(false)}
                  >
                   <Image
                       source = {{uri :this.state.url}}
                       style = {{
                           width : wp('97%'),
                           height : hp('97%'),
                           resizeMode : 'contain'
                       }}
                   />
               </TouchableOpacity>
           </View>
       )
   }

    changeStateFullPicture(){
        this.setState(fullPicture)
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
     * Fonction qui envoie une notif aux capitaines de l'équipe en indiquant que 
     * l'utilisateur souhaite la rejoindre
     */
    async sendNotifAjoutEquipe() {
        var titre = "Nouvelle notif"
        var corps = LocalUser.data.pseudo + " souhaite intégrer ton équipe " + this.state.nom
        for(var i = 0; i < this.state.joueurs.length; i ++) {
            var joueur = this.state.joueurs[i]
            if(joueur.isCaptain) {
                await this.storeNotifRejoindreEquipe(joueur.id)
                for(var k = 0; k < joueur.tokens.length; k++) {
                    await this.sendPushNotification(joueur.tokens[k], titre,corps)
                }
            }
        }
    }


    /**
     * Fonction qui va sauvegarder la notification de demande d'intégration à l'équipe
     */
    async storeNotifRejoindreEquipe(joueurId) {
        var db = Database.initialisation()
        db.collection("Notifs").add(
            {
                time : new Date(),
                dateParse : Date.parse(new Date()),
                recepteur : joueurId,
                emetteur : LocalUser.data.id,
                equipe : this.state.id,
                type : Types_Notification.DEMANDE_REJOINDRE_EQUIPE
            }
        )
    }


    /**
     * Fonction qui affiche l'alert pour confirmer ou non le souhait de rejoindre
     * l'équipe
     */
    buildAlertIntegerEquipe(){
        var localAttente = LocalUser.integrerAttente;
        if (localAttente == undefined) {
            localAttente = [];
        }

        if (this.state.equipe.joueursAttentes.includes(LocalUser.data.id) || localAttente.includes(this.state.equipe.id)) {
            Alert.alert(
                '',
                "Ta demande pour intégrer l'équipe " + this.state.nom + " a déjà été envoyée",
            )
        } else {
            Alert.alert(
                '',
                "Tu souhaites faire une demande pour intégrer l'équipe " + this.state.nom ,
                [
                    {text: 'Confirmer', onPress: () => {
                        this.joinEquipe().then(() => {
                            localAttente.push(this.state.equipe.id);
                            LocalUser.integrerAttente = localAttente;
                        });
                    }},
                    {
                    text: 'Annuler',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                    },
                ],
            )
        }
    }

    /**
     * Fonction qui ajoute l'utilisateur dans les joueurs en attente de l'équipe et envoie
     * une notification aux capitaine.
     */
    async joinEquipe() {
        this.setState({isLoading : true})
        await this.sendNotifAjoutEquipe()
        await this.addJoueurInEquipe()
        Alert.alert('',"Ta demande a bien été envoyée à l'équipe " + this.state.nom)
        this.setState({isLoading : false})
    }


    /**
     * Fonction qui ajoute un joueur aux joueurs en attente de l'équipe
     */
    async addJoueurInEquipe() {
        var db = Database.initialisation()
        db.collection("Equipes").doc(this.state.id).update({
            joueursAttentes : firebase.firestore.FieldValue.arrayUnion(LocalUser.data.id)
        })
    }
    

    /*******************************************************************************
    ***********************   FONCTIONS POUR L'AFFICHAGE    ************************
    *******************************************************************************/

    render() {
        return (
            <View>
                {this.waitForLoading()}
            </View>
        )
    }

    /**
    * Fonction qui permet d'attendre que l'on ai bien récupérer les données
    * avant d'afficher les informations de profils
    */
   waitForLoading() {
        if(this.state.isLoadingJoueurs && this.state.isLoadingDefis) {
            return <View><Text>Loading ..</Text></View>
        } else {
            if(this.state.fullPicture) {
                return this.displayFullPicture()
            }else {
                return this.displayProfil()
            }
        }
    }



    /**
    * Permet d'afficher le petit c si j'utilisateur est le capitaine de l'équipe
    */
    displayCapitanat() {
        if (this.state.isCaptain) {
            return <Image source = {require('app/res/c.png')} style = {styles.c}/>;
        }
    }



    /**
    * Méthode qui va permettre d'afficher les bon componant en fonction
    * de si le joueur est capitaine ou non
    */
    displayActionEquipe() {
        /* Cas où le joueur n'est pas un membre de l'équipe. */
        if (!this.state.isaMember) {
            return (
                <View style = {styles.main_container_action}>
                    <TouchableOpacity
                        onPress = {() => this.newGroupe()}>
                        <Image
                            source = {require('app/res/write.png')}
                            style = {styles.icon_message} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = {() => this.buildAlertIntegerEquipe()}>
                        <Image
                            source = {require('app/res/icon_plus.png')}
                            style = {styles.icon_plus} />
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style = {{...styles.main_container_action}}>
                    <TouchableOpacity
                        onPress = {() => this.newGroupe()}>
                        <Image
                            source = {require('app/res/write.png')}
                            style = {styles.icon_message} />
                    </TouchableOpacity>
                </View>
            )
        }
    }


    /**
     * Permet d'afficher le petit c au niveau des joueurs de l'équipe en
     * fonction de si il est capitaine ou non
     */
    displayCapitanat_joueur() {
        if (this.props.isCaptain) {
            return <Image source = {require('app/res/c.png')} style = {styles.c}/>;
        }
    }

    displayDefis(){

        if(this.state.allDefis == undefined || this.state.allDefis.length == 0) {
            return (
                <View style={{alignItems: 'center'}}>
                    <Text>aucun défi programmé</Text>
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


    buildJoueurs(partie) {
        var liste = []
        for(var i = 0; i < partie.participants.length ; i++) {
            if(! partie.indisponibles.includes(partie.participants[i])) {
                liste.push(partie.participants[i])
            }
        }
        return liste
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



    /**
     * Fonction qui permet de trier les joueurs en fonction de l'ordre laphabethique
     * de leur pseudo.
     * @param {*} dataVrac 
     */
    buildJoueursAlphabetique(dataVrac) {
        let  data =  {
            A: [],
            B: [],
            C: [],
            D: [],
            E: [],
            F: [],
            G: [],
            H: [],
            I: [],
            J: [],
            K: [],
            L: [],
            M: [],
            N: [],
            O: [],
            P: [],
            Q: [],
            R: [],
            S: [],
            T: [],
            U: [],
            V: [],
            W: [],
            X: [],
            Y: [],
            Z: [],
        }
        for(var i = 0; i < dataVrac.length ; i ++) {
            var d = dataVrac[i]
            var lettre = d.pseudo[0].toUpperCase();
            let arrayj = data[lettre];
            arrayj.push(dataVrac[i]);
            data[lettre] = arrayj;
        }


        var dataTrie = [];
        Object.keys(data).forEach(char => {
            var arrayLettre = data[char];
            for (var j=0; j<arrayLettre.length; j++) {
                dataTrie.push(arrayLettre[j]);
            }
        })

        return dataTrie;
    }


    buildJoueursCapNonCap(joueurs) {
        var capitaines = [];
        var nonCapitaines = [];
        for (var i=0; i<joueurs.length; i++) {
            if (joueurs[i].isCaptain) {
                capitaines.push(joueurs[i]);
            } else {
                nonCapitaines.push(joueurs[i]);
            }
        }

        var capitainesTrie = this.buildJoueursAlphabetique(capitaines);
        var nonCapitainesTrie = this.buildJoueursAlphabetique(nonCapitaines);

        var data = [];
        for (var i=0; i<capitainesTrie.length; i++) {
            data.push(capitainesTrie[i]);
        }
        for (var i=0; i<nonCapitainesTrie.length; i++) {
            data.push(nonCapitainesTrie[i]);
        }

        return data;
    }
      

    getNbEtoiles() {
        if (this.state.joueurs == undefined) {
            return 0;
        } else {
            var scoreMoy = 0;
            for (var i=0; i<this.state.joueurs.length; i++) {
                scoreMoy += this.state.joueurs[i].score;
            }
            scoreMoy = Math.ceil(scoreMoy / this.state.joueurs.length);

            return scoreMoy;
        }
    }


    newGroupe() {
        this.props.navigation.push("NewGroupe",{joueurs :this.state.joueurs, equipe : this.state.equipe})
    }

    /**
     * Fonction qui nous permet d'afficher la vue du profil de l'équipe
     */
    displayProfil() {
        if(! this.state.isLoading) {
            return (
                <ScrollView>
                    <View style = {styles.info_equipe}>

                        {/* BLOC INFOS DE L'EQUIPE */}
                        <View style = {styles.bloc_identite}>

                            <View style = {styles.main_container_photo}>
                                <TouchableOpacity
                                    onPress = {()=>this.changeStateFullPictureWithBool(true)}
                                >
                                    <Image source = {{uri :this.state.url}} style = {styles.image_profil_equipe} />
                                </TouchableOpacity>
                            </View>

                            {/* text de l'équipe */}
                            <TouchableOpacity
                                style = {styles.main_container_txt}
                                onPress = {async () => {
                                    if(this.state.isCaptain) {
                                        let eqData = this.state.equipeData;
                                        joueursData = await Database.getArrayDocumentData(eqData.joueurs, 'Joueurs');
                                        this.props.navigation.navigate("Reglages_Equipe", {equipeData: eqData, joueursData: joueursData})
                                    }
                                }}>
                                <Text style = {styles.age_ville}>{this.state.txt_identite}</Text>
                                <Text style = {styles.nb_joueur}>Equipe {this.state.sexe}</Text>
                                <Text  style = {styles.nb_joueur}>{this.state.nbJoueur}</Text>
                            </TouchableOpacity>

                            {/* action de l'équipe */}
                            {this.displayActionEquipe()}
                        </View>

                        {/* BLOC NOTATION ET NB DE LIKE */}
                        <View style = {styles.bloc_notation_like}>
                            <View style = {styles.main_container_notation}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={this.getNbEtoiles()}
                                    starSize={hp('4%')}
                                    fullStarColor='#F8CE08'
                                    emptyStarColor='#B1ACAC'
                                />
                                {/*<Text style = {styles.fiabilite}>Fiabilité, {this.state.fiabilite}</Text>*/}
                            </View>

                            <View style = {styles.main_container_like}>
                                <TouchableOpacity
                                    onPress = {()=> {this.gotoJoueursQuiLikent()}}>
                                    <Text>{this.state.equipeData.aiment.length} </Text>
                                </TouchableOpacity>
                                {this.likeEquipe()}
                            </View>
                        </View>

                        <View style={{marginHorizontal: wp('2%'), marginVertical: wp('2%')}}>
                            <Text style = {styles.quote} numberOfLines={2}>{this.state.citation}</Text>
                        </View>

                        {/* BLOC DEFIS */}
                        {/*<View style = {styles.bloc_defis}>
                            <View style = {styles.vue_txt}><Text style = {styles.txt_defi} >{this.state.nbDefitCree} défis créés</Text></View>
                            <View style = {styles.vue_txt}><Text style = {styles.txt_defi}>{this.state.nbDefitParticipe} défis participés</Text></View>
                        </View>*/}
                        {/*this.displayCapitanat()*/}
                    </View>

                    {/* BLOC POUR LES JOUEURS DE L'EQUIPE */}
                    <View style = {styles.main_container_joueur}>
                        <TouchableOpacity style = {styles.vue_txt_joueur}
                            onPress = {() => this.goToJoueursEquipes()}>
                            <Text style = {styles.txt_joueur}>Joueurs de l'équipe</Text>
                        </TouchableOpacity>

                        <FlatList style = {{marginLeft : wp('2%')}}
                            data={this.state.joueurs}
                            numColumns={5}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) =>

                                <View style = {styles.view_shadow}>
                                    <Photo_Joueur_Equipe
                                        urlPhoto = {item.photo}
                                        isCaptain = {item.isCaptain}
                                        id = {item.id}
                                        nav = {this.props.navigation}
                                    />
                                </View>
                            }
                        />
                    </View>

                    {/* BLOC DEFIS */}
                    <View style = {styles.main_container_defis}>
                        <View style = {styles.view_txt_defis}>
                            <TouchableOpacity onPress = {() => {
                                this.props.navigation.push("CalendrierEquipe", {idEquipe : this.state.id, header : this.state.nom})
                            }}>
                                <Text style = {styles.txt_defis}>Défis de l'équipe</Text>
                            </TouchableOpacity>

                        </View>
                        {this.displayDefis()}
                    </View>
                </ScrollView>
            )
        } else {
            return(
                <Simple_Loading
                    taille = {hp('5%')}
                />
            )
        }
    }




    /**
     * Fonction qui permet en fonction de la valeur du state fullPicture d'afficher
     * soit l'image en plein écran, soit le profil de l'équipe
     */
    displayRender() {
        if(this.state.fullPicture == true) {
            return this.displayFullPicture()
        }else {
            return this.displayProfil()
        }
    }


    /******************************************************************************
    ***************   FONCTIONS POUR MODIFIER LE NOMBRE DE LIKE    ****************
    *******************************************************************************/

    likeEquipe() {
        if (LocalUser.data.equipesFav.some(elmt => elmt === this.state.id)) {
            // On like deja cette equipe, donc on la retirera des equipesFav
            return (
                <TouchableOpacity onPress = {() => {
                    Database.changeSelfToOtherArray_Aiment(this.state.id, "Equipes", false);
                    Database.changeOtherIdToSelfArray_EquipesFav(this.state.id, false);
                    
                    let copyEquipeData = {...this.state.equipeData};
                    copyEquipeData.aiment = this.state.equipeData.aiment.filter(v => !(v === LocalUser.data.id));
                    this.setState({
                        equipeData : copyEquipeData
                    })
                }}>
                    <Image source = {require('app/res/icon_already_like.png')} style = {styles.image_like}/>
                </TouchableOpacity>
            )
        } else {
            // On ne like pas encore cette equipe, donc on l'ajoutera à nos equipesFav
            return (
                <TouchableOpacity onPress = {() => {
                    Database.changeSelfToOtherArray_Aiment(this.state.id, "Equipes", true);
                    Database.changeOtherIdToSelfArray_EquipesFav(this.state.id, true);

                    let copyEquipeData = {...this.state.equipeData};
                    copyEquipeData.aiment.push(LocalUser.data.id);
                    this.setState({
                        equipeData : copyEquipeData
                    })
                }}>
                    <Image source = {require('app/res/icon_like.png')} style = {styles.image_like}/>
                </TouchableOpacity>
            )
        }
    }
}


const styles = {

    info_equipe : {
        flex : 1,
        borderWidth: 1,
    },

    main_container_photo : {
        marginLeft : wp('2%')
    },

    image_profil_equipe : {
        width : wp('25%'),
        height :wp('25%')
    },

    bloc_identite : {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop : hp('2%'),
    },

    main_container_txt : {
        marginLeft : wp('4%')
    },


    age_ville : {
        fontSize : RF(2.85)
    },

    quote : {
        fontSize : RF(2.4),
        fontStyle: 'italic'
    },

    nb_joueur : {
        fontSize : RF(2.4)
    },
    main_container_action : {
        marginLeft : wp('5%'),
        alignItems: 'flex-end',
        marginRight: wp('2%')
    },

    icon_message : {
        width : 30,
        height : 30,
        marginBottom : hp('1.5%'),
        marginLeft : wp('4%'),
        marginRight : wp('4%')
    },

    icon_plus : {
        width : 30,
        height : 30,
        marginBottom : hp('1.5%')

    },

    bloc_notation_like : {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    main_container_notation : {
        marginLeft : wp('2%'),
        marginTop : wp('2%')

    },

    etoiles : {
        width : 83,
        height : 16,
        alignSelf: 'stretch',
        marginBottom : wp('2%')


    },

    fiabilite : {
        fontSize : RF(2.65)

    },

    bloc_defis : {
        flex: 1,
        flexDirection: 'row',
    },

    vue_txt : {
        marginLeft : wp('5%'),
        marginRight : wp('4%')
    },

    txt_defi : {
        fontSize : RF(2.7)
    },

    c : {
        width : wp('10%'),
        height : wp('10%'),
        position : 'absolute',
        bottom : 0,
        right : 0
    },

    main_container_like : {
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection : 'row'
    },

    image_like : {
        height : 35,
        width : 35
    },


    main_container_joueur : {
        marginBottom : hp('3%'),
        marginTop : hp('4%')
    },

    liste_joueur : {
        flex:1,
        padding : 5
    },

    vue_txt_joueur : {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius : 15,
       // borderWidth : 1,
       backgroundColor:'#52C3F7',
       shadowColor: 'rgba(0,0,0, .4)', // IOS
       shadowOffset: { height: 5, width: 5 }, // IOS
       shadowOpacity: 5, // IOS
       shadowRadius: 5, //IOS
       elevation: 5, // Android       marginBottom : hp('2%')

    },
    txt_joueur : {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },

   main_container_joueur_equipe : {
    //borderWidth : 1,
    width: wp('19%'),
    height : wp('19%'),
    alignContent : 'center',
    overflow: 'hidden',
    padding :5,
    marginBottom : hp('4%'),
    marginTop : hp('4%'),
},

touchableOpacity : {
},

image_equipe : {
    width : wp('16%'),
    height : wp('16%'),
    resizeMode:  'cover',
    alignSelf: 'center',

},
c_equipe : {
    width : wp('7%'),
    height : wp('7%'),
    position : 'absolute',
    bottom : 0,
    right : 0
},

txt_defis : {
    color: 'white',
    fontSize: RF(2.7),
    fontWeight: 'bold',
    paddingVertical: 4
},

image_defis : {
 width : wp('13%'),
 height : wp('13%'),
 alignSelf : 'center',
 resizeMode: 'cover'
},

note_equipe_defis : {
 width : wp('16%'),
 height : wp('2.9%'),
 alignSelf: 'stretch'
},

image_view_defis : {
 borderRadius : 80,
 borderWidth : 1,
 alignContent : 'center',
 alignItems: 'center',
 marginLeft : wp('2%'),
 marginTop : wp('1%'),
 marginBottom : wp('0.8%'),
 padding : wp('2%'),
 width : wp('18%')
},

view_txt_defis : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius : 15,
    // borderWidth : 1,
    backgroundColor:'#52C3F7',
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 5, width: 5 }, // IOS
    shadowOpacity: 5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android    marginBottom : hp('2%')
},

view_shadow : {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 5, width: 5 }, // IOS
    shadowOpacity: 5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android

}



}

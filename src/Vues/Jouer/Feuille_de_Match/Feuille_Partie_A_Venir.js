
import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Database from '../../../Data/Database'
import actions from '../../../Store/Reducers/actions'
import { connect } from 'react-redux'
import Presences_Joueurs from '../../../Components/Defis/Feuilles_Match/Presences_Joueurs'
import LocalUser from '../../../Data/LocalUser.json'
import DatesHelpers from '../../../Helpers/DatesHelpers'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'
import Simple_Loading from '../../../Components/Loading/Simple_Loading'
/**
 * Vue qui permet d'afficher la feuille de match d'une partie à venir
 */
class Feuille_Partie_A_Venir extends React.Component {

    constructor(props) {
        super(props)
        this.partie = this.props.navigation.getParam('partie', undefined)
        this.monId = LocalUser.data.id

        var seconds = this.partie.jour.seconds
        this.ChangeThisTitle('Partie ' + this.buildDate(new Date(seconds * 1000)))
        this.state = {
            joueurs :  [],
            joueursRecherche : [],
            partie : this.props.navigation.getParam('partie', undefined),
            isLoading : false,
        }

    }

    componentDidMount() {
        // On construit une liste avec autant d'elt que de joueurs recherche
        var j= []
        for(var i = 0; i< this.state.partie.nbJoueursRecherche; i++) {
            j.push(i)
        }
        this.setState({joueursRecherche : j})

        // On construit la liste des joueurs
        this.buildListOfJoueur()
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

    /**
     * Méthode qui va permettre de renvoyer une liste des joueurs qui contiendra 
     * les participants ainsi que ceux indisponibles triés par ordre alphabetique.
     */
    async buildListOfJoueur() {
        var joueurs = this.props.navigation.getParam('joueurs', [])
        if(this.state.partie != undefined) {
            joueurs = joueurs.sort(function (a, b) {
                if(a.pseudo == b.pseudo ) {
                    return 0
                } else {
                    return a.pseudo.toLowerCase().localeCompare(b.pseudo.toLowerCase())
                }
            })
        }
        
        this.setState({joueurs : joueurs})
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
        for(var i  = 0; i < this.state.partie.attente.length; i++) {
            if(this.state.partie.attente[i] != LocalUser.data.id) {
                var id = this.state.partie.attente[i]
                var tokens = this.findJoueurWithId(id).tokens
                if(tokens != undefined) {
                    for(var k =0; k < tokens.length; k ++) {
                        await this.sendPushNotification(tokens[k], titre, corps)
                    }
                }
            }
        }

    }

    /**
     * Fonction qui va envoyer une notification à l'organisateur de la partie en
     * indiquant que l'utilisateur confirme sa présence, elle va deplus sauvegarder
     * la notification dans la base de données.
     */
    async sendNotifConfirmerToOrganisateur(date) {
        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " confirme sa présence pour une partie le "
        corps = corps + DatesHelpers.buildDate(date)

        // find Organisateur
        var organisateur = this.findJoueurWithId(this.state.partie.organisateur)

        if(organisateur.id != LocalUser.data.id)  {
            var tokens = organisateur.tokens
            if(tokens != undefined) {
                for(var k =0; k < tokens.length; k ++) {
                    await this.sendPushNotification(tokens[k], titre, corps)
                }
            }
        }

        // Store the notification in DB
        this.storeNotifConfirmerInDB()

    }

    /**
     * Fonction qui va envoyer une notification à l'organisateur de la partie en
     * indiquant que l'utilisateur est indisponible
     */
    async sendNotifIndispoToOrganisateur(date) {
        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " est indisponible pour une partie le "
        corps = corps + DatesHelpers.buildDate(date)

        // find Organisateur
        var organisateur = this.findJoueurWithId(this.state.partie.organisateur)

        if(organisateur.id != LocalUser.data.id)  {
            var tokens = organisateur.tokens
                if(tokens != undefined) {
                    for(var k =0; k < tokens.length; k ++) {
                        await this.sendPushNotification(tokens[k], titre, corps)
                    }
                }
        }

        this.storeNotifAnnulerInDB()


    }


    /**
     * Fonction qui permet d'envoyer les notifications au joueurs en attentes et les 
     * sauvegarder dans la base de données.
     */
    storeNotifRelanceInDB() {
        this.sendNotifToAllPlayer(new Date(this.state.partie.jour.seconds * 1000))
        
        
        // Store the notifs
        var db = Database.initialisation() 
        for(var i  = 0; i < this.state.partie.attente.length; i++) {
            if(this.state.partie.attente[i] != LocalUser.data.id) {
                var id = this.state.partie.attente[i]
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        partie : this.state.partie.id,
                        emetteur :  LocalUser.data.id,
                        recepteur : id,
                        time : new Date(),
                        type : Types_Notification.CONVOCATION_RELANCE_PARTIE,
                    }
                ) 
            }
        }
        Alert.alert('', "Les joueurs en attente ont été relancés")


    }

    /**
     * Fonction qui permet de sauvegarder dans la base de données la notification indiquant que 
     * l'utilisateur participe à la partie
     */
    storeNotifConfirmerInDB() {
        
        var organisateur = this.findJoueurWithId(this.state.partie.organisateur)

        // Store the notifs
        var db = Database.initialisation() 
        db.collection("Notifs").add(
            {
                dateParse : Date.parse(new Date()),
                partie : this.state.partie.id,
                emetteur :  LocalUser.data.id,
                recepteur : organisateur.id,
                time : new Date(),
                type : Types_Notification.CONFIRMER_PRESENCE_PARTIE,
            }
        ) 
            
        

    }

    /**
     * Fonction qui permet de sauvegarder dans la base de données la notification indiquant que 
     * l'utilisateur est indisponible pour la partie
     */
    storeNotifAnnulerInDB() {
        
        var organisateur = this.findJoueurWithId(this.state.partie.organisateur)

        // Store the notifs
        var db = Database.initialisation() 
        db.collection("Notifs").add(
            {
                dateParse : Date.parse(new Date()),
                partie : this.state.partie.id,
                emetteur :  LocalUser.data.id,
                recepteur : organisateur.id,
                time : new Date(),
                type : Types_Notification.ANNULER_PRESENCE_PARTIE,
            }
        ) 
            
        

    }
    // =====================================================================================




    /**
     * Fonction qui permet de construire un string représentant la date de 
     * la partie
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
     * Renvoie un objet joueur correspondant à l'id passé en paramettre
     */
    findJoueurWithId(id) {
        for(var  i = 0; i < this.state.joueurs.length ; i++ ){
            if(id == this.state.joueurs[i].id) return this.state.joueurs[i]

        }
    }

    /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs ayant 
     * confirmés. Ainsi que  d'enregistrer la partie mise à jour dans la DB et d'envoyer la
     * notification à l'organisateur.
     */
    async confirmerJoueurPresence()  {

        await this.sendNotifConfirmerToOrganisateur(new Date(this.state.partie.jour.seconds * 1000))

        // Ajouter l'id de l'utilisateur dans la liste des confirme (Creation d'un new array pour le re render)
        var j = []
        for(var i = 0 ; i < this.state.partie.confirme.length; i++) {
            j.push(this.state.partie.confirme[i])
            
        }
        if(! j.includes(this.monId)){
            j.push(this.monId) 
        }

        // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
        var att  = []
        for(var i = 0 ; i < this.state.partie.attente.length ; i++) {
            if(this.state.partie.attente[i] != this.monId) {
                att.push(this.state.partie.attente[i])
            }
        }

        // Suppr l'user  des joueurs indispos
        var indispo  = []
        for(var i = 0 ; i < this.state.partie.indisponibles.length ; i++) {
            if(this.state.partie.indisponibles[i] != this.monId) {
                indispo.push(this.state.partie.indisponibles[i])
            } 
        }

       

     
        // Mettre à jour le state.
        var partie = this.state.partie
        partie.confirme = j
        partie.attente = att
        partie.indisponibles = indispo

        this.setState({partie, partie})

        // Enregistrer dans la db
        var db = Database.initialisation()
        var partieRef = db.collection("Defis").doc(this.state.partie.id)
        partieRef.update({
            confirme : j,
            attente : att,
            indisponibles : indispo,
        }).then()
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });


    }


    
    /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs 
     * indisponibles, mettre à jour les autres listes 
     * Ainsi que  d'enregistrer la partie mise à jour dans la DB.
     */
    async annulerJoueurPresence() {

        nbJoueursRecherche = this.state.partie.nbJoueursRecherche
        await this.sendNotifIndispoToOrganisateur(new Date(this.state.partie.jour.seconds * 1000))

        // Ajouter l'utilisateur a la liste des joueurs indisponibles (new objet pour maj state)
        var indispo = []
        for(var i = 0 ; i < this.state.partie.indisponibles.length; i++) {
            indispo.push(this.state.partie.indisponibles[i])
        }
        if(! indispo.includes(this.monId)) {
            indispo.push(this.monId)
            nbJoueursRecherche = nbJoueursRecherche +1
        }
        

        

        // Le suppr des en attente
        var attente = []
        for(var i = 0; i <this.state.partie.attente.length; i++) {
            if(this.state.partie.attente[i] != this.monId) {
                attente.push(this.state.partie.attente[i])
            }
        }

        // Le suppr des confirmés
        var confirme = []
        for(var i = 0; i <this.state.partie.confirme.length; i++) {
            if(this.state.partie.confirme[i] != this.monId) {
                confirme.push(this.state.partie.confirme[i])
            }
        }

        // Mettre à jour le state.
        var partie = this.state.partie
        partie.confirme = confirme
        partie.attente = attente
        partie.indisponibles = indispo
        partie.nbJoueursRecherche =nbJoueursRecherche

        console.log("NB JOUEURS RECHERHCHE ", partie.nbJoueursRecherche)
        this.setState({partie, partie})

        // Enregistrer dans la db
        var db = Database.initialisation()
        var partieRef = db.collection("Defis").doc(this.state.partie.id)
        partieRef.update({
            confirme : confirme,
            attente : attente,
            indisponibles : indispo,
            nbJoueursRecherche : partie.nbJoueursRecherche

        }).then()
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }



    /**
     * Fonction qui va être appelée au moment où l'utilisateur confirme sa
     * présence. 
     */
    handleConfirmerOui() {
        Alert.alert(
            '',
            "Tu souhaites confirmer ta présence pour cette partie ? ",
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
     * Fonction qui va être appelée au moment où l'utilisateur annule sa
     * présence. 
     */
    handleConfirmerNon() {
        Alert.alert(
            '',
            "Tu souhaites annuler ta présence pour cette partie ? ",
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
     * Fonction qui va permettre d'aficher l'alerte permettant à l'utilisateur
     * de confirmer si il souhaite relancer les joueurs .
     */
    alerteRelancerJoueur() {
        Alert.alert(
            '',
            'Tu souhaites relancer les joueurs en attente ?',
            [
                {text: 'Oui', onPress: () =>this.storeNotifRelanceInDB()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )
    }

    async goToProfilJoueur(joueur){
        this.setState({isLoading : true})
        var equipes = await Database.getArrayDocumentData(joueur.equipes, "Equipes")
        this.setState({isLoading : false})
        this.props.navigation.push("ProfilJoueur", {id: joueur.id, joueur : joueur, equipes : equipes, reseau : []})
    }


    /**
     * Fonction qui renvoie la liste des joueurs ayant été invité par le créateur, 
     * cad ceux qui ne sont pas dans la liste des inscris
     */
    filtreJoueurInvites() {

        // Initialiser les listes
        var joueurs = []
        var participants = this.state.joueurs
        var organisateur = []
        var inscris = this.state.partie.inscris 

        // Iterer sur les participants et filtrer les joueurs invités
        for(var i = 0; i <participants.length; i++) {
            
            // Séparer l'organisateur des autres joueurs
            if(this.state.partie.organisateur == participants[i].id) {
                organisateur.push(participants[i])
            } else if(! inscris.includes(participants[i].id)) {
                joueurs.push(participants[i])
            }
            
        }
        return organisateur.concat(joueurs)
    }

    

    /**
     * Fonction qui renvoie la liste des joueurs qui se sont inscris cad
     * pas ceux invités par le créateur.
     */
    filtreJoueurInscris() {
        var joueurs = []
        var participants = this.state.joueurs
        var inscris = this.state.partie.inscris 
        for(var i = 0; i <participants.length; i++) {
            if(inscris.includes(participants[i].id)) {
                joueurs.push(participants[i])
            }
        }
       
        return joueurs
        
    }


    /**
     * Fonction qui va permettre de se rendre vers la page pour inviter des joueurs
     */
    inviterPlusdeJoueur() {
        const action = { type: actions.STORE_PARTICIPANTS_PARTIE, value:  this.state.partie.participants}
            this.props.dispatch(action)
        const action2 = { type: actions.STORE_NB_JOUEURS_RECHERCHES_PARTIES, value:  this.state.partie.nbJoueursRecherche}
        this.props.dispatch(action2)

        this.props.navigation.push("ChoixJoueursPartie",
        {
            ajout_Partie_existante : true,
            id_partie :  this.state.partie.id,
            enAttente : this.state.partie.attente,
            inscris : this.state.partie.inscris,
            invite : true,                          // c'est le créateur qui invite
            date : this.state.partie.jour,
            joueursConcernes : this.state.partie.joueursConcernes
        })
    }

    /**
     * Fonction qui va permettre de se rendre à la page où on  va choisir le nombre de joueurs 
     * à rechercher
     */
    rechercherPlusdeJoueurs() {
        this.props.navigation.push("ChoixNbrJoueursPartie",
        {
            format : this.state.partie.format,
            id_partie :  this.state.partie.id,
            joueurs : this.state.partie.participants,
            ajout_Partie_existante : true,
        })
    }

    _renderCircleOfColor(color)  {
        return(
            <View>
                <View style = {[{ backgroundColor : color}, styles.circle]}></View>
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

    _renderItemJoueurRecherche= ({item}) => {

        return(
            <View style = {styles.containerItemJoueur}>

                <View style = {[styles.photoJoueur, {borderWidth : 2, borderColor : Colors.agooraBlueStronger}]}>

                </View>


                {/* View contenant le cercle de couleur */}
                <View style = {styles.containerCircle}>
                   
                    <View style = {{alignSelf : "flex-end"}}>
                        {this._renderCircleOfColor(Colors.agooraBlueStronger)}
                    </View>
                </View>
            </View>
        )
    }


    /**
     * Permet de créer le composant présentant les participants à une 
     * partie
     */
    _renderItemJoueur= ({item}) => {
        if(this.state.partie != undefined) {
            var color  = "red"
            if(this.state.partie.confirme.includes(item.id)) {
                color = "green"
            } else if(this.state.partie.attente.includes(item.id)) {
                color = "#C0C0C0"
            } 

            return(
                <TouchableOpacity style = {styles.containerItemJoueur}
                    onPress = {() => this.goToProfilJoueur(item) }>

                    <Image
                        source = {{uri : item.photo}}
                        style = {styles.photoJoueur}
                    />    

                    {/* View contenant le pseudo est le score*/}
                    <View style = {{justifyContent : "center"}}>
                        <Text>{item.pseudo}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.score}
                            starSize={hp('2.2%')}
                            fullStarColor='#F8CE08'
                            emptyStarColor='#B1ACAC'
                        />
                    </View>  

                    {this.btnsConfirmer(item.id)}

                    {/* View contenant le cercle de couleur */}
                    <View style = {styles.containerCircle}>
                    
                        <View style = {{alignSelf : "flex-end"}}>
                            {this._renderCircleOfColor(color)}
                        </View>
                    </View>

                </TouchableOpacity>
            )
        }
        
    }

    renderBtnRelancer = () => {
        if(this.state.partie != undefined) {
            if(this.monId == this.state.partie.organisateur) {
                return(
                    <TouchableOpacity 
                        style = {styles.btnRelancer}
                        onPress = {() => this.alerteRelancerJoueur()}>
                            <Text>Relancer</Text>
                    </TouchableOpacity>
                )
            }
        }
        
    }

    renderBtnInviterPlusJoueur() {
        if(this.state.partie != undefined) {
            if(this.monId == this.state.partie.organisateur) {
                return(
                    <TouchableOpacity 
                        style = {styles.btnRechercher}
                        onPress = {() => this.inviterPlusdeJoueur()}>
                            <Text>Inviter plus de joueurs</Text>
                    </TouchableOpacity>
                )
            }
        }
    }

    renderBtnRechercherPlusJoueur() {
        if(this.state.partie != undefined) {
            if(this.monId == this.state.partie.organisateur) {
                return(
                    <TouchableOpacity 
                    style = {styles.btnRechercher}
                    onPress = {() => this.rechercherPlusdeJoueurs()}>
                            <Text>Rechercher plus de joueurs</Text>
                    </TouchableOpacity>
                )
            }
        }
    }

    render() {
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('6%')}
                />
            )
        } else if(this.state.partie != undefined) {

        
            var nbJoueurs = this.state.partie.participants.length + this.state.partie.nbJoueursRecherche
            return (
                <View>
                    <Text style  = {{alignSelf : "center"}}>Feuille de match</Text>

                    <Text style = {{marginLeft : wp('3%')}}>Joueurs invités / recherchés : {nbJoueurs} </Text>
                    <Presences_Joueurs
                        nbjoueursConfirmes = {this.state.partie.confirme.length}
                        nbIndisponibles = {this.state.partie.indisponibles.length}
                        nbAttentes = {this.state.partie.attente.length}
                        isPartie = {true}
                        renderBtnRelancer={this.renderBtnRelancer}
                    />

                   

                    {/* Nbr de joueurs recherchés */}
                    <View style ={styles.bloc_disponibilite_joueurs}>
                        {this._renderCircleOfColor(Colors.agooraBlueStronger)}
                        <Text>Joueurs recherchés restant : {this.partie.nbJoueursRecherche}</Text>
                    </View>

                    

                    {/* View contenant les joueurs */}
                    <ScrollView>

                        <View style = {{backgroundColor : Colors.grayItem, flex :1,paddingBottom : 50, marginBottom : hp('30%')}}>
                            <Text style = {styles.txt}>Joueurs invités</Text>

                            <FlatList
                                data = {this.filtreJoueurInvites()}
                                renderItem = {this._renderItemJoueur}
                                extraData = {this.state}
                                keyExtractor={(item) => item.id}
                            />
                        
                            {this.renderBtnInviterPlusJoueur()}
                    
                            <Text style = {styles.txt}>Joueurs Recherchés</Text>

                            {/* Liste des joueurs qui se sont inscris à la partie*/}
                            <FlatList
                                data = {this.filtreJoueurInscris()}
                                renderItem = {this._renderItemJoueur}
                                extraData = {this.state.partie}
                            
                            />
                            <FlatList
                                data = {this.state.joueursRecherche}
                                renderItem = {this._renderItemJoueurRecherche}
                                extraData = {this.state.partie}
                            />

                            {this.renderBtnRechercherPlusJoueur()}
                        </View>
                    
                    </ScrollView>
                </View>
                

            )
        } else {
            return(
                <View>
                    <Text>Une erreur est survenue</Text>
                </View>
            )
        }
    }
}
const styles = {
    circle  : {
        width : wp('5%'),
        height :wp('5%'),
        borderRadius : wp('2.5%'),
        marginRight : wp('3%'),
        marginLeft : wp('3%')
    },

    bloc_disponibilite_joueurs : {
        flexDirection :'row',
        marginTop : hp('2%')
    },

    btnRelancer : {
        borderWidth :2,
        borderColor  : Colors.agooraBlueStronger,
        borderRadius :5,
        marginLeft : wp('5%'),
        paddingHorizontal : wp('2%'),
        paddingVertical : hp('1%')

    },

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

    photoJoueur : {
        width : wp('16%'), 
        height : wp('16%'), 
        borderRadius : wp('8%'),
        marginRight : wp('3%')
    },
    containerCircle : {
        flex: 1,
        justifyContent: 'center',
    },

    txtConfirmer : {
        fontWeight : "bold",
        fontSize : RF(2.5)
    },

    btnRechercher : {
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

    txt : {
        marginLeft : wp('3%'),
        marginTop  : hp('2%'),
        fontSize : RF(2.4)
    }
}

const mapStateToProps = (state) => {
    return{ 
        JoueursParticipantsPartie : state.JoueursParticipantsPartie,
        nbJoueursRecherchesPartie : state.nbJoueursRecherchesPartie
    } 
}
export default connect(mapStateToProps) (Feuille_Partie_A_Venir)
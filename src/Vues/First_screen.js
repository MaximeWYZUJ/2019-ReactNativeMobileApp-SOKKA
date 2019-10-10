import React from 'react'
import {YellowBox, View, Text, ImageBackground,  Image,StyleSheet, Animated,TouchableOpacity, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../Data/Database'
import firebase from 'firebase'
import '@firebase/firestore'
import {SkypeIndicator} from 'react-native-indicators';
import { Constants, Location, Permissions, Notifications } from 'expo';
import LocalUser from '../Data/LocalUser.json'
import villes from '../Components/Creation/villes.json'
import departements from '../Components/Creation/departements.json'
import NormalizeString from '../Helpers/NormalizeString';
import Simple_Loading from '../Components/Loading/Simple_Loading'
import {AsyncStorage} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

/** Pour afficher 5sec faire deux fonction qui affiche qqchose et en fonction du state appeler une ou l'autre */
/**
 * Classe qui permet d'afficher le premier écran de l'application
 */

class First_screen extends React.Component {

   
    static navigationOptions = { title: '', header: null };


    getDepartement(nomVille) {
        for (var i=0; i<villes.length; i++) {
            if (NormalizeString.normalize(nomVille) == NormalizeString.normalize(villes[i].Nom_commune)) {
                var cp = villes[i].Code_postal+"";
                if (cp.length < 5) {
                    cp = "0" + cp;
                }
                var depCode = cp.substr(0, 2);
                for (var j=0; j<departements.length; j++) {
                    if (departements[j].departmentCode === depCode) {
                        return departements[j].departmentName;
                    }
                }
            }
        }
        return "erreur"
    }

    async fonction() {
        /*var db = Database.initialisation();
        var coll = await db.collection("Joueurs").get();
        for (var i=0; i<coll.docs.length; i++) {
            var data = coll.docs[i].data();
            if (data.departement == undefined) {
                var departement = this.getDepartement(data.ville);
            } else {
                var departement = data.departement;
            }
            db.collection("Joueurs").doc(data.id).set({
                ...data,
                pseudoQuery: NormalizeString.decompose(data.pseudo),
                ville: NormalizeString.normalize(data.ville),
                departement: NormalizeString.normalize(departement)
            })
        }*/
    }

    constructor(props) {
        super(props)
        this.props.nav

        this.state = {
            timePassed : false,
            isLoading : true,
            locationResult: null
        }

        this.agorraAnimation = new Animated.ValueXY({ x: 0, y:hp('53%') })
        this.connexionAnimation = new Animated.ValueXY({ x: wp('100%'), y:hp('28%') })
        this.InscriptionAnimation = new Animated.ValueXY({ x: wp('-100%'), y:hp('34%') })

        this.agorraAnimation = new Animated.ValueXY({ x: 0, y:hp('53%') })
        this.connexionAnimation = new Animated.ValueXY({ x: wp('100%'), y:hp('28%') })
        this.InscriptionAnimation = new Animated.ValueXY({ x: wp('-100%'), y:hp('34%') })
    }


    /**
     * Fonction qui permet de déplacer le texte Agoora vers le haut
     */
    _moveAgoora = () => {
        Animated.spring(this.agorraAnimation, {
          toValue: {x: 0, y: hp('8%')},
        }).start()

    }

    /**
     * Fonction qui permet de déplacer le boutton se connecter
     */
    _moveConnexion = () => {
        Animated.spring(this.connexionAnimation, {
          toValue: {x: 0, y: hp('28%')},
        }).start()

    }

    /**
     * Fonction qui permet de déplacer le boutton Inscris toi
     */
    _moveInscription = () => {
        Animated.spring(this.InscriptionAnimation, {
          toValue: {x: 0, y: hp('34%')},
        }).start()

    }

    /**
     * Fonction appelée à la fin du rendu
     */
    componentDidMount(){

        // Cas où l'utilisateur vien de se déconnecter
        this.checkIfUserISConnected()
        setTimeout(() => {
            this.setState({
                isLoading: false
            })
        }, 5000)
        
        // Start counting when the page is loaded
        this.timeoutHandle = setTimeout(()=>{
           this.setState({
                timePassed : true
           })
           this._moveAgoora()
           this._moveConnexion()
           this._moveInscription()

        }, 1000);
   }


    gotoInscription() {
        this.props.navigation.push("choixModeInscription");
    }

    gotoConnexion() {
        this.props.navigation.push("choixModeCo");
    }


    _retrieveData = async () => {
        console.log("in retrieve data")
        try {
          const email = await AsyncStorage.getItem('email');
          const password = await AsyncStorage.getItem('password');
            this.checkConnexion(email,password)
          if (value !== null) {
            // We have data!!
          }
        } catch (error) {
          // Error retrieving data
          console.log(error)
        }
      };

    /**
     * Fonction qui va permettre de vérifier si un utilisateur est déja connecté sur 
     * ce téléphone, si c'est le cas alors on vas directement sur son profil.
     */
    async checkIfUserISConnected() {
        
        console.log("in check token")
        this._retrieveData()

        /*var token =  await this.registerForPushNotifications()

        var doc = await Database.getDocumentData(token, "Login")

        if(doc!= undefined) {
            this.gotoProfilJoueur(doc.id);
            this.storeToken(doc, token);
            //var joueur = await Database.getDocumentData(doc.id, "Joueurs")
        } else {
            console.log("IN ELSE !!!!")
            this.setState({isLoading : false})
        }*/

    }

   /* async registerForPushNotifications() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log('in register')
        if (status !== 'granted') {
            console.log("1")
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          if (status !== 'granted') {
            console.log("2")
            return;
          }
        }
        console.log("okook")
        var token = await Notifications.getExpoPushTokenAsync();
        console.log("after await token")
        //this.subscription = Notifications.addListener(this.handleNotification);
    
        return (token)
    }


    async storeToken(docData, token) {
        // Mettre a jour l'array tokens
        var listeToken = []
        if(docData.tokens != undefined) {
            listeToken = docData.tokens
        } 
        if(! listeToken.includes(token)) {
            listeToken.push(token)
        
            var db = Database.initialisation()
            db.collection("Joueurs").doc(id).update({
                tokens : listeToken
            })
            
            LocalUser.data.tokens = listeToken;
        }
    }


   

 
    gotoProfilJoueur(id) {
       Database.getDocumentData(id, 'Joueurs').then(async (docData) => {
            // Traitement de la collection Equipes
            arrayEquipes = await Database.getArrayDocumentData(docData.equipes, 'Equipes');

            // Traitement des données propres
            docData.naissance = new Date(docData.naissance.toDate());

            // Traitement des données locales
            LocalUser.exists = true;
            LocalUser.data = docData;
            var villePos = this.findPositionVilleFromName(docData.ville);
            LocalUser.geolocalisation = villePos;

            // Envoi
            this.setState({isLoading : false})
            this.props.navigation.navigate("ProfilJoueur", {id: docData.id, joueur : docData, equipes : arrayEquipes})

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
   }*/

      /**
     * Fonction qui renvoie la position de la ville à partir de son nom
     * @param {String} Name : Nom de la ville 
     */
    findPositionVilleFromName(name) {
        for(var i  =  0 ; i < villes.length; i++) {
            if(name.toLocaleLowerCase() == villes[i].Nom_commune.toLocaleLowerCase()) {
                var position = villes[i].coordonnees_gps
                var latitude = position.split(',')[0]
                var longitude = position.split(', ')[1]
                 var pos = {
                    latitude : parseFloat(latitude),
                    longitude : parseFloat(longitude)
                }
               return pos

            }
        }
    }


    /**
     * Fonction qui va permettre d'authentifier un utilisateur
     */
    checkConnexion(email, mdp){
        this.setState({isLoading : true})
        var db = Database.initialisation()

        firebase.auth().signInWithEmailAndPassword(email,mdp)
        .then(async (userCred) => {
            if (userCred.user.emailVerified || !checkEmailVerifie) {
                
                // Récupérations des données de la DB
                j = await Database.getDocumentData(firebase.auth().currentUser.uid, "Joueurs");
                jEquipes = await Database.getArrayDocumentData(j.equipes, 'Equipes');

                // Update des données locales
                LocalUser.exists = true;
                LocalUser.data = j;
                LocalUser.dataEquipesUser = []
                var villePos = this.findPositionVilleFromName(j.ville);
                LocalUser.geolocalisation = villePos;

                // Enregistrement du token
                this.storeToken(j);

                // Passage à la vue suivante
                this.props.navigation.navigate("ProfilJoueur", {id: j.id, joueur: j, equipes: jEquipes});
                this.setState({isLoading: false});
            } else {
                Alert.alert("", "Ce compte n'est pas activé. Si tu n'as pas reçu le mail d'activation, appuie sur le bouton ci-dessous",
                [
                    {text: "Renvoyer le mail d'activation", onPress: () => this.renvoyerMail()}
                ]);
                this.setState({isLoading: false})
            }
        })
        .catch((error) => {
          const { code, message } = error;
            console.log(error)
            this.setState({
                txt : 'Adresse email ou mot de passe incorrect',
                isLoading : false
            })
            // For details of error codes, see the docs
            // The message contains the default Firebase string
            // representation of the error
        });
    }


    async storeToken(j) {
        this.registerForPushNotifications()
        .then(async (token) => {
            let db = Database.initialisation();
            db.collection("Login").doc(token).set({id : j.id});

            var tokenListe =  [] 
            if (j.tokens != undefined) {
                tokenListe = j.tokens
            }
            tokenListe.push(token)
            LocalUser.data.tokens = tokenListe
            db.collection("Joueurs").doc(j.id).update({
                tokens : tokenListe
            })
        })
    }


    async registerForPushNotifications() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log('in register')
        if (status !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          if (status !== 'granted') {
            return;
          }
        }
        console.log("okook")
        var token = await Notifications.getExpoPushTokenAsync();
        console.log("after await token")    
        return (token)
    }




    displayScreen() {

        if(this.state.isLoading) {
            return (
                <View style = {styles.main_container}>
                    <ImageBackground source = {require('app/res/first_screen.jpg')}
                        style = {styles.image_background}>

                       
                        <Simple_Loading
                            taille  = {hp('7%')}
                            style = {{marginTop : hp('2%')}}/>

                        {/* Vue contenant le text en bas de l'écran */}
                        <View style = {styles.View_txt_regle}>
                            <Text>Règles de base</Text>
                            <Text>10 Minutes ou 2 buts</Text>
                            <Text>Le vainqueur engage</Text>
                            <Text>Victoire : Seul le vainqueur reste</Text>
                            <Text>Match nul : les deux équipes sortent</Text>
                            <Text>Tacles interdit</Text>
                            <Text>A toi de les suivre ou de t'adapter à la rencontre</Text>

                            {/* Image de l'herbre */}
                            <Image
                                source = {require('app/res/grass.jpg')}
                                style = {styles.grass}
                            />
                        </View>


                        

                    </ImageBackground>

                </View>
            )
        } else {
                return (
                    <View style = {styles.main_container}>
                        <ImageBackground source = {require('app/res/first_screen.jpg')}
                            style = {styles.image_background}>


                            {/* Vue contenant le text en bas de l'écran */}
                            <View style = {styles.View_txt_regle}>
                                <Text>Règles de base</Text>
                                <Text>10 Minutes ou 2 buts</Text>
                                <Text>Le vainqueur engage</Text>
                                <Text>Victoire : Seul le vainqueur reste</Text>
                                <Text>Match nul : les deux équipes sortent</Text>
                                <Text>Tacles interdit</Text>
                                <Text>A toi de les suivre ou de t'adapter à la rencontre</Text>

                                {/* Image de l'herbre */}
                                <Image
                                    source = {require('app/res/grass.jpg')}
                                    style = {styles.grass}
                                />
                            </View>


                            {/*View contenant le txt Agoora */}
                            <Animated.View style={[styles.animatedConnexion,this.agorraAnimation.getLayout()]}>
                                    <Text style = {styles.txt}>SOKKA</Text>
                            </Animated.View>

                            {/* View contenant le boutton se connecter */}
                            <Animated.View style={this.connexionAnimation.getLayout()}>
                                    <TouchableOpacity
                                        style = {styles.animatedConnexion}
                                        onPress = {() => this.gotoInscription()}
                                        >
                                        <Text style = {styles.txt}>Inscription</Text>
                                    </TouchableOpacity>
                            </Animated.View>

                            {/* View contenant le boutton s'inscrire */}
                            <Animated.View style={this.InscriptionAnimation.getLayout()}>
                                    <TouchableOpacity
                                        style = {styles.animatedConnexion}
                                        onPress={() => this.gotoConnexion()}
                                        >
                                        <Text style = {styles.txt}>Connexion</Text>

                                    </TouchableOpacity>
                            </Animated.View>

                        </ImageBackground>

                    </View>
                )
           
        }

    }


    render() {
        return (
            <View style = {styles.main_container}>
                {this.displayScreen()}
            </View>
        )
    }

}

const styles =  StyleSheet.create({

    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },

    image_background  : {
        width : wp('100%'),
        flex : 1
    },

    View_txt_regle : {
        backgroundColor : 'white',
        alignItems : 'center',
        position : 'absolute',
        bottom : 0,
        right : 0,
        paddingTop : hp('2%')


    },

    grass : {
        width : wp('100%'),
        height : wp('22%')
    },

    view_agoora : {
        backgroundColor : 'white',
        paddingBottom : hp('2%'),
        paddingTop : hp('2%'),
        width : wp('70%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        position : 'absolute',
        bottom : hp('38%'),


    },
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
      },

    animatedConnexion: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft : wp('15%'),
        marginRight : wp('15%'),
        paddingTop  : wp('5%'),
        paddingBottom : wp('5%')

    },
    button: {
        paddingTop: 24,
        paddingBottom: 24,
    },
    buttonText: {
        fontSize: 24,
        color: '#333',
    },
    button : {
        color : 'white',
    },
    txt : {
        fontSize : RF(3.3)
    }
})

export default (First_screen)

import React from 'react'
import { View, Text, ImageBackground,  Image,StyleSheet, Animated,TouchableOpacity, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Database from '../Data/Database'
import firebase from 'firebase'
import '@firebase/firestore'
import {  Permissions, Notifications } from 'expo';
import LocalUser from '../Data/LocalUser.json'
import villes from '../Components/Creation/villes.json'
import departements from '../Components/Creation/departements.json'
import NormalizeString from '../Helpers/NormalizeString';
import Simple_Loading from '../Components/Loading/Simple_Loading'
import {AsyncStorage} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Sokka_Main_Component from './Sokka_Main_Component'
import Svg, { Path,SvgXml } from 'react-native-svg'
import SVGImage from 'react-native-svg-image';
import * as Font from 'expo-font';


/**
 * Classe qui permet d'afficher le premier écran de l'application
 */
class First_screen extends React.Component {

    static navigationOptions = { title: '', header: null };


    constructor(props) {
        super(props)
        this.props.nav

        this.state = {
            timePassed : false,
            isLoading : true,
            locationResult: null,
            fontsLoaded : false
        }
    }


    /**
     * Fonction appelée à la fin du rendu
     */
  async componentDidMount(){

    await Font.loadAsync({
        "montserrat-light": require("../../assets/fonts/montserrat-light.ttf"),       
        "montserrat-extrabold" :require("../../assets/fonts/montserrat-extrabold.ttf"), 
        "montserrat-regular" :require("../../assets/fonts/montserrat-regular.ttf"), 
        "montserrat-bold" :require("../../assets/fonts/montserrat-bold.ttf"), 

    });
    this.setState({fontsLoaded: true});
        // Cas où l'utilisateur vien de se déconnecter
        this.checkIfUserISConnected()
       
        // Start counting when the page is loaded
        this.timeoutHandle = setTimeout(()=>{
           this.setState({
                timePassed : true,
                isLoading : false
           })
        }, 5000);

      
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
    }


   

 
  

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


    // ======================================================================================
    //==================================== RENDER FUNCTIONS =================================
     // ======================================================================================


    renderLoading(){
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille  = {hp('7%')}
                    style = {{marginTop : hp('4%'), position: "absolute", alignSelf : "center"}}/>
            )
        }
    }


    renderMainFrame(){
       if(this.state.fontsLoaded) {
            return(
                <View style = {{flex : 1}}>

                    <View style = {{alignItems : "center", marginTop : hp("3%"), zIndex : 2}}>
                        <Image
                            source = {require("../../res/sokka_title.png")}
                            style = {{ marginBottom: hp("1.4%"), width : wp("46%"), resizeMode : "contain"}}/>
                    
                    <View>
                            <Image
                                source = {require("../../res/sokka_circle.png")}
                                style = {{ width : hp('36%'), height :hp('36%')}}/>
                            
                            <Text style = {{position : "absolute",fontFamily : "montserrat-light", fontSize : 9, alignSelf : "center"}}>MATCHS - JOUEURS - ÉQUIPES</Text>
    
                        </View>
                    
                    </View>

                    <View style = {{marginTop : hp("1.3%"), paddingLeft : wp('6.4%'), paddingEnd : 16}}>
                        <Text style ={styles.big_txt} >ON AIME LE</Text>
                        <Text style = {styles.title}>FOOT</Text>
                        <Text style = {{marginTop : 16, fontFamily : "montserrat-light", fontSize : 13, marginEnd : wp('10.54')}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim dolor nulla, ut faucibus dolor finibus eget..</Text>
                    </View>

                     <View style = {{position : "absolute", width : wp('100%')}}>
                         {this.renderLoading()}
                     </View>
                </View>              
            )
        } else {
            return(
                <View>

                </View>
            )
        }
    }

    renderSideFrame(){
        if(this.state.fontsLoaded) {
            return(
                <View style = {{flexDirection : "row", paddingLeft : wp("5.6%")}}>
                    <Image
                        style = {{alignSelf : "center",width : 82, height :7}}
                        source = {require("../../res/step_1.png")}
                    />
                    <Text style = {{fontFamily : "montserrat-light", fontSize : 11, marginLeft : wp("14%"), marginEnd : wp("3%")}}>{"CONNEXION OU\nINSCRIPTION"}</Text>
                </View>
            )
        } else {
            return(
                <View>

                </View>
            )
        }
    }

    renderButton(){
        return(
            <TouchableOpacity 
                onPress = {() => this.gotoConnexion()}
            style = {{paddingVertical : 13, paddingHorizontal : 28}}>
                <Image
                    source = {require("../../res/right_arrow.png")}
                    style = {{width : 25, height : 17}}
                    />
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <Sokka_Main_Component
                main_frame = {this.renderMainFrame()}
                side_frame = {this.renderSideFrame()}
                button = {this.renderButton()}
                topBarHidden = {true}
                backgroundColor = {"white"} />
        )
    }

}

const styles =  StyleSheet.create({

    title: {
        fontSize: 66,
        fontFamily : "montserrat-extrabold",
        marginTop : -20
    },

    big_txt : {
        fontSize: 32,
        fontFamily : "montserrat-light",
    },

    txt_foot : {
        fontSize: 66,
    },

})

export default (First_screen)

import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../Data/Database'
import firebase from 'firebase'
import '@firebase/firestore'
import Terrains from '../Helpers/Toulouse'
import {SkypeIndicator} from 'react-native-indicators';
import { Constants, Location, Permissions } from 'expo';
import LocalUser from '../Data/LocalUser.json'

const erreur_gps_pas_active = "Location services are disabled"

/** Pour afficher 5sec faire deux fonction qui affiche qqchose et en fonction du state appeler une ou l'autre */
/**
 * Classe qui permet d'afficher le premier écran de l'application
 */

class First_screen extends React.Component {

    static navigationOptions = { title: '', header: null };

    constructor(props) {
        super(props)
        if (LocalUser.exists) {
            j = LocalUser.data;
            this.props.navigation.push("ProfilJoueur", {id: j.id, joueur: j, equipes: []});
        } else {
            this.state = {
                timePassed : false,
                isLoading : false,
                locationResult: null
            }

            this.agorraAnimation = new Animated.ValueXY({ x: 0, y:hp('53%') })
            this.connexionAnimation = new Animated.ValueXY({ x: wp('100%'), y:hp('28%') })
            this.InscriptionAnimation = new Animated.ValueXY({ x: wp('-100%'), y:hp('34%') })
        }
        this.agorraAnimation = new Animated.ValueXY({ x: 0, y:hp('53%') })
        this.connexionAnimation = new Animated.ValueXY({ x: wp('100%'), y:hp('28%') })
        this.InscriptionAnimation = new Animated.ValueXY({ x: wp('-100%'), y:hp('34%') })
       //this._storeTerrains()
       this.test = this.test.bind(this)

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

    test() {
        this.props.showNotification({
            title: 'You pressed it!',
            message: 'The notification has been triggered',
            onPress: () => Alert.alert('Alert', 'You clicked the notification!')
          });
    }
    /**
     * Fonction appelée à la fin du rendu
     */
    componentDidMount(){


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

   _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
        this.setState({
        locationResult: 'Permission to access location was denied',
        });
        }
        let location = await Location.getCurrentPositionAsync({});
        console.log(location)
        this.setState({ locationResult: JSON.stringify(location) });
        };


    gotoInscription() {
        this.props.navigation.push("choixModeInscription");
    }

    gotoConnexion() {
        this.props.navigation.push("choixModeCo");
    }


   gotoMapTerrains() {

        this._getLocationAsync();
        this.setState({isLoading : true})


        navigator.geolocation.getCurrentPosition(

            (position) => {
                // Calculer la distance pour tous les terrains
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                this.setState({isLoading : false})
                this.props.navigation.push("RechercherTerrainsMap", {latitude : latUser, longitude : longUser})

            },
            (error) => {
                Alert.alert("Tu dois obligatoirement activer ton gps ! ")
                this.setState({isLoading : false})
                console.log(error.message)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge : 3600000}
            //{ enableHighAccuracy: true, timeout: 20000, maximumAge : 300000}

        )
    }

   gotoRechercherTerrainNom() {
    navigator.geolocation.getCurrentPosition(

        (position) => {

            // Calculer la distance pour tous les terrains
            let latUser = position.coords.latitude
            let longUser = position.coords.longitude
            this.props.navigation.push("RechercherTerrainsNom", {latitude : latUser, longitude : longUser})

        })
   }

   gotoAccueillJouer() {
        this.props.navigation.push("AccueilJouer", {})

    /*navigator.geolocation.getCurrentPosition(

        (position) => {
            // Calculer la distance pour tous les terrains
            let latUser = position.coords.latitude
            let longUser = position.coords.longitude
            console.log(latUser)
            this.props.navigation.push("AccueilJouer", {latitude : 44.9902646, longitude : 1.5267866})

        })*/
   }

   gotoProfilJoueur(id) {
       Database.getDocumentData(id, 'Joueurs').then(async (docData) => {
            // Traitement de la collection Reseau
            arrayReseau = [];
            for (idReseau of docData.reseau) {
                idReseauData = await Database.getDocumentData(idReseau, 'Joueurs');
                arrayReseau.push(idReseauData);
            }

            // Traitement de la collection Equipes
            arrayEquipes = await Database.getArrayDocumentData(docData.equipes, 'Equipes');

            // Traitement des données propres
            docData.naissance = new Date(docData.naissance.toDate());

            // Traitement des données locales
            LocalUser.exists = true;
            LocalUser.data = docData;

            // Envoi
            this.props.navigation.navigate("ProfilJoueur", {id: docData.id, joueur : docData, equipes : arrayEquipes})

        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
   }



    displayScreen() {

        if(! this.state.isLoading) {
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
                                {/*onPress={() => this.gotoMapTerrains()}*/}
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
                                    //onPress={() => this.gotoProfilJoueur("aPyjfKVxEU4OF3GtWgQrYksLToxW2")}
                                    >
                                    <Text style = {styles.txt}>Connexion</Text>

                                </TouchableOpacity>
                        </Animated.View>

                    </ImageBackground>

                </View>
            )
        } else {
            return(
                <View style = {styles.main_container}>
                    {/* Image de l'herbre */}
                    <View style = {styles.View_grass}>
                        <Image
                            source = {require('app/res/grass.jpg')}
                            style = {styles.grass}
                        />
                    </View>

                    {/* View contenant le text Agoora */}
                    <View style = {styles.view_agoora}>
                        <Text style = {styles.txt_agoora}>SOKKAk</Text>
                    </View>

                    {/* View contenant le texte */}
                    <View style = {{marginTop :hp('30%')}}>
                        <Text style = {{fontSize : RF(2.5)}}>Chargement</Text>
                    </View>

                    {/* Indicateur de chargement */}
                    <SkypeIndicator
                    color='#52C7FD'
                    size = {hp('10%')} />
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

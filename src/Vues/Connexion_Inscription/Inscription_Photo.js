import React from 'react'

import {View, Text,Image,TouchableOpacity,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { ImagePicker } from 'expo';
import Database from '../../Data/Database'
import NormalizeString from '../../Helpers/NormalizeString.js';
import Permissions from 'react-native-permissions'
import * as firebase from 'firebase';
import '@firebase/firestore'
import FileUploader from  'react-firebase-file-uploader';
import {SkypeIndicator} from 'react-native-indicators';
import LocalUser from '../../Data/LocalUser.json';

  
/**
 * Classe qui permet à l'utilisateur de choisir ou non sa photo de profil et 
 * de terminer l'inscription.
 */
export default class Inscription_Photo extends React.Component {

    
    constructor(props) {
        super(props)    

        /* On recupère le mail et le mdp de l'utilisateur. */
        const { navigation } = this.props;
        const mail = navigation.getParam('mail', ' ');
        const mdp = navigation.getParam('mdp', ' ');
        const nom = navigation.getParam('nom', ' ');
        const prenom = navigation.getParam('prenom', ' ');
        const pseudo = navigation.getParam('pseudo', ' ');
        const ville = navigation.getParam('ville', '');
        const naissance = navigation.getParam('naissance', ' ');
        const age = navigation.getParam('age','');
        const zone = navigation.getParam('zone', '');

        this.state = {
            nom : nom,
            prenom : prenom,
            pseudo : pseudo,
            mail : mail,
            mdp : mdp,
            photo: require('app/res/camera_icone.png'),
            txt_btn : 'PASSER',
            user_uid : ' ',
            image_changed : false,
            isLoading : false,
            ville : ville,
            naissance : naissance,
            age : age,
            zone : zone
        }
    }

    //***************************************************************************
    //********************** CHOIX DE LA PHOTO DE PROFIL ************************
    //***************************************************************************

    /**
     * Fonction qui permet d'ouvrir la galerie et de permettre à l'utilisateur
     * de choisir une photo de profil
     */
    _pickImage = async () => {

        
        /* Obtenir les permissions. */
        const { Permissions } = Expo;
        const { status: cameraRollPermission } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        /* Ouvrir la galerie. */
        let result = await Expo.ImagePicker.launchImageLibraryAsync({
        });

        /* Si l'utilisateur à choisis une image. */
        if (!result.cancelled) {
            this.setState({ 
              photo: {uri : result.uri },
              txt_btn : 'SUIVANT',
              image_changed : true
            });
        }
    };

   

    
    //*******************************************************************************
    //**************************** SAUVEGARDE DES DONNEES ***************************
    //*******************************************************************************


    /**
     * Fonction qui permet d'enregistrer l'utilisateur dans 
     * la base de données
     */
    saveUserInDataBase = async () => {

        /* Changer le state isLoading */
        this.setState({
            isLoading : true
        })
        /* Initialiser la db. */
        var db  = Database.initialisation()

        /*Creer un nouvel utilisateur */
        const mail = this.state.mail
        const nom = this.state.prenom + " " + this.state.nom
        const pseudo = this.state.pseudo
        const image_changed = this.state.image_changed

        /* Uploader la photo de profil et enregister l'utilisateur. */
        if(image_changed){
            this.uploadImageFinal(this.state.photo.uri, this.state.pseudo)
                .then(() => {
                    //Alert.alert("Success");
                    this.uploadUser(image_changed)

                    this.props.navigation.push("ConfimationInscription", {
                        pseudo : pseudo,
                        photo : this.state.photo.uri
                    })
                    
                })
                .catch((error) => {
                    Alert.alert(error);
                    console.log("erreur !! ", error)
                });
        }
    }

    /**
     * Permet de récuprer l'url de téléchargement de l'image et d'enregistrer l'image
     * image_change : bool : true si l'user renseigne une image 
     */
    async uploadUser(image_changed) {
        //var db  = Database.initialisation()
        //var urlPhoto = 'erreur'
        var fileName = this.state.pseudo
        /*var nom = this.state.prenom + ' ' + this.state.nom
        var mail = this.state.mail
        var age = this.state.age
        var naissance = this.state.naissance
        var ville = this.state.ville
        var zone = this.state.zone*/
        const oldState = this.state;

        firebase.auth().createUserWithEmailAndPassword(this.state.mail, this.state.mdp)
        .then(function(data){
            var id = data.user.uid

            /* Obtenir une ref à la photo. */
            if(image_changed) {
                var ref = firebase.storage().ref().child("Photos_profil_Joueurs/test/" + fileName)

                /* Une fois qu'on a l'url on peut enregistrer les données de
                 l'utilisateurdans firebase. */
                ref.getDownloadURL().then(function(url) {
                    user = {
                        id: id,
                        age: oldState.age,
                        aiment: [],
                        equipes: [],
                        equipesFav: [],
                        fiabilite: 0,
                        mail: oldState.mail,
                        naissance: firebase.firestore.Timestamp.fromMillis(Date.parse(oldState.naissance)),
                        nom: oldState.prenom+" "+oldState.nom,
                        photo: url,
                        //position: ???,
                        position: null,
                        pseudo: oldState.pseudo,
                        queryPseudo: NormalizeString.normalize(oldState.pseudo),
                        reseau: [],
                        score: 0,
                        telephone: "XX.XX.XX.XX.XX",
                        terrains: [],
                        ville: oldState.ville,
                        zone: oldState.zone
                    }
                    
                    // Stockage en local
                    LocalUser.exists = true;
                    LocalUser.data = user;

                    // Stockage dans la DB
                    Database.addDocToCollection(user, id, 'Joueurs')

                }, function(error){
                    console.log(error);
                    return 'erreur'
                });
            } else {
                user = {
                    id: id,
                    age: oldState.age,
                    aiment: [],
                    equipes: [],
                    equipesFav: [],
                    fiabilite: 0,
                    mail: oldState.mail,
                    naissance: firebase.firestore.Timestamp.fromMillis(Date.parse(oldState.naissance)),
                    nom: oldState.prenom+" "+oldState.nom,
                    photo: null,
                    //position: ???,
                    position: null,
                    pseudo: oldState.pseudo,
                    queryPseudo: NormalizeString.normalize(oldState.pseudo),
                    reseau: [],
                    score: 0,
                    telephone: "XX.XX.XX.XX.XX",
                    terrains: [],
                    ville: oldState.ville,
                    zone: oldState.zone
                }

                // Stockage en local
                LocalUser.exists = true;
                LocalUser.data = user;

                // Stockage dans la DB
                Database.addDocToCollection(user, id, 'Joueurs')
            }
        }).catch(function(error) {
              console.log(error)
              return 'erreur'
          });
    }
       
    
    

    /**
     * Fonction qui va permettre d'uploader la photo de profil dans le storage
     * firebase.
     * 
     * uri : uri de la photo de profil
     * imageName : Nom à donner au fichier sur le storage
     */
    uploadImageFinal = async (uri, imageName) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response);
            };
            xhr.onerror = function() {
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        var ref = firebase.storage().ref().child("Photos_profil_Joueurs/test/" + imageName);
        return ref.put(blob);
    }


    //*********************************************************************************
    //**************************** AFFICHAGE DE LA VUE ********************************
    //*********************************************************************************
     
    /**
     * Fonction qui permet de gérer l'affichage de la vue en 
     * fonction de l'état de chargement des données.
     * Au début on affiche la vue qui permet à l'utilisateur de choisir
     * sa photo de profil, puis quand il appuis sur le bouton on affiche 
     * une page de chargement.
     */
    diaplayRender() {
        if( ! this.state.isLoading) {
            return(
                <View style ={[styles.main_container]}>
    
                    {/* View contenant le text Agoora */}
                    <View style = {styles.view_agoora}>
                        <Text style = {styles.txt_agoora}>AgOOra</Text>
                    </View>
    
                    {/* Image de l'herbre */}
                    <View style = {styles.View_grass}>
                        <Image 
                            source = {require('app/res/grass.jpg')}
                            style = {styles.grass}
                        />
                    </View>
    
                    {/* Vue contenant le boutton photo et les textes de la page */}
                    <View>
                        <Text 
                            style = {styles.txt_haut}>
                            Choisi ta photo ! 
                        </Text>
    
                        <TouchableOpacity 
                            style = {{marginBottom :hp('3%'), marginTop : hp('3%'), alignItems : 'center'}}
                            onPress={this._pickImage}>
                            <Image
                                style = {{width : wp('30%'), height : wp('30%'), alignSelf : 'center'}}
                                source={this.state.photo}/>
    
                        
                        
                        </TouchableOpacity>
    
                        <Text style = {styles.txt_bas}>Elle permettra aux autres joueurs</Text>
                        <Text style = {styles.txt_bas}>de te reconnaitre plus facilement !!</Text>
    
                        {/* Bouton passer */}
                        <View style = {{marginTop : hp('4%')}}>
                            <TouchableOpacity 
                                style = {styles.btn_passer}
                                onPress = {this.saveUserInDataBase}
                            >
                                    <Text style = {styles.txt_btn}>{this.state.txt_btn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>        
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
                        <Text style = {styles.txt_agoora}>AgOOra</Text>
                    </View>
                
                    {/* View contenant le texte */}
                    <View style = {{marginTop :hp('30%')}}>
                        <Text style = {{fontSize : RF(2.5)}}>Un instant, nous traitons les données</Text>
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
        return(
            <View style ={[styles.main_container ]}>
            {this.diaplayRender()}
            </View>
        )
    }
}

//***************************************************************************
//******************************* STYLES ************************************
//***************************************************************************



const styles = {
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    grass : {
        width : wp('100%'),
        height : wp('22%')
    },

    View_grass : {
        backgroundColor : 'white',
        alignItems : 'center',
        position : 'absolute',
        bottom : 0,
        right : 0,
        paddingTop : hp('2%')

        
    },
    txt_agoora : {
        fontSize : RF(3.5),
        fontWeight : 'bold'
    },

    view_agoora : {
        borderWidth : 1,
        //position : 'absolute',
        top : hp('-16%'),
        paddingTop : hp('2%'),
        paddingBottom : hp('2%'),
        width : wp('70%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        
    },
    btn_passer : {
        backgroundColor:'white',
        width : wp('88%'),
        paddingTop : wp('3%'),
        paddingBottom : wp('3%'),
        paddingLeft : wp('2%'),
        borderRadius : 6,
        borderWidth : 1,
        alignItems : 'center'
    },

    txt_haut : {
        marginBottom :hp('3%'), 
        alignSelf : 'center',
        fontSize : RF(3)
    },
    txt_bas : {
        alignSelf : 'center',
        fontSize : RF(3)
    }
}
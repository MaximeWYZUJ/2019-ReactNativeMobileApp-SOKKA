import React from 'react'

import {View, Text, Image, TouchableOpacity, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { Camera, ImagePicker, Permissions } from 'expo';
import Database from '../../Data/Database'
import villes from '../../Components/Creation/villes.json'
import departements from '../../Components/Creation/departements.json'
import NormalizeString from '../../Helpers/NormalizeString.js';
import * as firebase from 'firebase';
import '@firebase/firestore'
import FileUploader from  'react-firebase-file-uploader';
import {SkypeIndicator} from 'react-native-indicators';
import LocalUser from '../../Data/LocalUser.json';
import Notification from '../../Helpers/Notifications/Notification'

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
        const sexe = navigation.getParam('sexe', ' ');
        const ville = navigation.getParam('ville', '');
        const naissance = navigation.getParam('naissance', ' ');
        const age = navigation.getParam('age','');
        const zone = navigation.getParam('zone', '');
        const departement = this.getDepartement(ville);

        this.state = {
            nom : nom,
            prenom : prenom,
            pseudo : pseudo,
            sexe: sexe,
            mail : mail,
            mdp : mdp,
            photo: require('app/res/camera_icone.png'),
            txt_btn : 'PASSER',
            user_uid : ' ',
            image_changed : false,
            isLoading : false,
            ville : ville,
            departement: departement,
            naissance : naissance,
            age : age,
            zone : zone,
            id : "erreur",

            usingCamera: false
        }
    }


    getDepartement(nomVille) {
        for (var i=0; i<villes.length; i++) {
            if (nomVille === villes[i].Nom_commune) {
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


    //***************************************************************************
    //********************** CHOIX DE LA PHOTO DE PROFIL ************************
    //***************************************************************************

    /**
     * Fonction qui permet d'ouvrir la galerie et de permettre à l'utilisateur
     * de choisir une photo de profil
     */
    pickImageGallerie = async () => {

        
        /* Obtenir les permissions. */
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status === "granted") {
            /* Ouvrir la galerie. */
            let result = await ImagePicker.launchImageLibraryAsync({
            });

            /* Si l'utilisateur à choisis une image. */
            if (!result.cancelled) {
                this.setState({ 
                photo: {uri : result.uri },
                txt_btn : 'SUIVANT',
                image_changed : true
                });
            }
        }
    };


    /**
     * Fonction qui permet de prendre une photo depuis la camera
     */
    pickImageCamera = async () => {
        /* Obtenir les permissions. */
        const { status } = await Permissions.askAsync(Permissions.CAMERA);

        if (status === "granted") {
            this.setState({usingCamera: true})
        }
    };

    snapPhoto = async () => {
        let photo = await this.camera.takePictureAsync();
        this.setState({
            photo: {uri: photo.uri},
            txt_btn: 'SUIVANT',
            image_changed: true,
            usingCamera: false
        })
    }
   

    
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

                    this.uploadUser(image_changed).then(() => {
                        this.props.navigation.navigate('ConfirmationInscription', {pseudo: LocalUser.data.pseudo, photo: LocalUser.data.photo})
                    });
                })
                .catch((error) => {
                    Alert.alert(error);
                    console.log("erreur !! ", error)
                });

        } else {
            this.uploadUser(image_changed).then(() => {
                this.props.navigation.navigate('ConfirmationInscription', {pseudo: LocalUser.data.pseudo, photo: LocalUser.data.photo});
            });
        }
    }

    /**
     * Permet de récuprer l'url de téléchargement de l'image et d'enregistrer l'image
     * image_change : bool : true si l'user renseigne une image 
     */
    async uploadUser(image_changed) {
        console.log("in uploadUser")
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
            console.log("id")
            /* Obtenir une ref à la photo. */
            if(image_changed) {
                var ref = firebase.storage().ref().child("Photos_profil_Joueurs/test/" + fileName)

                /* Une fois qu'on a l'url on peut enregistrer les données de
                 l'utilisateurdans firebase. */
                ref.getDownloadURL().then(function(url) {
                    
                    Notification.storeTokenInLogin(id).then(function() {
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
                            nomQuery : NormalizeString.decompose(oldState.prenom+" "+oldState.nom),
                            prenomQuery : NormalizeString.decompose(oldState.prenom),
                            photo: url,
                            //position: ???,
                            position: null,
                            pseudo: oldState.pseudo,
                            queryPseudo: NormalizeString.normalize(oldState.pseudo),
                            sexe: oldState.sexe,
                            reseau: [],
                            score: 0,
                            telephone: "XX.XX.XX.XX.XX",
                            terrains: [],
                            ville: oldState.ville,
                            departement: oldState.departement,
                            zone: oldState.zone,
                            poste: "mixte"
                        }
                        
                        console.log("before store localUser")
                        // Stockage en local
                        LocalUser.exists = true;
                        LocalUser.data = user;
                        LocalUser.data.naissance = new Date(user.naissance.toDate());
    
                        // Stockage dans la DB
                        Database.addDocToCollection(user, id, 'Joueurs')

                        return user;
                    })

                }, function(error){
                    console.log(error);
                    return 'erreur'
                });
            } else {
                Notification.storeTokenInLogin(id).then(function() {
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
                        sexe: oldState.sexe,
                        reseau: [],
                        score: 0,
                        telephone: "XX.XX.XX.XX.XX",
                        terrains: [],
                        ville: oldState.ville,
                        departement: oldState.departement,
                        zone: oldState.zone,
                        poste: "mixte"
                    }

                    // Stockage en local
                    LocalUser.exists = true;
                    LocalUser.data = user;
                    LocalUser.data.naissance = new Date(user.naissance.toDate());

                    // Stockage dans la DB
                    Database.addDocToCollection(user, id, 'Joueurs')

                    return user;
                });
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
                        <Text style = {styles.txt_agoora}>SOKKA</Text>
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
                            onPress={
                                () => Alert.alert(
                                '',
                                "Comment veux-tu prendre la photo ?",
                                [
                                    {
                                        text: 'Caméra',
                                        onPress: () => this.pickImageCamera(),
                                    },
                                    {
                                        text: 'Gallerie',
                                        onPress: () => this.pickImageGallerie(),
                                        style: 'cancel',
                                    },
                                ],
                                )}>
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
                        <Text style = {styles.txt_agoora}>SOKKA</Text>
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
        if (this.state.usingCamera) {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => {this.camera = ref}}>
                        <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                        }}>
                            <TouchableOpacity
                                style={{
                                flex: 1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                                }}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> FLIP </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                flex: 1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                                }}
                                onPress={this.snapPhoto}>
                                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> SNAP </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            )
        } else {
            return(
                <View style ={[styles.main_container ]}>
                {this.diaplayRender()}
                </View>
            )
        }
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
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    }
}
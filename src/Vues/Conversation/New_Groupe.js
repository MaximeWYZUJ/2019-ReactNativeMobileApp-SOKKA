
import React from 'react'
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert,TextInput,KeyboardAvoidingView,SafeAreaView } from 'react-native'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'
import StarRating from 'react-native-star-rating'
import { Camera, ImagePicker, Permissions } from 'expo';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import AlphabetListView from 'react-native-alphabetlistview'
import { CheckBox } from 'react-native-elements'
import * as firebase from 'firebase';
import '@firebase/firestore'

import Joueur_Pseudo_Score from '../../Components/ProfilJoueur/Joueur_Pseudo_Score'

export default class New_Groupe extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            joueursSelectionnes : props.navigation.getParam("joueurs", []),
            txt : "",
            photo : require("../../../res/choix_photo.png"),
            image_changed : false,
            usingCamera : false,
            isLoading : false
        }
    }

    texteChanged = (searchedText) => {
        this.setState({txt : searchedText})
    };


    
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
                image_changed : true
                });
            }
        }
    };


    saveGroupInDataBase = async () => {

        /* Changer le state isLoading */
        this.setState({
            isLoading : true
        })
        /* Initialiser la db. */
        var db  = Database.initialisation()

        /*Creer un nouvel utilisateur */
        const image_changed = this.state.image_changed

        /* Uploader la photo de profil et enregister l'utilisateur. */
        if(image_changed){
            this.uploadImageFinal(this.state.photo.uri, this.state.txt)
                .then(() => {

                    this.uploadUser(image_changed).then((groupe) => {
                        console.log(groupe)
                        this.props.navigation.navigate('AccueilConversation')
                    });
                })
                .catch((error) => {
                    Alert.alert(error);
                    console.log("erreur !! ", error)
                });

        } else {
            this.uploadUser(image_changed).then((groupe) => {
                console.log(groupe)
                this.props.navigation.navigate('ListMessages', {conv : groupe})
            });
        }
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
        var ref = firebase.storage().ref().child("Photos_Groupes/test/" + imageName);
        return ref.put(blob);
    }





    /**
     * Permet de récuprer l'url de téléchargement de l'image et d'enregistrer l'image
     * image_change : bool : true si l'user renseigne une image 
     */
    async uploadUser(image_changed) {
        console.log("in uploadUser")
        
        var fileName = this.state.txt
        const oldState = this.state;
        var participants = this.buildParticipants()
        console.log(participants)
        var db = Database.initialisation()
                var refGroupe = db.collection("Conversations").doc()
            /* Obtenir une ref à la photo. */
            if(image_changed) {
                var ref = firebase.storage().ref().child("Photos_Groupes/test/" + fileName)
                console.log("before get url")
                /* Une fois qu'on a l'url on peut enregistrer les données de
                 l'utilisateurdans firebase. */
                 await ref.getDownloadURL().then( function(url) {
                    
                        groupe = {
                            aLue : false,
                            estUnGroupe : true,
                            id : refGroupe.id,
                            lecteurs : [LocalUser.data.id],
                            nom : fileName,
                            participants : participants,
                            admin : LocalUser.data.id,
                            photo :url,
                            dateDernierMessage : Date.parse(new Date()),
                            txtDernierMsg : " "
                        }
                        console.log(groupe)

                        // Stockage dans la DB
                        Database.addDocToCollection(groupe, refGroupe.id, 'Conversations')
                        return groupe;

                }, function(error){
                    console.log(error);
                    return 'erreur'
                });
            } else {
                groupe = {
                    aLue : false,
                    estUnGroupe : true,
                    id : refGroupe.id,
                    lecteurs : [LocalUser.data.id],
                    nom : fileName,
                    participants : participants,
                    admin : LocalUser.data.id,
                    dateDernierMessage : Date.parse(new Date()),
                    txtDernierMsg : " "

                }  
                console.log(groupe)
                    // Stockage dans la DB
                    Database.addDocToCollection(groupe, refGroupe.id, 'Conversations')
                    console.log("after added")
                    return groupe;
            }
        
    }

    buildParticipants(){
        var liste = []
        for(var i = 0; i < this.state.joueursSelectionnes.length; i++) {
            liste.push(this.state.joueursSelectionnes[i].id)
        }
        liste.push(LocalUser.data.id)
        return liste
    }



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
    renderHeader(){
            return(
                <View style = {{flexDirection : "row", justifyContent : "space-between", marginTop : hp('1%')}}>
                    <View style = {{width : wp('2%')}}></View>
                    <Text style = {styles.titre}>Nouveau groupe</Text>
                    {this.renderBtnCreer()}
                </View>
            )
    }

 

    renderItem = ({item}) => {
        return(
            <Joueur_Pseudo_Score
                pseudo = {item.pseudo}
                score = {item.score}
                photo= {item.photo}/>
        )
    }

    renderBtnCreer(){
        if(this.state.txt.length > 1) {
            return(
                <TouchableOpacity
                    onPress = {this.saveGroupInDataBase}>
                    <Text style = {styles.creer}>Créer</Text>
                </TouchableOpacity>
            )
        } else {
            return(
                <Text style = {{marginRight : wp('2%')}}>Créer</Text>
            )
        }
    }
    render(){
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
        } else if(! this.state.isLoading) {

            return(
                <View>
                    
                    {this.renderHeader()}

                    
                    <View style = {{flexDirection : "row", justifyContent : "space-around", marginTop : hp('2.5%')}}>
                    <TouchableOpacity
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
                                source = {this.state.photo}
                                style = {{width : wp('10%'), height : wp('10%'), marginRight : wp('1%')}}/>
                    </TouchableOpacity>
                        
                        
                        <View>
                            <Text>Nom du groupe</Text>
                            <TextInput
                                style = {{width : wp('50%'), borderWidth : 1, borderRadius : wp('2%')}}
                                onChangeText = {this.texteChanged}
                            />
                        </View>



                    </View>

                    <View style = {{width :wp('100%'), paddingVertical : hp('1%'), backgroundColor : Color.grayItem, marginTop : hp('2%')}}>
                        <Text style = {{color : "#A0A0A0", marginLeft : wp('4%')}}>Participants {this.state.joueursSelectionnes.length} sur {LocalUser.data.reseau.length} </Text>
                    </View>

                    <FlatList
                        data = {this.state.joueursSelectionnes}
                        renderItem = {this.renderItem}
                    />
                </View>
            )
        }   else {
            return(
                <Simple_Loading
                    taille = {hp('4%')}
                />
            )
        }     
    }
}

const styles = {
    titre : {
        fontWeight : "bold",
        fontSize : RF(2.5)
    },

    creer : {
        color : Color.agOOraBlue,
        marginRight : wp('2%')
    },
}

import React from 'react'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert,TextInput,KeyboardAvoidingView,SafeAreaView } from 'react-native'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import StarRating from 'react-native-star-rating'
import { Camera, ImagePicker, Permissions } from 'expo';

import firebase from 'firebase'
import '@firebase/firestore'

export default class Modifier_Groupe extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            groupe : this.props.navigation.getParam('groupe', undefined),
            joueurs : [LocalUser.data].concat(this.props.navigation.getParam('joueurs', [])),
            isLoading : false,
            newNom : "",
            usingCamera : false,
            image : require('../../../res/group.png')


        }
    
    }

    componentDidMount(){
        if(this.state.groupe.photo != undefined) { 
            this.setState({image : {uri : this.state.groupe.photo}})
        }


    }
    static navigationOptions = ({ navigation }) => {

        
        return { title:"Discussions", 
            
    
        headerRight: (

            <TouchableOpacity
                onPress = {() => console.log("TODO!!")} >
                <Image
                    style = {{width : 30, height : 30, marginRight :15}}
                    source = {require('../../../res/write.png')}
                />
            </TouchableOpacity>
        ),

            headerLeft : (
                <TouchableOpacity
                onPress = {() =>navigation.push("AccueilConversation", {retour_arriere_interdit : true})} >
                   <Image
                    style = {{width : 20, height : 20, marginLeft :15}}
                    source = {require('../../../res/right-arrow-nav.png')}
                   />
               </TouchableOpacity>
            )
    
        
        };     
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
                image: {uri : result.uri },
                isLoading : true
                });

                var url = await this.uploadImage(result.uri, this.state.groupe.nom)
                console.log("after upload")
                var db = Database.initialisation()
               await  db.collection("Conversations").doc(this.state.groupe.id).update({
                    photo : url
                })
                console.log('after update')
                this.setState({isLoading : false})
                Alert.alert('','La photo a bien été changée')
            }
        }
    };

    alertImage(){
        Alert.alert(
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
            )
    }
    

    uploadImage = async (uri, imageName) => {
        console.log("in upload image")
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
        var ref = firebase.storage().ref().child("Photos_Groupes//test/" + imageName);
        console.log("after ref")
        ref.put(blob);

        return ref.getDownloadURL();
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
            image: {uri: photo.uri},
            usingCamera: false,
            isLoading : true
        })
        var url = await this.uploadImage(photo.uri, this.state.groupe.nom)
        console.log("after upload")
        var db = Database.initialisation()
       await  db.collection("Conversations").doc(this.state.groupe.id).update({
            photo : url
        })
        console.log('after update')
        this.setState({isLoading : false})
        Alert.alert('','La photo a bien été changée')
        }
    

    texteChanged = (searchedText) => {
        this.setState({newNom : searchedText})
    };

     onSubmit = () => {
        var newNom = this.state.newNom
        var db = Database.initialisation()
        db.collection("Conversations").doc(this.state.groupe.id).update({
            nom :newNom
        }).catch(function(error) {
            console.log(error)
        })
    }



    _renderPhotoConv() {
        
        return(

            <TouchableOpacity
                onPress = {() => this.alertImage()}>
                <Image
                    source = {this.state.image}
                    style = {styles.image_conv}/>
            </TouchableOpacity>
        )
           
    }
    alertAdmin(joueur) {
        Alert.alert(
            joueur.pseudo,
            '',
            [
                {text: 'Voir le profil', onPress: () => this.voirProfil(joueur.id)},
                {text: 'Envoyer un message', onPress: () => this.envoyerUnMessage(joueur)},
                {text: 'Supprimer du groupe', onPress: () => this.supprDuGroupe(joueur.includesid)},
                {text: 'Annuler', onPress: () => console.log('Cancel Pressed')},

            ],
        ) 
    }

    envoyerUnMessage(joueur) {
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
    ajouterJoueurs(){
        this.props.navigation.push("NewMessage", {ajoutGroupeExistant : true, groupe : this.state.groupe})
    }
    trouverJoueur(id) {
        for(var i = 0; i < this.state.joueurs.length; i ++){
            if(this.state.joueurs[i].id == id) return this.state.joueurs[i]
        }
    }
    async voirProfil(id) {
        this.setState({isLoading : true})
        var joueur = this.trouverJoueur(id);
        var equipes = await Database.getArrayDocumentData(joueur.equipes, "Equipes")
        var reseau = await Database.getArrayDocumentData(joueur.reseau , "Joueurs")
        joueur.naissance = new Date(joueur.naissance.toDate());
        this.setState({isLoading : false})
        this.props.navigation.push("ProfilJoueur", {id: joueur.id, joueur : joueur, reseau : reseau, equipes : equipes})

    }
    async supprDuGroupe(id){
        if(this.state.groupe.admin == LocalUser.data.id) {
            var db  = Database.initialisation()
            db.collection("Conversations").doc(this.state.groupe.id).update({
                participants : firebase.firestore.FieldValue.arrayRemove(id)
            })

            var newParticipants = []
            for(var i = 0; i < this.state.joueurs.length ; i++){
                var j = this.state.joueurs[i] 
                if(j.id != id) newParticipants.push(j)
            }
            
            this.setState({joueurs : newParticipants})
        }
    }

    renderItem = ({item}) => {
        var name = item.pseudo
        var admin = ""
        if(item.id == LocalUser.data.id) name = "Toi"
        if(item.id == this.state.groupe.admin) admin = "Adm"
        return(
            <View style = {{marginRight : wp('8%'), flexDirection : "row"}}>
                <TouchableOpacity style = {[styles.containerItemJoueur]}
                    onPress = {() => this.alertAdmin(item)}
                   >

                    <Image
                        source = {{uri : item.photo}}
                        style = {styles.photoJoueur}
                    /> 

                    {/* View contenant le pseudo est le score*/}
                    <View style = {{justifyContent : "center"}}>
                        <Text>{name}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.score}
                            starSize={hp('2.2%')}
                            fullStarColor='#F8CE08'
                            emptyStarColor='#B1ACAC'
                        />
                    </View> 

                    <View>
                        <Text style= {{marginLeft : wp('10%'), fontWeight : "bold", justifyContent : "center"}}>{admin}</Text>

                    </View>
            </TouchableOpacity>
            

                
          </View>
        )
    }

    

    render() {
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('5%')}
                />
            )
        } else  if (this.state.usingCamera) {
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
                <ScrollView>
                    <View style = {{flex : 1}}>
                    <View style = {{width :wp('100%'), paddingVertical : hp('1%'), backgroundColor : Color.grayItem, marginTop : hp('2%')}}>
                            <Text style = {{color : "black", marginLeft : wp('4%')}}>Infos du groupe</Text>
                    </View>

                    {this._renderPhotoConv()}

                    <TextInput
                        placeholder = {this.state.groupe.nom}
                        placeholderTextColor = {"black"}
                        style = {styles.txtInput}
                        onChangeText = {this.texteChanged}
                        onSubmitEditing= {this.onSubmit}
                    />

                    <Text style = {{marginLeft : wp('2%'), marginTop : hp('1%')}}>{this.state.joueurs.length} participant(s)</Text>
                    <TouchableOpacity
                        onPress = {() => this.ajouterJoueurs()}
                        style = {{marginTop : hp('2%')}}>
                        <Text style = {{marginLeft : wp('2%')}}>Ajouter des participants au groupe</Text>
                    </TouchableOpacity>

                    <FlatList
                        data = {this.state.joueurs}
                        keyExtractor={(item) => item.id}
                        renderItem = {this.renderItem}
                        extraData = {this.state.joueurs}
                    />
                </View>
                </ScrollView>
                
            )
        }
    }
}

const styles = {
    image_conv : {
        width : wp('100%'),
        height : wp('50%'),
        marginBottom : hp('1%'),
        marginTop : hp('1%')
    },
    txtInput : {
        alignSelf : "center",
        width : wp('90%'),
        height : wp('4%'),
        marginLeft : wp('2%'),
        marginTop : hp('2%')
    },
    containerItemJoueur : {
        flexDirection : 'row',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6
    },

    photoJoueur : {
        marginRight : wp('3%'),
        width :  wp('16%'),
        height :  wp('16%'),
        borderRadius : wp('8%')
    },
}


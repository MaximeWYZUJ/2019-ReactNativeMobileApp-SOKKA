import React from 'react'
import {View,Text,Button, Picker, TextInput, TouchableOpacity, Image, Alert} from 'react-native'
import { Camera } from 'expo-camera';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from "react-native-responsive-fontsize"
import Database from '../../Data/Database';
import NormalizeString from '../../Helpers/NormalizeString'
import * as firebase from 'firebase';
import '@firebase/firestore'

const policeSize = RF(2.4);

export default class Reglages_Equipe extends React.Component {
    
    constructor(props) {
        super(props)
        this.equipeData = this.props.navigation.getParam('equipeData', null);
        this.joueursData = this.props.navigation.getParam('joueursData', null);

        this.niveau = 0;
        for (j of this.joueursData) {
            this.niveau = this.niveau + j.score;
        }
        this.niveau = Math.ceil(this.niveau / this.joueursData.length);

        this.ville = "";
        this.citation = "";
        this.photoURI = "";
        this.contactsPossibles = [];
        this.mailsPossibles = [];
        for (j of this.joueursData) {
            // On verifie que j est un capitaine de l'equipe
            if (this.equipeData.capitaines.some(elmt => elmt === j.id)) {
                this.contactsPossibles.push(j.telephone);
                this.mailsPossibles.push(j.mail);
            }


        }


        console.log(this.equipeData.sexe)

        var sexe = this.equipeData.sexe
        if(sexe == undefined) {
            sexe = "mixte"
        }
        this.state = {
            contactSelected: this.equipeData.telephone,
            mailSelected: this.equipeData.mail,
            sexeSelected: sexe,
            usingCamera: false,
            image_changed: false,
            photo: {uri: this.equipeData.photo}
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', "Réglage de l'équipe")
        }
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
            image_changed: true,
            usingCamera: false
        })
    }

    /**
     * Fonction qui va permettre d'uploader la photo de profil dans le storage
     * firebase.
     * 
     * uri : uri de la photo de profil
     * imageName : Nom à donner au fichier sur le storage
     */
    uploadImage = async (uri, imageName) => {
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
        }).catch(function(error) {
            console.log("error in uploading image", error)
        }).then(() => {
            console.log("succeded upload image")
        });
        var ref = firebase.storage().ref().child("Photos_Profil_Equipes/tests/" + imageName);
        ref.put(blob).catch(function(error) {
            console.log("error in uploading image", error)
        }).then(() => {
            console.log("succeded upload image")
        });

        return ref.getDownloadURL();
    }


    // ========================================================


    renderPickerSexe() {
        return (
            <Picker
                selectedValue={this.state.sexeSelected}
                style={{height: 50, width: wp('50%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({sexeSelected: itemValue})}
                >
                <Picker.Item label={"mixte"} key={0} value={"mixte"}/>
                <Picker.Item label={"masculine"} key={0} value={"masculine"}/>
                <Picker.Item label={"féminine"} key={0} value={"féminine"}/>
            </Picker>
        )
    }


    renderPickerContact() {
        return (
            <Picker
                selectedValue={this.state.contactSelected}
                style={{height: 50, width: wp('50%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({contactSelected: itemValue})}
                >
                {this.renderPickerItem(this.contactsPossibles)}
            </Picker>
        )
    }

    
    renderPickerMail() {
        return (
            <Picker
                selectedValue={this.state.mailSelected}
                style={{height: 50, width: wp('50%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({mailSelected: itemValue})}
                >
                {this.renderPickerItem(this.mailsPossibles)}
            </Picker>
        )
    }


    renderPickerItem(array) {
        let arrayItem = [];
        for (var i=0; i<array.length; i++) {
            arrayItem.push(<Picker.Item label={array[i]} key={i} value={array[i]}/>);
        }

        return arrayItem;
    }


    isVilleOk() {
        for(var i = 0; i < villes.length; i++) {
            if(NormalizeString.normalize(this.ville) == NormalizeString.normalize(villes[i].Nom_commune)) {
                return true
            } 
        }
        return false
    }


    async validate() {
        var modifs = {};

        if (this.ville) {
            if (this.isVilleOk()) {
                modifs["ville"] = NormalizeString.normalize(this.ville);
            } else {
                Alert.alert("Tu dois choisir une ville dans la base SOKKA");
            }
        }

        if (this.citation) {
            modifs["citation"] = this.citation;
        }

        modifs["sexe"] = this.state.sexeSelected;

        modifs["mail"] = this.state.mailSelected;
        
        modifs["telephone"] = this.state.contactSelected;

        modifs["score"] = this.niveau;

        if (this.state.image_changed) {
            console.log("image changed")
            newPhoto = await this.uploadImage(this.state.photo.uri, this.equipeData.id);
            console.log(newPhoto)
            modifs["photo"] = newPhoto;
        }

        console.log("before db initialisation", modifs)

        var db = Database.initialisation();
    
        db.collection("Equipes").doc(this.equipeData.id).set(modifs, {merge: true})
        .then(() => {
            console.log("in then")
            this.props.navigation.push("Profil_Equipe", {equipeId: this.equipeData.id});
        }).catch(function(error) {
            console.log(error)
        })
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
                <View style = {styles.main_container}>
                    <View style = {{alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => Alert.alert(
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
                            <Image style={styles.photo} source={{uri : this.state.photo.uri}}/>
                        </TouchableOpacity>
                    </View>

                    {/* CHAMPS A REMPLIR */}
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text>Age moyen :  {this.equipeData.age}</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text>Ville :  </Text>
                        <TextInput
                            style={{flex: 1, borderColor: '#C0C0C0'}}
                            onChangeText={(t) => this.ville=t}
                            placeholder={this.equipeData.ville}
                            />
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text>Phrase fétiche :  </Text>
                        <TextInput
                            style={{flex: 1, borderColor: '#C0C0C0'}}
                            onChangeText={(t) => this.citation=t}
                            placeholder={this.equipeData.citation}
                            />
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text>Niveau :  {this.niveau}</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text>Sexe :  </Text>
                        {this.renderPickerSexe()}
                    </View>

                    {/* COORDONNEES PICKER */}
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: "#C0C0C0"}}>
                        <Text>Coordonnées de l'équipe</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text>Contact :  </Text>
                        {this.renderPickerContact()}
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text>Mail :  </Text>
                        {this.renderPickerMail()}
                    </View>

                    {/* BLANK SPACE */}
                    <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    </View>

                    {/* VALIDER */}
                    <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Button
                            title="Valider"
                            onPress={() => this.validate()}
                        />
                    </View>
                </View>
            )
        }
    }
}

const styles = {
    main_container : {
        marginTop : hp('1%'),
        flex: 1,
        flexDirection: 'column'
    },

    photo: {
        width: 100,
        height: 100,
        backgroundColor: 'gray'
    },

    view_icon_reglage : {
        width: wp('100%'), 
        height: 50, 
        marginBottom : hp('0.8%')
    },

    icon_reglage : {
        width : wp('12%'),
        height : wp('12%'),
        alignSelf : 'center'
    },

    view_image_equipe : {
        marginTop : wp('4%'),
        marginLeft : wp('3%'),
        flexDirection : 'row'

    },

    image_equipe : {
        width : wp('25%'),
        height : wp('25%')
    },

    view_txt_photo : {
        marginLeft : wp('4%'),
        alignItems : 'center', 
        flexDirection : 'row',
    },

    txt_modif_photo : {
        alignSelf : 'center',
        fontSize : policeSize

    },

    view_champ : {
        marginTop : hp('1%'),
        marginLeft : wp('3%'),

    },

    text_champs : {
        fontSize : policeSize,
        alignSelf : 'center',

    },

    text_input_champs : {
        fontSize : policeSize,
        paddingLeft:20,
        alignSelf : 'center',
        
    },
    image_niveau : {
        height : hp('3%'),
        width : wp('33%')
    },

    view_txt_partie : {
        width: wp('100%'), 
    },

    view_container : {
        borderBottomWidth : 2
    },

    txt_capitaine : {
        alignSelf : 'center',
        fontSize : policeSize,
    },

    view_picker : {
        marginLeft : wp('3%')
    },

    bouton : {
        backgroundColor : 'rgba(13, 169, 27, 1.0)',
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        alignSelf : 'center',
        width : wp('40%'),
        borderRadius :  30,
        borderWidth : 2,
        borderColor : 'rgba(13,134,23,1)'
    },

    txt_boutton : {
        alignSelf : 'center',
        fontSize :  policeSize
    }

}
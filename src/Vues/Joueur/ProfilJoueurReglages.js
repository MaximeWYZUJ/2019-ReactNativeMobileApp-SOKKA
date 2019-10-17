import React from 'react'
import {Picker, TouchableOpacity, ScrollView, View, Text, StyleSheet, Image, Button, TextInput, ListView, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Camera } from 'expo-camera';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import DatePicker from 'react-native-datepicker'
import villes from '../../Components/Creation/villes.json'
import departements from '../../Components/Creation/departements.json'
import Database from '../../Data/Database'
import Simple_Loader from '../../Components/Loading/Simple_Loading'
import NormalizeString from '../../Helpers/NormalizeString';
import * as firebase from 'firebase';
import '@firebase/firestore'
import Email from 'react-native-email'


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ProfilJoueurReglages extends React.Component {

    constructor(props) {
        super(props)
        this.joueur = this.props.navigation.getParam('joueur', null)
        this.id = this.props.navigation.getParam('id', null)

        var auj = new Date();
      

        var jNaissance = new Date(this.joueur.naissance.seconds * 1000)
        var jNaissanceDisp = jNaissance.getDate()+'-'+(jNaissance.getMonth()+1)+'-'+jNaissance.getFullYear();
        
        this.today = auj.getFullYear() + '-' + (auj.getMonth() + 1) + '-' + auj.getDate();
        this.todayDisp = auj.getDate() + '-' + (auj.getMonth() + 1) + '-' + auj.getFullYear();
        this.naissance = ""
        
        this.ville = ""
        this.depCode = ""
        this.zone = ""
        this.pseudo = ""
        this.nom = ""
        this.prenom = ""
        this.score = this.joueur.score;
        this.telephone = ""
        this.mail = ""
        this.searchedVilles = [];
        this.age = this.joueur.age;
        this.sexe = this.joueur.sexe;
        this.poste = this.joueur.poste;

        this.mdp = "";
        this.mdpConfirm = "";
        
        if (this.joueur.AKA == undefined || this.joueur.AKA === "") {
            this.AKAplaceholder = "...";
            this.AKA = "";
        } else {
            this.AKAplaceholder = this.joueur.AKA;
            this.AKA = this.joueur.AKA;
        }
        
        this.state = {
            isLoading: false,
            naissanceDisp: jNaissanceDisp,
            naissance : "",
            age : this.joueur.age,
            searchedVilles: [],
            ville: "",
            depCode: "",
            scoreDisp: this.score,
            sexe: this.joueur.sexe,
            poste: this.joueur.poste,

            usingCamera: false,
            image_changed: false,
            photo: {uri: this.joueur.photo}
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Réglages')
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
        });
        var ref = firebase.storage().ref().child("Photos_profil_Joueurs/test/" + imageName);
        ref.put(blob);

        return ref.getDownloadURL();
    }


    // ===================================================================
    // ===================================================================


    calculAge(naissance) {
        var today = new Date();
        var naissanceDate = new Date(naissance)
        var ageCalcul = today.getFullYear() - naissanceDate.getFullYear() - 1;
        if (today.getMonth() > naissanceDate.getMonth() && today.getDay() > naissanceDate.getDay()) {
            ageCalcul = ageCalcul + 1;
        }
        this.age = ageCalcul;
        this.setState({age: ageCalcul})
        return ageCalcul;
    }


    /**
     * Fonction qui permet de renvoyer une liste des villes qui
     * commencent par searchedText
     */
    searchedVillesFunction= (searchedText) => {
        let searchedAdresses = villes.filter(function(ville) {
            
            return ville.Nom_commune.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({
            searchedVilles: searchedAdresses,
            ville: searchedText
        })
    };


    /**
     * Pour mettre la première lettre en capitale
     * @param {} string 
     */
    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    getDepartement() {
        for (var i=0; i<departements.length; i++) {
            console.log(this.state.depCode);
            if (departements[i].departmentCode === this.state.depCode) {
                return departements[i].departmentName;
            }
        }
        return "erreur 13/10/19 reglages joueur";
    }


    /**
     * Verifie que la ville choisie par l'utilisateur est bien 
     * dans la db
     */
    isVilleOk(nomVille) {
        for(var i = 0; i < villes.length; i++) {
            if(nomVille.toLowerCase() == villes[i].Nom_commune.toLowerCase()) {
                return true
            } 
        }
        return false
    }


    /**
     * Fonction qui permet de controler l'affichage des noms des villes
     */
    renderVille = (adress) => {
        if(this.state.ville.length > 0) {
            var txt = adress.Nom_commune.toLowerCase()
            var cp = adress.Code_postal;
            if (cp < 9999) {
                cp = cp*10;
            }
            var depCode = cp+"";
            depCode = depCode[0]+depCode[1];
            
            return (
                <TouchableOpacity
                    onPress = {() => {this.ville = this.jsUcfirst(txt); this.depCode = depCode; this.setState({ville: this.jsUcfirst(txt), depCode: depCode, searchedVilles: []})}}
                    style = {{backgroundColor : Colors.grayItem,  marginTop : hp('1%'), marginBottom : hp('1'),paddingVertical : hp('1%')}}
                    >
                
                    <View style = {{flexDirection : 'row'}}>
                            <Text>{adress.Code_postal} - </Text>
                            <Text style = {{fontWeight : 'bold', fontSize :RF(2.6)}}>{this.state.ville}</Text>
                            <Text style = {{fontSize :RF(2.6)}}>{txt.substr(this.state.ville.length)}</Text>
                    </View>
                
                </TouchableOpacity>
            );
        } else {
            return(<View/>)
        }
    };


    renderPickerPoste() {
        return (
            <Picker
                selectedValue={this.state.poste}
                style={{width: wp('60%'), marginRight: wp('5%')}}
                onValueChange={(itemValue, itemIndex) => {this.poste = itemValue; this.setState({poste: itemValue})}}
                >
                <Picker.Item label={"poste non renseigné"} key={0} value={null}/>
                <Picker.Item label={"mixte"} key={1} value={"mixte"}/>
                <Picker.Item label={"offensif"} key={2} value={"offensif"}/>
                <Picker.Item label={"defensif"} key={3} value={"defensif"}/>
                <Picker.Item label={"gardien"} key={4} value={"gardien"}/>
            </Picker>
        )
    }


    renderPickerSexe() {
        return (
            <Picker
                selectedValue={this.state.sexe}
                style={{width: wp('60%'), marginRight: wp('5%')}}
                onValueChange={(itemValue, itemIndex) => {this.sexe = itemValue; this.setState({sexe: itemValue})}}
                >
                <Picker.Item label={"Masculin"} key={1} value={"masculin"}/>
                <Picker.Item label={"Féminin"} key={2} value={"feminin"}/>
            </Picker>
        )
    }


    modifierMdp() {
        // On veut modifier le mdp
        if (this.mdp != "" && this.mdp == this.mdpConfirm && this.mdp.length >= 6) {
            var user = firebase.auth().currentUser;
            user.updatePassword(this.mdp).then(() => {
                this.props.navigation.push('ProfilJoueur', {id: this.id, joueur: this.joueur, equipes: this.props.navigation.getParam('equipes', ''),retour_arriere_interdit : true})
                this.setState({isLoading: false});
            }, (error) => {
                this.setState({isLoading: false})
                Alert.alert(
                    "",
                    "La modification du mot de passe nécessite de s'être connecté récemment. Veuillez vous reconnecter pour mettre à jour votre mot de passe.",
                    [
                        {
                            text: 'OK',
                            onPress: () => {this.props.navigation.push('ProfilJoueur', {id: this.id, joueur: this.joueur, equipes: this.props.navigation.getParam('equipes', ''),retour_arriere_interdit : true})},
                            style: 'cancel'
                        }
                    ]
                );
            })
        
        // On ne veut pas modifier le mdp
        } else if (this.mdp == "") {
            this.setState({isLoading: false});
            this.props.navigation.push('ProfilJoueur', {id: this.id, joueur: this.joueur, equipes: this.props.navigation.getParam('equipes', ''),retour_arriere_interdit : true})

        // On modifie mal le mdp
        } else if (this.mdp != this.mdpConfirm) {
            this.setState({isLoading: false});
            Alert.alert('', "Le mot de passe de confirmation n'est pas le même que le nouveau mot de passe")
        } else {
            this.setState({isLoading: false});
            Alert.alert('', "Ton mot de passe doit contenir au moins 6 caractères")
        }
    }


    async _validate() {
        if (this.naissance) {
            var naissanceTimestamp = firebase.firestore.Timestamp.fromMillis(Date.parse(this.naissance));
            this.joueur.naissance = naissanceTimestamp
        }
        if (this.age > 0) {
            this.joueur.age = this.age
        }
        if (this.isVilleOk(this.ville)) {
            this.joueur.ville = NormalizeString.normalize(this.ville);
            this.joueur.departement = NormalizeString.normalize(this.getDepartement());
        }
        if (this.zone) {
            this.joueur.zone = this.zone
        }
        if (this.pseudo) {
            this.joueur.pseudo = this.pseudo
            this.joueur.queryPseudo = NormalizeString.normalize(this.pseudo);
            this.joueur.pseudoQuery = NormalizeString.decompose(this.pseudo);
        }


        if (this.joueur.pseudo == this.joueur.prenom + " " + this.joueur.nom) {
            var pasDePseudo = true;
        }


        if (this.prenom) {
            this.joueur.prenom = this.prenom
        }
        if (this.nom) {
            this.joueur.nom = this.nom
        }

        if (pasDePseudo) {
            this.joueur.pseudo = this.joueur.prenom + " " + this.joueur.nom;
        }

        if(this.joueur.prenom == undefined) {
            this.joueur.prenom = " "
        }
        
        this.joueur.score = this.score;
        this.joueur.sexe = this.sexe;
        this.joueur.poste = this.poste;

        this.joueur.AKA = this.AKA;
        
        if (this.telephone) {
            this.joueur.telephone = this.telephone
        }
        if (this.mail) {
            this.joueur.mail = this.mail
        }

        if (this.state.image_changed) {
            newPhoto = await this.uploadImage(this.state.photo.uri, this.joueur.id);
            this.joueur.photo = newPhoto;
        }

        /* Initialisation de la base de données. */
        var db = Database.initialisation()
    
        this.setState({isLoading: true})

        /* Enregistrer l'utilisateur dans la base de données. */
        db.collection("Joueurs").doc(this.id).set({
            age : this.state.age,
            fiabilite : this.joueur.fiabilite,
            naissance : this.joueur.naissance,
            nom : this.joueur.nom,
            telephone : this.joueur.telephone,
            zone : this.joueur.zone,
            prenom : this.joueur.prenom,
            nom: this.joueur.nom,
            pseudo: this.joueur.pseudo,
            queryPseudo: this.joueur.queryPseudo,
            pseudoQuery: this.joueur.pseudoQuery,
            ville: this.joueur.ville,
            departement: this.joueur.departement,
            photo: this.joueur.photo,
            score: this.joueur.score,
            sexe: this.joueur.sexe,
            poste: this.joueur.poste,
            AKA: this.joueur.AKA
        },
        {
            merge: true

        }).then(() => {
            // On veut modifier le mail
            if (this.mail != "") {
                var user = firebase.auth().currentUser;
                user.updateEmail(this.mail).then(() => {
                    db.collection("Joueurs").doc(this.id).set({
                        mail: this.joueur.mail
                    }, {merge: true})
                    this.modifierMdp();
                }, (error) => {
                    console.log(error);
                    this.setState({isLoading: false})
                    Alert.alert(
                        "",
                        "La modification de ton adresse mail nécessite de s'être connecté récemment. Reconnecte toi pour mettre à jour ton adresse mail.",
                        [
                            {
                                text: 'OK',
                                onPress: () => {this.props.navigation.push('ProfilJoueur', {id: this.id, joueur: this.joueur, equipes: this.props.navigation.getParam('equipes', ''),retour_arriere_interdit : true})},
                                style: 'cancel'
                            }
                        ]
                    );
                })
            } else {
                this.modifierMdp();
            }
        }).catch(function(error) {
            this.setState({isLoading: false})
            console.log("Error writing document: ", error);
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <Simple_Loader taille={hp('3%')}/>
                </View>
            )
        }
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
            return (
                <ScrollView style={styles.main_container}>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            style={{width: 40, height: 40, marginHorizontal: 10, marginBottom: 20}}
                            source={require('app/res/icon_reglage.png')}
                            />
                    </View>
                    <View style={styles.infos_perso}>
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
                        <View style={styles.champ}>
                            <Text>Date de naissance :  </Text>
                            <DatePicker
                                style={{width: wp('45%'), alignItems : 'center'}}
                                date= {this.state.naissanceDisp}
                                mode="date"
                                placeholder="choisis une date"
                                format="DD-MM-YYYY"
                                minDate="01-01-1900"
                                maxDate={this.todayDisp}
                                confirmBtnText="Confirmer"
                                cancelBtnText="Annuler"
                                customStyles={{
                                dateInput: {
                                    marginLeft: 0,
                                    borderWidth : 0
                                }
                                }}
                                onDateChange={(date) => {
                                    s = date.split('-');
                                    s2 = s[2]+'-'+s[1]+'-'+s[0];
                                    this.setState({
                                        naissanceDisp: date,
                                        naissance: s2
                                    })
                                    this.naissance = s2; this.calculAge(s2)
                                }}
                            />
                        </View>
                        <View style={styles.champ}>
                            <Text>Age :  {this.state.age} ans</Text>
                        </View>
                        <View style={styles.champ}>
                            <Text>Sexe :  </Text>
                            {this.renderPickerSexe()}
                        </View>
                        <View style={styles.champ}>
                            <Text>Poste :  </Text>
                            {this.renderPickerPoste()}
                        </View>
                        <View style={styles.champ}>
                            <Text>Ville :  </Text>
                            <TextInput 
                                placeholder = {this.joueur.ville}
                                style = {styles.txt_input}
                                placeholderTextColor ='#CECECE'
                                onChangeText ={(text) => this.searchedVillesFunction(text)} 
                                value = {this.state.ville}
                            />
                            <ListView
                                dataSource={ds.cloneWithRows(this.state.searchedVilles)}
                                renderRow={this.renderVille}
                            />
                        </View>
                        <View style={styles.champ}>
                            <Text>Prénom :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.prenom=t}
                                placeholder={this.joueur.prenom}
                                />
                        </View>
                        <View style={styles.champ}>
                            <Text>Nom :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.nom=t}
                                placeholder={this.joueur.nom}
                                />
                        </View>
                        <View style={styles.champ}>
                            <Text>Pseudo :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.pseudo=t}
                                placeholder={this.joueur.pseudo}
                                />
                        </View>
                        <View style={styles.champ}>
                            <Text>AKA :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.AKA=t}
                                placeholder={this.AKAplaceholder}
                                />
                        </View>
                        <View style={styles.champ}>
                            <Text>Niveau :  </Text>
                            <Picker
                                selectedValue={this.state.scoreDisp}
                                style={{width: wp('60%')}}
                                onValueChange={(itemValue, itemIndex) => {this.score = itemValue; this.setState({scoreDisp: itemValue})}}
                                >
                                <Picker.Item label={"0 étoile"} key={0} value={0}/>
                                <Picker.Item label={"1 étoile"} key={1} value={1}/>
                                <Picker.Item label={"2 étoiles"} key={2} value={2}/>
                                <Picker.Item label={"3 étoiles"} key={3} value={3}/>
                                <Picker.Item label={"4 étoiles"} key={4} value={4}/>
                                <Picker.Item label={"5 étoiles"} key={5} value={5}/>
                            </Picker>
                        </View>
                    </View>
                    
                    <View style={styles.coordonnees}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>Mes coordonnées</Text>
                        </View>
                        <View style={styles.champ}>
                            <Text>Contact :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.telephone=t}
                                placeholder={this.joueur.telephone}
                                />
                        </View>
                        <View style={styles.champ}>
                            <Text>Mail :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.mail=t}
                                placeholder={this.joueur.mail}
                                />
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}}>Modifier le mot de passe</Text>
                        </View>
                        <View style={styles.champ}>
                            <Text>Nouveau mot de passe :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.mdp=t}
                                placeholder={"nouveau mot de passe"}
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.champ}>
                            <Text>Confirmation du mot de passe :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.mdpConfirm=t}
                                placeholder={"nouveau mot de passe"}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <View style={styles.validate}>
                        <Button title="Valider" onPress={() => this._validate()}/>
                    </View>

                    <View style={styles.validate}>
                        <Button title="Contacter SOKKA" onPress={() => {
                            const to = "contact@sokka.app"
                            Email(to, {
                                subject : "Contacter SOKKA",
                                body : "Bla bla"
                            }).catch(console.error)
                        }}/>
                    </View>

                    {/* Blank space pour pouvoir scroller assez et eviter d'etre masqué par le clavier */}
                    <View style={{height: hp('50%'), width: wp('100%')}}>
                    </View>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 10,
        marginVertical: 20
    },
    infos_perso: {
        flex: 5,
    },
    coordonnees: {
        flex: 2,
    },
    photo: {
        width: 100,
        height: 100,
        backgroundColor: 'gray'
    },
    champ: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    validate: {
        flex: 1,
        margin: 10,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center'
    }
})

export default ProfilJoueurReglages
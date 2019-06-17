import React from 'react'
import {Picker, TouchableOpacity, ScrollView, View, Text, StyleSheet, Image, Button, TextInput, ListView } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import DatePicker from 'react-native-datepicker'
import villes from '../../Components/Creation/villes.json'
import Database from '../../Data/Database'
import NormalizeString from '../../Helpers/NormalizeString';
import * as firebase from 'firebase';
import '@firebase/firestore'


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ProfilJoueurReglages extends React.Component {

    constructor(props) {
        super(props)
        this.joueur = this.props.navigation.getParam('joueur', null)
        this.id = this.props.navigation.getParam('id', null)

        var auj = new Date();
        var jNaissance = firebase.firestore.Timestamp.fromMillis(Date.parse(this.joueur.naissance)).toDate();
        var jNaissanceDisp = jNaissance.getDate()+'-'+(jNaissance.getMonth()+1)+'-'+jNaissance.getFullYear();
        
        this.today = auj.getFullYear() + '-' + (auj.getMonth() + 1) + '-' + auj.getDate();
        this.todayDisp = auj.getDate() + '-' + (auj.getMonth() + 1) + '-' + auj.getFullYear();
        this.naissance = ""
        
        this.ville = ""
        this.zone = ""
        this.pseudo = ""
        this.score = this.joueur.score;
        this.telephone = ""
        this.mail = ""
        this.searchedVilles = [];
        this.age = this.joueur.age;
        
        this.state = {
            naissanceDisp: jNaissanceDisp,
            naissance : "",
            age : this.joueur.age,
            searchedVilles: [],
            ville: "",
            scoreDisp: this.score
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Réglages')
        }
    }


    calculAge(naissance) {
        var today = new Date();
        var naissanceDate = new Date(naissance)
        var ageCalcul = today.getFullYear() - naissanceDate.getFullYear();
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


    /**
     * Verifie que la villle choisie par l'utilisateur est bien 
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
            
            return (
                <TouchableOpacity
                    onPress = {() => {this.ville = this.jsUcfirst(txt); this.setState({ville: this.jsUcfirst(txt), searchedVilles: []})}}
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


    _validate() {
        console.log(this.ville);
        if (this.naissance) {
            var naissanceTimestamp = firebase.firestore.Timestamp.fromMillis(Date.parse(this.naissance));
            this.joueur.naissance = naissanceTimestamp
        }
        if (this.age > 0) {
            this.joueur.age = this.age
        }
        if (this.isVilleOk(this.ville)) {
            this.joueur.ville = this.ville
        }
        if (this.zone) {
            this.joueur.zone = this.zone
        }
        if (this.pseudo) {
            this.joueur.pseudo = this.pseudo
            this.joueur.queryPseudo = NormalizeString.normalize(this.pseudo);
        }
        
        this.joueur.score = this.score
        
        if (this.telephone) {
            this.joueur.telephone = this.telephone
        }
        if (this.mail) {
            this.joueur.mail = this.mail
        }
        console.log(this.joueur.ville)
        /* Initialisation de la base de données. */
        var db = Database.initialisation()
    
        /* Enregistrer l'utilisateur dans la base de données. */
        db.collection("Joueurs").doc(this.id).set({
            age : this.state.age,
            fiabilite : this.joueur.fiabilite,
            mail : this.joueur.mail,
            naissance : this.joueur.naissance,
            nom : this.joueur.nom,
            telephone : this.joueur.telephone,
            zone : this.joueur.zone,
            pseudo: this.joueur.pseudo,
            queryPseudo: this.joueur.queryPseudo,
            ville: this.joueur.ville
        },
        {
            merge: true

        }).then(() => {
            console.log("Document successfully written!");
            this.props.navigation.push('ProfilJoueur', {id: this.id, joueur: this.joueur, equipes: this.props.navigation.getParam('equipes', ''),retour_arriere_interdit : true})
        }).catch(function(error) {
            console.log("Error writing document: ", error);
        });
    }

    render() {
        
        return (
            <ScrollView style={styles.main_container}>
                <View style={{alignItems: 'center'}}>
                    <Image
                        style={{width: 40, height: 40, marginHorizontal: 10, marginBottom: 20}}
                        source={require('app/res/icon_reglage.png')}
                        />
                </View>
                <View style={styles.infos_perso}>
                    <Image style={styles.photo} source={{uri : this.joueur.photo}}/>
                    <View style={styles.champ}>
                        <Text>Date de naissance :  </Text>
                        <DatePicker
                            style={{width: wp('45%'), alignItems : 'center'}}
                            date= {this.state.naissanceDisp}
                            mode="date"
                            placeholder="select date"
                            format="DD-MM-YYYY"
                            minDate="01-01-1900"
                            maxDate={this.todayDisp}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
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
                    {/*<View style={styles.champ}>
                        <Text>Zone de jeu :  </Text>
                        <TextInput
                            style={{flex: 1, borderColor: '#C0C0C0'}}
                            onChangeText={(t) => this.zone=t}
                            placeholder={this.joueur.zone}
                            />
                    </View>*/}
                    <View style={styles.champ}>
                        <Text>AKA :  </Text>
                        <TextInput
                            style={{flex: 1, borderColor: '#C0C0C0'}}
                            onChangeText={(t) => this.pseudo=t}
                            placeholder={this.joueur.pseudo}
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
                </View>

                <View style={styles.validate}>
                    <Button title="Valider" onPress={() => this._validate()}/>
                </View>

                {/* Blank space pour pouvoir scroller assez et eviter d'etre masqué par le clavier */}
                <View style={{height: hp('50%'), width: wp('100%')}}>
                </View>
            </ScrollView>
        );
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
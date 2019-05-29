import React from 'react'
import {ScrollView, View, Text, StyleSheet, Image, Button, TextInput } from 'react-native'
import Database from '../../Data/Database'
import NormalizeString from '../../Helpers/NormalizeString';

class ProfilJoueurReglages extends React.Component {

    constructor(props) {
        super(props)
        this.joueur = this.props.navigation.getParam('joueur', null)
        this.id = this.props.navigation.getParam('id', null)

        this.naissance = ""
        this.age = ""
        this.ville = ""
        this.zone = ""
        this.pseudo = ""
        this.score = ""
        this.telephone = ""
        this.mail = ""
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Réglages')
        }
    }

    _validate() {
        /*if (this.naissance) {     PARSER LA DATE POUR CHECK SI C'EST TJRS UN TIMESTAMP
            this.joueur.naissance = this.naissance
        }*/
        if (this.age) {
            this.joueur.age = parseInt(this.age)
        }
        if (this.ville) {
            this.joueur.ville = this.ville
        }
        if (this.zone) {
            this.joueur.zone = this.zone
        }
        if (this.pseudo) {
            this.joueur.pseudo = this.pseudo
            this.joueur.queryPseudo = NormalizeString.normalize(this.pseudo);
        }
        if (this.score) {
            this.joueur.score = parseInt(this.score)
        }
        if (this.telephone) {
            this.joueur.telephone = this.telephone
        }
        if (this.mail) {
            this.joueur.mail = this.mail
        }

        /* Initialisation de la base de données. */
        var db = Database.initialisation()
    
        /* Enregistrer l'utilisateur dans la base de données. */
        db.collection("Joueurs").doc(this.id).set({
            age : this.joueur.age,
            fiabilite : this.joueur.fiabilite,
            mail : this.joueur.mail,
            naissance : this.joueur.naissance,
            nom : this.joueur.nom,
            telephone : this.joueur.telephone,
            zone : this.joueur.zone,
            pseudo: this.joueur.pseudo,
            queryPseudo: this.joueur.queryPseudo
        },
        {
            merge: true

        }).then(() => {
            console.log("Document successfully written!");
            this.props.navigation.push('ProfilJoueur', {id: this.id, joueur: this.joueur, equipes: this.props.navigation.getParam('equipes', '')})
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
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flex: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text>Date de naissance :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.naissance=t}
                                placeholder={this.joueur.naissance.toDateString()}
                                />
                        </View>
                        <View style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Text>Age :  </Text>
                            <TextInput
                                style={{flex: 1, borderColor: '#C0C0C0'}}
                                onChangeText={(t) => this.age=t}
                                placeholder={this.joueur.age+""}
                                />
                        </View>
                    </View>
                    <View style={styles.champ}>
                        <Text>Ville :  </Text>
                        <TextInput
                            style={{flex: 1, borderColor: '#C0C0C0'}}
                            onChangeText={(t) => this.ville=t}
                            placeholder={this.joueur.ville}
                            />
                    </View>
                    <View style={styles.champ}>
                        <Text>Zone de jeu :  </Text>
                        <TextInput
                            style={{flex: 1, borderColor: '#C0C0C0'}}
                            onChangeText={(t) => this.zone=t}
                            placeholder={this.joueur.zone}
                            />
                    </View>
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
                        <TextInput
                            style={{flex: 1, borderColor: '#C0C0C0'}}
                            onChangeText={(t) => this.score=t}
                            placeholder={this.joueur.score+""}
                            />
                    </View>
                    <View style={styles.champ}>
                        <Text>Fiabilite :  {this.joueur.fiabilite+""}</Text>
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
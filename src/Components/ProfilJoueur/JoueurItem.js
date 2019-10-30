import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import StarRating from 'react-native-star-rating'
import { withNavigation } from 'react-navigation'
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Types_Notification from '../../Helpers/Notifications/Types_Notification'
import RF from 'react-native-responsive-fontsize';
class JoueurItem extends React.Component {

    constructor(props){
        super(props)
    }


    gotoProfilJoueur() {
        Database.getDocumentData(this.props.id, 'Joueurs').then(async (docData) => {
             // Traitement de la collection Reseau
             arrayReseau = await Database.getArrayDocumentData(docData.reseau, 'Joueurs');
 
             // Traitement de la collection Equipes
             arrayEquipes = await Database.getArrayDocumentData(docData.equipes, 'Equipes');
 
             // Traitement des données propres
             docData.naissance = new Date(docData.naissance.toDate());
 
             // Envoi
             this.props.navigation.push("ProfilJoueur", {id: docData.id, joueur : docData, reseau : arrayReseau, equipes : arrayEquipes})
         
         }).catch(function(error) {
             console.log("Error getting document:", error);
         });
    }


    /**
     * Méthode qui renvoie l'objet à afficher ou non, qui permet de liker
     * le profil d'un autre joueur et de l'ajouter à notre réseau
     */
    likeJoueur() {
        if (LocalUser.data.id != this.props.id) {
            if (LocalUser.data.reseau.includes(this.props.id)) {
                // On aime deja ce profil, donc on le retirera des likes
                return (
                    <TouchableOpacity
                            onPress={() => {
                                Database.changeSelfToOtherArray_Aiment(this.props.id, "Joueurs", false);
                                Database.changeOtherIdToSelfArray_Reseau(this.props.id, false);

                                this.forceUpdate();
                            }}>
                        <Image
                            style={{width: wp('10%'), height: wp('10%')}}
                            source = {require('app/res/icon_already_like.png')}/>
                    </TouchableOpacity>
                )
            } else {
                // On n'aime pas encore ce profil, donc on l'ajoutera aux likes
                return (
                    <TouchableOpacity
                            onPress={() => {
                                Database.changeSelfToOtherArray_Aiment(this.props.id, "Joueurs", true);
                                Database.changeOtherIdToSelfArray_Reseau(this.props.id, true);

                                this.storeNotifAjoutInDb()
                                this.forceUpdate();
                            }}>
                        <Image
                            style={{width: wp('10%'), height: wp('10%')}}
                            source = {require('app/res/icon_like.png')}/>
                    </TouchableOpacity>
                )
            }
        } else {
            // C'est notre profil
            return (
                <View>
                    <Image
                        style={{width: wp('10%'), height: wp('10%')}}
                        source = {require('app/res/icon_like_gray.png')}/>
                </View>
            )
        }
    }

    renderLike() {
        var showLike = (this.props.showLike != undefined && this.props.showLike == true);
        if (showLike) {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    {this.likeJoueur()}
                </View>
            )
        }
    }


    /**
     * Fonction qui va envoyer la notification puis la  sauvegarder
     * dans la base de données.
     */
    async storeNotifAjoutInDb() {
        await this.sendNotifAjoutReseau()
        var db = Database.initialisation()
        db.collection("Notifs").add({
            emetteur : LocalUser.data.id,
            recepteur : this.props.id,
            type : Types_Notification.AJOUT_RESEAU,
            time : new Date(),
            dateParse : Date.parse(new Date())
        }).then(() => {
            console.log("store notif ok")
        }).catch(function(error) {
            console.log("error store notif ajout reseau", error)
        })
    }


    /**
     * Fonction qui va envoyer la notification d'ajout de réseau au joueur concerné
     */
    async sendNotifAjoutReseau() {
        var titre = "Nouvelle notif"
        var corps = LocalUser.data.pseudo + " t'a ajouté à son réseau"

        var joueur = await Database.getDocumentData(this.props.id, "Joueurs")
        var tokens = [];
        if(joueur.tokens != undefined) tokens = joueur.tokens
        for(var i = 0; i < tokens.length; i++) {
           await  this.sendPushNotification(tokens[i],titre,corps)
        }
    }


    

    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    async sendPushNotification(token , title,body ) {
        return fetch('https://exp.host/--/api/v2/push/send', {
          body: JSON.stringify({
            to: token,
            title: title,
            body: body,
            data: { message: `${title} - ${body}` },
           
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }).catch(function(error) {
            console.log("ERROR :", error)
        }).then(function(error) {
            console.log("THEN", error)
        });
    }

    render() {
        const nom = this.props.nom
        const score = this.props.score
        const photo = this.props.photo

        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity style={styles.main_container} onPress={() => this.gotoProfilJoueur()}>
                    <Image
                        style={{backgroundColor: "#C0C0C0", width: wp('15%'), height: wp('15%'), borderRadius :28, marginLeft : wp('2%'), marginRight : wp('2%')}}
                        source={{uri: photo}}/>
                    <View style={{flexDirection: 'column'}}>
                        <Text>{nom}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={parseInt(score, 10)}
                            starSize={20}
                            fullStarColor='#F8CE08'
                            emptyStarColor='#B1ACAC'
                            containerStyle={{width: 30}}
                        />
                    </View>
                </TouchableOpacity>
                {this.renderLike()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    main_container: {
        flex: 2,
        flexDirection: 'row',
        marginTop : hp('1.5%'),
        marginBottom : hp('1.5%')
    }
})

export default withNavigation(JoueurItem)

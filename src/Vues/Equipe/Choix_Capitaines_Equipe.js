
import React from 'react'
import { Text, ScrollView, TouchableOpacity, View, FlatList, Alert } from 'react-native'
import { CheckBox } from 'react-native-elements'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'

import Types_Notification from '../../Helpers/Notifications/Types_Notification'
import Color from '../../Components/Colors';
import Joueur_Pseudo_Score from '../../Components/ProfilJoueur/Joueur_Pseudo_Score'
import Simple_Loading from '../../Components/Loading/Simple_Loading'
import firebase from 'firebase'
import '@firebase/firestore'


export default class Choix_Capitaines_Equipe extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            joueurs : props.navigation.getParam("joueurs", []),
            equipe : props.navigation.getParam("equipe",undefined),
            joueursSelectionnes : [],
            isLoading : false    
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;

        return {
          title : navigation.getParam("equipe").nom
        };
    };

    buildAlertSuivant() {
        var txt = "au joueur séléctionné"
        var attribut = "sa réponse."
        if(this.state.joueursSelectionnes.length > 1) {
            txt = "aux joueurs séléctionnés"
            attribut = "leur réponse."
        }
        Alert.alert(
            '',
            'Ta proposition a bien été envoyée ' + txt + '. Tu seras informé de ' + attribut
        )
        this.setState({isLoading : true})

        this.props.navigation.navigate("Profil_Equipe", {equipeId : this.state.equipe.id})
    }


    /**
     * Fonction qui met à jour la liste des capitaines en attente dans le doc de 
     * l'équipe
     * @param {*} joueurId  : String[]
     */
    async saveCapInDb(joueursId) {
        console.log("in save cap in db", joueursId)
        console.log(this.state.equipe.id)
        var db =Database.initialisation()
        for(var i = 0; i< joueursId.length; i ++) {
            await db.collection("Equipes").doc(this.state.equipe.id).update({
                capitainesAttentes :  firebase.firestore.FieldValue.arrayUnion(joueursId[i]),
            }).then(console.log("ok save cap in db"))
            .catch(function(error){console.log(error)})
        }
        
    }

    buildAlertAretCap(){
        Alert.alert(
            '',
            "Tu souhaites arrêter d'être capitaine de l'équipe "  + this.state.equipe.nom + " ?",
            [
                {text: 'Confirmer', onPress: async() =>  {
                    this.arreterCap()
                }},
                {
                  text: 'Annuler',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ], 
        )
    }
    
    async arreterCap(){
        this.setState({isLoading : true})
        var db = Database.initialisation()
        await db.collection("Equipes").doc(this.state.equipe.id).update({
            capitaines : firebase.firestore.FieldValue.arrayRemove(LocalUser.data.id)
        })

        await this.sendNotifArretCap()
        await this.storeNotifArretCap()
        this.setState({isLoading : false})
        this.props.navigation.push("Profil_Equipe", {equipeId : this.state.equipe.id})
    }

    // ===========================================================================
    // ========================== NOTIFICATIONS ==================================
    // ===========================================================================
    
    
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

    async sendNotifArretCap() {
        var titre = "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " n'est plus capitaine de l'équipe " + this.state.equipe.nom
        
        for(var i = 0; i < this.state.joueurs.length; i++){
            if(this.state.joueurs[i].id != LocalUser.data.id){
                var joueur = this.state.joueurs[i]
                var tokens = []
                if(joueur.tokens != undefined) {
                    tokens = joueur.tokens
                    console.log("======" ,joueur)
                }
                for(var k =0; k < tokens.length; k ++) {
                    await this.sendPushNotification(tokens[k], titre,corps)
                }
            }
        }
    }



    async sendNotif() {
        this.setState({isLoading : true})
        var joueursId = []
        var titre = "Nouvelle notif"
        var corps = "Le capitaine " + LocalUser.data.pseudo + " souhaite t'ajouter en capitaine de l'équipe " 
        + this.state.equipe.nom + "."
        for(var i = 0 ; i < this.state.joueursSelectionnes.length; i ++){
            var joueur = this.state.joueursSelectionnes[i]
            joueursId.push(joueur.id)
            var tokens = []
            if(joueur.tokens != undefined) {
                tokens = joueur.tokens
            }
            for(var k =0 ; k < tokens.length; k++){
                await this.sendPushNotification(tokens[k], titre,corps)
            }
        }

        await this.saveCapInDb(joueursId)
        await this.storeNotifInDb(joueursId)
        this.buildAlertSuivant()
    }

    async storeNotifInDb(joueursId){
        console.log("in store notif")
        var db = Database.initialisation()
        for(var i = 0; i < joueursId.length; i++) {
            var id = joueursId[i]
            db.collection("Notifs").add({
                emetteur : LocalUser.data.id,
                recepteur : id,
                type : Types_Notification.DEMANDE_REJOINDRE_CAPITAINES,
                time : new Date(),
                dateParse : Date.parse(new Date()),
                equipe : this.state.equipe.id
            })
        }
    }

    async storeNotifArretCap(){
        console.log("in store notif arret")
        var db = Database.initialisation()
        for(var i = 0 ; i < this.state.joueurs.length; i++){
            if(this.state.joueurs.id != LocalUser.data.id) {
                console.log("in if")
                console.log(Types_Notification.ARRET_CAPITAINE)
                var joueur = this.state.joueurs[i]
                await db.collection("Notifs").add({
                    emetteur : LocalUser.data.id,
                    recepteur : joueur.id,
                    type : Types_Notification.ARRET_CAPITAINE,
                    time : new Date(),
                    dateParse : Date.parse(new Date()),
                    equipe : this.state.equipe.id

                })
            }
        }
    }

    //==================================================================================


    _renderItemJoueur = ({item}) => {
        return(
            <View style = {{flexDirection : "row", alignItems : "center", }}>
                <Joueur_Pseudo_Score
                    pseudo = {item.pseudo}
                    score = {item.score}
                    photo = {item.photo}
                />

                <CheckBox
                    
                    title=' '
                    checkedColor = {Color.agOOraBlue}
                    right
                    containerStyle={{backgroundColor: 'white', borderWidth :0, alignSelf : "center"}}                    
                    checked={this.state.equipe.capitaines.includes(item.id) || this.state.joueursSelectionnes.includes(item)}
                    onPress={() => {
                        console.log("PRESS !!!")
                        var j = this.state.joueursSelectionnes
                        if(! j.includes(item)) {
                            j.push(item)
                            this.setState({joueursSelectionnes : j})
                        } else {
                            j = []
                            for(var i =0; i < this.state.joueursSelectionnes.length ; i++){
                                if(this.state.joueursSelectionnes[i].id != item.id) {
                                    j.push(this.state.joueursSelectionnes[i])
                                }
                            }
                            this.setState({joueursSelectionnes : j})
                        }

                    }}
                />

                {this.renderArretCapitanat(item.id)}
            </View>
            
        )
        
    }

    


    /**
     * Fonction qui renvoie la liste des capitianes
     */
    buildListOfCap(){
        var liste = []
        for(var i = 0; i < this.state.joueurs.length; i++) {
            var j = this.state.joueurs[i]
            if(this.state.equipe.capitaines.includes(j.id)) {
                liste.push(j)
            }
        }
        return liste
    }

    /**
     * Fonction qui renvoie la liste des joueurs non capitiane
     */
    buildListOfNonCap(){
        var liste = []
        for(var i = 0; i < this.state.joueurs.length; i++) {
            var j = this.state.joueurs[i]
            if(! this.state.equipe.capitaines.includes(j.id)) {
                liste.push(j)
            }
        }
        return liste
    }

    renderBtnSuivant() {
        if(this.state.joueursSelectionnes.length == 0) {
            return(
                <Text>Suivant</Text>
            )
        } else {
            return(
                <TouchableOpacity
                onPress = {() =>  this.sendNotif()}>
                    <Text style = {{color : Color.agOOraBlue}}>Suivant</Text>
                </TouchableOpacity>
            )
        }
    }

    renderArretCapitanat(joueurId){
        if(joueurId == LocalUser.data.id && this.state.equipe.capitaines.includes(joueurId) && this.state.equipe.capitaines.length > 1){
            return(
                <TouchableOpacity style = {{marginLeft : -wp('3%')}}
                    onPress = {()=> this.buildAlertAretCap()}>
                    <Text>{"Arrêter d'être \ncapitaine"}</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('3%')}
                />
            )
        } else {
            return(
                <ScrollView style = {{flex : 1}}>
                    
                    <View style = {{marginTop  : hp('1.2%'), flexDirection : 'row', justifyContent: 'space-between', paddingHorizontal : '4%'}}>
                        <Text style = {{color : Color.agOOraBlue,}}>Annuler</Text>
                        
                        <Text style = {{fontWeight : "bold", fontSize : RF("2.7")}}>Modifier les capitaines</Text>

                        {this.renderBtnSuivant()}
                    </View>



                    <FlatList
                        data = {this.buildListOfCap()}
                        renderItem = {this._renderItemJoueur}/>

                    
                    {/* Les autres joueurs de l'équipes */}
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}
                            >
                            <Text style={styles.header}>Joueurs</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <FlatList
                        data = {this.buildListOfNonCap()}
                        renderItem = {this._renderItemJoueur}/>

                </ScrollView>
            )
        }
    }
}


const styles = {
    
    
    txt_joueur : {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
    additional_style_container : {
        width : wp('98%'),
        marginLeft : wp('1%'),
        marginRight : wp('1%'),
        borderRadius : 15,
        marginBottom : hp('1%'),
        paddingBottom : hp('1.5%'),
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 5, width: 5 }, // IOS
        shadowOpacity: 5, // IOS
        shadowRadius: 5, //IOS
       // elevation: 2, // Android
    },

    header_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        width : wp('88%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
       // marginVertical: 10,
        //marginHorizontal: 10,
        borderRadius : 15,

       // borderWidth : 1,
       backgroundColor:'#52C3F7',
       //elevation : 5


    },
    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
    icon_plus : {
        width : 30,
        height : 30,
        marginBottom : hp('1.5%')

    },
}
import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert,TextInput,KeyboardAvoidingView,SafeAreaView } from 'react-native'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
class List_Messages extends React.Component {
  constructor(props){
      super(props)
    this.state = {
        conv : this.props.navigation.getParam('conv', undefined),
        messages : [],
        isLoading : true,
        joueurs : []
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
    };     
};

    componentDidMount(){
        if(! this.isAgroupConv()){
            this.getMessage()
        } else {
            this.getMessageGroupConv()
        }
    }

    async getMessage() {
        console.log("in get message")
        var messages = []
        var id = this.state.conv.id 
        var db = Database.initialisation()
        await db.collection("Conversations").doc(id).collection("Messages").orderBy("dateEnvoie","desc" ).limit(10).get()
        .then(querySnapshot => {
            var i  = 0
            querySnapshot.docs.forEach(doc => {
                var msg = this.buildMsgForChat(doc.data(), i)
                messages.push(msg);
                i++
            });
        }).catch(function(errro) {console.log(errro)});
        console.log(messages)
        
        this.setState({messages : messages, isLoading : false})
    }


    async getJoueursGroupeData(){
        var joueurs = []
        var joueursToGetData = []
        // On télécharge pas les données de l'utilisateur, on les a déja
        for(var i = 0; i < this.state.conv.participants.length ; i++) {
            if(this.state.conv.participants[i] != LocalUser.data.id){
                joueursToGetData.push(this.state.conv.participants[i])
            }
        }
        joueurs = await Database.getArrayDocumentData("Joueurs", joueursToGetData)
        return joueurs
    }



    async getMessageGroupConv() {
        console.log("in get message")
        var messages = []

        var joueurs = await this.getJoueursGroupeData()
        var id = this.state.conv.id 
        var db = Database.initialisation()
        await db.collection("Conversations").doc(id).collection("Messages").orderBy("dateEnvoie","desc" ).limit(10).get()
        .then(querySnapshot => {
            var i  = 0
            querySnapshot.docs.forEach(doc => {
                var msg = this.buildMsgForChatGroup(doc.data(), i, joueurs)
                messages.push(msg);
                i++
            });
        }).catch(function(errro) {console.log(errro)});
        console.log(messages)
        
        this.setState({messages : messages, isLoading : false})
    }





    buildMsgForChat(msg, id) {
        console.log("in build mesg")
        msg._id = id
        msg.createdAt = new Date(msg.dateEnvoie)
        if(msg.emetteur == LocalUser.data.id){
            msg.user = {
                _id : msg.emetteur,
                name : LocalUser.data.pseudo,
                avatar : LocalUser.data.photo
            }
        } else {
            msg.user = {
                _id : msg.emetteur,
                name : this.state.conv.joueur.pseudo,
                avatar :this.state.conv.joueur.photo
            }
        }
        return msg
    }

    buildMsgForChatGroup(msg, id, joueurs) {
        msg._id = id
        msg.createdAt = new Date(msg.dateEnvoie)
        if(msg.emetteur == LocalUser.data.id){
            msg.user = {
                _id : msg.emetteur,
                name : LocalUser.data.pseudo,
                avatar : LocalUser.data.photo
            }
        } else {
           var _id = msg.emetteur
           for(var i = 0 ; i < joueurs.length; i++){
               if(joueurs[i].id == msg.emetteur) {
                   var name = joueurs[i].pseudo
                   var avatar = joueurs[i].photo
               }
           }
           msg.user = {
                _id :_id,
                name :name,
                avatar : avatar
            }
        }
        return msg
    }


    async sendMsg(msg){
        console.log("in send msg", msg.text)
        console.log(LocalUser.data.id)
        console.log( Date.parse(new Date()))
        var db = Database.initialisation()
        await db.collection("Conversations").doc(this.state.conv.id).collection("Messages").add({
            aLue : false,
            dateEnvoie : Date.parse(new Date()),
            emetteur : LocalUser.data.id,
            text : msg.text
        }).catch(function(error){console.log(error)})
        .then(console.log("msg send"))
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

    async sendNotifNewMessage() {
        var titre = "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " t'as envoyé un message"
        var tokens = []
        var joueur = this.state.conv.joueur
        if(joueur.tokens != undefined) tokens = joueur.tokens
        for(var i = 0 ; i < tokens.length; i++) {
            await this.sendPushNotification(tokens[i], titre,corps)
        }
    }


    //============================================================================
    /**
     * True si c'est une conv à plus de deux personnes
     */
    isAgroupConv(){
        return this.state.conv.participants.length  >2
    }


    _renderPhotoConv(conv) {
        if(conv.photo == undefined) {
            if(conv.joueur == undefined) {
                return(
                    <Image
                        source = {require('../../../res/group.png')}
                        style = {styles.image_conv}/>
                )
            } else {
                return(
                    <Image
                        source = {{uri : conv.joueur.photo }}
                        style = {styles.image_conv}/>
                )
            }
        } else {
            return(
                <Image
                    source = {{uri : conv.photo }}
                    style = {styles.image_conv}/>
            )
        }
    }

    nomConv(conv){
        console.log(conv.nom)
        if(conv.nom == undefined) {
            return(conv.joueur.pseudo)
        } else {
            return(conv.nom)
        }
    }


    async gotoToProfilJoueur(){
        var joueur = this.state.conv.joueur
            // Traitement de la collection Reseau
            arrayReseau = await Database.getArrayDocumentData(joueur.reseau, 'Joueurs');
            // Traitement de la collection Equipes
            arrayEquipes = await Database.getArrayDocumentData(joueur.equipes, 'Equipes');
            // Traitement des données propres
            joueur.naissance = new Date(joueur.naissance.toDate());
            // Envoi
            this.props.navigation.push("ProfilJoueur", {id: joueur.id, joueur : joueur, reseau : arrayReseau, equipes : arrayEquipes})
        
        
    }
    
    /**
     * Fonction qui affiche le nom et la photo de la personne avec qui on comunique
     */
    _renderConvHeader(){

        return(
            <TouchableOpacity style = {styles.header}
                onPress = {() => this.buildAlertGotoProfil()}>
                {this._renderPhotoConv(this.state.conv)}

                <View>
                    <Text style = {styles.nom_conv}>{this.nomConv(this.state.conv)}</Text>
                </View>
            </TouchableOpacity>
        )

    }

    buildAlertGotoProfil() {
        Alert.alert(
            '',
            'Voir le profil de ' + this.state.conv.joueur.pseudo + "?",
            [
                {text: 'Oui', onPress: () =>this.gotoToProfilJoueur()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )
    }

  componentWillMount() {

    /*this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })*/
  }

  async onSend(messages = []) {
    this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }))
    for(var i = 0; i < messages.length ; i++) {
        await this.sendMsg(messages[i])
    }
    await this.sendNotifNewMessage()
    
    
  }

  render() {
      console.log(this.state.messages)
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('5%')}
                />
            )
        } else {
            return(
                <View  style={{flex:1}}>
                    {this._renderConvHeader()}
                    <GiftedChat

                        messages={this.state.messages} 
                        onSend={messages => this.onSend(messages)}
                        user={{
                        _id: LocalUser.data.id,
                        }}
                    ></GiftedChat>

                     <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80}/>
                 </View>
            )
        }

        
      
    
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "red",
      },
      header : {
        flexDirection : "row", 
        backgroundColor : Color.grayItem,
        paddingVertical : hp('1%'),
        paddingHorizontal : wp('3%')
    },
    image_conv : {
        width : wp('18%'),
         height : wp('18%'), 
         borderRadius : wp('9%'),
         marginRight : wp('5%')
    },
    nom_conv : {
        fontSize : RF(3.5),
        fontWeight : "bold"
    },
})
export default List_Messages
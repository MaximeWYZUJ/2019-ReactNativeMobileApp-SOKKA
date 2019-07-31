import React from 'react'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert,TextInput,KeyboardAvoidingView,SafeAreaView } from 'react-native'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

import firebase from 'firebase'
import '@firebase/firestore'

class List_Messages extends React.Component {
  constructor(props){
      super(props)
      console.log("in list message !!",props.navigation.getParam('conv', undefined))
    this.state = {
        conv : this.props.navigation.getParam('conv', undefined),
        messages : [],
        isLoading : true,
        joueurs : [],
        lastMessageId  : undefined
    }
    this.addMessage = this.addMessage.bind(this)
    this.addMessageGroupe = this.addMessageGroupe.bind(this)


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

    addMessage(){

        this.getMessage()
        
    }

    addMessageGroupe(){
        this.getMessageGroupConv()
    }

    componentDidMount(){
        if(! this.isAgroupConv()){
            this.getMessage()
            var db = Database.initialisation()

            db.collection("Conversations").doc(this.state.conv.id).collection("Messages")
            .onSnapshot(this.addMessage);   
        } else {
            this.getMessageGroupConv()
            var db = Database.initialisation()
            db.collection("Conversations").doc(this.state.conv.id).collection("Messages")
            .onSnapshot(this.addMessageGroupe);   
        }

       
    }

    /**
     * PP
     */
    async getMessage() {
        var messages = []
        var id = this.state.conv.id 
        var lastMessageId = undefined
        var nbMessages = 0
        var db = Database.initialisation()
         db.collection("Conversations").doc(id).collection("Messages").orderBy("dateEnvoie","desc" ).limit(10).get()
        .then(querySnapshot => {
            var i  = 0
            querySnapshot.docs.forEach(doc => {
                var msg = this.buildMsgForChat(doc.data(), i)
                lastMessageId = doc.id
                messages.push(msg);
                i++
                nbMessages = i
            });
            console.log("ok build all messages")
            this.setState({messages : messages, isLoading : false, lastMessageId :lastMessageId, nbMessages : nbMessages})

        }).catch(function(errro) {console.log(errro)});
        console.log(messages)
        
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
        joueurs = await Database.getArrayDocumentData( joueursToGetData, "Joueurs")
        return joueurs
    }



    async getMoreMessage(){
        
        var messages =[]
        for(var i = 0 ; i < this.state.messages.length ; i++){
            messages.push(this.state.messages[i])
        }
        var id = this.state.conv.id 
        var db = Database.initialisation()
      
        nbMessages = this.state.nbMessages
        lastEnvoie = this.state.messages[this.state.nbMessages].dateEnvoie
        var lastMessageId = undefined
        var query =  db.collection("Conversations").doc(id).collection("Messages").orderBy("dateEnvoie","desc" ).limit(10).startAfter(lastEnvoie)
        query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                var index  = this.state.nbMessages +1
                if(this.isAgroupConv()){
                    var msg = this.buildMsgForChatGroup(results.docs[i].data(), index, this.state.joueurs)
                } else {
                    var msg = this.buildMsgForChat(results.docs[i].data(), index)
                }
                messages.push(msg)
                lastMessageId = results.docs[i].id
                nbMessages ++
           
            }
            this.setState({messages : messages, nbMessages : nbMessages, lastMessageId : lastMessageId})
        }).catch(function(error) {console.log(error)}).then(console.log("ok more message"));
    }

    async getMessageGroupConv() {
        var messages = []

        var joueurs = await this.getJoueursGroupeData()
        var lastMessageId = undefined
        var nbMessages = 0
        var id = this.state.conv.id 
        var db = Database.initialisation()
        await db.collection("Conversations").doc(id).collection("Messages").orderBy("dateEnvoie","desc" ).limit(10).get()
        .then(querySnapshot => {
        
            var i  = 0
            querySnapshot.docs.forEach(doc => {
                    var msg = this.buildMsgForChatGroup(doc.data(), i, joueurs)
                    lastMessageId = doc.id
                    nbMessages =i
                messages.push(msg);
                i++
            });
        }).catch(function(errro) {console.log(errro)});
        
        this.setState({messages : messages, isLoading : false, joueurs : joueurs,lastMessageId :lastMessageId, nbMessages : nbMessages})
    }





    buildMsgForChat(msg, id) {
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
        console.log("in send msg", this.state.conv.lecteurs)
        var db = Database.initialisation()
        if(this.state.conv.lecteurs != undefined){
            await this.incrementeNbMsgNonLu()
        }

        console.log("after increment")
        await db.collection("Conversations").doc(this.state.conv.id).collection("Messages").add({
            aLue : false,
            dateEnvoie : Date.parse(new Date()),
            emetteur : LocalUser.data.id,
            text : msg.text
        }).catch(function(error){console.log(error)})
        .then(console.log("msg send"))

        console.log("apres anout doc dans collection message")
        await db.collection("Conversations").doc(this.state.conv.id).update({
            txtDernierMsg : msg.text,
            dateDernierMessage : Date.parse(new Date()),
            aLue : false,
            lecteurs : [LocalUser.data.id]
        })
        console.log("apres maj doc conv")
        conv = this.state.conv
        conv.txtDernierMsg = msg.text,
        conv.dateDernierMessage = Date.parse(new Date()),
        conv.aLue = false,
        conv.lecteurs = [LocalUser.data.id]
        this.setState({conv : conv})
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
        if(! this.isAgroupConv()) {
            var tokens = []
            var joueur = this.state.conv.joueur
            if(joueur.tokens != undefined) tokens = joueur.tokens
            for(var i = 0 ; i < tokens.length; i++) {
                await this.sendPushNotification(tokens[i], titre,corps)
            }
        } else {
            console.log("in send notif message group")
            corps =  LocalUser.data.pseudo + " a envoyé un message au groupe " + this.state.conv.nom
            for(var i = 0 ; i < this.state.joueurs.length; i++){
                var joueur = this.state.joueurs[i]
                console.log("joueur pseudo ", joueur.pseudo)
                var tokens = []
                if(joueur.tokens != undefined) tokens = joueur.tokens
                for(var k = 0; k < tokens.length; k++) {
                    await this.sendPushNotification(tokens[k], titre,corps)
                }
            }
        }
    }

    async incrementeNbMsgNonLu(){

        if(this.isAgroupConv()) {
            console.log("====================in increment if !! ========")
            for(var i = 0 ; i < this.state.joueurs.length; i++) {
                var joueur = this.state.joueurs[i]
                console.log("in boucle", joueur.pseudo)
                console.log(this.state.conv)
                if( this.state.conv.lecteurs.includes(joueur.id)){
                    console.log("in increment",joueur.id)
                    var db = Database.initialisation()
                    var ref =  db.collection("Joueurs").doc(joueur.id)
                    var j = await ref.get().then((doc) => {
                        ref.update({
                            nbMessagesNonLu : doc.data().nbMessagesNonLu +1
                            
                        }).catch(function(error) {
                            console.log("ERROR :", error)
                        }).then(console.log("ok increment"))
                    })
               
                }
                console.log("okokoko")
            }
            
        } else {
            var joueur = this.state.conv.joueur
                if( this.state.conv.lecteurs.includes(joueur.id)){
                    console.log("in increment",joueur.id)
                    var db = Database.initialisation()
                    var ref =  db.collection("Joueurs").doc(joueur.id)
                    var j = await ref.get().then((doc) => {
                        ref.update({
                            nbMessagesNonLu : doc.data().nbMessagesNonLu +1
                            
                        }).catch(function(error) {
                            console.log("ERROR :", error)
                        }).then(console.log("ok increment"))
                    })
               
                }
        }
        
        
       
    }


    //============================================================================
    /**
     * True si c'est une conv à plus de deux personnes
     */
    isAgroupConv(){
        return this.state.conv.estUnGroupe;
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

    async goToModifGroupe() {
        this.setState({isLoading : true})
        var joueurs = await this.buildListOfParticipants()
        this.setState({isLoading  : false})
        this.props.navigation.push("ModifierGroupe",{groupe : this.state.conv, joueurs : joueurs})
    }


    async buildListOfParticipants() {
        var db = Database.initialisation()
        var gData = await Database.getDocumentData(this.state.conv.id, "Conversations")
        var j = []
        for(var i = 0; i < this.state.joueurs.length ; i++){
            var joueur = this.state.joueurs[i]
            if(gData.participants.includes(joueur.id)) {
                j.push(joueur)
            }
        }
        return j
    }
    
    /**
     * Fonction qui affiche le nom et la photo de la personne avec qui on comunique
     */
    _renderConvHeader(){

        return(
            <TouchableOpacity style = {styles.header}
                onPress = {() => {
                    if(! this.isAgroupConv()) {
                        this.buildAlertGotoProfil()
                    } else {
                        this.goToModifGroupe()
                    }
                }}>
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
      await this.sendNotifNewMessage()

    for(var i = 0; i < messages.length ; i++) {
        await this.sendMsg(messages[i])
    }
    cpnsole.log("everithing good !!!!!!!!!!")
    
    
  }

  renderLoadEarlier(){
      return(
          <TouchableOpacity 
                style = {{alignSelf : "center", borderRadius : wp('1%'), backgroundColor : Color.grayItem, marginTop : hp('1%') }}
                onPress = {() => this.getMoreMessage()}>
              <Text>Charger les messages plus anciens</Text>
          </TouchableOpacity>
      )
  }
  renderSend(props) {
    return (
        
            <Send
                {...props}
            >
                <View style={{marginRight: 10, marginBottom: 10}}>
                    <Image 
                        source={require('../../../res/send-button.png')}
                        style = {{width : wp('7%'), height : wp('7%')}}/>
                </View>
            </Send>
    );
}

  render() {
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
                        renderSend = {this.renderSend}
                        placeholder = {"Taper un message"}
                        extraData = {this.state.messages}
                        messages={this.state.messages} 
                        onSend={messages => this.onSend(messages)}
                        user={{
                        _id: LocalUser.data.id,
                        }}
                        loadEarlier = {true}
                        onLoadEarlier = {() => this.getMoreMessage()}
                        renderLoading = {() => {return(<Simple_Loading taille = {hp('3%')}/>)}}
                        renderLoadEarlier = {() => this.renderLoadEarlier()}
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
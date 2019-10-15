import React from 'react';
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert } from 'react-native'
import { CheckBox } from 'react-native-elements'

import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import Simple_Loading from '../../Components/Loading/Simple_Loading'
import Color from '../../Components/Colors';
import firebase from 'firebase'
import '@firebase/firestore'
import { StackActions, NavigationActions } from 'react-navigation';

// Rememttre à Zéro le stack navigator pour empecher le retour en arriere
const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [
      NavigationActions.navigate({ routeName: 'ProfilJoueur' }),
    ],
});

export default class Accueil_Conversation extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isLoading : true,
            refreshing : false,
            conversations : [],
            participants : []   // array où chaque elt est de la forme {id_conv : String, joueur :any}  pour optimiser l'acces au donée
                                // On ne stocke que les données où il y'a que deux participants et ça permettra de passer les données en 
                                // props et éviter de les re telecharger quand on va sur la vue de la conv

        }
    }

    static navigationOptions = ({ navigation }) => {

            if(!navigation.getParam("retour_arriere_interdit",false)) {
                return { title:"Discussions", 
                headerRight: (
    
                   <TouchableOpacity
                    onPress = {() => navigation.push("NewMessage")}>
                       <Image
                        style = {{width : 30, height : 30, marginRight :15}}
                        source = {require('../../../res/write.png')}
                       />
                   </TouchableOpacity>
                  ),
                  
                };  
            } else {
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
                        onPress = {() =>navigation.dispatch(resetAction)} >
                           <Image
                            style = {{width : 20, height : 20, marginLeft :15}}
                            source = {require('../../../res/right-arrow-nav.png')}
                           />
                       </TouchableOpacity>
                    )
                };   
            }
              
    };


     /** Fonction appelée au moment où l'utilisateur pull to refresh */
     _onRefresh = async () => {
        this.setState({refreshing: true});
        this.getConversations()

        this.setState({refreshing : false})
    }

  
    componentDidMount(){
        this.getConversations()
    }

    async getConversations(){
        var conversations = []
        var db = Database.initialisation()
        var  ref = db.collection("Conversations");
        var query = ref.where("participants", 'array-contains' , LocalUser.data.id).orderBy("dateDernierMessage", "desc");
        query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                var conv = results.docs[i].data()
                var joueur = undefined
                
                // Si deux participants alors on télécharge les données du joueur
                if(conv.participants.length == 2) {
                    if(conv.participants[0] == LocalUser.data.id) {
                        joueur = await Database.getDocumentData(conv.participants[1], "Joueurs")
                    } else {
                        joueur = await Database.getDocumentData(conv.participants[0], "Joueurs")
                    }
                } 

                /*var obj = {
                    joueur : joueur, 
                    aLu : conv.aLu,
                    dateDernierMessage : conv.dateDernierMessage,
                    participants : conv.participants,
                    txtDernierMsg : conv.txtDernierMsg,
                    nom : conv.nom,
                    photo :


                }
                conversations.push(obj)*/
                conv.joueur = joueur
                conversations.push(conv)

            }
            this.setState({conversations : conversations, isLoading : false})

        }).catch(function(error) {
            console.log("Error getting documents conv:", error);
      });   

    }


    async updateLecteur(aLue,idConv){
        if(! aLue) {
            this.setState({isLoading : true}) 
            var db = Database.initialisation()
            await db.collection("Conversations").doc(idConv).update({
                lecteurs : firebase.firestore.FieldValue.arrayUnion(LocalUser.data.id)
            }).catch(function(error){console.log(error)})
            var j = await Database.getDocumentData(LocalUser.data.id, "Joueurs")
            if (j.nbMessagesNonLu > 0) {
                await db.collection("Joueurs").doc(LocalUser.data.id).update({
                    nbMessagesNonLu : j.nbMessagesNonLu - 1
                }).catch(function(error){console.log(error)})
            }
            this.setState({isLoading : false})
        }
    }

    

    nomConv(conv){
        if(conv.nom == undefined) {
            return(conv.joueur.pseudo)
        } else {
            return(conv.nom)
        }
    }



    /**
     * Fonction qui affiche la photo du joueur avec qui on communique dans la conv. Ou un icon 
     * si il s'agit d'une conversation de groupe.
     */
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


    

    _renderItem = ({item}) => {
        if(item.lecteurs != undefined){
            var aLue = item.lecteurs.includes(LocalUser.data.id)
        } else {
            aLue = true
        }
        var color = "white"
        if(! aLue ) color = Color.grayItem
        return(
            <TouchableOpacity 
                style = {{flexDirection : "row", marginBottom : hp('1.5%'), justifyContent : "space-between", backgroundColor : color}}
                onPress = {async () => {
                    await this.updateLecteur(aLue,item.id)
                    if(! aLue) {
                        var lecteurs = item.lecteurs
                        lecteurs.push(LocalUser.data.id)
                       item.lecteurs = lecteurs 
                    }
                    this.props.navigation.push("ListMessages", {conv : item})}}>
                <View  style = {{flexDirection : "row" , justifyContent : "center"}}>
                    {this._renderPhotoConv(item)}
                    <View style = {{alignSelf: "center"}}>
                        <Text style = {styles.nom_conv }>{this.nomConv(item)}</Text>
                        <Text style = {styles.mesg_conv}>{this.cutString(item.txtDernierMsg)}</Text>
                    </View>
                </View>
                
                <Text style = {{marginRight : wp('2%')}}>{this.dateDernierMsg(item)}</Text>
                
            </TouchableOpacity>
        )
    }

    cutString(str) {
        var newStr = str.substr(0, 27)
        if(str.length > 28) {
            newStr  = newStr + " ..."
        }
        return newStr
    }

    dateDernierMsg(conv){
        var jours = ["Dim","Lun", "Mar", "Mer", "Jeu","Ven", "Sam"]
        var date = new Date(conv.dateDernierMessage)
        var now = new Date()
      
        var memeJour = (date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear())
        var t = (now - date)
        if(memeJour ) {
            return date.getHours() + ":" + date.getMinutes()
        } else {
           if(now - date < 604800000) {  // nbr of mili seconds in a week
                return jours[date.getDay()]
           } else {
               return date.getDate() + "/" + (date.getMonth() + 1).toString() 
           }
        } 
    }

    

    render(){
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('6%')}
                />
            )
        } else {
            return(
                <View>
                    <ScrollView style = {{paddingBottom : hp('20%')}}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }
                    >
                    <FlatList
                        data = {this.state.conversations}
                        renderItem = {this._renderItem}
                        style = {{marginTop : hp('2%'), marginHorizontal : wp('3.5%')}}
                        />
                    </ScrollView>
                        
                </View>
            )
        }
        
    }
} const styles = {
    nom_conv : {
        fontWeight : "bold",
        fontSize : RF(2.4)
    },

    image_conv : {
        width : wp('15%'),
         height : wp('15%'), 
         borderRadius : wp('7.5%'),
         marginRight : wp('3%')
    },

    mesg_conv : {
        fontSize : RF(2),
        color : "#B2B2B2"
    }
}
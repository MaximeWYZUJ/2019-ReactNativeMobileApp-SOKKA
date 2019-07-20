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

export default class Accueil_Conversation extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isLoading : true,
            conversations : [],
            participants : []   // array où chaque elt est de la forme {id_conv : String, joueur :any}  pour optimiser l'acces au donée
                                // On ne stocke que les données où il y'a que deux participants et ça permettra de passer les données en 
                                // props et éviter de les re telecharger quand on va sur la vue de la conv

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
        this.getConversations()
    }

    async getConversations(){
        console.log("in get conversation")
        var conversations = []
        var db = Database.initialisation()
        var  ref = db.collection("Conversations");
        console.log("after get ref")
        var query = ref.where("participants", 'array-contains' , LocalUser.data.id).orderBy("dateDernierMessage", "desc");
        console.log("after write query")
        query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                console.log("in for convs §§§§§§§§§§")
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

    

    nomConv(conv){
        console.log(conv.nom)
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
        return(
            <TouchableOpacity 
                style = {{flexDirection : "row", marginBottom : hp('1.5%'), justifyContent : "space-between"}}
                onPress = {() => this.props.navigation.push("ListMessages", {conv : item})}>
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
        console.log("zzzzzzzzz,", date.getMonth())
        console.log("zzzzzzzzz,", now.getMonth())
        console.log(  date.getMonth() == now.getMonth() )
        var memeJour = (date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear())
        var t = (now - date)
        if(memeJour ) {
            return date.getHours() + ":" + date.getMinutes()
        } else {
            console.log("====================", now - date)
           if(now - date < 604800000) {  // nbr of mili seconds in a week
                return jours[date.getDay()]
           } else {
               return date.getDate() + "/" + (date.getMonth() + 1).toString() 
           }
        } 
    }

    

    render(){
        console.log(this.state.conversations)
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('6%')}
                />
            )
        } else {
            return(
                <View>
                    <FlatList
                        data = {this.state.conversations}
                        renderItem = {this._renderItem}
                        style = {{marginTop : hp('2%'), marginHorizontal : wp('3.5%')}}
                        />
                        
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
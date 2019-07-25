
import React from 'react'
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert,TextInput,KeyboardAvoidingView,SafeAreaView } from 'react-native'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import StarRating from 'react-native-star-rating'

import firebase from 'firebase'
import '@firebase/firestore'

export default class Modifier_Groupe extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            groupe : this.props.navigation.getParam('groupe', undefined),
            joueurs : [LocalUser.data].concat(this.props.navigation.getParam('joueurs', []))

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


    _renderPhotoConv() {
        if(this.state.groupe.photo == undefined) { 
            return(
                <Image
                    source = {require('../../../res/group.png')}
                    style = {styles.image_conv}/>
            )
           
        } else {
            return(
                <Image
                    source = {{uri : this.state.groupe.photo }}
                    style = {styles.image_conv}/>
            )
        }
    }
    alertAdmin(pseudo) {
        Alert.alert(
            '',
            pseudo,
            [
                {text: 'Voir le profil', onPress: () => console.log('Cancel Pressed')},
                {text: 'Envoyer un message', onPress: () => console.log('Cancel Pressed')},
                {text: 'Supprimer du groupe', onPress: () => console.log('Cancel Pressed')},
                {text: 'Annuler', onPress: () => console.log('Cancel Pressed')},

            ],
        ) 
    }

    renderItem = ({item}) => {
        var name = item.pseudo
        var admin = ""
        if(item.id == LocalUser.data.id) name = "Toi"
        if(item.id == this.state.groupe.admin) admin = "Adm"
        return(
            <View style = {{marginRight : wp('8%'), flexDirection : "row"}}>
                <TouchableOpacity style = {[styles.containerItemJoueur]}
                    onPress = {() => this.alertAdmin()}
                   >

                    <Image
                        source = {{uri : item.photo}}
                        style = {styles.photoJoueur}
                    /> 

                    {/* View contenant le pseudo est le score*/}
                    <View style = {{justifyContent : "center"}}>
                        <Text>{name}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.score}
                            starSize={hp('2.2%')}
                            fullStarColor='#F8CE08'
                            emptyStarColor='#B1ACAC'
                        />
                    </View> 

                    <View>
                        <Text style= {{marginLeft : wp('10%'), fontWeight : "bold", justifyContent : "center"}}>{admin}</Text>

                    </View>
            </TouchableOpacity>
            

                
          </View>
        )
    }

    

    render() {
        return(
            <ScrollView>
                <View style = {{flex : 1}}>
                <View style = {{width :wp('100%'), paddingVertical : hp('1%'), backgroundColor : Color.grayItem, marginTop : hp('2%')}}>
                        <Text style = {{color : "black", marginLeft : wp('4%')}}>Infos du groupe</Text>
                </View>

                {this._renderPhotoConv()}

                <TextInput
                    placeholder = {this.state.groupe.nom}
                    placeholderTextColor = {"black"}
                    style = {styles.txtInput}
                />

                <Text style = {{marginLeft : wp('2%'), marginTop : hp('1%')}}>{this.state.joueurs.length} participant(s)</Text>
                <TouchableOpacity
                    style = {{marginTop : hp('2%')}}>
                    <Text style = {{marginLeft : wp('2%')}}>Ajouter des participants au groupe</Text>
                </TouchableOpacity>

                <FlatList
                    data = {this.state.joueurs}
                    keyExtractor={(item) => item.id}
                    renderItem = {this.renderItem}
                />
            </View>
            </ScrollView>
            
        )
    }
}

const styles = {
    image_conv : {
        width : wp('100%'),
        height : wp('50%'),
        marginBottom : hp('1%'),
        marginTop : hp('1%')
    },
    txtInput : {
        alignSelf : "center",
        width : wp('90%'),
        height : wp('4%'),
        marginLeft : wp('2%'),
        marginTop : hp('2%')
    },
    containerItemJoueur : {
        flexDirection : 'row',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6
    },

    photoJoueur : {
        marginRight : wp('3%'),
        width :  wp('16%'),
        height :  wp('16%'),
        borderRadius : wp('8%')
    },
}


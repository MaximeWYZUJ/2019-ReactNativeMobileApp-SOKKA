
import React from 'react'
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert,TextInput,KeyboardAvoidingView,SafeAreaView } from 'react-native'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'
import StarRating from 'react-native-star-rating'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import AlphabetListView from 'react-native-alphabetlistview'
import { CheckBox } from 'react-native-elements'

import firebase from 'firebase'
import '@firebase/firestore'
import Joueur_Pseudo_Score from '../../Components/ProfilJoueur/Joueur_Pseudo_Score'

export default class New_Groupe extends React.Component {

    renderHeader(){
            return(
                <View style = {{flexDirection : "row", justifyContent : "space-between"}}>
                    <View style = {{width : wp('2%')}}></View>
                    <Text style = {styles.titre}>Nouveau groupe</Text>
                    <TouchableOpacity>
                        <Text style = {styles.creer}>Créer</Text>
                    </TouchableOpacity>
                </View>
            )
    }
    render(){
        return(
            <View>
                
                {this.renderHeader()}

                
                <View style = {{flexDirection : "row", justifyContent : "space-around", marginTop : hp('2.5%')}}>
                    <Image
                        source = {require("../../../res/choix_photo.png")}
                        style = {{width : wp('10%'), height : wp('10%'), marginRight : wp('1%')}}/>
                    
                    <View>
                        <Text>Nom du groupe</Text>
                        <TextInput
                            style = {{width : wp('50%'), borderBottomWidth : 1}}
                        />
                    </View>

                </View>
            </View>
        )
        
    }
}

const styles = {
    titre : {
        fontWeight : "bold",
        fontSize : RF(2.5)
    },

    creer : {
        color : Color.agOOraBlue,
        marginRight : wp('2%')
    },
}
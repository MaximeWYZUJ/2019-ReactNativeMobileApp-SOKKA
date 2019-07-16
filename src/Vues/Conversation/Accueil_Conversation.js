import React from 'react';
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert } from 'react-native'
import { CheckBox } from 'react-native-elements'

import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'

export default class Accueil_Conversation extends React.Component {

    constructor(props){
        super(props)
    }

    static navigationOptions = ({ navigation }) => {

        // Le retour en arriere est autorisé
        
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

    render(){
        return(
            <View>
                <Text>A FAIRE</Text>
            </View>
        )
    }
}
import React from 'react'
import { StyleSheet, Text, Image, ScrollView, Button, TouchableOpacity, View, FlatList,RefreshControl, Alert } from 'react-native'
import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation'
import Database from '../../Data/Database';

class Icon_Message extends React.Component {

    constructor(props) {
        super(props)
    }


    renderNbMessageNonLu(){
        if( Database.isUser(this.props.id) &&( !this.props.nbMessagesNonLu == 0 || !this.props.nbMessagesNonLu == undefined) ) {
            return(
                <View style = {{position : "absolute" , top : wp('1%'), right : wp('1%') , backgroundColor : "red", borderRadius : wp('2%'), width : wp('4%'), height : wp('4%'), justifyContent : "center", alignContent : "center"}}>
                    <Text style = {{alignSelf : "center"}}>{this.props.nbMessagesNonLu}</Text>
                </View>
            )
        }
    }

    render(){
        return(
            <View style = {{paddingTop : hp('1%'), paddingRight : wp('3.2%')}}>
                <TouchableOpacity onPress = {() => this.props.navigation.push("AccueilConversation")}>
                    <Image
                        source = {require('../../../res/message.png')}
                        style = {{width : wp('10%') , height : wp('10%')}}/>
                </TouchableOpacity>

               {this.renderNbMessageNonLu()}

            </View>
        )
    }
}
export default withNavigation(Icon_Message)
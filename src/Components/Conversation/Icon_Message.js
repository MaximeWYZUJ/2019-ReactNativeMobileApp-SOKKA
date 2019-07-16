import React from 'react'
import { StyleSheet, Text, Image, ScrollView, Button, TouchableOpacity, View, FlatList,RefreshControl, Alert } from 'react-native'
import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation'

class Icon_Message extends React.Component {
    render(){
        return(
            <View style = {{paddingTop : hp('1%'), paddingRight : wp('3.2%')}}>
                <TouchableOpacity onPress = {() => this.props.navigation.push("AccueilConversation")}>
                    <Image
                        source = {require('../../../res/message.png')}
                        style = {{width : wp('10%') , height : wp('10%')}}/>
                </TouchableOpacity>

                <View style = {{position : "absolute" , top : wp('1%'), right : wp('1%') , backgroundColor : "red", borderRadius : wp('2%'), width : wp('4%'), height : wp('4%'), justifyContent : "center", alignContent : "center"}}>
                    <Text style = {{alignSelf : "center"}}>2</Text>
                </View>

            </View>
        )
    }
}
export default withNavigation(Icon_Message)
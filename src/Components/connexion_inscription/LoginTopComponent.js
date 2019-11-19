import React from 'react'
import {YellowBox, View, Text, ImageBackground,  Image,StyleSheet, Animated,TouchableOpacity, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

export default class LoginTopComponent extends React.Component {
    
    render() {
        return(
            <View style = {{width : wp("100%"), justifyContent : "center"}}>
                <Image
                    source = {require('../../../res/login_top_component.png')}
                    style = {{width : wp("46.8%"), resizeMode : "contain", alignSelf : "center"}}
                    />
                <Image
                    source = {require('../../../res/sokka_title.png')}
                    style = {{width : wp("46.8%"), resizeMode : "contain", position : "absolute", alignSelf : "center"}}
                    />
            </View>
        )
    }
}
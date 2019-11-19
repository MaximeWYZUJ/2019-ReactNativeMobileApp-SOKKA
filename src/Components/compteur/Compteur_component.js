import React from 'react'

import {View} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Compteur_component extends React.Component {

    render() {
        return(
            <View>
                <View style = {{flexDirection : 'row'}}>
                    <View  style = {[styles.step, styles.curent_step]}></View>
                    <View style = {[styles.step, styles.curent_step]}></View>
                    <View style = {[styles.step, styles.curent_step]}></View>
                    <View style = {[styles.step, styles.curent_step]}></View>
                    <View style = {styles.step}></View>
                </View>
            </View>
        )
    }
}

const styles = {
    step : {
        width :12, 
        height :12, 
        borderWidth : 0,
        borderRadius : 5,
        marginLeft : 8,
        marginRight : 8
    },

    curent_step : {
        backgroundColor : "red"
    }
}
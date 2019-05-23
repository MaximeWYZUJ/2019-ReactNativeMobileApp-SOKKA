import React from 'react'
import {View,Text, TextInput} from 'react-native'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';

/**
 * Classe permettant de définir un champs pour le réglage des infos de l'équipe
 */
fontSize = 0

export default class Champ_reglage extends React.Component {

 

    changeText(text) {
        this.props.callback(text);
    }

    changeFontSize(size){
        fontSize = RF(size)
    }

    render() {
        return(
            <View style = {{flexDirection : 'row' ,}}>
                <Text style = {[styles.text_champs, {fontSize : this.props.fontSize}]}>{this.props.txt}</Text>
                <TextInput 
                    placeholder = {this.props.txtPlaceHolder} 
                    placeholderTextColor = 'black' 
                    style = {[styles.text_input_champs, {fontSize : this.props.fontSize}]}
                    onChangeText = {(text) => this.changeText(text)} 
                />
            </View>
        )
    }
}

const styles = {
    view_champ : {
        marginTop : hp('1%')
    },

    text_champs : {
        alignSelf : 'center',

    },

    text_input_champs : {
        fontSize : RF(2.5),
        paddingLeft:20,
        alignSelf : 'center',
        
    }
}
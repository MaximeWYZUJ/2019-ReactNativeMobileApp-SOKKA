import React from 'react'
import {View, TouchableOpacity,Image} from 'react-native'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Photo_Joueur_Equipe extends React.Component {

    displayCapitanat() {
        if (this.props.isCaptain) {
            return <Image source = {require('app/res/c.png')} style = {styles.c}/>;
        } 
    }


    render() {
        return (
            <View style = {styles.main_container}>
                <TouchableOpacity style = {styles.touchableOpacity}>
                    <Image source = {{uri : this.props.urlPhoto}} style= {styles.image} borderRadius={30}/>
                    {this.displayCapitanat()}
                </TouchableOpacity>
            </View>
        ) 
    }
}
const styles = {
    main_container : {
        borderWidth : 1,
        width: wp('19%'),
        height : wp('19%'),
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden',
        //padding : wp('1%')
    },

    touchableOpacity : {
    },

    image : {
        width : wp('17%'),
        height : wp('17%'),
        resizeMode:  'cover',
        alignSelf: 'center',

    },
    c : {
        width : wp('7%'),
        height : wp('7%'),
        position : 'absolute',
        bottom : 0,
        right : 0
    }
}
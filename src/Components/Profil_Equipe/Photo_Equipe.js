import React from 'react'
import { View, Text, Image, TouchableOpacity} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

/**
 * Classe permettant de définir le composant Photo_Equipe.
 * Il s'agit de la photo présente dans le profil d'une équipe.
 */
export default class Photo_Equipe extends React.Component {


    changeBool(bool) {
        this.props.callback(bool);
    }
    
    render() {
        return (
            <View style = {styles.main_container}>
                <TouchableOpacity
                    onPress = {()=> this.changeBool(true)}
                >
                    <Image source = {this.props.urlPhoto} style = {styles.image_equipe} />
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = {

    main_container : {
        marginLeft : wp('2%')
    },

    image_equipe : {
        width : wp('25%'),
        height :wp('25%')
    }
}


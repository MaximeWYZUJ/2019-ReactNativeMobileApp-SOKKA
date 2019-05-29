
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'

/**
 * Classe qui permet d'afficher une notification de convocation ou relance
 * à une partie
 */
class Notif_Convocation_Partie extends React.Component {

    render() {
        return(
            <Text>kpk</Text>
        )
    }
}



export default withNavigation (Notif_Convocation_Partie)
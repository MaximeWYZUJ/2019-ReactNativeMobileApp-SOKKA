import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import DatesHelpers  from '../../../Helpers/DatesHelpers'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'
import firebase from 'firebase'
import '@firebase/firestore'


class Notif_Ajout_Equipe_Favorite extends React.Component {


    render() {
        return(
            <View>
                <Text>kkkk</Text>
            </View>
        )
    }
}

export default withNavigation(Notif_Ajout_Equipe_Favorite)
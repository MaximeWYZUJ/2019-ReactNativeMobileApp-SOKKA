
import React from 'react'

import {View, Text,Image,TouchableOpacity, TextInput, ScrollView,FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SkypeIndicator} from 'react-native-indicators';


export default class Simple_Loading extends React.Component {

    constructor(props) {
        super(props) 
        
    }

    render() {
        var taille = hp('10%')
        if(this.props.taille != undefined) {
            taille = this.props.taille
        }
        return(
            <View style = {{marginTop : hp('15%')}}>
                <SkypeIndicator 
                 color='#52C7FD'
                 size = {taille} />
             </View>
        )
    }
}
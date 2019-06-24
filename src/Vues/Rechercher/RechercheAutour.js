import React from 'react'
import { View, Text } from 'react-native'


export default class RechercheAutour extends React.Component {


    static navigationOptions = ({ navigation }) => {
        return {
            title: "Autour de moi"
        }
    }


    render() {
        return (
            <View>
                <Text>Recherche autour</Text>
            </View>
        )
    }

}
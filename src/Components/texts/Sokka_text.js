import * as Font from 'expo-font';
import React from 'react'

import {Text} from 'react-native'

export default class Sokka_text extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false
        }
       
    }


    componentDidMount(){
        await Font.loadAsync({             
            "montserrat-medium": require("../../../assets/fonts/montserrat-medium.ttf"),       
            "montserrat-light": require("../../../assets/fonts/montserrat-light.ttf"),       
                              
        });
        this.setState({fontsLoaded: true});
    }

}
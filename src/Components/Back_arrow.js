import React from 'react'

import { Image,TouchableOpacity, Alert} from 'react-native'
import StylesHelpers from '../Helpers/StylesHelpers'
import { withNavigation } from 'react-navigation'

class Back_arrow extends React.Component {
    
    render(){
        return(
            <TouchableOpacity 
                onPress = {() =>this.props.navigation.goBack()}
                style = {{position : "absolute", paddingVertical : 16, paddingHorizontal : 16, zIndex : 10}}>
                <Image
                    style = {StylesHelpers.nav_arrow_style}
                    source = {require("../../res/right-arrow-nav.png")}/>
            </TouchableOpacity>
        )
    }
} 
export default withNavigation(Back_arrow)
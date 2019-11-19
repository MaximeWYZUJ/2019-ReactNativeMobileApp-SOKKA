import React from 'react'
import {View, Text,Platform, NativeModules} from 'react-native'
const { StatusBarManager } = NativeModules;

import StylesHelpers from '../Helpers/StylesHelpers'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const flex_side_bar = 2
export default class Sokka_Main_Component  extends React.Component{

    constructor(props) {
        super(props)
        if(!props.topBarHidden) {
            var  mainPaddingTop = 0
        } else {
            var mainPaddingTop = STATUSBAR_HEIGHT
        }
        this.state = {
            mainPaddingTop : mainPaddingTop
        }
        var mainPaddingTop = STATUSBAR_HEIGHT

    }

    render() {
        return(
            <View style = {{backgroundColor : StylesHelpers.mainRed, height : hp("100%"), width : wp("100%"), position : "absolute", zindex : 3,flexDirection : "column", flex : 1, paddingTop : STATUSBAR_HEIGHT}} >
                
                {/* view with main frame and side bar  */}
                <View
                    style = {{flexDirection : "row", flex : 1182}}>


                    {/* Main frame*/}
                    <View
                        style = {{backgroundColor : this.props.backgroundColor, width : wp(StylesHelpers.mainFrameWidth),borderBottomEndRadius : StylesHelpers.mainRadius ,justifyContent : "center"}}>
                    
                        {this.props.main_frame}
                    </View>

                    
                    {/* Side bar */}
                    <View
                        style = {{backgroundColor :StylesHelpers.mainRed, width : wp(StylesHelpers.sideBarWidth)}}/>

                </View>


                {/* view with side frame and btn , il faudra peut etre mettre la largeur du btn en param 
                a priori la largeur du boutton s'adapte ici*/}
                <View
                    style = {{flexDirection : "row",justifyContent: "space-between", backgroundColor :this.props.backgroundColor, alignContent : "center"}}
                >
                    {/* Side frame*/}
                    <View
                        style = {{backgroundColor : this.props.backgroundColor, justifyContent : "flex-start", alignSelf : "center"}}>
                       {this.props.side_frame}
                    </View>

                    <View/>
                        
                    
                    {/* btn */}
                    <View
                        style = {{backgroundColor :StylesHelpers.mainRed, borderTopStartRadius : StylesHelpers.mainRadius, borderBottomStartRadius : StylesHelpers.mainRadius, alignItems : "center"}}>

                        {this.props.button}    
                    </View>

                </View>
              
                {/* Bottom frame*/}
                <View
                        style = {{backgroundColor :StylesHelpers.mainRed, flex : 66, flexDirection : 'row'}}>


                    <View style = {{backgroundColor : this.props.backgroundColor, flex : 63, borderTopEndRadius : StylesHelpers.mainRadius,justifyContent : "center"}}>
                        
                    </View> 

                    
                    {/* Side bar */}
                    <View
                        style = {{backgroundColor :StylesHelpers.mainRed, flex : flex_side_bar}}/>       
                </View>
            </View>                
        )
    }
}
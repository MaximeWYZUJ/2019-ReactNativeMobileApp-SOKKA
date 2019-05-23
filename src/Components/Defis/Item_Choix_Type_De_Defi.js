import React from 'react';
import {StyleSheet, View,Dimensions,TouchableOpacity,Text,Image} from 'react-native';
import Colors from '../Colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { withNavigation } from 'react-navigation'

class Item_Choix_Type_De_Defi extends React.Component {

    constructor(props) {
        super(props)
    }
    chooseSlideToRender() {
        if(this.props.type == 'match') {
            return (
                <View style = {styles.mainContainer}>
                    {/* Bloc principal*/}
                    <View style = {styles.mainBloc} >

                        {/* Bloc contenant l'icon et le texte */}
                        <View style = {styles.blocIcon}>
                            <Image
                                source = {require('../../../res/match.png')}
                                style = {styles.icon}/>
                        </View>
                        <TouchableOpacity 
                            style = {{paddingTop : hp('5%'), paddingBottom : hp('5%')}}
                            onPress = {()=> {this.props.navigation.push("ChoixDateDefis", {type : "Match"})}}>
                            <Text style = {styles.txt}>Proposer un match </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            )
        } else {
            return (
                <View style = {styles.mainContainer}>
                    {/* Bloc principal*/}
                    <View style = {styles.mainBloc} >

                        {/* Bloc contenant l'icon et le texte */}
                        <View style = {styles.blocIcon}>
                            <Image
                                source = {require('../../../res/bresilienne.png')}
                                style = {styles.icon}/>
                        </View>
                        <TouchableOpacity 
                            style = {{paddingTop : hp('5%'), paddingBottom : hp('5%')}}
                            onPress = {()=> {this.props.navigation.push("ChoixDateDefis", {type :"Brésilienne"})}}>
                            
                            <Text style = {styles.txt}>Proposer une brésilienne </Text>
                        </TouchableOpacity>

                    </View>
                    
                </View>
            )
        }
    }

    render() {
        return (
            <View>
                {this.chooseSlideToRender()}
            </View>
        )
    }
}
const styles  = StyleSheet.create({

    mainContainer : {
        //marginTop : hp('10%'),
        //marginLeft : wp('10%'),
        
        //backgroundColor : Colors.agOOraBlue,
        alignItems : 'center',
        alignContent : 'center',
        paddingTop : hp('13%')
    }, 

    mainBloc : {
        width : wp('75%'),
       // height : hp('65%'),
        backgroundColor : Colors.grayItem,
        borderRadius : 15,
        alignItems:'center',        // Alignement horizontal
        //justifyContent:'center',    // Alignement vertical 
    },

    icon : {
        width : wp('57%'), 
        height : wp('57%'),
        marginBottom : hp('5%'),
    }, 

    blocIcon : {
        backgroundColor : Colors.agOOraBlue,
        borderTopRightRadius : 15,
        borderTopLeftRadius : 15,
        width : wp('75%'),
        alignItems : 'center',
        paddingTop : hp('13%'),
        paddingBottom : hp('8%')
    
    },
    txt : {
       // marginTop : hp('5%'),
        //marginBottom : hp('5%'),
        fontSize : RF('3')
    }
})

export default withNavigation(Item_Choix_Type_De_Defi)
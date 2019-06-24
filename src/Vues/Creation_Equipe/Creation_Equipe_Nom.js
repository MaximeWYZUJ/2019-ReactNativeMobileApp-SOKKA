import React from 'react'

import {KeyboardAvoidingView, View, Text,Image, ImageBackground,  StyleSheet,TouchableWithoutFeedback,TouchableOpacity, TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'

/**
 * Vue qui va permettre à l'utilisateur de renseigner le nom d'une équipe qu'il est
 * en train de créer.
 */
export default class Creation_Equipe_Nom extends React.Component {

   // static navigationOptions = { title: 'Nouvelle équipe'};

    constructor(props) {
        console.log("CREATION EQUIPE NON : in CONSTRUCTOR")
        super(props) 
        this.state = {
            nom : ''
        }
    }

    changeNom(txt) {
        this.setState({nom : txt})
    }

    render(){
        console.log("IN RENDER !!")
        return(
            <View style = {styles.main_container}>

                {/* Bandeau superieur */}
                <View style = {styles.bandeau}>
                    <Text style= {{ alignSelf : "center", marginLeft : wp('22%'), marginRight : wp('13%'), fontSize : RF(3.1)}}>Nom de l'équipe</Text>
                    <TouchableOpacity
                        onPress = {()=> this.props.navigation.push("CreationEquipeZone", {nom : this.state.nom})}
                    >
                        <Text style = {{fontSize : RF(3.1), color : Colors.agOOraBlue}}>Suivant</Text>
                    </TouchableOpacity>
                </View>

                {/* View contenant l'image du ballon */}
                <View style = {{alignItems : 'center', alignContent : 'center', marginTop : hp('5%')}  }>
                    <Image
                        source = {require('app/res/football_shoe.png')}
                        style = {{width : wp('35%'), height : wp('35%')}}/>
                </View>

                 {/* Champs pour écrire le nom de l'équipe */}
                <KeyboardAvoidingView style = {{alignItems : 'center', alignContent : 'center'}}>
                    <TextInput
                        placeholder = "Nom de l'équipe"
                        style = {styles.txt_input}
                        onChangeText = {(txt) => this.changeNom(txt)}
                    />
                </KeyboardAvoidingView>

                {/* View contenant les "compteur d'etape de creation"*/}
                <View style ={{alignItems : 'center', alignContent : 'center'}}>
                    <View style = {{flexDirection : 'row', marginTop :hp('5%')}}>
                        <View  style = {[styles.step, styles.curent_step]}></View>
                        <View style = {styles.step}></View>
                        <View style = {styles.step}></View>
                        <View style = {styles.step}></View>
                        <View style = {styles.step}></View>

                    </View>
                </View>
            </View>
        )
    }

}
const styles = {
    main_container : {
        marginTop:hp('0%')
    },

    bandeau : {
        flexDirection : 'row',
        backgroundColor : '#DCDCDC',
        paddingTop : hp('1%'),
        paddingBottom : hp('1%')
    },

    txt_input : {
        borderWidth : 1,
        marginTop : hp('8%'),
        width : wp('70%'),
        fontSize : RF(3.4),
        borderRadius : 10,
        padding : wp("2%")
    },

    step : {
        width :wp('5%'), 
        height : wp('5%'), 
        borderWidth : 1,
        borderRadius : 10,
        marginLeft : wp('3%'),
        marginRight : wp('3%')
    },

    curent_step : {
        backgroundColor : Colors.agOOraBlue
    }

    
}
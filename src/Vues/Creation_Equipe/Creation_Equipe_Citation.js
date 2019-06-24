import React from 'react'

import {KeyboardAvoidingView, View, Text,Image,TouchableOpacity, TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'

export default class Creation_Equipe_Citation extends React.Component {

    static navigationOptions = { title: 'Nouvelle équipe'};

    constructor(props) {
        super(props) 
        console.log(props)
        this.state = {
            citation : ''
        }
    }


    changeNom(txt) {
        this.setState({citation : txt})
    }


    render(){
        return(
            <View style = {styles.main_container}>

                {/* Bandeau superieur */}
                <View style = {styles.bandeau}>
                    <Text> </Text>
                    <Text style= {{ alignSelf : "center", fontSize : RF(3.1)}}>Phrase fétiche</Text>
                    <TouchableOpacity
                        onPress = {()=> this.props.navigation.push(
                            "CreationEquipePhoto", 
                            {
                                nom : this.props.navigation.getParam('nom', undefined),
                                ville :  this.props.navigation.getParam('ville', undefined),
                                departement :  this.props.navigation.getParam('departement', undefined),
                                joueurs : this.props.navigation.getParam('joueurs', []),
                                citation : this.state.citation
                            }
                        )}
                    >
                        <Text style = {{fontSize : RF(3.1), color : Colors.agOOraBlue}}>Suivant</Text>
                    </TouchableOpacity>
                </View>

                {/* View contenant l'image du ballon */}
                <View style = {{alignItems : 'center', alignContent : 'center', marginTop : hp('5%')}  }>
                    <Image
                        source = {require('app/res/quotation.png')}
                        style = {{width : wp('35%'), height : wp('35%')}}/>
                </View>
              
                {/* Champs pour écrire la de l'équipe */}
                <KeyboardAvoidingView style = {{alignItems : 'center', alignContent : 'center'}}>
                    <Text>Décris en quelques mots ton équipe</Text>
                    <TextInput
                        placeholder = "Phrase fétiche"
                        style = {styles.txt_input}
                        onChangeText = {(txt) => this.changeNom(txt)}
                    />
                </KeyboardAvoidingView>

                {/* View contenant les "compteur d'etape de creation"*/}
                <View style ={{alignItems : 'center', alignContent : 'center'}}>
                    <View style = {{flexDirection : 'row', marginTop :hp('5%')}}>
                        <View  style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
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
        paddingBottom : hp('1%'),
        justifyContent: 'space-between',

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


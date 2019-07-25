import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { Image } from 'react-native-elements';
import Colors from '../../../Components/Colors'
import DatePicker from 'react-native-datepicker'
import Slider from "react-native-slider";
import Type_Defis from '../Type_Defis'


export default class Choix_Date_Defis extends React.Component {

    constructor (props) {
        super(props)
        this.type =  this.props.navigation.getParam('type', ' ')
        this.format =  this.props.navigation.getParam('format', ' ')

        var auj = new Date()

        this.state = {
            today : auj.getDate() + '-' + (auj.getMonth() + 1) + '-' +  auj.getFullYear() ,

            day : auj.getDate() + '-' + (auj.getMonth() + 1) + '-' +  auj.getFullYear(),
            duree : 1,
            hours  : auj.getHours() + ':' + auj.getMinutes() + ':00',
            hoursNow :  auj.getHours() + ':' + auj.getMinutes() + ':00',
            aToutComplete : false,
            
        }
    }

    static navigationOptions = ({ navigation }) => {
        if(navigation.getParam('type', ' ') == Type_Defis.defis_2_equipes){
            return {
                title: 'Proposer un défi'
            }
        } else {
            return {
                title: 'Proposer une partie'
            }
        }
    }
    
    goToRechercherTerrain() {
        console.log('------' + this.state.duree + '---------')
        this.props.navigation.push("ChoixTerrainDefis", 
                {
                    format : this.format,
                    type : this.type,
                    jour : this.state.day,
                    duree : this.state.duree,
                    heure : this.state.hours,
                })        
    }

    buttonNext(){

        conditionDay = (this.state.day != this.state.today && this.state.duree != 0) 

        hourToday = parseInt(this.state.hoursNow.split(':')[0])
        hourDefi = parseInt(this.state.hours.split(':')[0])

        conditionHour = (hourToday < hourDefi && this.state.duree != 0)
        if(conditionDay || conditionHour) {
            return( 
                <TouchableOpacity
                    onPress ={() =>this.goToRechercherTerrain()}>
                    <Text style = {styles.txtBoutton}>Suivant</Text>
                </TouchableOpacity>
            ) 
        } else {
            return (
                <Text>Suivant</Text>
            )
        }
    }

    render() {

        

        return(
            <View >
                {/* Bandeau superieur */}
                <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        onPress ={
                            () => Alert.alert(
                                '',
                                "Es-tu sûr de vouloir quitter ?",
                                [
                                    {
                                        text: 'Oui',
                                        onPress: () => this.props.navigation.push("AccueilJouer")},
                                    {
                                        text: 'Non',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                            )}>
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>

                    <Text> Quand </Text>
                    
                    {this.buttonNext()}
                </View>

                <Text style = {{alignSelf : 'center', marginBottom : hp('5%'), fontSize : RF(3)}}>Quand souhaites-tu jouer ?</Text>
                <Image
                    source = {require('../../../../res/football.png')}
                    style = {styles.img}/>
                {/* Pour le jour*/}
                <View style = {styles.containerDate}>
                    <Text style = {{color : '#CECECE'}}>Date</Text>
                    <DatePicker
                        style={{width: wp('45%'), alignItems : 'center'}}
                        date= {this.state.day}
                        mode="date"
                        placeholder="select date"
                        format="DD-MM-YYYY"
                        minDate={this.state.today}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateInput: {
                            marginLeft: 0,
                            borderWidth : 0
                        }
                        }}
                        onDateChange={(date) => {this.setState({day: date})}}
                        />
                </View>

                {/* Pour l'heure*/}
                <View style = {styles.containerDate}>
                    <Text style = {{color : '#CECECE'}}>heure : </Text>
                    <DatePicker
                        style={{width: wp('45%'), alignItems : 'center'}}
                        date= {this.state.hours}
                        mode="time"
                        format="HH:mm"
                        is24Hour = {true}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateInput: {
                            marginLeft: 0,
                            borderWidth : 0
                        }
                        }}
                        onDateChange={(date) => {this.setState({hours: date})}}
                    />
                </View>

                {/* Pour la durée*/}
                <View>
                    <View style = {{flexDirection : 'row'}}>
                        <Text style = {{color : '#CECECE'}}>Durée : </Text>
                        <Text>{this.state.duree} h</Text>
                    </View>
                    <Slider
                        minimumValue={0}
                        maximumValue={3}
                        value={this.state.duree}
                        step = {0.5}
                        style = {{width : wp('65%'), alignSelf :"center"}}
                        onValueChange={(value) => {
                            this.setState({ duree : value, })
                        }}
                        minimumTrackTintColor={Colors.agOOraBlue}
                        maximumTrackTintColor= {Colors.agooraBlueStronger}
                        thumbTintColor= {Colors.agooraBlueStronger} 
                    />
                </View>

            </View>
            
        )
    }
}
const styles = {
    containerDate : {
        borderBottomWidth : 1, 
        flexDirection : 'row',
        alignItems :'center'
    },
    txt_btn : {
        fontSize : RF(2.7),
        color : 'white',
        fontWeight : 'bold'
    },

    btnSuivant : {
        backgroundColor:'#52C3F7',
        width : wp('78%'),
        paddingTop : wp('3%'),
        paddingBottom : wp('3%'),
        paddingLeft : wp('2%'),
        borderRadius : 20,
        alignItems : 'center',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android,
        alignSelf : "center",
        marginTop : hp('5%')
    },

    img : {
        width : wp('35%'),
        height : wp('35%'),
        marginBottom : hp('5%'),
        alignSelf : 'center'
    },

    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    }
    
}
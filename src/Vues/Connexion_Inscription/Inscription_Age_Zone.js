
import React from 'react'

import {View, Text,Image ,TouchableOpacity, Animated, TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import DatePicker from 'react-native-datepicker'


export default class Inscription_Age_Zone extends React.Component {

    constructor(props) {
        super(props)
        var auj = new Date()
        
        this.inputChamps =  new Animated.ValueXY({ x: wp('100%'), y:hp('-8%') })

        /* On recupère le mail et le mdp de l'utilisateur. */
        const { navigation } = this.props;
        const mail = navigation.getParam('mail', ' ');
        const mdp = navigation.getParam('mdp', ' ');
        const nom = navigation.getParam('nom', ' ');
        const prenom = navigation.getParam('prenom', ' ');
        const pseudo = navigation.getParam('pseudo', ' ');

        this.state = {
            ville : ' ',
            zone : ' ',
            today : auj.getFullYear() + '-' + (auj.getMonth() + 1) + '-' +  auj.getDate(),
            txtDateNaissance : 'Date de naissance',
            mail : mail,
            mdp : mdp,
            nom : nom,
            prenom : prenom,
            pseudo : pseudo,
            age : 0
        }

    }

    moveInput = () => {
        Animated.spring(this.inputChamps, {
          toValue: {x: 0, y : hp('-8%')},
        }).start()
    }
    componentDidMount() {
        this.moveInput()
    }

    changeVille(texte) {
        this.setState({
            ville : texte
        })
    }

    changeZone(texte) {
        this.setState({
            zone : texte
        })
    }

    calculAge()  {
        var d = new Date()
        var x = new Date(this.state.today)
        return (d.getFullYear()  - x.getFullYear())
    }

    callNextScreen() {
        this.props.navigation.navigate("InscriptionPhoto", {
            mail : this.state.mail,
            mdp : this.state.mdp,
            nom : this.state.nom,
            prenom : this.state.prenom,
            pseudo : this.state.pseudo,
            ville : this.state.ville,
            zone : this.state.zone,
            naissance : this.state.today,
            age : this.calculAge()
        })
    }

    displayRender() {
            return(
                <View style = {styles.main_container}>
                    {/* Image de l'herbre */}
                    <View style = {styles.View_grass}>
                        <Image 
                            source = {require('app/res/grass.jpg')}
                            style = {styles.grass}
                        />
                    </View>

                    {/* View contenant le text Agoora */}
                    <View style = {styles.view_agoora}>
                        <Text style = {styles.txt_agoora}>AgOOra</Text>
                    </View>

                    {/* Txt input pour la ville */}
                    
                    <View style = {styles.view_champ}>
                            <Animated.View style={[this.inputChamps.getLayout(), {borderBottomWidth : 1}]}>
                                <TextInput 
                                    placeholder = "Ville"
                                    style = {styles.txt_input}
                                    placeholderTextColor ='#CECECE'
                                    onChangeText ={(text) => this.changeVille(text)} 


                                />
                            </Animated.View>
                    </View>

                    {/* Txt input pour la zone */}
                    
                    <View style = {styles.view_champ}>
                            <Animated.View style={[this.inputChamps.getLayout(), {borderBottomWidth : 1}]}>
                                <TextInput 
                                    placeholder = "Zone"
                                    style = {styles.txt_input}
                                    placeholderTextColor ='#CECECE'
                                    onChangeText ={(text) => this.changeZone(text)} 


                                />
                            </Animated.View>
                    </View>
                    
                    <View style = {{ width : wp('80%')}}>
                        <Animated.View style={[this.inputChamps.getLayout(), {borderBottomWidth : 1, flexDirection : 'row',alignItems :'center'}]}>

                            <Text style = {{color : '#CECECE'}}>{this.state.txtDateNaissance}</Text>
                            <DatePicker
                                style={{width: wp('45%'), alignItems : 'center'}}
                                date= {this.state.today}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate="1900-001-01"
                                maxDate={this.state.today}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                dateInput: {
                                    marginLeft: 0,
                                    borderWidth : 0
                                }
                                }}
                                onDateChange={(date) => {this.setState({today: date, txtDateNaissance : ''})}}
                            />
                            </Animated.View>
                    </View>
                    <View style = {{marginBottom : hp('5%')}}>
                        <Text style = {{fontSize : RF(2.6)}}>
                            Renseigne ces informations personnelles
                        </Text>
                    </View>
                    <TouchableOpacity style = {styles.btn_Connexion}
                                onPress = {()=> this.callNextScreen()}>
                                <Text style = {styles.txt_btn}>Suivant</Text>

                    </TouchableOpacity>
                </View>


            ) 
       
    }
    render(){
        return(
            <View style = {styles.main_container}>
                {this.displayRender()}
            </View>
        )
    }
}

const styles = {
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    grass : {
        width : wp('100%'),
        height : wp('22%'),

    },

    View_grass : {
        backgroundColor : 'white',
        alignItems : 'center',
        position : 'absolute',
        bottom : 0,
        right : 0,
        left : 0,
        paddingTop : hp('2%')

        
    },

    view_agoora : {
        borderWidth : 1,
        position : 'absolute',
        top : hp('2%'),
        paddingTop : hp('2%'),
        paddingBottom : hp('2%'),
        width : wp('70%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        
    },

    txt_agoora : {
        fontSize : RF(3.5),
        fontWeight : 'bold'
    },

    view_champ : {
        marginBottom : hp('2%'),
        marginTop : hp('2%'),
        width : wp('80%'),

    },
    txt_btn : {
        fontSize : RF(2.7),
        color : 'white',
        fontWeight : 'bold'
    },

    btn_Connexion : {
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
        elevation: 5, // Android
    },
}
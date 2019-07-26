import React from 'react'

import {Picker, View, Text,Image, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import RF from 'react-native-responsive-fontsize';

/**
 * Classe qui va permettre à l'utilisateur de renseigner son nom 
 * son prénom et son pseudo lors de l'incription 
 */
export default class Inscription_Nom_Pseudo extends React.Component {
    
    
    constructor(props) {
        super(props)

        /* On recupère le mail et le mdp de l'utilisateur. */
        const { navigation } = this.props;
        const mail = navigation.getParam('mail', ' ');
        const mdp = navigation.getParam('mdp', ' ');

        this.state = {
            nom : '',
            prenom : '',
            pseudo : '',
            sexe: 'masculin',
            mail : mail,
            mdp : mdp,
        }
        this.cadre = new Animated.ValueXY({ x: wp('0%'), y:hp('0%') })
        this.inputNom =  new Animated.ValueXY({ x: wp('100%'), y:hp('-8%') })
    }

    moveInputNom = () => {
        Animated.spring(this.inputNom, {
          toValue: {x: 0, y : hp('-8%')},
        }).start()
    }
    componentDidMount() {
        this.moveInputNom()
    }

    /**
     * Permet de changer le nom en fonction de ce que tappe l'utilisateur
     * @param {*} text 
     */
    changeNom(text) {
        this.setState({
            nom : text
         })
    }

    /**
     * Permet de changer le prenom en fonction de ce que tappe l'utilisateur
     */
    changePrenom(text) {
        this.setState({
            prenom : text
         })
    }

    /**
     * Permet de changer le pseudo en fonction de ce tappe l'utilsateur
     */
    changePseudo(text) {
        this.setState({
            pseudo : text
         })
    }

    callNextScreen() {
        if (this.state.prenom.length == 0 || this.state.nom.length == 0) {
            Alert.alert(
                '',
                "Tu dois renseigner au moins ton nom et ton prénom"  ,
                [
                    {
                    text: "D'accord",
                    onPress: () => {},
                    style: 'cancel',
                    },
                ],
            )
        } else {

            var pseudoBis = this.state.pseudo;
            if (pseudoBis.length == 0) {
                pseudoBis = this.state.prenom + " " + this.state.nom;
            }

            this.props.navigation.push("InscriptionZone",
            {
                mail : this.state.mail,
                mdp : this.state.mdp,
                nom : this.state.nom,
                prenom : this.state.prenom,
                pseudo : pseudoBis,
                sexe: this.state.sexe
            })

        }

    }



    render() {

        return(
            <View style = {styles.main_container}>

                {/* View contenant le text Agoora */}
                <View style = {styles.view_agoora}>
                    <Text style = {styles.txt_agoora}>SOKKA</Text>
                </View>

                {/* Image de l'herbre */}
                <View style = {styles.View_grass}>
                    <Image 
                        source = {require('app/res/grass.jpg')}
                        style = {styles.grass}
                    />
                </View>

                {/* View contenant les champs */}
                
               
                    <Animated.View style={[this.cadre.getLayout(), styles.container_champs]}>


                        {/* Pour le nom */}
                        <View style = {styles.view_champ}>
                            <Animated.View style={[this.inputNom.getLayout(), {borderBottomWidth : 1}]}>
                                <TextInput 
                                    placeholder = "Nom"
                                    style = {styles.txt_input}
                                    onChangeText ={(text) => this.changeNom(text)} 

                                />
                            </Animated.View>

                        </View>

                        {/* Pour le prénom */}
                        <View style = {styles.view_champ}>
                            <Animated.View style={[this.inputNom.getLayout(), {borderBottomWidth : 1}]}>
                                <TextInput 
                                    placeholder = "Prénom"
                                    style = {styles.txt_input}
                                    onChangeText ={(text) => this.changePrenom(text)} 
                                />
                            </Animated.View>

                        </View>

                        {/* Pour le pseudo */}
                        <View style = {styles.view_champ}>
                            <Animated.View style={[this.inputNom.getLayout(), {borderBottomWidth : 1}]}>
                                <TextInput 
                                    placeholder = "Pseudo"
                                    style = {styles.txt_input}
                                    onChangeText ={(text) => this.changePseudo(text)} 

                                />
                            </Animated.View>

                        </View>

                        {/* Pour le sexe */}
                        <View style = {styles.view_champ}>
                            <Animated.View style={[this.inputNom.getLayout(), {borderBottomWidth : 1, flexDirection: 'row', alignItems: 'center'}]}>
                                <Text>Sexe : </Text>
                                <Picker
                                    selectedValue={this.state.sexe}
                                    style={{width: wp('60%'), marginRight: wp('5%')}}
                                    onValueChange={(itemValue, itemIndex) => {this.setState({sexe: itemValue})}}
                                    >
                                    <Picker.Item label={"Masculin"} key={1} value={"masculin"}/>
                                    <Picker.Item label={"Féminin"} key={2} value={"feminin"}/>
                                </Picker>
                            </Animated.View>

                        </View>

                    </Animated.View>
                    {/* Le txt en millieu d'écran */}
                    <View style = {{alignItems : 'center', alignContent : 'center'}}>
                        <Text style ={styles.txt_description}>Indique ton nom et ton prénom pour </Text>
                        <Text style ={styles.txt_description}>que tes fans puissent te retrouver !</Text>
                    </View>

                

                 
                    {/* Bouton suivant */}
                    <View style = {{marginTop : hp('4%')}}>
                        <TouchableOpacity style = {styles.btn_Connexion}
                            onPress = {() => this.callNextScreen()}>
                                <Text style = {styles.txt_btn}>SUIVANT</Text>
                        </TouchableOpacity>
                    </View>
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
        height : wp('22%')
    },

    View_grass : {
        backgroundColor : 'white',
        alignItems : 'center',
        position : 'absolute',
        bottom : 0,
        right : 0,
        paddingTop : hp('2%')

        
    },

    view_agoora : {
        borderWidth : 1,
        position : 'absolute',
        top : hp('3%'),
        paddingTop : hp('2%'),
        paddingBottom : hp('2%'),
        width : wp('70%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        
    },

    txt_agoora : {
        fontSize : RF(3.5)
    },

    txt : {
        fontSize : RF(2.3),
        marginRight : wp('4%'),
        color : 'gray'
    },

    container_champs : {
        //borderWidth : 1,
        width : wp('77%'),

        //paddingBottom : hp('3%'),
        //paddingTop : hp('3%')
    },

    txt_btn : {
        fontSize : RF(2.7),
        color : 'white',
        fontWeight : 'bold'
    },

    txt_input : {
        //width : wp('50%'),
    },

    view_champ : {
        marginBottom : hp('2%'),
        marginTop : hp('2%')
    },

    txt_description : {
        alignSelf : 'center',
        fontSize : RF(2.7)
    },

    btn_Connexion : {
        marginBottom : hp('2%'),
        backgroundColor:'#52C3F7',
        width : wp('77%'),
        paddingTop : wp('4%'),
        paddingBottom : wp('4%'),
        paddingLeft : wp('2%'),
        borderRadius : 20,
        borderWidth : 1,
        alignItems : 'center',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android
    },

}
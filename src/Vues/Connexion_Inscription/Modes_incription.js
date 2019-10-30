import React from 'react'

import {View, Text,Image, Animated,TouchableOpacity,TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import firebase from 'firebase'
import '@firebase/firestore'


const erreurMdpDiff = "Les mots de passe sont différents";
const erreurMdpTropCourt = "Le mot de passe doit faire au moins 6 caractères"
const erreurFormat = "Format du mail non reconnu"


/**
 * Classe qui va permettre d'afficher les modes d'inscription, y compris les champs pour 
 * les mails et mdp.
 */
export default class Modes_incription extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            txt :'',
            mail : ' ',
            mailErrorMsg : ' ',
            mdpErrorMsg : ' ',
            mailFormat: ' ',
            mdp : '',
            mdp_confimation : '',
            inscriptionReussie : false,
            nextDisabled: true,
            checkMail: false,
            checkMdp: false
        }
        this.mailAnimation = new Animated.ValueXY({ x: wp('-100%'), y:hp('-5%') })
        this.facebookAnimation =  new Animated.ValueXY({ x: wp('100%'), y:hp('0%') })
        this.txtOuAnimation = new Animated.ValueXY({ x: wp('0%'), y:hp('-2.5%') })

    }
    componentDidMount() {
        this._moveConnexionFacebook()
        this._moveConnexionMail()
    }

    /**
     * Fonction qui permet de déplacer le boutton se connecter via facebook
     */
    _moveConnexionFacebook = () => {
        Animated.spring(this.facebookAnimation, {
          toValue: {x: 0, y: hp('2%')},
        }).start()
    }

    /**
     * Fonction qui permet de déplacer le boutton se connecter via mail
     */
    _moveConnexionMail = () => {
        Animated.spring(this.mailAnimation, {
          toValue: {x: 0, y: hp('-5%')},
        }).start()
    }

   

    /* Pour recuperer l'email */
    mailTextInputChanged (text) {
        this.setState({
            mail : text
        })
    }

    /* Pour recuperer le mot de passe */
    passwordTextInputChanged (text) {
        this.setState({
            mdp : text
        })    
    }

    /* Verification du format du mail */
    checkMail () {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(this.state.mail) === false)
        {
            this.setState({
                checkMail: false,
                mailFormat: erreurFormat
            })
        }
        else {
            this.setState({
                checkMail: true,
                mailFormat: ' '
            })
        }
    }

   /* Pour recuperer la confirmation du mot de passe */
   passwordConfirmationTextInputChanged () {
        if (!(this.state.mdp === this.state.mdp_confimation)) {
            this.setState({
                mdpErrorMsg : erreurMdpDiff,
                checkMdp : false
            })
        } else if (this.state.mdp.length < 6) {
            this.setState({
                mdpErrorMsg : erreurMdpTropCourt,
                checkMdp : false
            })
        } else {
            this.setState({
                mdpErrorMsg : ' ',
                checkMdp : true
            })
        }
    }

    /**
     * Fonction qui va permettre de poursuivre l'inscription (par email)
     * si les infos rentrées sont bonnes
     */
    callNextStep() {

        var db = Database.initialisation();

        if (this.state.mdp === this.state.mdp_confimation) {
            firebase.auth().createUserWithEmailAndPassword(this.state.mail, this.state.mdp)
            .then((userCred) => {
                userCred.user.delete();

                this.setState({
                    mailErrorMsg : ' ',
                    inscriptionReussie : true,
                })

                this.props.navigation.push(
                    "InscriptionCGU", {
                        mail : this.state.mail,
                        mdp : this.state.mdp
                })
            })
            .catch((error) => {            
                switch(error.code) {
                    case "auth/email-already-in-use": {this.setState({mailErrorMsg: 'Cette adresse email est déjà associée à un compte. Veuillez vous connecter avec votre mot de passe.'}); break;}
                    case "auth/invalid-email": {this.setState({mailErrorMsg: 'Adresse email incorrect...'}); break;}
                    case "auth/weak-password": {this.setState({mailErrorMsg: "Le mot de passe est trop facile à deviner. Essaie de le ralonger et d'ajouter des caractères spéciaux..."}); break;}
                    default : {this.setState({mailErrorMsg: "Cette adresse email et ce mot de passe ne conviennent pas"}); break;}
                }
            });
        }
    }
    

    
    displayTxtInsc() {
        return (
            <View>
                <Text>{this.state.mailErrorMsg}</Text>
                <Text>{this.state.mailFormat}</Text>
                <Text>{this.state.mdpErrorMsg}</Text>
            </View>
        )
    
    }
   
    render() {
        
        return (
            <View style = {styles.main_container}>

                {/* View contenant le text Agoora */}
                <View style = {styles.view_agoora}>
                    <Text style = {styles.txt}>SOKKA</Text>
                </View>

                {/* Image de l'herbre */}
                <View style = {styles.View_grass}>
                    <Image 
                        source = {require('app/res/grass.jpg')}
                        style = {styles.grass}
                    />

                </View>

                {/* View contenant les champs pour l'inscription via mail */}
                <Animated.View style={[this.mailAnimation.getLayout(), {width : wp('88%')}]}>
                    <View 
                        style = {styles.animatedConnexion}
                        >
                        
                        
                        
                        <TextInput 
                            style = {styles.txt_input}
                            placeholder = 'Adresse mail'
                            placeholderTextColor = '#CECECE'
                            keyboardType = 'email-address'
                            onChangeText ={(text) => this.mailTextInputChanged(text)} 
                            onEndEditing ={() => this.checkMail()}
                        />
                        
                        
                        <TextInput 
                            style = {styles.txt_input}
                            placeholder = 'Mot de passe'
                            placeholderTextColor = '#CECECE'
                            secureTextEntry ={true}
                            onChangeText ={(text) => this.passwordTextInputChanged(text)} 
                        />

                        <TextInput 
                            style = {styles.txt_input}
                            placeholder = 'Confirme ton mot de passe'
                            placeholderTextColor = '#CECECE'
                            secureTextEntry ={true}
                            onChangeText ={(text) => this.setState({mdp_confimation : text})}
                            onEndEditing={() => this.passwordConfirmationTextInputChanged()}
                        />

                        {this.displayTxtInsc()}

                        <TouchableOpacity style = {this.state.checkMdp && this.state.checkMail ? styles.btn_Connexion : {...styles.btn_Connexion, backgroundColor: '#6a818c'}}
                            disabled={!(this.state.checkMdp && this.state.checkMail)}
                            onPress = {() => this.callNextStep()}>
                            <Text style = {styles.txt_btn}>Suivant</Text>
                        </TouchableOpacity>
                    </View>


                </Animated.View>


                {/*View contenant le txt ou */}  
                <Animated.View style={this.txtOuAnimation.getLayout()}> 
                    <Text>ou</Text>
                </Animated.View>

                {/* View contenant le boutton se connecter via facebook 
                <Animated.View style={[this.facebookAnimation.getLayout(),{width : wp('77%')}]}>
                    <TouchableOpacity 
                        style = {styles.animatedFacebook}
                        >
                        <Image
                            source = {require('app/res/fb.png')}
                            style = {styles.fb}
                        />
                        <Text style = {styles.txt_btn}>Utilise Facebook</Text>
                    </TouchableOpacity>
                </Animated.View>*/}

              
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
        width : wp('75%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        
    },

    txt : {
        fontSize : RF(3.5),
        fontWeight : 'bold'
    },

    txt_btn : {
        fontSize : RF(2.7),
        color : 'white',
        fontWeight : 'bold'
    },

    txt_input : {
        fontSize: RF(2.5),
        //backgroundColor:'#F0F0F0',
        width : wp('77%'),
        //paddingTop : wp('3%'),
        marginBottom : hp('3%'),
        //paddingBottom : wp('3%'),
        paddingLeft : wp('2%'),
        borderBottomWidth : 1


    },

    animatedConnexion: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        //paddingLeft : wp('15%'),
        //paddingRight : wp('15%'),
        paddingTop : wp('3%'),
        paddingBottom : wp('3%'),
        //borderWidth : 1
    },

    btn_Connexion : {
        backgroundColor: '#52C3F7',
        width : wp('77%'),
        paddingTop : wp('4%'),
        paddingBottom : wp('4%'),
        paddingLeft : wp('2%'),
        borderRadius : 20,
        alignItems : 'center',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android

    },

    animatedFacebook : {
        display: 'flex',
        flexDirection : 'row',
        backgroundColor : '#4167B2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        //paddingLeft : wp('15%'),
        //paddingRight : wp('15%'),
        paddingTop : wp('3%'),
        paddingBottom : wp('3%'),
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android
    },
    
    fb : {
        width : wp('8%'),
        height : wp('8%'),
        marginRight : wp('10%')
    }
}
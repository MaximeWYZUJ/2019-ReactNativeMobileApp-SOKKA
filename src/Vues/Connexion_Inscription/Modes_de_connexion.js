
import React from 'react'

import {View, Text,Image, Animated,TouchableOpacity,TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PasswordInputText from 'react-native-hide-show-password-input';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import firebase from 'firebase'
import '@firebase/firestore'
import {SkypeIndicator} from 'react-native-indicators';
import { Constants, Location, Permissions,Notifications } from 'expo';

/**
 * Classe qui va permettre d'afficher la page de choix du mode de connexion.
 */
export default class Modes_de_connexion extends React.Component {




    constructor(props) {
        super(props)
        this.state = {
            txt :'',
            mail : ' ',
            mdp : '',
            coReussie : false,
            isLoading : false
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
          toValue: {x: 0, y: hp('0%')},
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

    changeText(coReussie) {
        if(coReussi) {
            this.setState({
                txt : 'Connexion réussie',
                coReussie : true,
            })
        } else {
            this.setState({
                txt: 'Adresse mail ou mot de passe incorect...'
            })
        }
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

    displayTxtCo() {
            return (
                <View>
                    <Text>{this.state.txt}</Text>
                </View>
            )
        
    }

    /**
     * Fonction qui va permettre d'authentifier un utilisateur
     */
    checkConnexion(){
        this.setState({isLoading : true})
        var db = Database.initialisation()

        firebase.auth().signInWithEmailAndPassword(this.state.mail, this.state.mdp)
        .then(async (user) => {
         
            // Récupérations des données de la DB
            j = await Database.getDocumentData(firebase.auth().currentUser.uid, "Joueurs");
            jEquipes = await Database.getArrayDocumentData(j.equipes, 'Equipes');

            // Update des données locales
            LocalUser.exists = true;
            LocalUser.data = j;

            // Enregistrement du token
            this.storeToken(j);

            // Passage à la vue suivante
            this.props.navigation.navigate("ProfilJoueur", {id: j.id, joueur: j, equipes: jEquipes});
        })
        .catch((error) => {
          const { code, message } = error;
            console.log(error)
            this.setState({
                txt : 'Adresse email ou mot de passe incorrect',
                isLoading : false
            })
            // For details of error codes, see the docs
            // The message contains the default Firebase string
            // representation of the error
        });
    }


    async storeToken(j) {
        this.registerForPushNotifications()
        .then(async (token) => {
            let db = Database.initialisation();
            db.collection("Login").doc(token).set({id : j.id});

            var tokenListe =  [] 
            if (j.tokens != undefined) {
                tokenListe = j.tokens
            }
            tokenListe.push(token)
            LocalUser.data.tokens = tokenListe
            db.collection("Joueurs").doc(j.id).update({
                tokens : tokenListe
            })
        })
    }


    async registerForPushNotifications() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log('in register')
        if (status !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          if (status !== 'granted') {
            return;
          }
        }
        console.log("okook")
        var token = await Notifications.getExpoPushTokenAsync();
        console.log("after await token")
        //this.subscription = Notifications.addListener(this.handleNotification);
    
        return (token)
    }


    render() {
        if(! this.state.isLoading) {
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

                    {/* View contenant le boutton se connecter via l'adresse mail */}
                    <Animated.View style={[this.mailAnimation.getLayout(), {width : wp('88%')}]}>
                        <View 
                            style = {styles.animatedConnexion}
                            >

                            {/* Champs mail */}
                            <View style = {styles.view_champ}>
                                <TextInput 
                                    style = {styles.txt_input}
                                    placeholder = "adresse mail"
                                    placeholderTextColor = '#CECECE'
                                    keyboardType = 'email-address'
                                    onChangeText ={(text) => this.mailTextInputChanged(text)} 

                                />
                            
                            </View>
                        
                            {/* Champs mot de passe */}
                            <View style = {styles.view_champ}>
                                <TextInput 
                                    style = {styles.txt_input}
                                    placeholderTextColor = '#CECECE'
                                    placeholder = "mot de passe"
                                    secureTextEntry ={true}
                                    onChangeText ={(text) => this.passwordTextInputChanged(text)} 
                                    onSubmitEditing={() => this.checkConnexion()}
                                />
                            
                            
                            </View>
                        
                            <TouchableOpacity style = {styles.btn_Connexion}
                                onPress = {()=> this.checkConnexion()}>
                                <Text style = {styles.txt_btn}>Connexion</Text>

                            </TouchableOpacity>
                        </View>

                        {this.displayTxtCo()}

                    </Animated.View>


                    {/*View contenant le txt ou */}  
                    <Animated.View style={[this.txtOuAnimation.getLayout(), {marginBottom : hp('3%')}]}> 
                        <Text>ou</Text>
                    </Animated.View>

                    {/* View contenant le boutton se connecter via facebook */}
                    <Animated.View style={[this.facebookAnimation.getLayout(),{width : wp('78%')}]}>
                        <TouchableOpacity 
                            style = {styles.animatedFacebook}
                            >
                            <Image
                                source = {require('app/res/fb.png')}
                                style = {styles.fb}
                            />
                            <Text style = {styles.txt_btn}>Connecte toi avec Facebook</Text>
                        </TouchableOpacity>
                    </Animated.View>

                
                </View>

            )

        } else {
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
                        <Text style = {styles.txt_agoora}>SOKKA</Text>
                    </View>
                
                    {/* View contenant le texte */}
                    <View style = {{marginTop :hp('30%')}}>
                        <Text style = {{fontSize : RF(2.5)}}>Un instant, nous récuperons vos données</Text>
                    </View>

                    {/* Indicateur de chargement */}
                    <SkypeIndicator 
                    color='#52C7FD'
                    size = {hp('10%')} />
                </View>
            )
        }
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
        top : hp('2%'),
        paddingTop : hp('2%'),
        paddingBottom : hp('2%'),
        width : wp('70%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        
    },

    txt : {
        fontSize : RF(3.5)
    },

    txt_btn : {
        fontSize : RF(2.7),
        color : 'white',
        fontWeight : 'bold'
    },

    txt_input : {
        fontSize: RF(2.5),
        width : wp('78%'),
        marginBottom : hp('3%'),
        paddingLeft : wp('2%'),
        borderBottomWidth : 1
    },

    animatedConnexion: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        //paddingLeft : wp('15%'),
        //paddingRight : wp('15%'),
        paddingTop : wp('3%'),
        paddingBottom : wp('3%'),
        //borderWidth : 1
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
        marginRight : wp('5%')
    },

    view_champ : {
        alignItems : 'flex-start'
    }
}

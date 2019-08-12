
import React from 'react'

import {View, Text,Image ,TouchableOpacity, Animated, TextInput,ListView,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import DatePicker from 'react-native-datepicker'
import villes from '../../Components/Creation/villes.json'
import departements from '../../Components/Creation/departements.json'
import Colors from '../../Components/Colors'
import NormalizeString from '../../Helpers/NormalizeString'


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


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
        const sexe = navigation.getParam('sexe', ' ');

        this.state = {
            ville : '',
            zone : 'pas de zone',
            today : auj.getFullYear() + '-' + (auj.getMonth() + 1) + '-' +  auj.getDate(),
            txtDateNaissance : 'Date de naissance',
            mail : mail,
            mdp : mdp,
            nom : nom,
            prenom : prenom,
            pseudo : pseudo,
            sexe: sexe,
            age : 0,
            searchedVilles : []
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

    /**
     * Fonction qui permet de renvoyer une liste des villes qui
     * commencent par searchedText
     */
    searchedVilles= (searchedText) => {
        let searchedAdresses = villes.filter(function(ville) {
            
            return ville.Nom_commune.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({searchedVilles: searchedAdresses,ville : searchedText});
    };


    changeZone(texte) {
        this.setState({
            zone : texte
        })
    }

    /**
     * Verifie que la villle choisie par l'utilisateur est bien 
     * dans la db
     */
    isVilleOk() {
        for(var i = 0; i < villes.length; i++) {
            if(this.state.ville.toLowerCase() == villes[i].Nom_commune.toLowerCase()) {
                return true
            } 
        }
        return false
    }


    /**
     * Pour mettre la première lettre en capitale
     * @param {} string 
     */
    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    calculAge()  {
        var today = new Date();
        var naissanceDate = new Date(this.state.today)
        var ageCalcul = today.getFullYear() - naissanceDate.getFullYear() - 1;
        if (today.getMonth() > naissanceDate.getMonth() && today.getDay() > naissanceDate.getDay()) {
            ageCalcul = ageCalcul + 1;
        }
        return (ageCalcul)
    }


    getDepartement(nomVille) {
        for (var i=0; i<villes.length; i++) {
            if (nomVille === villes[i].Nom_commune) {
                var cp = villes[i].Code_postal+"";
                if (cp.length < 5) {
                    cp = "0" + cp;
                }
                var depCode = cp.substr(0, 2);
                for (var j=0; j<departements.length; j++) {
                    if (departements[j].departmentCode === depCode) {
                        return departements[j].departmentName;
                    }
                }
            }
        }
        return "erreur"
    }


    callNextScreen() {
        if(this.isVilleOk()) {
            this.props.navigation.navigate("InscriptionPhoto", {
                mail : this.state.mail,
                mdp : this.state.mdp,
                nom : this.state.nom,
                prenom : this.state.prenom,
                pseudo : this.state.pseudo,
                sexe: this.state.sexe,
                ville : NormalizeString.normalize(this.state.ville),
                departement : NormalizeString.normalize(this.getDepartement(this.state.ville)),
                zone : this.state.zone,
                naissance : this.state.today,
                age : this.calculAge()
            })
        } else {
            Alert.alert('Tu dois choisir une ville présente dans la base SOKKA')
        }
    }


    /**
     * Fonction qui permet de controler l'affichage des noms des villes
     */
    renderVille = (adress) => {
        if(this.state.ville.length > 0) {
            var txt = adress.Nom_commune.toLowerCase()
            
            return (
                <TouchableOpacity
                    onPress = {() => this.setState({ville :this.jsUcfirst(txt), searchedVilles : [] })}
                    style = {{backgroundColor : Colors.grayItem,  marginTop : hp('1%'), marginBottom : hp('1'),paddingVertical : hp('1%')}}
                    >
                
                    <View style = {{flexDirection : 'row'}}>
                            <Text>{adress.Code_postal} - </Text>
                            <Text style = {{fontWeight : 'bold', fontSize :RF(2.6)}}>{this.state.ville}</Text>
                            <Text style = {{fontSize :RF(2.6)}}>{txt.substr(this.state.ville.length)}</Text>
                    </View>
                
                </TouchableOpacity>
            );
        } else {
            return(<View/>)
        }
    };


    render() {
            return(
                <View style = {{flex : 1}}>
                    <ScrollView>
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

                            {/* Txt input pour la ville */}
                            <View style = {{marginTop : hp('25%')}}>
                                <View style = {styles.view_champ}>
                                        <Animated.View style={[this.inputChamps.getLayout(), {borderBottomWidth : 1}]}>
                                            <TextInput 
                                                placeholder = "Ville"
                                                style = {styles.txt_input}
                                                placeholderTextColor ='#CECECE'
                                                onChangeText ={(text) => this.searchedVilles(text)} 
                                                value = {this.state.ville}
                                            />

                                            <ListView
                                                    dataSource={ds.cloneWithRows(this.state.searchedVilles)}
                                                    renderRow={this.renderVille}
                                            />
                                            
                                        </Animated.View>
                                </View>

                                {/* Txt input pour la zone */}
                                {/*<View style = {styles.view_champ}>
                                        <Animated.View style={[this.inputChamps.getLayout(), {borderBottomWidth : 1}]}>
                                            <TextInput 
                                                placeholder = "Zone"
                                                style = {styles.txt_input}
                                                placeholderTextColor ='#CECECE'
                                                onChangeText ={(text) => this.changeZone(text)} 


                                            />
                                        </Animated.View>
                                </View>*/}
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
                    </ScrollView>
                </View>

            ) 
       
    }
   
}

const styles = {
    main_container: {
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
        elevation: 5, // Android,
        marginTop : hp('5%')
    },
}
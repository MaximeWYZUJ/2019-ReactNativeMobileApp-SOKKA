import React from 'react'

import {KeyboardAvoidingView, View, Text,Image, Animated,TouchableOpacity, TextInput,ListView, ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import place from '../../Components/Creation/place'
import Villes from '../../Components/Creation/villes.json'
import departements from '../../Components/Creation/departements.json'
import NormalizeString from '../../Helpers/NormalizeString';

/**
 * Vue qui va permettre à l'utilisateur de renseigner la zone d'une équipe qu'il est
 * en train de créer.
 */
var villes = Villes
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Creation_Equipe_Zone extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('nom', '')
        }
    }
    
    constructor(props) {
        super(props)
        const { navigation } = this.props;
        const nom = navigation.getParam('nom', ' ');
        this.champsAnimation = new Animated.ValueXY({ x: wp('-100%'), y:hp('0%') })
        this.state = {
            nom : nom,
            searchedVilles : [],
            txt : '',
            departement : '',
            ville : '',
            depCode : '',
        };
    }

     


    componentDidMount() {
        this._moveChamps()
        
    }

    /**
     * Fonction qui permet de déplacer les champs departement et ville
     */
    _moveChamps = () => {
        Animated.spring(this.champsAnimation, {
        toValue: {x: wp('11%'), y: hp('0%')},
        }).start()
    }


    searchedVilles = (searchedText) => {
        let searchedAdresses = villes.filter(function(ville) {
            
            return ville.Nom_commune.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({searchedVilles: searchedAdresses,ville : searchedText});
    };


    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    isVilleOk() {
        for(var i = 0; i < villes.length; i++) {
            if(NormalizeString.normalize(this.state.ville) == NormalizeString.normalize(villes[i].Nom_commune)) {
                return true
            } 
        }
        return false
    }

    getDepartement() {
        for (var i=0; i<departements.length; i++) {
            if (departements[i].departmentCode === this.state.depCode) {
                return departements[i].departmentName;
            }
        }
        return "erreur 13/10/19 inscription age zone";
    }

    
    /**
     * Fonction qui permet de controler l'affichage des noms des villes
     */
    renderVille = (adress) => {
        var txt = adress.Nom_commune.toLowerCase()
        var cp = adress.Code_postal;
        if (cp < 9999) {
            cp = cp*10;
        }
        var depCode = cp+"";
        
        return (
            <TouchableOpacity
                onPress = {() => this.setState({ville :this.jsUcfirst(txt), depCode: depCode[0]+depCode[1], searchedVilles : [] })}
                style = {{backgroundColor : Colors.grayItem,  marginTop : hp('1%'), marginBottom : hp('1'),paddingVertical : hp('1%')}}
                >
            
                <View style = {{flexDirection : 'row'}}>
                        <Text>{adress.Code_postal} - </Text>
                        <Text style = {{fontWeight : 'bold', fontSize :RF(2.6)}}>{this.state.ville}</Text>
                        <Text style = {{fontSize :RF(2.6)}}>{txt.substr(this.state.ville.length)}</Text>
                </View>
            
            </TouchableOpacity>
        );
    };
                          

   

  

    render() {
        return (
           
            <View style = {styles.main_container}>
                 
                 <ScrollView>
                {/* Bandeau superieur */}
                <View style = {styles.bandeau}>
                <TouchableOpacity
                        onPress ={() => Alert.alert(
                                '',
                                "Es-tu sûr de vouloir quitter ?",
                                [
                                    {
                                        text: 'Oui',
                                        onPress: () =>  this.props.navigation.push("ProfilJoueur")
                                        
                                    },
                                    {
                                        text: 'Non',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                            )}>
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>
                    <Text style= {{ fontSize : RF(3.1)}}>Lieu de l'équipe</Text>
                    <TouchableOpacity
                        onPress = {()=> {
                            if (this.isVilleOk()) {
                                this.props.navigation.push("CreationEquipeAjoutJoueurs", 
                                    {   nom : this.props.navigation.getParam("nom",undefined), 
                                        departement : this.getDepartement(), 
                                        ville : this.state.ville
                                    }
                                )
                            } else {
                                Alert.alert("Tu dois choisir une ville dans la base SOKKA")
                            }
                        }}
                    >
                        <Text style = {{fontSize : RF(3.1), color : Colors.agOOraBlue}}>Suivant</Text>
                    </TouchableOpacity>
                </View>

                  {/* View contenant l'image du ballon */}
                  <View style = {{alignItems : 'center', alignContent : 'center', marginTop : hp('5%')}  }>
                    <Image
                        source = {require('app/res/place.png')}
                        style = {{width : wp('35%'), height : wp('35%')}}/>
                </View>

                 {/* View contenant le champs pour la ville */}
                 <KeyboardAvoidingView style = {{flexDirection : 'row', marginTop : hp('3%'), alignItems : 'center', alignContent : 'center'}}>
                    <Animated.View style={[this.champsAnimation.getLayout()]}> 
                        <TextInput
                            style = {styles.input}
                            onChangeText={(t) => this.searchedVilles(t)}
                            placeholder= "Ville"
                            value = {this.state.ville}
                        />

                        <ListView
                            dataSource={ds2.cloneWithRows(this.state.searchedVilles)}
                            renderRow={this.renderVille} />
                        
                        
                    </Animated.View>
                </KeyboardAvoidingView>



                 {/* View contenant les "compteur d'etape de creation"*/}
                <View style ={{alignItems : 'center', alignContent : 'center'}}>
                    <View style = {{flexDirection : 'row', marginTop :hp('5%')}}>
                        <View  style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
                        <View style = {styles.step}></View>
                        <View style = {styles.step}></View>
                        <View style = {styles.step}></View>

                    </View>
                </View>
                </ScrollView>

            </View>

        )
    }

}

const styles = {
    main_container : {
        marginTop:hp('0%'),
    },

    bandeau : {
        flexDirection : 'row',
        backgroundColor : '#DCDCDC',
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        justifyContent : 'space-between'
    },

    input : {
        fontSize: RF(2.5),
        width : wp('78%'),
        marginBottom : hp('3%'),
        paddingLeft : wp('2%'),
        borderBottomWidth : 1
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
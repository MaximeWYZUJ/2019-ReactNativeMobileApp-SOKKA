import React from 'react'

import {KeyboardAvoidingView, View, Text,Image, Animated,TouchableOpacity, TextInput,ListView, ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import place from '../../Components/Creation/place'
import Villes from '../../Components/Creation/villes.json'
import Departement from '../../Components/Creation/departements.json'

/**
 * Vue qui va permettre à l'utilisateur de renseigner la zone d'une équipe qu'il est
 * en train de créer.
 */
var adresses  = Departement;
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
            searchedAdresses: [],
            searchedVilles : [],
            txt : '',
            departement : '',
            ville : '',
            numDep : 'nonRenseigne',
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


    /**
     * Fonction qui permet de renvoyer une liste des départements qui
     * commencent par searchedText
     */
    searchedAdresses = (searchedText) => {
        let searchedAdresses = adresses.filter(function(adress) {
            
            return adress.departmentName.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({searchedAdresses: searchedAdresses, departement : searchedText});
    };


    /**
     * Fonction qui permet de renvoyer une liste des villes du département
     * renseigné par l'utilisateur et qui commencent par searchtext
     */
    searchedVille = (searchedText) => {
        var numDep = this.state.numDep.toString()
        let villeFromDep = villes.filter(function(adress) {
        
        if(numDep != 'nonRenseigne') {            
            return adress.Code_postal.toString().startsWith(numDep)
        }else {
            return adress
        }
        });

        let searchedVille = villeFromDep.filter(function(adress) {
            return adress.Nom_commune.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({searchedVilles: searchedVille, ville : searchedText});
    };

        
    /**
     * Fonction qui permet de controler l'affichage des noms des département
    */
    renderAdress = (adress) => {
        var txt = adress.departmentName
        
        return (
            <TouchableOpacity
                onPress = {() => this.setState({departement : txt, searchedAdresses : [], numDep : adress.departmentCode })}>
            
                <View style = {{flexDirection : 'row'}}>
                        <Text style = {{fontSize :RF(2.3)}}>{adress.departmentCode} - </Text>
                        <Text style = {{fontWeight : 'bold', fontSize :RF(2.3)}}>{this.state.departement}</Text>
                        <Text style = {{fontSize :RF(2.3)}}>{txt.substr(this.state.departement.length)}</Text>
                </View>
            
               </TouchableOpacity>
        );
    };

    
    /**
     * Fonction qui permet de controler l'affichage des noms des villes
     */
    renderVille = (adress) => {
        var txt = adress.Nom_commune.toLowerCase()

        depCode = adress.Code_postal.toString();//.substring(0,2);
        if (depCode.length < 5) {
            depCode = "0"+depCode;
        }
        depCode = depCode.substring(0,2);
        dep = Departement.filter(function (d) {
            return (d.departmentCode === depCode);
        })
        
        
        return (
            <TouchableOpacity
                onPress = {() => {console.log(dep); console.log(depCode); this.setState({ville : txt, searchedVilles : [], departement : dep[0].departmentName })}}
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
                        onPress = {()=> this.props.navigation.push("CreationEquipeAjoutJoueurs", 
                            {   nom : this.props.navigation.getParam("nom",undefined), 
                                departement : this.state.departement, 
                                ville : this.state.ville
                            }
                        )}
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

                {/* View contenant le champs pour le département */}
                {/*<View style = {{flexDirection : 'row', marginTop : hp('3%'), alignItems : 'center', alignContent : 'center'}}>
                    <Animated.View style={[this.champsAnimation.getLayout()]}> 
                        <TextInput
                            style = {styles.input}
                            onChangeText={this.searchedAdresses}
                            placeholder= "Département"
                            value = {this.state.departement}
                        />

                        <ListView
                            dataSource={ds.cloneWithRows(this.state.searchedAdresses)}
                            renderRow={this.renderAdress} />
                        
                        
                    </Animated.View>
                </View>*/}

                 {/* View contenant le champs pour la ville */}
                 <KeyboardAvoidingView style = {{flexDirection : 'row', marginTop : hp('3%'), alignItems : 'center', alignContent : 'center'}}>
                    <Animated.View style={[this.champsAnimation.getLayout()]}> 
                        <TextInput
                            style = {styles.input}
                            onChangeText={this.searchedVille}
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
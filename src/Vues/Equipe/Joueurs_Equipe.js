import React from 'react'
import { StyleSheet, Text, Image, ScrollView, Button, TouchableOpacity, View, FlatList,RefreshControl, Alert } from 'react-native'
import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import { Constants, Location, Permissions,Notifications } from 'expo';
import Type_Defis from '../Jouer/Type_Defis'
import Types_Notification from '../../Helpers/Notifications/Types_Notification'
import Color from '../../Components/Colors';
import Barre_Recherche from '../../Components/Recherche/Barre_Recherche'
import Joueur_Pseudo_Score from '../../Components/ProfilJoueur/Joueur_Pseudo_Score'

/**
 * Classe qui affiche la vue montrant les joueurs de l'équipes
 */
export default class Joueurs_Equipe extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            joueurs : props.navigation.getParam("joueurs", []),
            equipe : props.navigation.getParam("equipe",undefined),
        }
    }


    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;

        return {
          title : navigation.getParam("equipe").nom
        };
    };

    /**
     * Fonction qui renvoie la liste des capitianes
     */
    buildListOfCap(){
        var liste = []
        for(var i = 0; i < this.state.joueurs.length; i++) {
            var j = this.state.joueurs[i]
            if(this.state.equipe.capitaines.includes(j.id)) {
                liste.push(j)
            }
        }
        return liste
    }

    /**
     * Fonction qui renvoie la liste des joueurs non capitiane
     */
    buildListOfNonCap(){
        var liste = []
        for(var i = 0; i < this.state.joueurs.length; i++) {
            var j = this.state.joueurs[i]
            if(! this.state.equipe.capitaines.includes(j.id)) {
                liste.push(j)
            }
        }
        return liste
    }

    /**
     * Pour aller sur la vue permettant de choisir les capitaines
     */
    goToChoixCapitaine() {
        this.props.navigation.navigate("ChoixCapitainesEquipe",{equipe : this.state.equipe, joueurs : this.state.joueurs})

    }

    _renderItemJoueur = ({item}) => {
        return(
            <Joueur_Pseudo_Score
                pseudo = {item.pseudo}
                score = {item.score}
                photo = {item.photo}
            />
        )
        
    
    }

    renderBtnChooseCap() {
        return(
            <TouchableOpacity
            style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%')}}
            onPress={() => Alert.alert(
                            '',
                            "Tu souhaites modifier les capitaines de l'équipe " + this.state.equipe.nom,
                            [
                                {
                                    text: 'Confirmer',
                                    onPress : () => {this.goToChoixCapitaine()}
                                },
                                {
                                    text: 'Annuler',
                                    style: 'cancel',
                                },
                            ],
                    )}
            >
            <Text style={styles.header}>+</Text>
        </TouchableOpacity>
        )  
    }
    renderBtnJoueur() {
        if(this.state.equipe != undefined && this.state.equipe.capitaines.includes(LocalUser.data.id)) {
            return(
                <TouchableOpacity
                style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%')}}
                onPress={() => Alert.alert(
                                '',
                                "Que veux-tu faire ?",
                                [
                                    {
                                        text: 'Créer',
                                    },
                                    {
                                        text: 'Rechercher',
                                        style: 'cancel',
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
            )
        }
    }
    render() {
        return(
            <ScrollView style = {{flex : 1}}>
                
            

                <View style = {{marginTop  : hp('1.2%')}}>
                    <Text style = {{fontWeight : "bold", fontSize : RF("2.7"), alignSelf : "center"}}>Joueurs de l'équipes</Text>
                </View>

            
                

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}
                        >
                        <Text style={styles.header}>Capitaines</Text>
                    </TouchableOpacity>
                    {this.renderBtnChooseCap()}
                </View>

                <FlatList
                    data = {this.buildListOfCap()}
                    renderItem = {this._renderItemJoueur}/>


                {/* Les autres joueurs de l'équipes */}
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}
                        >
                        <Text style={styles.header}>Joueurs</Text>
                    </TouchableOpacity>
                    {this.renderBtnJoueur()}
                </View>
                
                <FlatList
                    data = {this.buildListOfNonCap()}
                    renderItem = {this._renderItemJoueur}/>
            </ScrollView>
        )
    }
}

const styles = {
    
    
    txt_joueur : {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
    additional_style_container : {
        width : wp('98%'),
        marginLeft : wp('1%'),
        marginRight : wp('1%'),
        borderRadius : 15,
        marginBottom : hp('1%'),
        paddingBottom : hp('1.5%'),
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 5, width: 5 }, // IOS
        shadowOpacity: 5, // IOS
        shadowRadius: 5, //IOS
       // elevation: 2, // Android
    },

    header_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        width : wp('88%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
       // marginVertical: 10,
        //marginHorizontal: 10,
        borderRadius : 15,

       // borderWidth : 1,
       backgroundColor:'#52C3F7',
       //elevation : 5


    },
    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
    icon_plus : {
        width : 30,
        height : 30,
        marginBottom : hp('1.5%')

    },
}
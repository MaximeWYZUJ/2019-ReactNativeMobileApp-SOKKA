import React from 'react'

import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity,FlatList,Alert,ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Barre_Recherche from '../../../Components/Recherche/Barre_Recherche'
import Item_Partie from '../../../Components/Defis/Item_Partie'
import Item_Defi from '../../../Components/Defis/Item_Defi'
import Colors from '../../../Components/Colors';
import DataBase from '../../../Data/Database'
import Type_Defis from '../Type_Defis'



/**
 * Classe qui va permettre d'afficher les partie et defi (si l'utilisateur est capitaine
 * d'une équipe) qui recherchent des joueurs 
 */
export default class Rejoindre_Partie_Defi extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            latitude : undefined,
            longitude : undefined,
            allDefisPartie : undefined
        }
        this.isCaptain = true
        this.pseudo = "Flongb"
        this.props.navigation.setParams({Title: this.pseudo    })
    }

    componentDidMount() {
      this.findAllDefiAndPartie()

    }

   



    getUserPosition(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                            
                this.setState({latitude : latUser, longitude : longUser})
        },
        (error) => {
            console.log(error)           
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge : 3600000}
        )
    }


   

    /**
     * fonction qui va permettre d'effectuer une Query dans la base de donnée pour trouver 
     * tous les defis qui cherchent une équipe adverse.
     */
    async findAllDefiAndPartie() {
        var defisArray = []
        var db = DataBase.initialisation()

        var ref = db.collection("Defis");

        // Query sur les partie
        var query = ref.where("nbJoueursRecherche", ">", 0);
        query.get().then(async (results) => {
            
            // go through all results
            for(var i = 0; i < results.docs.length ; i++) {
                defisArray.push(results.docs[i].data())
            }


            // Query sur les defis 
            if(this.isCaptain) {
                var queryDefi = ref.where("cherche_adversaire", "==", true);
                queryDefi.get().then(async (results) => {
            
                    // go through all results
                    for(var i = 0; i < results.docs.length ; i++) {
                        defisArray.push(results.docs[i].data())
                    }
                    this.setState({allDefisPartie : defisArray})
                }).catch(function(error) {
                    console.log("Error getting documents defi:", error);
                });
            } else {
                this.setState({allDefisPartie : defisArray})
            }


              //this.setState({equipesAutour : equipeArray, equipeFiltrees : equipeArray})
              //return defisArray
            
          }).catch(function(error) {
              console.log("Error getting documents partie:", error);
          });   
    }

    async findJoueurs(arrayId) {
        var joueursArray = await DataBase.getArrayDocumentData(arrayId,"Joueurs")
        return joueursArray
    }   

    _renderItem = ({item}) => {       
        if(item.type == Type_Defis.partie_entre_joueurs){
          
            
            return(
                <Item_Partie
                    id = {item.id}
                    format = {item.format}
                    jour = {new Date(item.jour.seconds *1000)} 
                    duree = {item.duree}
                    joueurs = {item.participants}
                    nbJoueursRecherche =  {item.nbJoueursRecherche}
                    terrain=  {item.terrain}
                    latitudeUser = {this.state.latitude}
                    longitudeUser = {this.state.longitude}
                    message_chauffe  = {item.message_chauffe}
                />
            )
        } else if(item.type == Type_Defis.defis_2_equipes) {
            return(
                <Item_Defi
                    format = {item.format}
                    jour = {new Date(item.jour.seconds * 1000)}
                    duree ={item.duree}
                    equipeOrganisatrice = {item.equipeOrganisatrice}
                    equipeDefiee = {item.equipeDefiee}
                    terrain = {item.terrain}
                        
                />
            )
        } else {
            return(
                <Text>oooo</Text>
            )
        }
   }

    displayListDefisAndParties() {
        if(this.state.allDefisPartie != undefined) {

           

            if(this.state.allDefisPartie.length != 0) {

                return(
                    <ScrollView>
                         <View style = {{alignContent : "center", paddingBottom : 180}}>
                            <FlatList
                                data = {this.state.allDefisPartie}
                                renderItem = {this._renderItem}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    </ScrollView>
                   
                )
            } else {
                return(
                    <Text>Aucun défi ou partie n'est disponible</Text>
                )
            }
            
        } else {
            return(
                <Text>Loading ...</Text>
            )
        }
    }
    

    render() {
        
       

        return(
            <View style = {{marginTop : 50, backgroundColor : '#F3F4F6', paddingBottom : hp('3%')}}>
                <View style = {{backgroundColor : 'white'}}>
                    <Text style = {styles.txtCalendrier}>Calendrier</Text>

                    <TouchableOpacity style = {styles.containerHistorique}>
                        <Text>Afficher l'historique</Text>
                    </TouchableOpacity>

                </View>
                
                <Barre_Recherche/>

                {this.displayListDefisAndParties()}


                
            </View>
        )
    }
}

const styles = {
    txtCalendrier :  {
        fontsize : RF(2.7),
        alignSelf : "center"
    },

    containerHistorique : {
        alignSelf : "center",
        borderWidth : 1,
        borderRadius  : 5, 
        paddingLeft : wp('5%'),
        paddingRight : wp('5%'),
        paddingBottom : hp('1%'),
        paddingTop : hp('1%'),
        marginTop : hp('2%'),
        marginBottom : hp('2%')
    }
}
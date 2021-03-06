
import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Slider from "react-native-slider";
import { Image } from 'react-native-elements';
import Colors from '../../../Components/Colors'
import TabChoisirTerrainDefis from './TabChoisirTerrainDefis'
import Type_Defs from '../Type_Defis'
import { connect } from 'react-redux'
import actions from '../../../Store/Reducers/actions'
import Terrains from '../../../Helpers/Toulouse.json'
/**
 * Vue qui va permettre à l'utilisateur de choisir le terrain pour le défi
 * qu'il est en train de construire 
 */
class Choix_Terrain_Defis extends React.Component {

    constructor(props) {
        super(props)
        //this.latitude = this.props.navigation.getParam('latitude', ' ')
        //this.longitude = this.props.navigation.getParam('longitude', ' ')
        this.type = this.props.navigation.getParam('type', ' ')
        this.heure = this.props.navigation.getParam('heure', ' ')
        this.jour = this.props.navigation.getParam('jour', ' ')
        this.format = this.props.navigation.getParam('format', ' ')
        


        this.state = {
            terrainChoisi : ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        if(navigation.getParam('type', ' ') == Type_Defs.defis_2_equipes){
            return {
                title: 'Proposer un défi'
            }
        } else {
            return {
                title: 'Proposer une partie'
            }
        }
    }


    goToNextScreenPrix() {
        var navOps = {
            format : this.format,
            type : this.type,
            jour : this.jour,
            heure : this.heure,
            duree : this.props.navigation.getParam('duree', ''),
            terrain : this.props.terrainSelectionne,
            nomsTerrains : this.props.nomsTerrainSelectionne
        }
        if (this.type == Type_Defs.partie_entre_joueurs) {
            navOps = {...navOps, creationPartie: true};
        }
        this.props.navigation.push("Choix_Prix", navOps)
    }


    goToNextScreen() {
        console.log("eeeeeeeeeeeeeeeeee",  this.props.nomsTerrainSelectionne)
        console.log("THIS TYPE" ,this.type)
        if(this.type == Type_Defs.defis_2_equipes) { 
            
            
            console.log('------' +  this.props.navigation.getParam('duree', '')+ '---------')
            this.props.navigation.push("ChoixEquipeDefis",
            {
                format : this.format,
                type : this.type,
                jour : this.jour,
                heure : this.heure,
                duree : this.props.navigation.getParam('duree', ''),
                terrain : this.props.terrainSelectionne,
                nomsTerrains : this.props.nomsTerrainSelectionne,
                prix: null
            })
        } else if(this.type == Type_Defs.partie_entre_joueurs) {

            
            this.props.navigation.push("ChoixJoueursPartie",
            {
                format : this.format,
                type : this.type,
                jour : this.jour,
                heure : this.heure,
                duree : this.props.navigation.getParam('duree', ''),
                terrain : this.props.terrainSelectionne,
                nomsTerrains : this.props.nomsTerrainSelectionne,
                creationPartie: true,
                prix: null

            })
        }
    }

    /**
     * Fonction qui permet de trouver un terrain à partir de son id
     */
    findTerrainsfromId(id){
        for(var i =0; i <Terrains.length; i++) {
            if(Terrains[i].id == id) return Terrains[i]
        }
    }


    terrainChoose = (idTerrain)  => {
		this.setState({
			terrainChoisi : idTerrain
		})
    }

    
    buttonNext(){


            if(this.props.terrainSelectionne != undefined) {
                return(
                    <TouchableOpacity
                        onPress ={() =>  {
                            var terrain = this.findTerrainsfromId(this.props.terrainSelectionne);
                            if(terrain.Payant) {
                                var txtBoutton = "Confirmer"
                                var msg = 'Le terrain sélectionné est un terrain payant. Tu confirmes avoir réservé le terrain en ton nom ?'
                            
                                Alert.alert(
                                '',
                                msg,
                                [
                                    {text: txtBoutton, onPress: () => this.goToNextScreenPrix()},
                                    {
                                        text: 'Annuler',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                ]
                                )
                            } else{
                                var txtBoutton = "Continuer"
                                var msg = 'Le terrain sélectionné est un terrain public gratuit en accès libre.'
                            
                                Alert.alert(
                                '',
                                msg,
                                [
                                    {text: txtBoutton, onPress: () => this.goToNextScreen()},
                                    {
                                        text: 'Annuler',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                ]
                                )
                            }
                        }
                                
                        }>
                        <Text style = {styles.txtBoutton}>Suivant</Text>
                    </TouchableOpacity>
                )
            }
            return (
                <Text>Suivant</Text>
            )
        
    }

    render() {
        return (
            <View style = {{flex: 1}}>

                 {/* Bandeau superieur */}
                 <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        onPress ={() => Alert.alert(
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

                    <Text> Où </Text>
                    
                    {this.buttonNext()}
                </View>

                <Text style = {{marginTop : hp('0.7%'), fontSize : RF(2.6), marginBottom : hp('0.7%')}}>Sur quel terrain souhaites-tu jouer ?</Text>
                <TabChoisirTerrainDefis
                    latitude = {this.latitude}
                    longitude = {this.longitude}/>
            </View>
        )
    }
}
const styles = {

    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    }
    
}
const mapStateToProps = (state) => {
    console.log("zzzzzzzzzzzzzz", state.nomsTerrainSelectionne)
    return{ 
        terrainSelectionne : state.terrainSelectionne,
        nomsTerrainSelectionne : state.nomsTerrainSelectionne

    } 
}

export default connect(mapStateToProps) (Choix_Terrain_Defis)

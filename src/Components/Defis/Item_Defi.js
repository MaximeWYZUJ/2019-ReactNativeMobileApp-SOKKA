import React from 'react';
import {StyleSheet, View,Dimensions,TouchableOpacity,Text,Image, FlatList} from 'react-native';
import Colors from '../Colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import StarRating from 'react-native-star-rating'
import Terrains from '../../Helpers/Toulouse.json'
import LocalUser from '../../Data/LocalUser.json'
import Distance from '../../Helpers/Distance'
import { withNavigation } from 'react-navigation'


const DAY = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']


/**
 * Composant qui permet d'afficher un item représentant les défis.
 */
class Item_Defi extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            equipe1 : undefined,
            equipe2 : undefined,
            terrain : undefined,
        }
    }

    componentDidMount() {
        this.getEquipesFromDB()
        this.findTerrain();
    }

    
    async findTerrain() {
        var t = null;
        for(var i  = 0 ; i < Terrains.length ; i ++) {
            if(Terrains[i].id == this.props.terrain) {
                t = Terrains[i]
            } 
        }

        if (t!=null) {
            var d = Distance.calculDistance(LocalUser.geolocalisation.latitude, LocalUser.geolocalisation.longitude, t.Latitude, t.Longitude)+"";
            var dTxt = d.split(".")[0]+","+d.split(".")[1][0];
            t.distance = dTxt;
            this.setState({terrain: t})
        }
    }

    async getEquipesFromDB() {
        
        var db = Database.initialisation()

        var equipeRef = db.collection('Equipes').doc(this.props.equipeOrganisatrice);
        equipeRef.get().then(async(doc) => {
            if(doc.exists) {
                var equipe = doc.data()
                this.setState({equipe1 : equipe})                    
            } else {
                console.log("No such document!, itemDefi ", this.props.equipeOrganisatrice);
            }  
        })
        var equipeRef2 = db.collection('Equipes').doc(this.props.equipeDefiee);

        equipeRef2.get().then(async(doc) => {
            if(doc.exists) {
                var equipe = doc.data()
                this.setState({equipe2 : equipe})                    
            } else {
                console.log("No such document!, itemDefi ", this.props.equipeDefiee);
            }  
        })
    }
    

    
    
    
    
    
    
    

    buildDate() {
        var date = this.props.jour
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        var heure = date.getHours()

        var minute = (date.getMinutes()).toString()
        if(minute.length == 1) {
            minute = '0' + minute 
        }
        var heureFin = this.calculHeureFin(heure,minute,this.props.duree)

        return DAY[j] + ' ' + numJour  + '/' + mois + '/' + an + ' - ' +  heure + 'h' +minute + ' à ' + heureFin
    }

    
    goToRejoindreDefi()  {
        this.props.navigation.push("FicheDefiRejoindre", 
            {
                defi : this.props.allDataDefi,
                equipeOrganisatrice : this.state.equipe1,
                equipeDefiee : this.state.equipe2
            })
    }
    

    calculHeureFin(heure,minutes, duree){
    

        var heure = parseInt(heure) + Math.trunc(duree)

        var minutes =    parseInt(minutes) +  (this.props.duree -Math.trunc(duree)) * 60
        if(minutes >= 60) {
            heure ++
            minutes -= 60
        }
        if(minutes.toString().length == 1) {
            minutes = '0'+ minutes.toString()
        }
        return heure + 'h' + minutes
    }


    /**
     * Permet d'afficher la permière équipe 
     */
    renderEquipe1(equipe) {
        if(equipe != undefined) {
            return(
                <View style = {{flexDirection : "row"}}>
                    <Image
                        source = {{uri :equipe.photo}}
                        style = {{width : wp('13%'), height : wp('13%')}}/>
                
                    {/* Nom et notation de l'équipe*/}
                    <View style = {{marginLeft : wp('2%')}}>
                        <Text>{equipe.nom}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={equipe.score}
                            containerStyle = {styles.starContainer}
                            starSize={hp('1.5%')}
                            fullStarColor='#F8CE08'
                            emptyStarColor='#B1ACAC'
                        />
                    </View>
                </View>
            )
        }     
    }


    _renderTxtMillieu(){
        if(new Date(this.props.allDataDefi.jour.seconds * 1000) < new Date) {
            if(this.props.allDataDefi.scoreConfirme) {
                return(
                    <Text style = {styles.txtBut}>{this.props.allDataDefi.butsEquipeOrganisatrice} - {this.props.allDataDefi.butsEquipeDefiee}</Text>
                )
            } else if(this.props.allDataDefi.scoreRenseigne) {
                return(
                    <Text style = {styles.txtButNonConfirme}>{this.props.allDataDefi.butsEquipeOrganisatrice} - {this.props.allDataDefi.butsEquipeDefiee}</Text>
                )
            
            }
                
        } else  {
            if(this.props.allDataDefi.equipeDefiee != undefined) {
                
                return(
                    <Image
                        source = {require('../../../res/vs.png')}
                        style = {styles.vs}
                        />
                )
            }
        }
    }

    /**
     * Permet d'afficher la seconde équipe 
     */
    renderEquipe2(equipe) {
        if(equipe != undefined) {
            return(
                <View style = {{flexDirection : "row"}}>
                               
                    {/* Nom et notation de l'équipe*/}
                    <View style = {{marginRight : wp('2%')}}>
                        <Text>{equipe.nom}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={equipe.score}
                            containerStyle = {styles.starContainer}
                            starSize={hp('1.5%')}
                            fullStarColor='#F8CE08'
                            emptyStarColor='#B1ACAC'
                        />

                    </View>

                    <Image
                        source = {{uri :equipe.photo}}
                        style = {{width : wp('13%'), height : wp('13%')}}/>
                </View>

            )
        } else {
            return (
                <View>
                    <Text>Recherche</Text>
                    <Text>une équipe</Text>
                </View>
            )  
        }
        
    }


    renderTerrain() {
        if (this.state.terrain != undefined) {
            var terrain = this.state.terrain;
            return (
                <View  style = {{width : wp('63%')}}>
                    <Text style = {styles.nomTerrains}>{terrain.InsNom}</Text>
                    <Text style = {styles.nomTerrains}>{terrain.N_Voie == " " ? "" : terrain.N_Voie+" "}{terrain.Voie == "0" ? "adresse inconnue" : terrain.Voie}</Text>
                    <Text style = {styles.nomTerrains}>{terrain.Ville} - {terrain.distance} km</Text>
                </View>
            )
        }
    }

    
    render() {
        var color = '#FFFFFF' 
        if(this.props.jour < new Date())  color = "#E1E1E1"

        var txt = 'Defi ' + this.props.format + ' - ' + this.buildDate()
        return(
            <TouchableOpacity 
                style = {[styles.mainContainer, {backgroundColor : color}]}
                    onPress = {()=> this.goToRejoindreDefi()}>

                <Text>{txt}</Text>

                {/* View contenant les équipes */}
                <View style = {{flexDirection : 'row', justifyContent: 'space-between', marginTop : hp('2%')}}>
                    {this.renderEquipe1(this.state.equipe1)}
                    {this._renderTxtMillieu()}
                    {this.renderEquipe2(this.state.equipe2)}
                </View>

                 {/* View contenant le terrain*/}
                 <View style = {styles.containerTerrain}>
                    <Image
                        source = {require('../../../res/terrain1.jpg')}
                        style = {{width : wp('13%'), height : wp('13%'), marginRight : wp('2%')}}/>
                    {this.renderTerrain()}
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    mainContainer : {
        marginLeft : wp('4%'),
        marginRight : wp('4%'),
        paddingLeft : wp('2%'),
        paddingRight : wp('2%'),
        paddingTop : hp('2%'),
        paddingBottom : hp('1%'),
        backgroundColor : 'white',
        borderRadius : 10, 
        marginTop : hp('1%'),
        marginBottom : hp('1%')
    },

    containerTerrain: {
        flexDirection : "row" , 
        marginTop : hp('1%'),
        width: 'auto', 
        justifyContent:'center', 
        alignItems: 'center'
    },

    nomTerrains  : {
        fontStyle : 'italic',
        fontSize : RF(2)
    },

    starContainer : {
        width : wp('3.1%')
    },

    txtBut : {
        fontSize : RF(2.6),
        fontWeight : "bold",
        alignSelf :"center"
    },

    txtButNonConfirme : {
        fontSize : RF(2.6),
        fontStyle : "italic",
        alignSelf :"center"
    },

    vs : {
        height : wp('7%'),
        width : wp('8.12%'),
        alignSelf : "center"
    },

}

export default withNavigation(Item_Defi)
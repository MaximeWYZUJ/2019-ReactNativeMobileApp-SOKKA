import React from 'react';
import {StyleSheet, View,Dimensions,TouchableOpacity,Text,Image, FlatList} from 'react-native';
import Colors from '../Colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Terrains from '../../Helpers/Toulouse.json'
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import Distance from '../../Helpers/Distance'
import { withNavigation } from 'react-navigation'
import { database } from 'firebase';
import DatesHelpers from '../../Helpers/DatesHelpers'

const DAY = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

/**
 * Composant qui permet d'afficher un item représentant les parties.
 */
class Item_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            moreThan3Joueurs : false,
            joueurs : [{"id" : 'e', "photo" : 'r'}],
            terrain: undefined
        }
    }

    
    componentDidMount() {
        this.findTerrain();

        var joueursArray = []
        var db = Database.initialisation()
        var nb = Math.min(3, this.props.joueurs.length)
        // Boucler sur les equipes pour récuperer les données. 
        for(var i = 0 ; i < nb; i++) {
            var joueurRef = db.collection('Joueurs').doc(this.props.joueurs[i]);
            joueurRef.get().then(async(doc) => {
                if(doc.exists) {
                    var joueur = doc.data()
                    joueursArray.push(joueur)

                } else {
                    console.log("No such document! kk ");
                }
                this.setState({joueurs : joueursArray})
                this.forceUpdate()
            })
        }
 
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


    goToRejoindrePartie()  {
        this.props.navigation.push("FichePartieRejoindre",
            {
                id : this.props.id,
                jour : this.buildDate(),
                duree : this.props.duree,
                terrain : this.state.terrain,
                nbJoueursRecherche : this.props.nbJoueursRecherche,
                message_chauffe : this.props.message_chauffe,
                joueurs  : this.props.joueurs,
                joueursWithData : this.state.joueurs     // Les 3 premiers joueurs du défi (on a deja leur données donc pas besoin de les rechercher)
            })
    }
    

    _renderItem = ({item}) => {
        var color = "white"
        if(this.props.partieData != undefined) {
            if (this.props.partieData.confirme != undefined) {
                if(this.props.partieData.confirme.includes(item.id)) {
                    color = "green"
                }
            } else if (this.props.partieData.attente != undefined) {
                if (this.props.partieData.attente.includes(item.id)) {
                    color = "C0C0C0"
                }
            }
        }
        return(
            <Image
                source = {{uri : item.photo}}
                style = {[styles.photoJoueur, {borderWidth : 3, borderColor : color}]}
            />
        )
    }



    /**
     * Fonction qui permet d'afficher le nbr de joueurs recherchés
     */
    renderTextNBJoueurRecherches() {
        if(this.props.nbJoueursRecherche == 0) {
            return (
                <Text>Complet</Text>
            )
        } else if(this.props.nbJoueursRecherche == 1) {
            return(
                <View>
                    <Text>1 joueur</Text>
                    <Text>Recherché</Text>
                </View>
            )
        } else {
            return(
                <View>
                    <Text> {this.props.nbJoueursRecherche} joueurs</Text>
                    <Text>Recherchés</Text>
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

        var date = new Date(this.props.partieData.jour.seconds * 1000)

    
        if(DatesHelpers.isMatchEnded(date, this.props.duree))  { 
            color = "#E1E1E1"

        }
        if(this.props.partieData.dateString == undefined) {
            var date = this.buildDate()
        } else {
            var date = this.props.dateString
        }
        var txt = 'Partie ' + this.props.format + ' - ' + date

         return (
            <TouchableOpacity 
                style = { [styles.mainContainer, {backgroundColor : color}]}
                onPress = {()=> this.goToRejoindrePartie()}>
                

                <Text>{txt}</Text>
                <View style = {{flexDirection : "row", marginTop : hp('1%')}}>
                    <FlatList
                        horizontal={true}
                        data = {this.state.joueurs}
                        keyExtractor={(item) => item.id}
                        renderItem = {this._renderItem}
                        //numColumns={4}
                        extraData = {this.state}
                    />
                    <Text style = {{fontSize : RF(3), fontWeight : "bold", marginTop : hp('2%'), marginRight : wp('3%')}}>...</Text>
                    <View style = {{marginRight : wp('4%'), justifyContent : "center"}}>
                       {this.renderTextNBJoueurRecherches()}

                    </View>
                </View>

                {/* View contenant le terrain*/}
                <View style = {{flexDirection : "row" , marginTop : hp('1%'),width: 'auto', justifyContent:'center', 
                    alignItems: 'center'}}>
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
        borderRadius : 10, 
        marginTop : hp('1%'),
        marginBottom : hp('2%')
    },

    photoJoueur : {
        width : wp('14%'), 
        height : wp('14%'), 
        borderRadius : wp('7%'), 
        marginRight : wp('2%'), 
        marginTop : hp('1%'), 
        marginLeft : wp('1%')
    },

    nomTerrains  : {
        fontStyle : 'italic',
        fontSize : RF(2)
    }


}

export default withNavigation(Item_Partie)
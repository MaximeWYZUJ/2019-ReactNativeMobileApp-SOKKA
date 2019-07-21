import React from 'react';
import {StyleSheet, View,Dimensions,TouchableOpacity,Text,Image, FlatList} from 'react-native';
import Colors from '../Colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Terrains from '../../Helpers/Toulouse.json'
import Database from '../../Data/Database'
import { withNavigation } from 'react-navigation'


const DAY = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

/**
 * Composant qui permet d'afficher un item représentant les parties.
 */
class Item_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            moreThan3Joueurs : false,
            joueurs : [{"id" : 'e', "photo" : 'r'}]
        }

        


       // this.joueurs = this.buildListofPlayer(this.getJoueursFromDB())
    }

    
    componentDidMount() {
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
            minute = '0' + mois 
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


    /**
     * Fonction qui permet de rajouter un item undefined à la fin de la liste de 3 
     * joueurs si il y'a plus de 3 joueurs inscris sur la partie. Ca permettra d'afficher
     * les "..."
     * @param {*} liste 
     */
    buildListofPlayer(liste) {
      
            return liste
        
    }


    async getJoueursFromDB() {
       

        let joueursArray = await Database.getArrayDocumentData(this.props.joueurs, "Joueurs")
        
          
        


    }
        

    findTerrain() {
        for(var i  = 0 ; i < Terrains.length ; i ++) {
            if(Terrains[i].id == this.props.terrain) {
                return Terrains[i]
            } 
        }
    }

    goToRejoindrePartie()  {
        this.props.navigation.push("FichePartieRejoindre",
            {
                id : this.props.id,
                jour : this.buildDate(),
                duree : this.props.duree,
                terrain : this.findTerrain(),
                nbJoueursRecherche : this.props.nbJoueursRecherche,
                message_chauffe : this.props.message_chauffe,
                joueurs  : this.props.joueurs,
                joueursWithData : this.state.joueurs     // Les 3 premiers joueurs du défi (on a deja leur données donc pas besoin de les rechercher)
            })
    }
    

    renderDistance() {
        if(this.props.latitudeUser != undefined && this.props.longitudeUser != undefined) {
            return(
                <Text> - okokok</Text>
            )
        } 
    }

    _renderItem = ({item}) => {
            return(
                <Image
                    source = {{uri : item.photo}}
                    style = {styles.photoJoueur}
                />
            )
            
        
    }


    displayPseudo() {
        for(var i =0 ; i <this.state.joueurs.length; i++) {
        }
    }

    renderText = ({item}) => {
        <Text>{item}</Text>
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

    
    render() {
        var color = '#FFFFFF' 
        if(this.props.jour < new Date())  color = "#E1E1E1"

        var txt = 'Partie ' + this.props.format + ' - ' + this.buildDate()
        var terrain  = this.findTerrain(this.props.terrain)

         return (
            <TouchableOpacity 
                style = { [styles.mainContainer, {backgroundColor : color}]}
                onPress = {()=> this.goToRejoindrePartie()}>
                

                <Text>{txt}</Text>
                <View style = {{flexDirection : "row", marginTop : hp('1%')}}>
                    <FlatList
                        data = {this.state.joueurs}
                        keyExtractor={(item) => item.id}
                        renderItem = {this._renderItem}
                        numColumns={4}
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
                    <View style = {{width : wp('63%')}}>
                        <Text style = {styles.nomTerrains}>{terrain.InsNom}  {this.renderDistance()}</Text>
                    </View>
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
import React from 'react'

import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity,FlatList,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../../Components/Colors'
import Information_Recapitulatif from '../Information_Recapitulatif'
import ID from '../../../../Helpers/ID'
import Database from '../../../../Data/Database'
import { ScrollView } from 'react-native-gesture-handler';

export default class Recapitulatif_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.jour = this.props.navigation.getParam('jour', ' '),
        this.duree = this.props.navigation.getParam('duree', ' '),
        this.heure = this.props.navigation.getParam('heure', ' '),
        this.ville = "Toulouse"
        this.userData = {
            pseudo : "Flongb",
            id : 'aPyjfKVxEU4OF3GtWgQrYksLToxW2',
            photo : 'https://firebasestorage.googleapis.com/v0/b/agoora-ccf6c.appspot.com/o/Photos_profil_Joueurs%2Ftest%2Fflongb.jpg?alt=media&token=eb04bd3f-1fc8-44c8-9cfd-76598fdc58c5'
        }

        this.nomsTerrain =  this.props.navigation.getParam('nomsTerrains', ' '),
        this.format = this.props.navigation.getParam('format', ' '),
        this.joueurs =  this.props.navigation.getParam('joueurs', ''),
        this.nbJoueursRecherche = this.props.navigation.getParam('nbrJoueurs', ''),
        this.messageChauffe =this.props.navigation.getParam('messageChauffe', ''),

        this.joueurAnimation = new Animated.ValueXY({ x: -wp('100%'), y:0 })
        this.goToFichePartie = this.goToFichePartie.bind(this)

    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Proposer une partie'
        }
    }


    
    componentDidMount() {
        this.timeoutHandle = setTimeout(()=>{
            this.setState({
                 timePassed : true
            })
           this._moveJoueur()
 
         }, 1000);
    }

    /**
     * Fonction qui va permettre de construire une liste d'id des joueurs
     * @param {{id : String photo : String}} liste 
     */
    buildListOfJoueur(liste) {
        console.log("===================")
        var j = []
        for(var i = 0 ; i <liste.length ; i++) {
            if(! j.includes(liste[i].id)){
                j.push(liste[i].id)
                console.log(liste[i].id)
            }
           
        }
        console.log("========================")
        return j

    }

    /**
     * Fonction qui va permettre de construire une liste d'id des joueurs 
     * sans l'utilisateur
     * @param {{id : String photo : String}} liste 
     */
    buildListOfJoueurWithoutUser(liste) {
        var j = []
        for(var i = 0 ; i <liste.length ; i++) {
            if((! j.includes(liste[i].id)) && liste[i].id != this.userData.id) {
                j.push(liste[i].id)
                console.log(liste[i].id)
            }
           
        }
        return j

    }


    goToFichePartie(id) {
        Alert.alert(
            'Ta partie a bien été crée et publiée',
            "Les joueurs peuvent s'inscrire",
            [
              {text: 'Ok',  onPress: () => {
               
                this.props.navigation.push("FichePartieRejoindre",
                {
                    download_All_Data_Partie : true,
                    id : id
                })
            }
                        
              },
             
            ],
            {cancelable: false},
        ); 
        
    }
    
    

    

    savePartieInDB () {
        console.log("in save partie")
        var id = ID.buildId()
        var db = Database.initialisation();

        var jour = this.jour.split('-')[0]
        var moi = this.jour.split('-')[1]
        var an = this.jour.split('-')[2]
        var heure = this.heure.split(':')[0]
        var minutes = this.heure.split(':')[1]
        var d = an + '-' + moi + '-' + jour + 'T' + heure + ':' + minutes
        console.log(d)
        var date = new Date(d)
        console.log("DATE PARSE == ", Date.parse(date))
        recherche = this.nbJoueursRecherche > 0
        db.collection("Defis").doc(id.toString()).set({
            id : id,
            type : this.props.navigation.getParam('type', ' '),
            jour : date,
            duree : this.duree,
            format : this.format,
            organisateur : this.userData.id,
            ville : this.ville,
            participants : this.buildListOfJoueur(this.joueurs),
            message_chauffe : this.messageChauffe,
            terrain : this.props.navigation.getParam('terrain', ''),
            nbJoueursRecherche : this.nbJoueursRecherche,
            commentaires : [],
            prix_par_joueurs : 0,
            attente : this.buildListOfJoueurWithoutUser(this.joueurs),
            confirme : [this.userData.id],
            indisponibles  : [],
            dateParse : Date.parse(date),
            recherche : recherche,
            inscris : [],
            buteurs : [],
            votes : [],
            absents : []
        })
        .then(this.goToFichePartie(id))
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

    }


     /**
     * Fonction qui permet de déplacer le texte Agoora vers le haut
     */
    _moveJoueur= () => {
        Animated.spring(this.joueurAnimation, {
          toValue: {x: 0, y: 0},
        }).start()

    }

   


    _renderItem = ({item}) => {
       
        var color = "#C0C0C0"
        if(item.id == this.userData.id) {
            color = "#13C840"
        }
        return(
            <Animated.View style = {this.joueurAnimation.getLayout()}>
                <Image
                    source = {{uri : item.photo}}
                    style = {{width : wp('15%'), height : wp('15%'), borderRadius : wp('7%'), marginRight : wp('2%'), marginTop : hp('1%'), marginLeft : wp('1%'), borderWidth : 3, borderColor : color}}/>
            </Animated.View>
          
        )
    

    }

    render() {

        if(this.nbJoueursRecherche >1) {
            recheche = "recherchés"
        } else {
            recheche = 'recherché'
        }
         
        return(
            <ScrollView>
                <View style = {{}}>

                    {/* Bandeau superieur */}
                    <View style = {{backgroundColor : Colors.grayItem, flexDirection : 'row', justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%'), marginBottom : hp('2%')}}>
                        <TouchableOpacity
                            onPress ={() => this.props.navigation.push("AccueilJouer")}>
                            <Text style = {styles.txtBoutton} >Annuler</Text>
                        </TouchableOpacity>

                        <Text> Récapitulatif </Text>

                        <TouchableOpacity
                            onPress ={() =>{this.savePartieInDB()}}>
                            <Text style = {styles.txtBoutton}>Valider</Text>
                        </TouchableOpacity>			    
                    </View>

                    <View style  = {{marginTop : hp('2%')}}>
                        <Information_Recapitulatif
                            format = {this.format}
                            heure = {this.heure}
                            jour = {this.jour}
                            duree = {this.duree}
                            nomsTerrain = {this.nomsTerrain}
                            pseudo = {this.userData.pseudo}
                        />
                    </View>
                    {/* View contenant les deux équipes */}
                    <View style = {styles.containerEquipes}>
                        <Text>{this.joueurs.length} joueurs </Text>
                        <FlatList
                            data = {this.joueurs}
                            keyExtractor={(item) => item.id}
                            renderItem = {this._renderItem}
                            numColumns={5}
                        />

                        <Text style = {{alignSelf : "center", marginTop : hp('3%'), fontSize : RF(2.5)}}> {this.nbJoueursRecherche} joueurs {recheche}</Text>
                    </View>

                    {/* Message de chauffe*/}
                    <Text style = {styles.txt_message_chauffe}>{this.messageChauffe}</Text>
                </View>
            </ScrollView>
            
        )
    }
}
const styles  = {
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },

    containerEquipes : {
        borderWidth : 1,
        borderRadius : 5,
        marginTop : wp('5%'), 
        marginLeft : wp('3%'),
        marginRight : wp('3%'), 
        paddingTop : hp('2%'), 
        paddingBottom : hp('2%'),
        paddingLeft : wp('3%')
    },

    txt_message_chauffe : {
        fontSize : RF(2.6),
        fontStyle : 'italic',
        marginTop : hp('5%'),
        marginLeft : wp('3%'),
        marginRight : wp('3%')
    }
}
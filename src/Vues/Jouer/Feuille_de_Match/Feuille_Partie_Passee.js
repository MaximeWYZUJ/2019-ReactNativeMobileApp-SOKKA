import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Animated} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Database from '../../../Data/Database'
import TabFeuillePasse from './TabFeuillePasse'
import { connect } from 'react-redux'
import Simple_Loading from './../../../Components/Loading/Simple_Loading'
import LocalUser from '../../../Data/LocalUser.json'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'


/**
 * Classe qui permet d'afficher la feuille de match d'une partie déja jouée.
 */
class Feuille_Partie_Passee extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id
        this.state = {
            partie : this.props.navigation.getParam('partie', undefined),
            joueurs : this.props.navigation.getParam('joueurs', []),
            isLoading : false
        }
        this.joueurAnimation = new Animated.ValueXY({ x: -wp('100%'), y:0 })
        this.goToFichePartie = this.goToFichePartie.bind(this)
    }


    componentDidMount(){
        // this.rechecherJoueurManquant()
        this._moveJoueur()
    }



    /**
     * Fonction qui permet de revenir sur la fiche de la partie en interdissant
     * le retour en arrière
     */
    goToFichePartie() {
            
               
        this.props.navigation.push("FichePartieRejoindre",
            {
                download_All_Data_Partie : true,
                id : this.state.partie.id,
                retour_arriere_interdit : true
            }
        )  
    }


    /**
     * Fonction qui renvoie les données de l'organisateur de la partie
     */
    findOrganisateur() {
        for(var i =0; i <this.state.joueurs.length; i++) {
            if(this.state.joueurs[i].id == this.state.partie.organisateur) {
                return this.state.joueurs[i]
            }
        }
    }

 


    /**
     * Fonction qui permet de déplacer les joueurs
     */
    _moveJoueur= () => {
        Animated.spring(this.joueurAnimation, {
          toValue: {x: 0, y: 0},
        }).start()

    }

    /**
     * Fonction qui permet de renvoyer la liste de tous les joueurs ayant confirmés
     */
    buildListOfJoueursConfirme() {
        var liste = []
        console.log(this.state.partie.confirme)
        for(var i =0; i < this.state.joueurs.length; i++) {
            if(this.state.partie.confirme.includes(this.state.joueurs[i].id)){
                console.log(this.state.joueurs[i].id)
                liste.push(this.state.joueurs[i])
            }
        }
        return liste
    }

    
     // ===========================================================================
    // ========================== NOTIFICATIONS ==================================
    // ===========================================================================
    
    
    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    async sendPushNotification(token , title,body ) {
        return fetch('https://exp.host/--/api/v2/push/send', {
          body: JSON.stringify({
            to: token,
            title: title,
            body: body,
            data: { message: `${title} - ${body}` },
           
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }).catch(function(error) {
            console.log("ERROR :", error)
        }).then(function(error) {
            console.log("THEN", error)
        });
    }

    


    /**
     * Fonction qui envoie une notification aux joueurs ayant confirmé une fois 
     * que la feuille de match a été remplie par l'organisateur
     */
    async sendNotifFeuilleRemplie() {
        console.log("in send notif feuille remplie cap")
        var organisateur = this.findOrganisateur()
        console.log(organisateur.pseudo)
        var titre = "Nouvelle notif"
        var corps = organisateur.pseudo + " a renseigné la feuille de match de partie"
        var joueurs = this.buildListOfJoueursConfirme()
        console.log("before 1ier for")
        for(var i =0; i < joueurs.length; i++ ) {
            console.log("in for", i)
            if(joueurs[i].id != organisateur.id) {
                var tokens = []
                var joueur = joueurs[i]
                if(joueur.tokens != undefined) tokens = joueur.tokens
                console.log("BEFORE 2iemFOR")
                for(var k =0; k < tokens.length ; k++) {
                    console.log(tokens[k])
                    await this.sendPushNotification(tokens[k], titre, corps)
                    await this.storeNotifFeuilleCompletee(joueur)
                } 
            }
        }
        
    }

    /**
     * Fonction qui va sauvegarder dans la base de donnée la notification indiquant que
     * l'organisateur a renseigné la feuille de match.
     */
    async storeNotifFeuilleCompletee(joueur) {
        console.log(this.state.equipeDefiee)
        console.log(this.state.equipeOrganisatrice)
        
        var db = Database.initialisation()
        db.collection("Notifs").add({
                time : new Date(),
                dateParse : Date.parse(new Date()),
                partie : this.state.partie.id,
                organisateur :  LocalUser.data.id,
                recepteur : joueur.id,
                type : Types_Notification.FEUILLE_COMPLETEE_PARTIE,
        })
        
    }

    //=============================================================================================

    /**
     * Fonction qui va permettre d'enregistrer les données dans la db, pas besoin de changer 
     * attente car vu le fait qu'un joueurs soit dans les confirmé suffit.
     */
    async enregistrerDonnees() {
        this.setState({isLoading : true})
        var db = Database.initialisation()

        await this.sendNotifFeuilleRemplie()
        var defisRef = db.collection("Defis").doc(this.state.partie.id);

     
        defisRef.update({
           votes : this.props.votes,
           buteurs : this.props.buteurs,
           confirme : this.props.joueursPresents 
        })
        .then(this.goToFichePartie)
        
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }


    _renderItem = ({item}) => {

        var color  = "white"
        if(this.state.partie.confirme.includes(item.id)) {
            color = "#13C840"
       
        
            return(
                <Animated.View style = {this.joueurAnimation.getLayout()}>
                    <Image
                        source = {{uri : item.photo}}
                        style = {{width : wp('15%'), height : wp('15%'), borderRadius : wp('7%'), marginRight : wp('2%'), marginTop : hp('1%'), marginLeft : wp('1%')}}/>
                </Animated.View>
              
            )
        }        
    }

    



    render() {
        if(!this.state.isLoading) {
            return(
                <View style = {{flex :1}}>
                    {/* Bandeau superieur */}
                    <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                        <TouchableOpacity
                            >
                            <Text style = {styles.txtBoutton} >Annuler</Text>
                        </TouchableOpacity>

                        <Text> Feuille de match </Text>
                        
                        <TouchableOpacity
                            onPress= {() => this.enregistrerDonnees()}
                            >
                            <Text style = {styles.txtBoutton}>Enregister</Text>
                        </TouchableOpacity>
                    </View>

                    {/* View contenant la liste des joueurs ayant confirmés */}
                    <View style  = {styles.containerJoueur}>
                        
                        {/* Liste des joueurs */}
                        <FlatList
                            data = {this.buildListOfJoueursConfirme()}
                            renderItem = {this._renderItem}
                            numColumns={5}
                            keyExtractor={(item) => item.id}
                                
                        />
                    </View>

                    <Text>Statistiques joueurs</Text>

                    <TabFeuillePasse/>
                </View>
            )
        } else {
            return(
                <View>
                    <Simple_Loading
                        taille = {hp('3%')}
                        />
                </View>
            )
        }
    }
}
const styles = {
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },
    texte : {
        fontSize : RF('2.6'),
        alignSelf : "center"
    },

    containerJoueur : {
        borderWidth : 1,
        marginLeft  : wp('2%'),
        marginRight : wp('2%')
    }
}

const mapStateToProps = (state) => {
    return{ 
        buteurs : state.buteurs,
        votes : state.votes,
        joueursPresents : state.joueursPresents

    } 
}
export default connect(mapStateToProps) (Feuille_Partie_Passee)
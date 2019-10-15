

import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import Type_Defis from '../../../Vues/Jouer/Type_Defis';
import Types_Notification from '../../../Helpers/Notifications/Types_Notification';
import DatesHelpers from '../../../Helpers/DatesHelpers'

/**
 * Classe qui permet d'afficher la notification correspondant à un joueur confirmant
 * ou non sa présence à un défi dont je suis capitaine
 */
class Notif_Presence_Partie extends React.Component {
    
    constructor(props) {

        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            emetteur : undefined,
            equipe : undefined,
            defi : undefined
        }
    }


    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {


        // Données de l'équipe concernée
        var organisateur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")


        // Données de la partie 
        var partie = await Database.getDocumentData(this.props.notification.partie, "Defis")
        this.setState({ organisateur : organisateur, partie : partie,isLoading : false})
    }


    componentDidMount() {
        this.getData()
    }


     /**
     * Pour se rendre dans la fiche de la partie
     */
    goToFichePartie() {
        this.props.navigation.push("FichePartieRejoindre", 
            {
                id : this.state.partie.id,
                /*jour : this.buildDate(),
                duree : this.props.duree,
                terrain : this.findTerrain(),
                nbJoueursRecherche : this.state.partie.nbJoueursRecherche,
                message_chauffe : this.props.message_chauffe,
                joueurs  : this.props.joueurs,
                joueursWithData : this.state.joueurs     // Les 3 premiers joueurs du défi (on a deja leur données donc pas besoin de les rechercher)*/
            })
    }

    renderPhotoOrganisateur() {
        if(this.state.organisateur != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.organisateur.photo}} 
                        style = {{height : hp('8%'), width : hp('8%'), borderRadius : hp('4%'), marginRight : wp('3%'), marginLeft: wp('3%')}}   
                    />
                    </View>
                    
            )
        } else {
            return(
                <View
                    style = {{height : hp('8%'), width : hp('8%'), borderRadius : hp('4%'), backgroundColor : "gray", marginRight : wp('3%'),marginLeft : wp('3%'), justifyContent : 'center'}}   
                /> 
            )
        }
    }


    renderNomEmetteur() {
        if(this.state.organisateur != undefined) {
            return this.state.organisateur.pseudo
        } else {
            return "__"
        }
    }

    renderPresence() {
        if(this.props.notification.type == Types_Notification.CONFIRMER_PRESENCE_PARTIE) {
            return "a confirmé sa présence"
        } else {
            return "est indisponible"
        }
    }

    renderDatePartie() {
        if(this.state.partie != undefined) {
            return DatesHelpers.buildDate(new Date(this.state.partie.jour.seconds * 1000))

        } else {
            return '??'
        }
    }


    render() {
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('3%')}
                />
            )
        } else {
            return(
                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoOrganisateur()}
                    </View>
                    <View>
                        <Text> {this.renderNomEmetteur()} {this.renderPresence()} </Text>
                        <Text>pour une partie  le  {this.renderDatePartie()} </Text>

                        <TouchableOpacity
                            onPress = {() => this.goToFichePartie()}
                            >
                            <Text style = {styles.txtBtn}>Consulter</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            )
        }
    }
}

const styles = {
    txtBtn : {
        fontWeight : "bold"
    }
}

export default withNavigation(Notif_Presence_Partie)
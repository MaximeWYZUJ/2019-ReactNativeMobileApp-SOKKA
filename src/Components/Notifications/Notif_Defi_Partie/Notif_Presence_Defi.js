
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


/**
 * Classe qui permet d'afficher la notification correspondant à un joueur confirmant
 * ou non sa présence à un défi dont je suis capitaine
 */
class Notif_Presence_Defi extends React.Component {

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

    componentDidMount() {
        this.getData()
    }

    
    


     /**
     * Fonction qui va permettre de construire un String correspondant à la 
     * date du défi pour le titre de la vue.
     * @param {Date} date 
     */
    buildDate(date) {
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        return numJour  + '/' + mois + '/' + an
    }

    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {


        // Données de l'équipe concernée
        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")

        // Données de l'émeteur 
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données du défi 
        var defi = await Database.getDocumentData(this.props.notification.defi, "Defis")
        this.setState({equipe :equipe , emetteur : emetteur, defi : defi,isLoading : false})
    }



    /**
     * Pour se rendre dans la fiche du defi
     */
    async goToFicheDefi() {
        this.setState({isLoading : true})
        if(this.state.equipe.id == this.state.defi.equipeOrganisatrice) {
            var eq = undefined
            if(this.state.defi.equipeDefiee != undefined) {
                eq = await Database.getDocumentData(this.state.defi.equipeDefiee, "Equipes")
            }
            this.setState({isLoading : false})
            this.props.navigation.navigate("FicheDefiRejoindre",
                {
                    defi : this.state.defi,
                    equipeOrganisatrice : this.state.equipe,
                    equipeDefiee : eq
            } )
        } else {
            var eq = await Database.getDocumentData(this.state.defi.equipeOrganisatrice, "Equipes")
            this.setState({isLoading : false})

            this.props.navigation.navigate("FicheDefiRejoindre",
                {
                    defi : this.state.defi,
                    equipeOrganisatrice : eq,
                    equipeDefiee : this.state.equipe
            } )
        }
    }



    renderPhotoEmetteur() {
        if(this.state.emetteur != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.emetteur.photo}} 
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
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.pseudo
        } else {
            return "__"
        }
    }

    renderPresence() {
        if(this.state.defi.type = Types_Notification.CONFIRMER_PRESENCE_DEFI) {
            return "a confirmé sa présence"
        } else {
            return "est indisponible"
        }
    }

    renderDateDefi() {
        if(this.state.defi != undefined) {
            return this.buildDate(new Date(this.state.defi.jour.seconds * 1000))
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
                <View style = {{flexDirection : 'row', borderWidth : 1, marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEmetteur()}
                    </View>
                    <View>
                        <Text> {this.renderNomEmetteur()} {this.renderPresence()} </Text>
                        <Text>pour un défi le  {this.renderDateDefi()} </Text>

                        <TouchableOpacity
                            onPress = {() => this.goToFicheDefi()}
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

export default withNavigation (Notif_Presence_Defi)

import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'



/**
 * Notification indiquant que le capitaine de l'équipe de l'organisateur a complété la feuille
 * de match d'un défi
 */
class Notif_feuille_completee_Defi_adverse extends React.Component {

    constructor(props) {

        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            defi : undefined,
            equipeUser : undefined,
            autreEquipe : undefined
            
        }
    }


    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {


        // Données de la partie 
        var defi = await Database.getDocumentData(this.props.notification.defi, "Defis")

        if(defi.joueursEquipeOrga.includes(LocalUser.data.id)) {
            var equipeUser =  await Database.getDocumentData(this.props.notification.equipeOrganisatrice, "Equipes")
            var autreEquipe =  await Database.getDocumentData(this.props.notification.equipeDefiee, "Equipes")

        } else {
            var equipeUser =  await Database.getDocumentData(this.props.notification.equipeDefiee, "Equipes")
            var autreEquipe =  await Database.getDocumentData(this.props.notification.equipeOrganisatrice, "Equipes")

        }
        this.setState({ equipeUser : equipeUser, defi : defi,isLoading : false, autreEquipe : autreEquipe})
    }


    componentDidMount() {
        this.getData()
    }

    
    /**
     * Pour se rendre dans la fiche du defi
     */
    goToFicheDefi() {
       
        if(this.state.defi.joueursEquipeOrga.includes(LocalUser.data.id)) {
           var equipeOrganisatrice = this.state.equipeUser
           var equipeDefiee = this.state.autreEquipe 
        } else{
            var equipeOrganisatrice = this.state.autreEquipe
           var equipeDefiee = this.state.equipeUser 
        }
        
        this.props.navigation.navigate("FicheDefiRejoindre",
            {
                defi : this.state.defi,
                equipeOrganisatrice :equipeOrganisatrice,
                equipeDefiee : equipeDefiee
            } 
        )
        
    }


    renderPhotoEquipe() {
        if(this.state.autreEquipe != undefined) {
            return(
                <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                    <Image
                    source = {{uri : this.state.autreEquipe.photo}} 
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

    renderNomEquipe() {
        if(this.state.autreEquipe != undefined) {
            return this.state.autreEquipe.nom
        } else {
            return '___'
        }
    }

    renderNomMonEquipe() {
        if(this.state.equipeUser != undefined) {
            return this.state.equipeUser.nom
        } else {
            return '___'
        }
    }

    render() {
        if(! this.state.isLoading) {
            return(
                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEquipe()}
                    </View>
                    <View>
                        <Text>Le capitaine de l'équipe adverse {this.renderNomEquipe()} </Text>
                        <Text>a renseigné la feuille de match du défi contre ton équipe</Text>
                        <Text>{this.renderNomMonEquipe()}</Text>
                        <TouchableOpacity
                            onPress = {() => this.goToFicheDefi()}
                            >
                            <Text style = {styles.txtBtn}>Consulter</Text>
                        </TouchableOpacity>
                    </View>
                        
                </View>
            )
        } else {
            return(
                <Simple_Loading
                    taille = {hp('3%')}
                />
            )
        }
    }
}



const styles = {
    txtBtn : {
        fontWeight : "bold"
    }
}

export default withNavigation (Notif_feuille_completee_Defi_adverse)
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import DatesHelpers  from '../../../Helpers/DatesHelpers'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'
import firebase from 'firebase'
import '@firebase/firestore'

/**
 * Notifiction affichée si un des joueurs d'une équipe que l'utilisateur à crée refuse ou accepte d'intégrer
 * l'équipe.
 */
class Notif_Refu_Accepte_Equipe extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            emetteur : undefined,
            equipe : undefined,
        }
    }

    componentDidMount() {
        this.getData()
    }

    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {
        // Données de l'émeteur 
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")


        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")
        this.setState({emetteur : emetteur, equipe : equipe,isLoading : false})
    }

    goToProfileEquipe() {
        this.props.navigation.push("Profil_Equipe", {equipeId : this.state.equipe.id})
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

    renderNomEquipe() {
        if(this.state.equipe != undefined) {
            return this.state.equipe.nom
        } else {
            return "__"
        }
    }


    chooseTextToRender() {
        if(this.props.notification.type == Types_Notification.REFUSER_INVITATION_REJOINDRE_EQUIPE) {
            return(
                " a refusé "
            )
        } else {
            return(
                " a accepté "
            )
        }
    }

    render(){
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('3%')}
                />
            )
        } else {
            return(
                <View style = {{flexDirection : 'row',marginTop : hp('2.5%'), borderWidth : 0, alignContent:"center"}}>
                    <View>
                        {this.renderPhotoEmetteur()}
                    </View>
                    <View>
                        <Text>{this.renderNomEmetteur()} {this.chooseTextToRender()}</Text>
                        <Text>d'intégrer ton équipe {this.renderNomEquipe()}</Text>
                        
                        <TouchableOpacity
                            onPress = {() => this.goToProfileEquipe()}>
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



export default withNavigation(Notif_Refu_Accepte_Equipe)
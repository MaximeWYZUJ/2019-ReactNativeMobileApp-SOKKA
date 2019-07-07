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
class Notif_Rep_Demande_Integration_Equipe extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
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
        console.log('in get data')
        // Données de l'émeteur 

        console.log("after emetteur")

        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")
        console.log("after equipe")
        this.setState({equipe : equipe,isLoading : false})
    }

    goToProfileEquipe() {
        this.props.navigation.push("Profil_Equipe", {equipeId : this.state.equipe.id})
    }


    renderPhotoEquipe() {
        if(this.state.equipe != undefined) {
            return(
                <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.equipe.photo}} 
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
        if(this.state.equipe != undefined) {
            return this.state.equipe.nom
        } else {
            return "__"
        }
    }


    chooseTextToRender() {
        if(this.props.notification.type == Types_Notification.REFUSER_DEMANDE_INTEGRATION_EQUIPE) {
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
            console.log("IS LOADING")
            return(
                <Simple_Loading
                    taille = {hp('3%')}
                />
            )
        } else {
            console.log("ELSE RENDER")
            return(
                <View style = {{flexDirection : 'row',marginTop : hp('2.5%'), borderWidth : 0, alignContent:"center"}}>
                    <View>
                        {this.renderPhotoEquipe()}
                    </View>
                    <View>
                        <Text>{this.renderNomEquipe()} {this.chooseTextToRender()}</Text>
                        <Text>ton intégration dans l'équipe</Text>
                        
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



export default withNavigation(Notif_Rep_Demande_Integration_Equipe)
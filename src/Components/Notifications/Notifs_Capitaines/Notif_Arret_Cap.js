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

class Notif_Arret_Cap extends React.Component {

    constructor(props) {
        super(props)
        console.log("IN NOTIF ARRET CAP!!")
        this.state = {
            emetteur : undefined,
            equipe : undefined, 
            isLoading : true
        }
    }

    componentDidMount() {
        this.getData()
    }

    async getData() {
        console.log("in get data")
        // Données de l'équipe concernée
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données de la partie 
        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")

        
        this.setState({ emetteur : emetteur, equipe : equipe,isLoading : false})
    }

    gotoFicheEquipe() {
        this.props.navigation.navigate("Profil_Equipe", {equipeId : this.state.equipe.id})
    }


    renderPhotoEquipe() {
        if(this.state.equipe != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.emetteur.photo}} 
                        style = {{height : hp('8%'), width : hp('8%'), borderRadius : hp('4%'), marginRight : wp('3%'), marginLeft: wp('3%'), backgroundColor: 'gray'}}   
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


    nomEquipe(){
        if(this.state.equipe != undefined) {
            return this.state.equipe.nom
        } else {
            return '___'
        }
    }
    nomEmetteur(){
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.pseudo
        } else {
            return '___'
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
                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEquipe()}
                    </View>
                    <View>
                        <Text style = {{marginTop : hp('1%')}}>{this.nomEmetteur() + " n'est plus capitaine de \n l'équipe " + this.nomEquipe()} </Text>
                        <TouchableOpacity 
                            onPress = {() => this.gotoFicheEquipe()}>
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

export default withNavigation(Notif_Arret_Cap)
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
 * Notifiction affichée si un on a demander au joueur de devenir capitaine d'une équipe.
 */
class Notif_Demande_Rejoindre_Capitaines extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            equipe: undefined,
            emetteur : undefined,
            isLoading : true,
            a_accepte : false,
            a_refuse : false,
        }
    }

    componentDidMount(){
        this.getData()
    }


    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {

        console.log("in get data")
        // Données de l'équipe concernée
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données de la partie 
        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")

        var a_accepte = equipe.capitaines.includes(LocalUser.data.id)
        var a_refuse = ! equipe.capitaines.includes(LocalUser.data.id) && ! equipe.capitainesAttentes.includes(LocalUser.data.id)
        this.setState({ emetteur : emetteur, equipe : equipe,isLoading : false, a_accepte : a_accepte, a_refuse : a_refuse})
    }

    gotoFicheEquipe() {
        this.props.navigation.navigate("Profil_Equipe", {equipeId : this.state.equipe.id})
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

    nomEquipe(){
        if(this.state.equipe != undefined) {
            return this.state.equipe.nom
        } else {
            return '___'
        }
    }

    nomEmetteur(){
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.nom
        } else {
            return '___'
        }
    }

    

    chooseOptionToRender(){
        if(this.state.a_accepte) {
            return(
                <Text>Tu est devenu capitaine de l'équipe  {this.nomEquipe()}</Text>
            )
        } else if(this.state.a_refuse) {
            return(
                <Text>Tu as refusé d'être capitaine de l'équipe  {this.nomEquipe()}</Text>
            )
        } else {
            return(
                <View>
                    <Text>Le capitaine {this.nomEmetteur()} souhaite t'ajouter</Text>
                        <Text>en capitaine de l'équipe {this.nomEquipe()}</Text>
                        
                        <TouchableOpacity 
                        onPress = {() => this.gotoFicheEquipe()}>
                            <Text style = {styles.txtBtn}>Consulter</Text>
                        </TouchableOpacity>
                  

                    <View style = {{flexDirection : "row"}}>
                        <TouchableOpacity>
                            <Text style = {styles.txtBtn}>Accpeter</Text>
                        </TouchableOpacity>

                        <Text>   /   </Text>

                        <TouchableOpacity>
                            <Text style = {styles.txtBtn}>Refuser</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEquipe()}
                    </View>
                    <View>
                        {this.chooseOptionToRender()}
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
export default withNavigation(Notif_Demande_Rejoindre_Capitaines)
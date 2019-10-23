
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
 * Notification indiquant la réponse du capitaine de l'équipe organisatrice d'un défi que 
 * j'ai souhaité relever.
 */
class Notif_Reponse_Releve_Defi extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading : true,
            equipeOrga : undefined,
            defi : undefined,
        }
    }
    

    
    componentDidMount() {
        this.getData()
    }


     /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {


        // Données de l'équipe concernée
        var equipe = await Database.getDocumentData(this.props.notification.equipeEmettrice, "Equipes")


        // Données du défi 
        var defi = await Database.getDocumentData(this.props.notification.defi, "Defis")
        this.setState({equipeOrga :equipe , defi : defi,isLoading : false})
    }


      /**
     * Pour se rendre dans la fiche du defi
     */
    async goToFicheDefi() {
        this.setState({isLoading : true})
        var eq = undefined
        console.log("******************************")
        console.log("eq defiee" , this.state.defi.equipeDefiee)
        console.log("******************************")

        if(this.state.defi.equipeDefiee != undefined && this.state.defi.equipeDefiee != "") {
            eq = await Database.getDocumentData(this.state.defi.equipeDefiee, "Equipes")
        }
        this.setState({isLoading : false})
        this.props.navigation.navigate("FicheDefiRejoindre",
            {
                defi : this.state.defi,
                equipeOrganisatrice : this.state.equipeOrga,
                equipeDefiee : eq
        } )
  
    }


    renderNomEquipe(){
        if(this.state.equipeOrga != undefined) {
            return this.state.equipeOrga.nom
        } else {
            return " "
        }
    }

    renderDecision(){
        if(this.props.notification.type == Types_Notification.ACCEPTER_EQUIPE_DEFIEE) {
            return "accepté"
        } else {
            return "refusé"
        }
    }

    renderPhotoEmetteur() {
        if(this.state.equipeOrga != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.equipeOrga.photo}} 
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

    renderDateDefi(){
        if(this.state.defi != undefined) {
            return this.state.defi.dateString
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
                <View style = {{flexDirection : 'row',marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEmetteur()}
                    </View>
                    <View>
                        <Text>L'équipe {this.renderNomEquipe()} a  </Text> 
                        <Text>{this.renderDecision()} de vous défier. </Text> 

                        {/* Date et btn consulter*/}
                        <View style = {{flexDirection : "row"}}>
                            <Text> le {this.renderDateDefi()} </Text>
                            
                            <TouchableOpacity
                                onPress = {() => this.goToFicheDefi()}
                                >
                                <Text style = {styles.txtBtn}>Consulter</Text>
                            </TouchableOpacity>
                        </View>
                        

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

export default withNavigation (Notif_Reponse_Releve_Defi)
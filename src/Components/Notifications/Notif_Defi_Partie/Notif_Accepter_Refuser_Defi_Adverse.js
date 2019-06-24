

import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification';


/**
 * Notification reçu quand on a crée un défi contre une autre équipe et que le capitaine 
 * à accepter ou refuser ce defi.
 */
class Notif_Accepter_Refuser_Defi_Adverse extends React.Component {

    constructor(props) {
        super(props) 
        this.state = {
            isLoading : true,
            emetteur : undefined,
            equipeOrga : undefined,
            defi : undefined,
            equipeDefiee : undefined,
            defis_valide : false,
            defis_refuse : false
        }
    }
    componentDidMount() {
        this.getData()
    }

    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {
       
        // Données des équipes concernées
        var equipeOrga = await Database.getDocumentData(this.props.notification.equipeOrga, "Equipes")
        var equipeDefiee = await Database.getDocumentData(this.props.notification.equipeDefiee, "Equipes")
        
        // Données de l'émeteur 
        //var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données du défi 
        var defi = await Database.getDocumentData(this.props.notification.defi, "Defis")
        this.setState({equipeOrga :equipeOrga , equipeDefiee : equipeDefiee, defi : defi, isLoading : false})
    }

    goToFicheDefi() {
        this.props.navigation.navigate("FicheDefiRejoindre",
            {
                defi : this.state.defi,
                equipeOrganisatrice : this.state.equipeOrga,
                equipeDefiee : this.state.equipeDefiee
            } 
        )
    }


    
    renderPhotoEquipeDefiee() {
        if(this.state.equipeDefiee != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.equipeDefiee.photo}} 
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

    renderDecision() {
        if(this.props.notification.type == Types_Notification.ACCEPTER_CONVOCATION_DEFI_ADVERSE) {
            return "accepté"
        } else {
            return "refusé"
        }
    }

    renderNomEquipeDefiee() {
        if(this.state.equipeDefiee != undefined) {
            return this.state.equipeDefiee.nom
        } else {
            return '__'
        }
    }

    renderNomEquipeOrga() {
        if(this.state.equipeOrga != undefined) {
            return this.state.equipeOrga.nom
        } else {
            return '__'
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
                        {this.renderPhotoEquipeDefiee()}
                    </View>
                    <View>
                        
                        <Text> L'équipe {this.renderNomEquipeDefiee()} a {this.renderDecision()} le défi</Text>
                        <Text> lancé par ton équipe  {this.renderNomEquipeOrga()} </Text>

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

export default withNavigation(Notif_Accepter_Refuser_Defi_Adverse)
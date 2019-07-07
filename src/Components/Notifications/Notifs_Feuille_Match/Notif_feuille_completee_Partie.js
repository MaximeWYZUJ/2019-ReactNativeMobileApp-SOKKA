
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
class Notif_feuille_completee_Partie extends React.Component {

    constructor(props) {

        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            partie : undefined,
           organisateur : undefined,
            
        }
    }


    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {


        console.log("IN GET DATA §§§§§§§§§§")
        console.log(this.props.notification)
        // Données de la partie 
        var partie = await Database.getDocumentData(this.props.notification.partie, "Defis")
        console.log("PARTIE : ", partie.id)
        console.log(this.props.notification.organisateur)
        var organisateur = await Database.getDocumentData(this.props.notification.organisateur, "Joueurs")
        console.log("ORGANISATEUR : ", organisateur.id)
        this.setState({partie : partie, organisateur : organisateur, isLoading : false})

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
            })
        
    }


    renderPhotoOrga() {
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

    renderpseudoOrga() {
        if(this.state.organisateur != undefined) {
            return this.state.organisateur.pseudo
        } else {
            return '___'
        }
    }

   
    render() {
        if(! this.state.isLoading) {
            return(
                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoOrga()}
                    </View>
                    <View>
                        <Text>{this.renderpseudoOrga()} a complété la feuille</Text>
                        <Text>de match de partie</Text>
                        <TouchableOpacity
                            onPress = {() => this.goToFichePartie()}>
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

export default withNavigation (Notif_feuille_completee_Partie)
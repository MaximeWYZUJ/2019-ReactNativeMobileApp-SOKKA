
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'

/**
 * Classe qui permet d'afficher une notification de convocation ou relance
 * à une partie
 */
class Notif_Convocation_Partie extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            emetteur : undefined,
            partie : undefined
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
        console.log("before  emetteur", this.props.notification.emetteur)
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données du défi 
        var partie = await Database.getDocumentData(this.props.notification.partie, "Defis")
        this.setState({emetteur : emetteur, defi : defi,isLoading : false})
    }



    renderNomEmetteur() {
        if(this.state.emetteur != undefined) {
            return this.state.emetteur.pseudo
        } else {
            return "__"
        }
    }

    renderPhotoEmetteur() {
        if(this.state.emetteur != undefined) {
            console.log("ookokoko")
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

    renderDatePartie() {
        if(this.state.partie != undefined) {
            return this.buildDate(new Date(this.state.partie.jour.seconds * 1000))
        } else {
            return '??'
        }
    }

    render() {
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
                <View style = {{flexDirection : 'row',marginTop : hp('2%'), borderWidth : 1}}>
                    <View>
                        {this.renderPhotoEmetteur()}
                    </View>
                    <View>
                        <Text>Le capitaine {this.renderNomEmetteur()} de l'équipe  </Text>
                        <Text>{this.renderNomEquipe()}  t'as convoqué / relancé pour</Text>

                        {/* Date et btn consulter*/}
                        <View style = {{flexDirection : "row"}}>
                            <Text>une partie le {this.renderDatePartie()} </Text>
                            
                            <TouchableOpacity
                                onPress = {() => this.goToFicheDefi()}
                                >
                                <Text style = {styles.txtBtn}>Consulter</Text>
                            </TouchableOpacity>
                        </View>
                        

                        {this.renderBtnConfirmer()}
                    </View>
                </View>
            )
        }
        
    }
}



export default withNavigation (Notif_Convocation_Partie)
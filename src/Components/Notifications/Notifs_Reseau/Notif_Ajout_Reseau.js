

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

class Notif_Ajout_Reseau extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            emetteur : undefined
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
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        this.setState({emetteur : emetteur,isLoading : false})
    }


    /**
     * Fonction qui va permettre de se rendre sur le profil du joueur qui nous a ajouté
     * à son réseau
     */
    async goToProfilJoueur() {

        var equipes = await Database.getArrayDocumentData(this.state.emetteur.equipes, "Equipes")
        this.props.navigation.push("ProfilJoueur", {id: this.state.emetteur.id, joueur : this.state.emetteur, equipes : equipes})

    }



    renderPseudoEmetteur() {
        if(this.state.emetteur == undefined) {
            return("___")
        } else {
            console.log("eeeeeeeeeee", this.state.emetteur.pseudo)
            return this.state.emetteur.pseudo
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

    render() {
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
                        <Text>{this.renderPseudoEmetteur()} t'as ajouté à son réseau</Text>
         
                        
                        <TouchableOpacity
                            onPress = {() => this.goToProfilJoueur()}
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

export default withNavigation(Notif_Ajout_Reseau)
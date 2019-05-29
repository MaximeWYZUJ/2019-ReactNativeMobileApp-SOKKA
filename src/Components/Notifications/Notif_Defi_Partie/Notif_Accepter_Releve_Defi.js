
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
 * Classe qui permet d'afficher les notfications pour accèpter ou non une
 * équipe qui à relevée un défi posté par une des équipes dont l'utilisateur
 * est capitaine
 */
class Notif_Accepter_Releve_Defi extends React.Component {

    constructor(props) {
        super(props) 
        this.state = {
            isLoading : true,
            emetteur : undefined,
            equipeEmettrice : undefined,
            defi : undefined,
            equipeReceptrice : undefined,
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
        var equipeEmettrice = await Database.getDocumentData(this.props.notification.equipeEmettrice, "Equipes")
        var equipeReceptrice = await Database.getDocumentData(this.props.notification.equipeReceptrice, "Equipes")
        
        // Données de l'émeteur 
        //var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        console.log("after emeteur equipe")
        // Données du défi 
        var defi = await Database.getDocumentData(this.props.notification.defi, "Defis")
        this.setState({equipeEmettrice :equipeEmettrice , equipeReceptrice : equipeReceptrice, defi : defi, defis_valide : defi.defis_valide, defis_refuse  : defi.defis_refuse, isLoading : false})
    }

     
    /**
     * Pour se rendre dans la fiche du defi
     */
    goToFicheDefi() {
       
        var defi = this.state.defi
        defi["defis_valide"] = this.state.defis_valide
        defi["defis_refuse"] = this.state.defis_refuse

        this.setState({defi : defi})
        this.props.navigation.navigate("FicheDefiRejoindre",
            {
                defi : this.state.defi,
                equipeOrganisatrice : this.state.equipeReceptrice,
                equipeDefiee : this.state.equipeEmettrice
            } 
        )
        
    }


     /**
     * Fonction qui va être appelée au moment où l'utilisateur annule sa
     * présence. 
     */
    handleConfirmerNon() {
        console.log("in handle confirmer non")
        Alert.alert(
            '',
            "Tu souhaite refuser le défi lancé par l'équipe" + this.state.equipeEmettrice.nom,
            [
                {text: 'Oui', onPress: () => this.refuserDefis()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )

    }

    /**
     * Fonction qui va être appelée au moment où l'utilisateur confirme sa
     * présence. 
     */
    handleConfirmerOui() {
        Alert.alert(
            '',
            "Tu souhaite accepter le défi lancé par l'équipe" + this.state.equipeEmettrice.nom,
            [
                {text: 'Oui', onPress: () => this.accepterDefis()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )

    }

    /**
     * Fonction qui permet d'accepter le défi
     */
    accepterDefis() {

        var db = Database.initialisation()
        if(this.state.defi != undefined) {
            this.setState({defis_valide : true, defis_refuse : false})
            db.collection("Defis").doc(this.state.defi.id).update({
                defis_valide : true,
                defis_refuse : false
            })
        }
    }

    /**
     * Fonction qui permet de refuser le défi
     */
    refuserDefis() {

        var db = Database.initialisation()
        if(this.state.defi != undefined) {
            this.setState({defis_valide : false, defis_refuse : true})
            db.collection("Defis").doc(this.state.defi.id).update({
                defis_valide : false,
                defis_refuse : true
            })
        }
    }




    renderPhotoEquipeEmetteur() {
        if(this.state.equipeEmettrice != undefined) {
            return(
                    <View style = {{justifyContent : "center", paddingTop : hp('1%')}}>
                        <Image
                        source = {{uri : this.state.equipeEmettrice.photo}} 
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

    renderBtnConfirmer() {
        return(
            <View style = {{flexDirection : "row"}}>
                <TouchableOpacity
                    onPress = { () => this.handleConfirmerOui()}>
                    <Text style = {styles.txtBtn}>Accepter</Text>
                </TouchableOpacity>

                <Text>/</Text>

                <TouchableOpacity
                    onPress = {() => this.handleConfirmerNon()}>
                    <Text style = {styles.txtBtn}>Refuser</Text>
                </TouchableOpacity>
            </View>
        )

    }



    renderNomEquipeEmettrice() {
        if(this.state.equipeEmettrice != undefined) {
            return this.state.equipeEmettrice.nom
        } else {
            return '__'
        }
    }

    renderNomEquipeReceptrice() {
        if(this.state.equipeReceptrice != undefined) {
            return this.state.equipeReceptrice.nom
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
                <View style = {{flexDirection : 'row', borderWidth : 1, marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEquipeEmetteur()}
                    </View>
                    <View>
                        <Text> L'équipe {this.renderNomEquipeEmettrice()} défie ton équipe</Text>
                        <Text> {this.renderNomEquipeReceptrice()} </Text>

                        <TouchableOpacity
                            onPress = {() => this.goToFicheDefi()}
                            >
                            <Text style = {styles.txtBtn}>Consulter</Text>
                        </TouchableOpacity>
                        {this.renderBtnConfirmer()}
                        
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

export default withNavigation (Notif_Accepter_Releve_Defi)
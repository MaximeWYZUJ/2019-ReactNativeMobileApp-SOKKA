

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
 * Quand une équipe crée un défis contre une équipe dont l'utilisateur
 * est capitaine  
*/
class Notif_Defis_Contre_Equipe extends React.Component {


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


    // ===========================================================================
    // ========================== NOTIFICATIONS ==================================
    // ===========================================================================
    
    

    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    async sendPushNotification(token , title,body ) {
        return fetch('https://exp.host/--/api/v2/push/send', {
          body: JSON.stringify({
            to: token,
            title: title,
            body: body,
            data: { message: `${title} - ${body}` },
           
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }).catch(function(error) {
            console.log("ERROR :", error)
        }).then(function(error) {
            console.log("THEN", error)
        });
    }

    /**
     * Fonction qui envoie une notification de refus à chaque capitaine de l'équipe
     */
    async sendNotifRefu() {
        var titre = "Nouvelle notif"
        var corps = "L'équipe " + this.state.equipeReceptrice.nom + " a refusé le défi lancé par ton équipe "+ this.state.equipeEmettrice.nom

        for(var i = 0; i <this.state.equipeEmettrice.capitaines.length; i++) {
            var cap = await Database.getDocumentData(this.state.equipeEmettrice.capitaines[i], "Joueurs")

            
            if(id != LocalUser.data.id) {
                var tokens = [] 
                if(cap.tokens != undefined) tokens = cap.tokens

                for(var k = 0; k < tokens.length; k++) {
                    console.log("==== ", tokens[k])
                    await this.sendPushNotification(tokens[k], titre, corps)
                }
            }
        }
    }

    /**
     * Fonction qui envoie une notification de refus à chaque capitaine de l'équipe
     */
    async sendNotifAccepter() {
        var titre = "Nouvelle notif"
        var corps = "L'équipe " + this.state.equipeReceptrice.nom + " a accepté le défi lancé par ton équipe "+ this.state.equipeEmettrice.nom

        for(var i = 0; i <this.state.equipeEmettrice.capitaines.length; i++) {
            var cap = await Database.getDocumentData(this.state.equipeEmettrice.capitaines[i], "Joueurs")

            
            if(cap.id != LocalUser.data.id) {
                var tokens = [] 
                if(cap.tokens != undefined) tokens = cap.tokens
                
                for(var k = 0; k < tokens.length; k++) {
                    console.log("==== ", tokens[k])
                    await this.sendPushNotification(tokens[k], titre, corps)
                }
            }
        }
    }



    async storeNotifInDb(type) {

        for(var i = 0; i < this.state.equipeEmettrice.capitaines.length; i++) {
            var id = this.state.equipeEmettrice.capitaines[i]
            var db =Database.initialisation()
            db.collection("Notifs").add({
                equipeOrga : this.state.equipeEmettrice.id,
                equipeDefiee : this.state.equipeReceptrice.id,
                type : type,
                time : new Date(),
                dateParse : Date.parse(new Date()),
                recepteur : id,
                defi : this.state.defi.id

            })
        }
    }

   


    // ===========================================================================



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
                equipeOrganisatrice : this.state.equipeEmettrice,
                equipeDefiee : this.state.equipeReceptrice
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
            "Tu souhaites refuser le défi lancé par l'équipe " + this.state.equipeEmettrice.nom,
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
            "Tu souhaites accepter le défi lancé par l'équipe " + this.state.equipeEmettrice.nom,
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
    async accepterDefis() {

        await this.sendNotifAccepter()
        await this.storeNotifInDb(Types_Notification.ACCEPTER_CONVOCATION_DEFI_ADVERSE)
        var db = Database.initialisation()
        if(this.state.defi != undefined) {
            this.setState({defis_valide : true, defis_refuse : false})
            db.collection("Defis").doc(this.state.defi.id).update({
                defis_valide : true,
                defis_refuse : false
            }).then(() => {
                Alert.alert("Tu as bien accepté le défi lancé par l'équipe " + this.state.equipeEmettrice.nom)
            })
        }
    }

    /**
     * Fonction qui permet de refuser le défi
     */
    async refuserDefis() {
  
        await this.sendNotifRefu()
        await this.storeNotifInDb(Types_Notification.REFUSER_CONVOCATION_DEFI_ADVERSE)

        var db = Database.initialisation()
        if(this.state.defi != undefined) {
            this.setState({defis_valide : false, defis_refuse : true})
            db.collection("Defis").doc(this.state.defi.id).update({
                defis_valide : false,
                defis_refuse : true
            }).then(() => {
                Alert.alert("Tu as bien refusé le défi lancé par l'équipe " + this.state.equipeEmettrice.nom)
            })
        }
    }

    // A FINIR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! JEN ETAIS A CODER LES FONCTION DE REFUS OU D ACCEPTATION 
    //DU DEFI


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
                <View style = {{flexDirection : 'row', borderWidth : 1,marginTop : hp('2%')}}>
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
export default withNavigation (Notif_Defis_Contre_Equipe)
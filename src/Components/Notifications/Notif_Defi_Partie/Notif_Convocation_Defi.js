
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Colors'
import Simple_Loading from '../../Loading/Simple_Loading'
import Database  from '../../../Data/Database'
import LocalUser from '../../../Data/LocalUser.json'
import { withNavigation } from 'react-navigation'
import DatesHelpers from '../../../Helpers/DatesHelpers';
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'

/**
 * Classe qui permet d'afficher une notification de convocation ou relance
 * à un defi
 */
class Notif_Convocation_Defi extends React.Component {

    constructor(props) {

        super(props)
        this.monId = LocalUser.data.id

        this.state = {
            isLoading : true,
            emetteur : undefined,
            equipe : undefined,
            defi : undefined,
            show_boutons : props.notification.show_boutons,
            texte : props.notification.texte
        }

    }

    componentDidMount() {
        this.getData()
    }

    
    


     /**
     * Fonction qui va permettre de construire un String correspondant à la 
     * date du défi pour le titre de la vue.
     * @param {Date} date 
     */
    buildDate(date) {
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        return numJour  + '/' + mois + '/' + an
    }


    /**
     * Fonction qui permet de récupérer les données relatives à la notification
     */
    async getData() {


        // Données de l'équipe concernée
        var equipe = await Database.getDocumentData(this.props.notification.equipe, "Equipes")

        // Données de l'émeteur 
        var emetteur = await Database.getDocumentData(this.props.notification.emetteur, "Joueurs")

        // Données du défi 
        var defi = await Database.getDocumentData(this.props.notification.defi, "Defis")
        var show_boutons = true
        var txt = this.state.texte
        if(defi != undefined && (defi.confirmesEquipeDefiee.includes(this.monId) || defi.confirmesEquipeOrga.includes(this.monId))){
            txt = txt + "\n Réponse : Confirmé"
            show_boutons = false
        } else if(defi != undefined &&(defi.indisponiblesEquipeDefiee.includes(this.monId) || defi.indisponiblesEquipeOrga.includes(this.monId))) {
            txt = txt + "\n Réponse : Refusé"  
            show_boutons = false
        }
        console.log("after test")
        this.setState({equipe :equipe , emetteur : emetteur, defi : defi,isLoading : false, show_boutons : show_boutons, texte : txt})
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
     * Fonction qui va permettre d'envoyer des notifications à chaque 
     * capitaines indiquant que l'utilisateur confirme sa présence pour le défi
     */
    async sendNotifConfirmeToAllCapitaine(date) {

        
        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " a confirmé sa présence pour un défi le "
        corps = corps +  this.buildDate(new Date(date))
        console.log(corps)
        for(var i  = 0; i < this.state.equipe.capitaines.length; i++) {
            console.log("in for")
            if(this.state.equipe.capitaines[i] != LocalUser.data.id) {
                var cap = await Database.getDocumentData(this.state.equipe.capitaines[i], "Joueurs")

                var tokens = cap.tokens
                if(tokens != undefined) {
                    for(var k =0; k < tokens.length; k ++) {
                        await this.sendPushNotification(tokens[k], titre, corps)
                    }
                }

                console.log("before store in db")
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        defi : this.state.defi.id,
                        emetteur :  LocalUser.data.id,
                        recepteur : cap.id ,
                        time : new Date(),
                        type : Types_Notification.CONFIRMER_PRESENCE_DEFI,
                        equipe : this.state.equipe.id,
                        texte :  corps,
                        heure : DatesHelpers.buildDateNotif(new Date())
                    }
                ) 
            }
        }
        console.log("end sendNotifConfirmeToAllCapitaine ")

    }


     /**
     * Fonction qui va permettre d'envoyer des notifications à chaque 
     * capitaines indiquant que l'utilisateur est indisponible
     */
    async sendNotifIndispoToAllCapitaine(date) {

        var db = Database.initialisation()
        var titre=  "Nouvelle Notif"
        var corps = LocalUser.data.pseudo + " est indisponible pour un défi le "
        corps = corps +  this.buildDate(new Date(date))
        for(var i  = 0; i < this.state.equipe.capitaines.length; i++) {
            if(this.state.equipe.capitaines[i] != LocalUser.data.id) {
                var cap = await Database.getDocumentData(this.state.equipe.capitaines[i], "Joueurs")

                var tokens = cap.tokens
                if(tokens != undefined) {
                    for(var k =0; k < tokens.length; k ++) {
                        await this.sendPushNotification(tokens[k], titre, corps)
                    }
                }

                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        defi : this.state.defi.id,
                        emetteur :  LocalUser.data.id,
                        recepteur : cap.id ,
                        time : new Date(),
                        type : Types_Notification.ANNULER_PRESENCE_DEFI,
                        equipe : this.state.equipe.id,
                        texte :  corps,
                        heure : DatesHelpers.buildDateNotif(new Date())
                    }
                ) 
            }

           
        }

    }


    storeNotifRelanceInDB() {
        this.sendNotifToAllPlayer(new Date(this.state.partie.jour.seconds * 1000))
    }
    // ======================================================



    //===================================================================================
    //============ FONCTIONS POUR LA CONFIRMATION DE LA PARTICIPATION A UN DEFI =========
    //===================================================================================


    /**
     * Fonction qui va être appelée au moment où l'utilisateur annule sa
     * présence. 
     */
    handleConfirmerNon() {
        Alert.alert(
            '',
            "Tu souhaites annuler ta présence pour ce défi ? ",
            [
                {text: 'Oui', onPress: () => this.annulerJoueurPresence()},
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
            "Tu souhaites confirmer ta présence pour ce Defi ? ",
            [
                {text: 'Oui', onPress: () => this.confirmerJoueurPresence()},
                {
                  text: 'Non',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
            ],
        )

    }

    /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs ayant 
     * annuler . Ainsi que  d'enregistrer le defi mis à jour dans la DB.
     */
    async annulerJoueurPresence() {
        await this.sendNotifIndispoToAllCapitaine(new Date(this.state.defi.jour.seconds *1000))

        console.log("after send notif to all cap")
        // Trouver l'équipe dont l'utilisateur est membre 
        if(this.state.defi.joueursEquipeOrga.includes(this.monId)) {

            // Ajouter l'id de l'utilisateur dans la liste des indisponible (Creation d'un new array pour le re render)
            var j = []
            
            for(var i = 0 ; i < this.state.defi.indisponiblesEquipeOrga.length; i++) {
                j.push(this.state.defi.indisponiblesEquipeOrga[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }

            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeOrga.length ; i++) {
                if(this.state.defi.attenteEquipeOrga[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeOrga[i])
                }
            }

            // Suppr l'user  des joueurs confirme
            var  conf  = []
            
            for(var i = 0 ; i <this.state.defi.confirmesEquipeOrga.length ; i++) {
                if(this.state.defi.confirmesEquipeOrga[i] != this.monId) {
                    conf.push(this.state.defi.confirmesEquipeOrga[i])
                } 
            }

            // Mettre à jour le state.
            var defi = this.state.defi
            defi.confirmesEquipeOrga = conf
            defi.attenteEquipeOrga = att
            defi.indisponiblesEquipeOrga = j

            this.setState({defi, defi, show_boutons : false})

            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeOrga : conf,
                attenteEquipeOrga : att,
                indisponiblesEquipeOrga : j,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

        // Cas où le joueur est dans l'équipe défiée
        } else {
            // Ajouter l'id de l'utilisateur dans la liste des indispo (Creation d'un new array pour le re render)
            var j = []
            for(var i = 0 ; i < this.state.defi.indisponiblesEquipeDefiee.length; i++) {
                j.push(this.state.defi.indisponiblesEquipeDefiee[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }
            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeDefiee.length ; i++) {
                if(this.state.defi.attenteEquipeDefiee[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeDefiee[i])
                }
            }


            // Suppr l'user  des joueurs confirmés
            var conf  = []
            for(var i = 0 ; i <this.state.defi.confirmesEquipeDefiee.length ; i++) {
                if(this.state.defi.confirmesEquipeDefiee[i] != this.monId) {
                    conf.push(this.state.defi.confirmesEquipeDefiee[i])
                } 
            }


            // Mettre à jour le state.
            var defi = this.state.defi
            defi.confirmesEquipeDefiee = conf
            defi.attenteEquipeDefiee = att
            defi.indisponiblesEquipeDefiee = j

            this.setState({defi, defi})
            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeDefiee : conf,
                attenteEquipeDefiee : att,
                indisponiblesEquipeDefiee : j,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        }


        // stocker la notif : 
      
        var txt = ""
        txt =  this.props.notification.texte +  "\n reponse : Refusé"
        this.setState({texte : txt})
        
         
   
    }


    /**
     * Fonction qui va permettre d'ajouter un joueur à la liste des joueurs ayant 
     * confirmés. Ainsi que  d'enregistrer le def mise à jour dans la DB.
     */
    async confirmerJoueurPresence() {
        console.log("confirmerJoueurPresence")
        await this.sendNotifConfirmeToAllCapitaine(new Date(this.state.defi.jour.seconds *1000))

        // Trouver l'équipe dont l'utilisateur est membre 
        if(this.state.defi.joueursEquipeOrga.includes(this.monId)) {

            // Ajouter l'id de l'utilisateur dans la liste des confirme (Creation d'un new array pour le re render)
            var j = []
            for(var i = 0 ; i < this.state.defi.confirmesEquipeOrga.length; i++) {
                j.push(this.state.defi.confirmesEquipeOrga[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }

            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeOrga.length ; i++) {
                if(this.state.defi.attenteEquipeOrga[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeOrga[i])
                }
            }

            // Suppr l'user  des joueurs indispos
            var indispo  = []
            for(var i = 0 ; i <this.state.defi.indisponiblesEquipeOrga.length ; i++) {
                if(this.state.defi.indisponiblesEquipeOrga[i] != this.monId) {
                    indispo.push(this.state.defi.indisponiblesEquipeOrga[i])
                } 
            }

            // Mettre à jour le state.
            var defi = this.state.defi
            defi.confirmesEquipeOrga = j
            defi.attenteEquipeOrga = att
            defi.indisponiblesEquipeOrga = indispo

            this.setState({defi, defi,show_boutons : false})

            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeOrga : j,
                attenteEquipeOrga : att,
                indisponiblesEquipeOrga : indispo,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });


        // Cas où le joueur est dans l'équipe défiée
        } else {
            // Ajouter l'id de l'utilisateur dans la liste des confirme (Creation d'un new array pour le re render)
            var j = []
            for(var i = 0 ; i < this.state.defi.confirmesEquipeDefiee.length; i++) {
                j.push(this.state.defi.confirmesEquipeDefiee[i])
                
            }
            if(! j.includes(this.monId)){
                j.push(this.monId) 
            }

            // Suppr l'user des joueurs en attente (on crée des new objet pour que le state se maj)
            var att  = []
            for(var i = 0 ; i < this.state.defi.attenteEquipeDefiee.length ; i++) {
                if(this.state.defi.attenteEquipeDefiee[i] != this.monId) {
                    att.push(this.state.defi.attenteEquipeDefiee[i])
                }
            }

            // Suppr l'user  des joueurs indispos
            var indispo  = []
            for(var i = 0 ; i <this.state.defi.indisponiblesEquipeDefiee.length ; i++) {
                if(this.state.defi.indisponiblesEquipeDefiee[i] != this.monId) {
                    indispo.push(this.state.defi.indisponiblesEquipeDefiee[i])
                } 
            }

            // Mettre à jour le state.
            var defi = this.state.defi
            defi.confirmesEquipeDefiee = j
            defi.attenteEquipeDefiee = att
            defi.indisponiblesEquipeDefiee = indispo

            this.setState({defi, defi})

            // Enregistrer dans la db
            var db = Database.initialisation()
            var partieRef = db.collection("Defis").doc(this.state.defi.id)
            partieRef.update({
                confirmesEquipeDefiee : j,
                attenteEquipeDefiee : att,
                indisponiblesEquipeDefiee : indispo,
            }).then()
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        }

        

         var txt = ""
         txt =  this.props.notification.texte +  "\n reponse : Confirmé"
         this.setState({texte : txt})

    }


    //===================================================================================
    //================== FONCTIONS POUR SE RENDRE SUR LA FICHE DU DEFI ==================
    //===================================================================================
    








    
    /**
     * Pour se rendre dans la fiche du defi
     */
    async goToFicheDefi() {
        this.setState({isLoading : true})
        if(this.state.equipe.id == this.state.defi.equipeOrganisatrice) {
            var eq = undefined
            if(this.state.defi.equipeDefiee != undefined) {
                eq = await Database.getDocumentData(this.state.defi.equipeDefiee, "Equipes")
            }
            this.setState({isLoading : false})
            this.props.navigation.navigate("FicheDefiRejoindre",
                {
                    defi : this.state.defi,
                    equipeOrganisatrice : this.state.equipe,
                    equipeDefiee : eq
            } )
        } else {
            var eq = await Database.getDocumentData(this.state.defi.equipeOrganisatrice, "Equipes")
            this.setState({isLoading : false})

            this.props.navigation.navigate("FicheDefiRejoindre",
                {
                    defi : this.state.defi,
                    equipeOrganisatrice : eq,
                    equipeDefiee : this.state.equipe
            } )
        }
    }



    //===================================================================================


    renderNomEquipe() {
        if(this.state.equipe != undefined) {
            return this.state.equipe.nom
        } else {
            return "__"
        }
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

    renderDateDefi() {
        if(this.state.defi != undefined) {
            return this.buildDate(new Date(this.state.defi.jour.seconds * 1000))
        } else {
            return '??'
        }
    }


    renderBtnConfirmer() {
        if(new  Date(this.state.defi.jour.seconds *1000) > new Date && this.state.show_boutons) {
            return(
                <View style = {{flexDirection : "row"}}>
                    <Text>Confirmer : </Text>
                    <TouchableOpacity
                        onPress = { () => this.handleConfirmerOui()}>
                        <Text style = {styles.txtBtn}>Oui</Text>
                    </TouchableOpacity>

                    <Text>/</Text>

                    <TouchableOpacity
                        onPress = {() => this.handleConfirmerNon()}>
                        <Text style = {styles.txtBtn}>Non</Text>
                    </TouchableOpacity>
                </View>
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
                <View style = {{flexDirection : 'row',marginTop : hp('2%')}}>
                    <View>
                        {this.renderPhotoEmetteur()}
                    </View>
                    <View>
                        <Text style ={{width : wp('55%')}}>{this.state.texte}</Text>
                        {/* Date et btn consulter*/}
                        <View style = {{flexDirection : "row"}}>
                            {/*<Text>un défi le {this.renderDateDefi()} </Text>*/}
                            
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

const styles = {
    txtBtn : {
        fontWeight : "bold"
    }
}

export default withNavigation (Notif_Convocation_Defi)
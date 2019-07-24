import React from 'react'

import {View, Text,Image,TouchableOpacity} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import Database from '../../Data/Database';
import LocalUser from '../../Data/LocalUser.json'
import NormalizeString from '../../Helpers/NormalizeString'
import * as firebase from 'firebase';
import Simple_Loading from '../../Components/Loading/Simple_Loading'
import Types_Notification from '../../Helpers/Notifications/Types_Notification'


export default class Creation_Equipe_Photo extends React.Component {

    constructor(props) {
        super(props),
        this.state = {
            photo : require('app/res/choix_photo.png'),
            image_changed : false,
            joueurs : [LocalUser.data.id].concat(this.props.navigation.getParam("joueurs", [])),
            idEquipe : "erreur",
            isLoading : false
        }
        this.updateJoueur = this.updateJoueur.bind(this)
    }

     /**
     * Fonction qui permet d'ouvrir la galerie et de permettre à l'utilisateur
     * de choisir une photo de profil
     */
    _pickImage = async () => {

        
        /* Obtenir les permissions. */
        const { Permissions } = Expo;
        const { status: cameraRollPermission } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        /* Ouvrir la galerie. */
        let result = await Expo.ImagePicker.launchImageLibraryAsync({
        });

        /* Si l'utilisateur à choisis une image. */
        if (!result.cancelled) {
            this.setState({ 
              photo: {uri : result.uri },
              image_changed : true
            });
        }
    };


    /**
     * Fonction qui va permettre de sauvegarder la photo de l'équipe 
     * dans la base de donnée et renvoyer le lien
     */
    async savePhotoInStorage() {
        if(this.state.image_changed) {
            var uri = this.state.photo.uri
            var equipeName = this.props.navigation.getParam("nom", "errur")
            var url = Database.uploadImageFinal(uri,equipeName, true)
            return url 
        } else {
            return "aucune photo"
        }

    }


    /**
     * Fonction qui va permettre de sauvegarder l'équipe dans la base de donnée 
     * et de mettre à jour l'array equipe des joueurs
     */
    async saveEquipeInDb() {
        this.setState({isLoading : true})
        console.log("in save equipe")

        // Enregistrer la photo 
        var  urlPhoto = await this.savePhotoInStorage()
        console.log("==== URL : ", urlPhoto)

        console.log("[LocalUser.data.id]," ,[LocalUser.data.id])
        console.log(this.props.navigation.getParam("nom",""))
        console.log( NormalizeString.decompose(this.props.navigation.getParam("nom","")))
        
        // Sauver le document de l'équipe
        var db = Database.initialisation()
        var equipeRef = db.collection("Equipes").doc()
        console.log(equipeRef.id)
        this.setState({idEquipe : equipeRef.id})
        console.log("before set")
        await equipeRef.set({
            age : 23,
            aiment : [],
            capitaines : [LocalUser.data.id],
            citation : this.props.navigation.getParam("citation", "erreur"),
            fiabilite : 100,
            id : equipeRef.id,
            joueurs : [LocalUser.data.id],
            mail  : LocalUser.data.mail,
            nbDefisCree : 0,
            nbDefisParticipe : 0,
            nom : this.props.navigation.getParam("nom",""),
            photo : urlPhoto,
            queryName : NormalizeString.decompose(this.props.navigation.getParam("nom","")),
            //queryPrenom : NormalizeString.decompose(this.props.navigation.getParam("prenom","")),
            score : 5,
            telephone : LocalUser.data.telephone,
            ville : NormalizeString.normalize(this.props.navigation.getParam("ville", " ")),
            departement : NormalizeString.normalize(this.props.navigation.getParam("departement", "erreur")),
            defis : [],
            nbJoueurs : 1,
            joueursAttentes : this.props.navigation.getParam("joueurs", [])
        }).then(this.updateJoueur()).catch(function(error){
            console.log(error)
        })
        
       
    }

    /**
     * Fonction qui va permettre d'ajouter l'id de l'équipe à la liste des 
     * équipes de l'utilisateur.
     */
    async updateJoueur() {
        await this.sendNotifInvitationEquipe(this.state.idEquipe)
        var joueurs = this.state.joueurs
        var db = Database.initialisation()
        var joueurRef  = db.collection("Joueurs").doc(LocalUser.data.id)
        await joueurRef.update({
            equipes : firebase.firestore.FieldValue.arrayUnion(this.state.idEquipe)  
        })
        /*for(var i = 0; i < joueurs.length ; i++) {
            if(joueurs[i] == LocalUser.data.id ) {
            var joueurRef  = db.collection("Joueurs").doc(joueurs[i])
            console.log("=============")
            console.log(joueurs[i])
            await joueurRef.update({
                equipes : firebase.firestore.FieldValue.arrayUnion(this.state.idEquipe)  
            })
            console.log("ok")
            console.log("=============")

        }*/

        // Recuperer les équipe de l'utilisateur pour le profil
        var eq = []
        LocalUser.data.equipes = eqId = LocalUser.data.equipes.concat([this.state.idEquipe])

        for(var i =0; i < LocalUser.data.equipes.length; i++) {
            var e = await Database.getDocumentData(LocalUser.data.equipes[i], "Equipes")
            eq.push(e)
            console.log(e.nom)
        }

        console.log(" E == ", eq)
        console.log("equipes : ", LocalUser.data.equipes)
        
        this.props.navigation.push("ProfilJoueur", {id: LocalUser.data.id, joueur : LocalUser.data, equipes : eq, retour_arriere_interdit : true})
        
    }



    
    //===================================================================================
    //========================== FONCTIONS POUR LES NOTIFICATIONS =======================
    //===================================================================================


    /**
     * Fonction qui permet d'envoyer des notifications
     * @param {String} token 
     * @param {String} title 
     * @param {String} body 
     */
    async sendPushNotification(token , title,body ) {
        console.log("________ "+ body +  " _____")
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
     * Fonction qui va permettre d'envoyer une notification à tous les joueurs invité à rejoindre 
     * l'équipe.
     */
    async sendNotifInvitationEquipe(idEquipe) {
  
        var titre=  "Nouvelle Notif"
        var corps = "Le capitaine " + LocalUser.data.pseudo + "De l'équipe "
                    +  this.props.navigation.getParam("nom","") + " souhaite"
                    + "t'intégrer dans son équipe"


        var joueurs = this.props.navigation.getParam("joueurs", [])
        for(var i = 0; i < joueurs.length; i++) {
            await this.storeNotifInvitationInDB(idEquipe, joueurs[i])
            var j = await Database.getDocumentData(joueurs[i], "Joueurs")
            var tokens = j.tokens
            console.log("tokens : ", tokens)
            if(tokens != undefined) {
                for(var k =0; k < tokens.length; k ++) {
                    await this.sendPushNotification(tokens[k], titre, corps)
                }
            }
        }
        
    }


    /**
     * Fonction qui va sauvegarder les notification d'invitation à rejoindre l'équipe
     * dans la base de données.
     */
    async storeNotifInvitationInDB(equipeId, idRecepteur) {
        var db = Database.initialisation() 
        console.log()
        db.collection("Notifs").add(
            {
                dateParse : Date.parse(new Date()),
                equipe : equipeId,
                emetteur :  LocalUser.data.id,
                recepteur : idRecepteur,
                time : new Date(),
                type : Types_Notification.INVITATION_REJOINDRE_EQUIPE,
            }
        ).then(function() {console.log("NOTIF STORE")})
        .catch(function(error) {console.log(error)})
        
    }


    // ====================================================================================
   

    render(){
        if(! this.state.isLoading) {
            return(
                <View style = {styles.main_container}>
    
                    {/* Bandeau superieur */}
                    <View style = {styles.bandeau}>
                        <Text> </Text>
                        <Text style= {{ alignSelf : "center", marginLeft : wp('22%'), marginRight : wp('13%'), fontSize : RF(3.1)}}>Photo</Text>
                        <TouchableOpacity
                        onPress = {() => this.saveEquipeInDb()}
                        >
                            <Text style = {{fontSize : RF(3.1), color : Colors.agOOraBlue}}>Confirmer</Text>
                        </TouchableOpacity>
                    </View>
    
                    {/* View contenant l'image de l'appareil photo */}
                    <View style = {{alignItems : 'center', alignContent : 'center', marginTop : hp('8%')}  }>
                        <Text style = {{fontSize : RF(3)}}>Choisis une photo d'équipe  </Text>
                        <TouchableOpacity 
                            style = {{marginTop : hp('5%')}}
                            onPress={this._pickImage}>
                    
                            <Image
                            source = {this.state.photo}
                            style = {{width : wp('35%'), height : wp('35%')}}/>
                        </TouchableOpacity>
                        
                        <Text style = {{fontSize : RF(3), marginTop : hp('5%')}}>{"Elle permettra aux autres  joueurs de \n reconnaître ton équipe plus facilement"}</Text>
                    </View>
                  
    
                    {/* View contenant les "compteur d'etape de creation"*/}
                    <View style ={{alignItems : 'center', alignContent : 'center'}}>
                        <View style = {{flexDirection : 'row', marginTop :hp('5%')}}>
                            <View  style = {[styles.step, styles.curent_step]}></View>
                            <View style = {[styles.step, styles.curent_step]}></View>
                            <View style = {[styles.step, styles.curent_step]}></View>
                            <View style = {[styles.step, styles.curent_step]}></View>
                            <View style = {[styles.step, styles.curent_step]}></View>
                        </View>
                    </View>
                </View>
            )
        } else {
            return(
                <Simple_Loading/>
            )
        }
        
    }

}
const styles = {
    main_container : {
        marginTop:hp('0%')
    },

    bandeau : {
        flexDirection : 'row',
        backgroundColor : '#DCDCDC',
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        justifyContent: 'space-between',

    },

    txt_input : {
        borderWidth : 1,
        marginTop : hp('8%'),
        width : wp('70%'),
        fontSize : RF(3.4),
        borderRadius : 10,
        padding : wp("2%")
    },

    step : {
        width :wp('5%'), 
        height : wp('5%'), 
        borderWidth : 1,
        borderRadius : 10,
        marginLeft : wp('3%'),
        marginRight : wp('3%')
    },

    curent_step : {
        backgroundColor : Colors.agOOraBlue
    }

}
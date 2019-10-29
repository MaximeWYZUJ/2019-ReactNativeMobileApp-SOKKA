
import React from 'react'

import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput,Alert, ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Database from '../../../Data/Database'

import Information_Recapitulatif from './Information_Recapitulatif'
import ID from '../../../Helpers/ID'
import LocalUser from '../../../Data/LocalUser.json'
import Types_Notification from '../../../Helpers/Notifications/Types_Notification'
import DatesHelpers from '../../../Helpers/DatesHelpers'
import Notification from '../../../Helpers/Notifications/Notification'

const DAY = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

/**
 * Classe qui va permettre d'afficher le récapitulatif d'un défis crée par 
 * l'utilisateur
 */
export default class Recapitulatif_Defis extends React.Component {

    constructor(props) {
        super(props)
        

        this.format =  this.props.navigation.getParam('format', ' '),
        this.contreQui =this.props.navigation.getParam('contreQui', 'v'), 
        this.equipeAdverse = this.props.navigation.getParam('equipeAdverse', ' '),
        this.day =  this.props.navigation.getParam('jour', ' '),
        this.hours = this.props.navigation.getParam('heure', ' '),
        this.duree = this.props.navigation.getParam('duree', ' '),
        this.allDataEquipe = this.props.navigation.getParam('allDataEquipe', ' '),
        this.userData = this.props.navigation.getParam('userData', ' '),
        this.terrain = this.props.navigation.getParam('terrain', ' '),
        this.messageChauffe =  this.props.navigation.getParam('messageChauffe', ' '),
        this.prix = this.props.navigation.getParam('prix', null)
        this.nomsTerrain = this.props.navigation.getParam('nomsTerrains', ' '), 
        this.joueursSelectionnes =  this.props.navigation.getParam('joueursSelectionnes', [])
        this.state = {
            equipeAdverse : {
                nom : "_",
                photo : '',
                score : 0
            }
        }
        this.equipe1Animation = new Animated.ValueXY({ x: -wp('100%'), y:0 })
        this.equipe2Animation = new Animated.ValueXY({ x: wp('100%'), y:0 })
        this.goToFicheDefi = this.goToFicheDefi.bind(this)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("joueurs selectionnes",  this.joueursSelectionnes)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Proposer un défi'
        }
    }

   
    


    componentDidMount() {
        
        if(this.contreQui == 'rechercher_une_equipe') {
            var db = Database.initialisation()
            var docRef = db.collection('Equipes').doc(this.equipeAdverse);
            docRef.get().then(async (doc) => {
                if (doc.exists) {
                    this.setState({equipeAdverse : doc.data()})
                    this._moveEquipe1()
                    this._moveEquipe2()

                } else {
                    console.log("No such document!");
                }
            }).catch(function(error) {
                    console.log("Error getting document:", error);
            });

        } else {
            this._moveEquipe1()
        }
        
        
    }




    /**
     * Fonction qui va envoyer une notification aux capitaines de l'équipe adverse.
     */
    async sendNotifCapAdverses(dataEquipe){
        if(this.equipeAdverse != undefined) {
            var title = "Nouvelle notification"
            var corps = "L'équipe " + this.allDataEquipe.nom + " défie ton équipe " + dataEquipe.nom
            
            
            for(var i = 0; i < dataEquipe.capitaines.length; i++) {
                // Récupérer les données des capitaine
                var cap = await Database.getDocumentData(dataEquipe.capitaines[i], "Joueurs")

                var tokens = []
                if(cap.tokens != undefined) tokens = cap.tokens
                for(var k = 0; k < tokens.length; k ++){
                   await  this.sendPushNotification(tokens[k],title,corps)
                }

                
            }
            
        }
    }

    /**
     * Fonction qui envoie une notification aux joueurs convoqués
     * @param {*} equipe 
     * @param {*} joueurs 
     * @param {*} date 
     */
    async sendNotif(equipe, joueurs,date) {
        for(var i = 0 ; i < joueurs.length; i++) {

            var j = await Database.getDocumentData(joueurs[i], "Joueurs")
            if(j.tokens != undefined) {
                for(var k = 0; k< j.tokens.length; k++) {
                    var title = "Nouvelle notification"
                    var corps = "Le capitaine " + LocalUser.data.pseudo + " de l'équipe " + this.allDataEquipe.nom 
                    corps = corps + " t'a convoqué / relancé pour un un défi le " + this.buildDate(date)
                    await this.sendPushNotification(j.tokens[k], title, corps) 
                    //Notification.sendNotificationInvitationDefi(j.tokens[k],date,LocalUser.data,equipe)
                }
            }
        }
    }

    /**
     * Fonction qui va permettre de construire un String correspondant à la 
     * date du défi pour le titre de la vue.
     * @param {Date} date 
     */
    buildDate(date) {
        var j = date.getUTCDay()
        var numJour = date.getUTCDate()
        var mois  =(date.getUTCMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        return numJour  + '/' + mois + '/' + an
    }

    
    
    sendPushNotification(token , title,body ) {
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

    
     goToFicheDefi(msg, id,equipe,date,joueurs) {
        this.storeNotificationsInDB(id,date)
        this.storeNotificationDefiEquipe(id)
        this.sendNotif(equipe,joueurs,date)
        Alert.alert(
            '',
            msg,
            [
              {text: 'Ok',  onPress:  () =>  {
               
              
                this.props.navigation.push("AccueilJouer")
            }
                        
              },
             
            ],
            {cancelable: false},
        ); 
        
    }
    
    /**
     * Fonction qui va permettre de construire une liste d'id des joueurs 
     * sans le capitaine qui a organisé le defis
     */
    buildListOfJoueurWithoutCapitaine() {
        var joueurs = this.joueursSelectionnes
        var liste = []
        for(var i = 0 ; i < joueurs.length; i++) {
            if(  LocalUser.data.id != joueurs[i]) {
                liste.push(joueurs[i])
            }
        }
        console.log("buildListOfJoueurWithoutCapitaine", liste)
        return liste
        

    }

    saveDefiInDB () {
        var id = ID.buildId()
        var db = Database.initialisation();
    
        var nomEquipeAdverse  = this.state.equipeAdverse.nom

        var cherche_adverssaire = (this.contreQui =='poster_une_annonce')

     
        var msg = ' '
        if(cherche_adverssaire) {
            // Poster une annonce
            if (this.joueursSelectionnes.length > 1) {
                // On a convoque des joueurs
                msg = "Ton défi a bien été créé, tu seras informé dès qu’une équipe aura relevé ton défi. Les joueurs convoqués vont recevoir une notification pour confirmer leur participation"
            } else {
                msg = "Ton défi a bien été créé, tu seras informé dès qu’une équipe aura relevé ton défi"
            }
        }else {
            // Defi contre une equipe en particulier
            if (this.joueursSelectionnes.length > 1) {
                // On a convoque des joueurs
                msg = "Ton défi a bien été créé, le capitaine de l’équipe " + nomEquipeAdverse +" va recevoir une notification pour accepter ou non le défi. Les joueurs convoqués vont recevoir une notification"
            } else {
                msg = "Ton défi a bien été créé, le capitaine de l’équipe " + nomEquipeAdverse + " va recevoir une notification pour accepter ou non le défi »"
            }
        }
        
        var jour = this.day.split('-')[0]
        var moi = this.day.split('-')[1]
        if(moi.length ==1) {
            moi = '0'+moi
        }
        if(jour.length ==1) {
            jour = '0'+jour
        }
        
        var an = this.day.split('-')[2]
        var heure = this.hours.split(':')[0]
        if(heure.length == 1) {
            heure = "0" + heure
        }
        var minutes = this.hours.split(':')[1]

        if(minutes.length  == 1) {
            minutes = "0" + minutes
        }
        var d = an + '-' + moi + '-' + jour + 'T' + heure + ':' + minutes
        var date =new Date(d)

        var dateWithTimeZone = new Date(an + '-' + moi + '-' + jour + 'T' + heure + ':' + minutes+"Z")
        console.log("DATE WITH TIME ZONE", dateWithTimeZone)
        var numJour = dateWithTimeZone.getUTCDay()
        var dateString =DAY[numJour] + " " + jour + '/' + moi + '/'+ an + ' - ' + heure + "h" + minutes + " à "+DatesHelpers.calculHeureFin(heure,minutes, this.duree)
      
        var joueurs = this.joueursSelectionnes
        db.collection("Defis").doc(id.toString()).set({
            id : id,
            equipeOrganisatrice : this.allDataEquipe.id,
            equipeDefiee : this.equipeAdverse,
            type : this.props.navigation.getParam('type', ' '),
            jour : date,
            duree : this.duree,
            format : this.format,
            organisateur : this.userData.id,
            participants : joueurs,
            defis_valide : false,
            message_chauffe : this.messageChauffe,
            terrain :this.terrain,
            recherche : cherche_adverssaire,
            commentaires : [],
            prix_par_equipe : this.prix,
            dateParse : Date.parse(date),
            absents : [],
            joueursEquipeOrga : joueurs,
            joueursEquipeDefiee : [],
            confirmesEquipeOrga : this.findCapitaines(),
            confirmesEquipeDefiee : [],
            indisponiblesEquipeOrga : [],
            indisponiblesEquipeDefiee : [],
            attenteEquipeOrga : this.buildListOfJoueurWithoutCapitaine(),
            attenteEquipeDefiee : [],
            buteurs : [],
            votes : [],
            scoreRenseigne : false,
            butsEquipeOrganisatrice : 0,
            butsEquipeDefiee : 0,
            scoreConfirme :  false,
            scoreRenseigneParOrga : false,
            scoreRenseigneParDefiee : false,
            defis_refuse : false,
            dateString : dateString,
            attenteValidation: false,
            equipesConcernees : [this.allDataEquipe.id],
            joueursConcernes :this.buildListOfJoueursConcernes()
            

        })
        .then(this.goToFicheDefi(msg, id,this.allDataEquipe,date,this.buildListOfJoueurWithoutCapitaine()))
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

    }



    buildListOfJoueursConcernes(){
        console.log('in build list of joueur')
        var joueursConcernes = []
        for(var i = 0; i < this.joueursSelectionnes.length; i++) {
           joueursConcernes.push(this.joueursSelectionnes[i])

        }
        for(var i = 0; i < this.allDataEquipe.capitaines.length ; i++) {
            if(! joueursConcernes.includes(this.allDataEquipe.capitaines[i])) {
                joueursConcernes.push(this.allDataEquipe.capitaines[i])
            }
        }
        console.log("*************************")
        console.log(joueursConcernes)
        console.log("*************************")

        return joueursConcernes
        
    }

    /**
     * On va stocker une notification pour chaque joueur convoqué
     */
    storeNotificationsInDB(id,date) {
        console.log("in store notif ", date)
        var joueurs =this.joueursSelectionnes
        console.log("JOUEURS TO SEND NOTIFS !!!", joueurs)
        var db = Database.initialisation() 
        var txt = "Le capitaine " + LocalUser.data.pseudo + " de l'équipe " + this.allDataEquipe.nom 
        txt = txt + " t'a convoqué / relancé pour un un défi le " + this.buildDate(date)

        for(var i = 0 ; i < joueurs.length; i ++) {
            if(joueurs[i] != LocalUser.data.id) {
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        defi : id,
                        emetteur :  LocalUser.data.id,
                        recepteur : joueurs[i],
                        time : new Date(),
                        type : Types_Notification.CONVOCATION_RELANCE_DEFI,
                        equipe : this.allDataEquipe.id,
                        texte : txt,
                        heure: DatesHelpers.buildDateNotif(new Date()),
                        show_boutons : true

                    }
                ).catch(function(error) {
                    console.log(error)
                })
            }
        }

    }

    /**
     * Fonction qui sauvegarde dans la db une notification a envoyer à l'équipe
     * défiée si il y'en a une . On va de plus envoyer une notification à chaque capitaine
     */
    async storeNotificationDefiEquipe(id) {
        if(this.equipeAdverse != undefined) {

            // Récupérer les données de l'équipe adversse 
            var equipe = await Database.getDocumentData(this.equipeAdverse, "Equipes")

            // Envoyer la notif à chaque cap
            await this.sendNotifCapAdverses(equipe)
            for(var i = 0; i < equipe.capitaines.length; i++) {
                db.collection("Notifs").add(
                    {
                        dateParse : Date.parse(new Date()),
                        defi : id,
                        emetteur : LocalUser.data.id,
                        equipeEmettrice :  this.allDataEquipe.id,
                        equipeReceptrice : this.equipeAdverse,
                        recepteur : equipe.capitaines[i],
                        time : new Date(),
                        type : Types_Notification.ACCEPTER_DEFIS_CONTRE_EQUIPE,
                        //defis_refuse : false
                    }
                )
            }
            
        }
       
        
    }

    
    findCapitaines() {
        var joueurs =  this.props.navigation.getParam('joueursSelectionnes', [])
        if(joueurs.includes(LocalUser.data.id)) {
            return [LocalUser.data.id]
        } else {
            return []
        }
        /*var capitaines = []

        for(var i = 0 ; i < joueurs.length; i++) {
            if(this.allDataEquipe.capitaines.includes(joueurs[i])) {
                capitaines.push(joueurs[i])
            }
        }
        return capitaines*/
    }

     /**
     */
    _moveEquipe1 = () => {
        Animated.spring(this.equipe1Animation, {
          toValue: {x: 0, y: 0},
        }).start()

    }

     /**
     * Fonction qui permet de déplacer le texte Agoora vers le haut
     */
    _moveEquipe2= () => {
        Animated.spring(this.equipe2Animation, {
          toValue: {x: 0, y: 0},
        }).start()

    }




    calculHeureFin(){
    

        var heure = parseInt(this.hours.split(':')[0]) + Math.trunc(this.duree)

        var minutes =    parseInt(this.hours.split(':')[1]) +  (this.duree -Math.trunc(this.duree)) * 60
        if(minutes >= 60) {
            heure ++
            minutes -= 60
        }
        if(heure >= 24) {
            heure = heure - 24
        }
        if(minutes.toString().length == 1) {
            minutes = '0'+ minutes.toString()
        }
        return heure + ':' + minutes
    }


    texteEntreEquipe() {
        if(this.contreQui == 'rechercher_une_equipe') {
            return(
                <Text style = {[styles.nomEquipe,{alignSelf : "center"}]}> Souhaite défier</Text>
            )
        } else {
            return(                            
                <Text style = {[styles.nomEquipe,{alignSelf : "center"}]}> Cherche une équipe à défier</Text>
            )
        }
    }


    


    //==============================================================================

    renderEquipeAdverse(){
        if(this.contreQui == 'rechercher_une_equipe') {
            return(
                <Animated.View style = {[{flexDirection :'row', alignSelf : "flex-end" , marginRight : wp('5%')}, this.equipe2Animation.getLayout()]}>

                                <Image
                                    source = {{uri : this.state.equipeAdverse.photo}}
                                    style = {styles.photoEquipe}
                                />

                                {/* Nom et score de l'équipe adversse */}
                                <View style = {{justifyContent : "center"}}>

                                    <Text style = {styles.nomEquipe}>{this.state.equipeAdverse.nom}</Text>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        rating={this.state.equipeAdverse.score}
                                        starSize={hp('2.5%')}
                                        fullStarColor='#F8CE08'
                                        emptyStarColor='#B1ACAC'
                                        containerStyle={styles.rating}
                                    />
                                </View>
                </Animated.View>
            ) 
        } else {
            return(
                <View style = {[{borderWidth : 1,alignSelf : "flex-end" , marginRight : wp('5%'), borderRadius : wp('9%')}, styles.photoEquipe]}>

                </View>
            )
        }
        
    }


    renderPrix(){
        if(this.prix != null && this.prix > 0) {
            return(                    
                <Text style = {{marginLeft : wp('3%'), marginTop : hp('2%')}}>Prix par équipe = {this.prix} € (à régler sur place)</Text>
            )
        } else {
            return (
                <Text style = {{marginLeft : wp('3%'), marginTop : hp('2%')}}>Gratuit</Text>
            )
        }
    }


    render() {
        console.log("HOURS ", this.day)
        console.log()
        var jour = this.day.split('-')[0]
        var moi = this.day.split('-')[1]
        if(moi.length ==1) {
            moi = '0'+moi
        }
        if(jour.length ==1) {
            jour = '0'+jour
        }

        
        var an = this.day.split('-')[2]
        var heure = this.hours.split(':')[0]

        if(heure.length == 1) {
            heure = "0" + heure
        }
        var minutes = this.hours.split(':')[1]
      
        var dateDefi = new Date(an + '-' + moi + '-' + jour + 'T' + heure + ':' + minutes+"Z")
        var numJour = dateDefi.getUTCDay()
        var d =DAY[numJour] + " " + jour + '/' + moi + '/'+ an + ' - ' + heure + "h" + minutes + " à "+DatesHelpers.calculHeureFin(heure,minutes, this.duree)
    
        console.log("DATE, ", dateDefi)
        console.log("num day",dateDefi.getUTCDay())
        console.log("=====DATE STRING",d )
        return (
            <ScrollView>
            <View>


                 {/* Bandeau superieur */}
                 <View style = {{backgroundColor : Colors.grayItem, flexDirection : 'row', justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%'), marginBottom : hp('2%')}}>
                    <TouchableOpacity
                        onPress ={() => Alert.alert(
                                '',
                                "Es-tu sûr de vouloir quitter ?",
                                [
                                    {
                                        text: 'Oui',
                                        onPress: () => this.props.navigation.push("AccueilJouer")},
                                    {
                                        text: 'Non',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                            )}>
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>

                    <Text> Récapitulatif </Text>

                    <TouchableOpacity
                        onPress ={() =>{this.saveDefiInDB()}}>
                        <Text style = {styles.txtBoutton}>Valider</Text>
                    </TouchableOpacity>			    
                </View>

                <View style ={{marginTop : hp('4%')}}>
                    <Information_Recapitulatif
                        format = {this.format}
                        heure = {this.hours}
                        jour = {this.day}
                        duree = {this.duree}
                        nomsTerrain = {this.nomsTerrain}
                        pseudo = {this.userData.pseudo}
                    />
                    
                        {/* View contenant les deux équipes */}
                        <View style = {styles.containerEquipes}>

                            {/* Equipe de l'utilisateur */}
                            <Animated.View style = {[{flexDirection :'row', alignSelf : "flex-start",marginLeft : wp('3%')}, this.equipe1Animation.getLayout()]}>

                                <Image
                                    source = {{uri : this.allDataEquipe.photo}}
                                    style = {styles.photoEquipe}
                                />
                                {/* Nom et score de l'équipe de l'utilisateur*/}
                                <View style = {{justifyContent : "center"}}>
                                    <Text style = {styles.nomEquipe}>{this.allDataEquipe.nom}</Text>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        rating={this.allDataEquipe.score}
                                        starSize={hp('2.5%')}
                                        fullStarColor='#F8CE08'
                                        emptyStarColor='#B1ACAC'
                                        containerStyle={styles.rating}
                                    />
                                </View>
                            </Animated.View>

                            {this.texteEntreEquipe()}
                            {/* Equipe adverse */}
                            {this.renderEquipeAdverse()}
                        </View>

                        {this.renderPrix()}

                        {/* Message de chauffe*/}
                        <Text style = {styles.txt_message_chauffe}>{this.messageChauffe}</Text>
                </View>
            </View>
            </ScrollView>
        )
    }
}

const styles  = {
    
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },

    separateur : {
        alignSelf : "center",
        marginBottom : hp('2%')
    },
    photo_terrain : {
        //marginLeft : wp('3%'),
        marginRight : wp('3%'),
        width : wp('16%'), 
        height : wp('16¨%') 
    },

    infoDefis : {
        alignSelf : "center",
        fontSize : RF(2.2)
    },

    nomTerrains : {
        fontSize : RF(2.2)
    },

    photoEquipe : {
        width : wp('18%'),
        height :wp('18%'),
        marginLeft : wp('2%'),
        marginRight : wp('2%'),
        marginTop : hp('1%'),
        marginBottom : hp('1%')
    },
    rating: {
        width: 40,
    },

    nomEquipe : {
        fontSize : RF(2.3)
    },
    containerEquipes : {
        borderWidth : 1,
        borderRadius : 5,
        marginTop : wp('5%'), 
        marginLeft : wp('3%'),
        marginRight : wp('3%'), 
        paddingTop : hp('2%'), 
        paddingBottom : hp('2%')
    },

    txt_message_chauffe : {
        fontSize : RF(2.6),
        fontStyle : 'italic',
        marginTop : hp('5%'),
        alignSelf : "center"
    }

}
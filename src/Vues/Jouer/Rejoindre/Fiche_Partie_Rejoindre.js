import React from 'react'

import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity,FlatList,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../../Data/Database';
import { connect } from 'react-redux'
const DAY = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
import Terrains from '../../../Helpers/Toulouse.json'
import actions from '../../../Store/Reducers/actions'
import Color from '../../../Components/Colors';
import StarRating from 'react-native-star-rating'
import { ScrollView } from 'react-native-gesture-handler';
import Joueur_Pseudo_Score from '../../../Components/ProfilJoueur/Joueur_Pseudo_Score'
import LocalUser from '../../../Data/LocalUser.json'
import { StackActions, NavigationActions } from 'react-navigation';


// Rememttre à Zéro le stack navigator pour empecher le retour en arriere
const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [
      NavigationActions.navigate({ routeName: 'AccueilJouer' }),
    ],
});



/**
 * Classe qui va permettre d'afficher les informations d'une partie et permettre à l'utilisateur
 * d'y participer.
 */
class Fiche_Partie_Rejoindre extends React.Component {
    
    constructor(props) {
        super(props)
        this.pseudo = LocalUser.data.pseudo
        this.monId = LocalUser.data.id
        console.log("in constructeur")
       /* this.format  = this.props.navigation.getParam('format', '')
        this.nbJoueursRecherche =  this.props.navigation.getParam('nbJoueursRecherche', '')
        this.jour = this.buildDate(this.props.navigation.getParam('jour', ''))
        this.heure = this.buildHeure(this.props.navigation.getParam('jour', ''))
        this.duree = 2
        this.messageChauffe  =this.props.navigation.getParam('message_chauffe', '') 
        this.terrain = this.props.navigation.getParam('terrain', '')
        */
        this.joueurAnimation = new Animated.ValueXY({ x: -wp('100%'), y:0 })
        //this.ChangeThisTitle( "Partie " + this.buildDate(this.props.navigation.getParam('jour', '')))
        
        this.state = {
           // dataJoueurs : this.props.navigation.getParam('joueursWithData', ''),

            partie : undefined, 
            isLoading : true,
            InsNom : "inconnu",
            EquNom : 'inconnu',
            N_Voie : "",
            Voie : "inconu",
            CodePostal : "inconu",
            Ville : "inconu",
            joueursData : []
            // Infos du défis qu'on va obtenir quand on reviens de la page ajout de joueur
            /*pseudo = "inconu",
            format = "inconu",
            nbJoueursRecherche = 0,
            jour = this.buildDate(new Date()),
            heure = this.buildHeure(new Date()),
            duree = 0,
            messageChauffe  = "inconu",
            terrain = "inconu",
            joueursId =   []   */      

        }
    }

    


    static navigationOptions = ({ navigation }) => {
        if(! navigation.getParam("retour_arriere_interdit",false)) {
            const {state} = navigation;
            return {
            title: `${state.params.title}`,
            };
        } else {
            const {state} = navigation;
            return { title: `${state.params.title}`, 
            headerLeft: (

               <TouchableOpacity
                onPress = {() =>navigation.dispatch(resetAction)} >
                   <Image
                    style = {{width : 20, height : 20, marginLeft :15}}
                    source = {require('../../../../res/right-arrow-nav.png')}
                   />
               </TouchableOpacity>
              ),
                };
        }
      };
      
    ChangeThisTitle = (titleText) => {
         const {setParams} = this.props.navigation;
          setParams({ title: titleText })
    }


    componentDidMount(){
            // this.rechecherJoueurManquant()
        this.downloadAllDataPartie()  
        this._moveJoueur()
    }

    buildDateString(datetoChange) {
        var date = datetoChange
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        var heure = date.getHours()

        var minute = (date.getMinutes()).toString()
        if(minute.length == 1) {
            minute = '0' + minute 
        }
        var heureFin = this.calculHeureFin(heure,minute,this.state.partie.duree)

        return DAY[j] + ' ' + numJour  + '/' + mois + '/' + an + ' - ' +  heure + 'h' +minute + ' à ' + heureFin
    }

    calculHeureFin(heure,minutes, duree){
    

        var heure = parseInt(heure) + Math.trunc(duree)

        var minutes =    parseInt(minutes) +  (duree -Math.trunc(duree)) * 60
        if(minutes >= 60) {
            heure ++
            minutes -= 60
        }
        if(minutes.toString().length == 1) {
            minutes = '0'+ minutes.toString()
        }
        return heure + 'h' + minutes
    }


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

    buildHeure(date) {
        var d = date.split(' - ')
        var h = d[1]
        var min = h.split('h')[1].substring(0,2)
        
        return h.split('h')[0] + ':' + min
    }


    /**
     * Fonction qui va permettre de télécharger toutes les données de la partie.
     * On va l'utiliser quand on reviens de la page "ajout de joueurs" car on a 
     * plus accès au props 
     */
    async downloadAllDataPartie() {

        var id = this.props.navigation.getParam('id', 'erreur')
        var partie = await Database.getDocumentData(id,"Defis")
        this.findTerrain(partie.terrain)
        var joueursData = await Database.getArrayDocumentData(partie.participants, "Joueurs")
        
        

        this.setState({partie : partie , isLoading : false,joueursData :joueursData })
        
        this.ChangeThisTitle('Partie ' + this.buildDate(new Date(this.state.partie.jour.seconds * 1000)))

    }

    /**
     * Fonction qui va permettre de renvoyer une liste d'id correspondant au joueurs present
     * @param {list d'objet {id : String , presence : String}} array 
     */
    buildListOfId(array) {
        var j = []
        for(var i = 0; i <array.length; i++) {
            j.push(array[i].id)
        }
        return j
    }

    /**
     * Fonction qui va permettre de construire la liste pour la flatList 
     * On rajoute un champs presence aux données des joueurs
     * @param {Liste de joueur} arrayJoueur 
     * @param {list d'objet {id : String , presence : String}} arrayParticipation 
     */
    buildListforFlatList(arrayJoueur, arrayParticipation) {
        console.log("arrayParticipation.length : ", arrayParticipation.length)
        var j = []
        for(var i = 0; i <arrayJoueur.length; i++) {
            var joueur = arrayJoueur[i]
            for(var j = 0; j < arrayParticipation.length ; j++) {
                if(arrayJoueur[i].id == arrayJoueur[j].id) {
                    joueur.presence = arrayParticipation[j]
                    j.push(joueur)
                    break
                }

            }
            
        }
        return j 
    }

    findTerrain(id) {
        for(var i  = 0 ; i < Terrains.length ; i ++) {
            if(Terrains[i].id == id) {
                this.setState({
                    InsNom : Terrains[i].InsNom,
                    EquNom : Terrains[i].EquNom,
                    N_Voie : Terrains[i].N_Voie,
                    Voie : Terrains[i].Voie,
                    CodePostal :Terrains[i].CodePostal,
                    Ville :Terrains[i].Ville,
                })
            } 
        }
    }



    handlePressRejoindre(){
        
        Alert.alert(
            '',
            'Tu souhaites rejoindre cette partie',
            [
              {text: 'Confirmer', 
                    onPress: () => {
                        const action = { type: actions.STORE_PARTICIPANTS_PARTIE, value:  this.state.partie.participants}
                        this.props.dispatch(action)
                        const action2 = { type: actions.STORE_NB_JOUEURS_RECHERCHES_PARTIES, value:  this.state.partie.nbJoueursRecherche}
                        this.props.dispatch(action2)

                        this.props.navigation.push("ChoixJoueursPartie",
                        {
                            ajout_Partie_existante : true,
                            id_partie :  this.props.navigation.getParam('id', ''),
                            enAttente : this.state.partie.attente,
                            inscris : this.state.partie.inscris,
                            invite : false                          // Si c'est le créateur qui invite
                        })
                    }
            },
              {
                text: 'annuler',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
            {cancelable: true},
          );
    }



    /**
     * Fonction qui permet de déplacer le joueurs
     */
    _moveJoueur= () => {
        Animated.spring(this.joueurAnimation, {
          toValue: {x: 0, y: 0},
        }).start()

    }




    /** Fonction qui va permettre de sauvegarder la liste des joueurs 
     *  présent dans le state gloabal
     */
    storePlayerInGlobalState() {     
        console.log("in presence joueurs")
   
        const action = { type: actions.STORE_JOUEURS_INVITES, value: this.state.joueursData}
        this.props.dispatch(action)
    }

    /** Fonction qui va permettre de sauvegarder la partie dans le 
     *  state gloabal
     */
    storePartieInGlobalState() {
        const action = { type: actions.STORE_ALL_DATA_PARTIE, value: this.state.partie}
        this.props.dispatch(action)
    }



    


    /**
     * Fonction qui renvoie les données du joueurs à partir de son id. 
     * On ne va pas chercher les données depuis la DB car on les a deja.
     * @param {String} id 
     */
    findPlayerFromId(id) {
        for(var i = 0; i < this.state.joueursData.length; i++) {
            console.log(this.state.joueursData[i].id)
            if(this.state.joueursData[i].id == id) {
                return this.state.joueursData[i]
            }
        }
        return undefined
    }


    /**
     * Fonction qui renvoie l'objet ayant le maximul d'occurence d'un 
     * élément dans un array.
     */
    maxOccurence(array){
        if(array.length == 0)
            return null;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }
    /**
     * Fonction qui va parcourir la liste des votants et renvoyer le ou les joueurs
     * ayant recolté le plus de vote (les si égalité)
     */
    findHommeDuMatch() {
        
        var joueursVotes = []
        console.log(this.state.partie.votes)
        for(var i = 0; i < this.state.partie.votes.length ; i++) {
            var vote = this.state.partie.votes[i]
            console.log("vote = ", vote)
            joueursVotes.push(vote.idVote)
        }
        console.log("Joueur vote = ", joueursVotes)

        // id qui a le plus d'occurence (donc celui ayant le plus de vote)
        var idHommeMatch =  this.maxOccurence(joueursVotes);
        
        console.log("id homme match = ", idHommeMatch)
        // Trouver le joueur associé à l'id
        return this.findPlayerFromId(idHommeMatch)
        
    }

    /**
     * Fonction qui renvoie true si on a deja voté pour ce joueurs
     * @param {Liste des joueurs ayant deja un vote : {id : String, nbVotes : int } liste} joueurs 
     * @param {Vote : {idVotant : String, idVote : String}} vote  
     */
    aDejaUnVote(joueurs, vote) {
        for(var j = 0; j < joueurs.length; j ++) {
            if(joueurs[i].id == vote.idVote){
               return true
            }
        }
        return false
    }

    
    _renderItem = ({item}) => {

        var color  = "white"
        if(this.state.partie.confirme.includes(item.id)) {
            color = "#13C840"
        } else if(this.state.partie.attente.includes(item.id)) {
            color = "#C0C0C0"
        }
        if(! this.state.partie.indisponibles.includes(item.id)) {
            return(
                <Animated.View style = {this.joueurAnimation.getLayout()}>
                    <Image
                        source = {{uri : item.photo}}
                        style = {{width : wp('15%'), height : wp('15%'), borderRadius : wp('7%'), marginRight : wp('2%'), marginTop : hp('1%'), marginLeft : wp('1%'), borderWidth : 3, borderColor : color}}/>
                </Animated.View>
              
            )
        }        
    }

    

    _renderBtnRejoindre(){
        if(! this.state.partie.participants.includes(this.monId))  {
            return(
                <TouchableOpacity 
                            style = {styles.btnRejoindre}
                            onPress = {() => this.handlePressRejoindre()}>
                            <Text>S'inscrire</Text>
                </TouchableOpacity>
            )
        }else {
            return(
                <View>
                    <TouchableOpacity 
                            style = {styles.btn_feuille_de_match}
                            onPress = {() => { 
                                    var date = new Date( this.state.partie.jour.seconds * 1000)
                                    if(date > new Date()) {
                                        this.props.navigation.push("FeuillePartieAVenir", 
                                            { 
                                                partie : this.state.partie,
                                                joueurs : this.state.joueursData
                                            }
                                        )
                                    } else {
                                        this.storePlayerInGlobalState()
                                        this.storePartieInGlobalState()
                                        this.props.navigation.push("FeuillePartiePassee", 
                                            { 
                                                partie : this.state.partie,
                                                joueurs : this.state.joueursData
                                            }
                                        )
                                    }
                            }}
                            >
                            <Text>Feuille de match</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    //=====================================================================
    //=========================== FONCTIONS SI PARTIE PASSEE ==============
    //=====================================================================


    /**
     * Fonction qui permet d'afficher un item représentant un buteur
     */
    _renderItemButeur = ({item}) => {
        console.log("in render item buteurs")
        var joueur = this.findPlayerFromId(item.id)
        console.log(joueur.pseudo)
        if(joueur != undefined && item.nbButs > 0) {
            return(
           
                <View style = {styles.containerItemJoueur}>
    
                    <Joueur_Pseudo_Score
                        photo = {joueur.photo}
                        pseudo = {joueur.pseudo}
                        score = {joueur.score}
                    />


                    {/* View contenant le cercle de couleur */}
                    <View style = {styles.containerCircle}>
                    
                        <View style = {{alignSelf : "flex-end"}}>
                            <Text style  = {{marginRight : wp('8%')}}>{item.nbButs}</Text>
                        </View>
                    </View> 
    
                </View>
            )
        } else {
            return(
                <View>
                </View>
            )
        }
        

    }

    _renderHommesMatch(joueur) {

        console.log("in render hommemATCH")
        if(joueur != undefined) {

            // Trouver le nbr de vote pour le joueur
            var nbVote = 0
            for(var i = 0; this.state.partie.votes.length; i++) {
                if(this.state.partie.votes[i].id == joueur.id) {
                    nbVote ++
                }
            }
            console.log(nbVote)

            return(
           
                <View>
                    <View style = {styles.containerItemJoueur}>
        
                        <Image
                            source = {{uri : joueur.photo}}
                            style = {styles.photoJoueur}
                        /> 

                        {/* View contenant le pseudo est le score*/}
                        <View style = {{justifyContent : "center"}}>
                            <Text>{joueur.pseudo}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={joueur.score}
                                starSize={hp('2.2%')}
                                fullStarColor='#F8CE08'
                                emptyStarColor='#B1ACAC'
                            />
                        </View>                     
        
                    </View>

                    {/* Chiffre du vote */}
                    <Text style = {{marginLeft : wp('10%'), marginTop : -hp('1%')}}> {nbVote} voix sur {this.state.partie.votes.length} votant(s)</Text>
                </View>
            )
        }
    }

    /**
     * Fonction qui permet d'afficher les butteurs si la partie est passée et 
     * si la feuille de match a été complétée.
     */
    _renderListButeurs() {
        var date = new Date( this.state.partie.jour.seconds * 1000)
        if(date < new Date()) {
            console.log(this.state.partie.buteurs)
            // Si les buteurs ont été renseignés
            if(this.state.partie.buteurs.length > 0) {
                return(
                    <View>
                        <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Buteurs : </Text>
                        <FlatList
                            data = {this.state.partie.buteurs}
                            renderItem = {this._renderItemButeur}
                        />
                    </View>
                ) 

            } else {
                return(
                    <View>
                        <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Buteurs : Non renseigné </Text>
                         
                    </View>
                ) 
            }
           
        } else {
            return (
                <View>
                </View>
            )
        }
    }


     /**
     * Fonction qui permet d'afficher les Hommes du match si la partie est passée et 
     * si la feuille de match a été complétée.
     */
    _renderHommesMatch() {
        var date = new Date( this.state.partie.jour.seconds * 1000)
        
        if(date < new Date()) {
            // Si les buteurs ont été renseignés
            if(this.state.partie.votes.length > 0) {
                var joueur = this.findHommeDuMatch()
                console.log(joueur.id)
                // Trouver le nbr de vote pour le joueur
                var nbVote = 0
                for(var i = 0; i < this.state.partie.votes.length; i++) {
                    if(this.state.partie.votes[i].idVote == joueur.id) {
                        nbVote ++
                    }
                }
                return(
                    <View>
                        <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Homme du match : </Text>
                        <View style = {styles.containerItemJoueur}>
        
                            <Image
                                source = {{uri : joueur.photo}}
                                style = {styles.photoJoueur}
                            /> 

                            {/* View contenant le pseudo est le score*/}
                            <View style = {{justifyContent : "center"}}>
                                <Text>{joueur.pseudo}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={joueur.score}
                                    starSize={hp('2.2%')}
                                    fullStarColor='#F8CE08'
                                    emptyStarColor='#B1ACAC'
                                />
                            </View>  
                        </View>
                        <Text style = {{marginLeft : wp('10%'), marginTop : -hp('1%')}} >{nbVote} voix sur {this.state.partie.votes.length} vote(s)</Text>

                    </View>
                ) 

            } else {
                return(
                    <View>
                        <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Homme du match : Non renseigné </Text>
                         
                    </View>
                ) 
            }
           
        } else {
            return (
                <View>
                </View>
            )
        }
    }



    //==============================================================================
    
    /**
     * Fonction qui permet d'afficher le nbr de joueurs recherchés
     */
    renderTextNBJoueurRecherches() {
        if(this.state.partie.nbJoueursRecherche == 0) {
            return (
                <Text style = {styles.textJoueursRecherche}>Complet</Text>
            )
        } else if(this.state.partie.nbJoueursRecherche == 1) {
            return(
                <View>
                    <Text style = {styles.textJoueursRecherche}>1 joueur recherché</Text>
                </View>
            )
        } else {
            return(
                <View>
                    <Text style = {styles.textJoueursRecherche}> {this.state.partie.nbJoueursRecherche} joueurs recherchés</Text>
                </View>
            )
        }
    }


    displayRender() {
        if(this.state.isLoading) {
            return (
                <View>
                    <Text>Patientez quelques secondes...</Text>
                </View>
            )
        } else {
            var seconds =this.state.partie.jour.seconds
            var date = this.buildDateString(new Date(seconds* 1000))
            
            return(
                
                <View style = {{marginTop : hp('4%')}}>
                    <ScrollView> 
                        <View>  
                            <View>
                                {/* Information sur le defi */}
                                <Text style = {styles.infoDefis}> Partie {this.state.partie.format} par {this.pseudo}</Text>
                                <Text style = {styles.separateur}>_____________________________________</Text>
                                <Text style = {styles.infoDefis}> {date}</Text>
                                <Text style = {styles.separateur}>_____________________________________</Text>

                                {/* View contenant l'icon terrain et son nom*/}
                                <View style = {{flexDirection : 'row', marginTop : hp('2%'), marginLeft : wp('8%')}}>
                                    <Image
                                        source = {require('../../../../res/terrain1.jpg')}
                                        style = {styles.photo_terrain}
                                    />
                                    {/* InsNom et EquNom du terrain */}
                                    <View style = {{width : wp('70%'), justifyContent:'center'}}>
                                        <Text style = {styles.nomTerrains}>{this.state.InsNom}</Text>
                                        <Text style = {styles.nomTerrains}>{this.state.N_Voie} {this.state.Voie}</Text>
                                        <Text style = {styles.nomTerrains}>{this.state.CodePostal} {this.state.Ville}</Text>

                                    </View>
                                </View>
                            </View>

                            <View style = {styles.containerJoueurs}>
            
                                {/* Liste des joueurs */}
                                <FlatList
                                    data = {this.state.joueursData}
                                    renderItem = {this._renderItem}
                                    numColumns={5}
                                    keyExtractor={(item) => item.id}
                                
                                />

                                {/* Texte indiquant le nombre de joueurs recherchés*/}
                                {this.renderTextNBJoueurRecherches()}
                                                            
                                {/*Bouton pour rejoindre la partie */}
                                {this._renderBtnRejoindre()}
                            </View>
                                
                            {/* Les buteurs */}
                            {this._renderListButeurs()}

                            {/* Les hommes du matchs*/}
                            {this._renderHommesMatch()}


                             <Text style = {styles.txt_message_chauffe}>{this.state.partie.message_chauffe}</Text>
                        </View>
                    </ScrollView>

                </View>
            )
        }
    }
    render() { 

        return(
            <View>
                {this.displayRender()}
            </View>
        )
    }
}

const styles = {
    containerJoueurs : {
        borderWidth : 1,
        borderRadius : 5,
        marginTop : wp('5%'), 
        marginLeft : wp('3%'),
        marginRight : wp('3%'), 
        paddingTop : hp('2%'), 
        paddingBottom : hp('2%'),
        paddingLeft : wp('3%')
    },

    textJoueursRecherche : {
        textAlign: 'right',
        marginRight : wp('3%')
    },

    btnRejoindre : {
        alignSelf : "center",
        paddingHorizontal : wp('2%'),
        paddingVertical : hp('2%'),
        borderRadius : 15,
        borderWidth  : 1
    },
    
    txt_message_chauffe : {
        fontSize : RF(2.7),
        fontStyle : 'italic',
        marginTop : hp('5%'),
        alignSelf : "center",
        marginBottom : hp('3%')
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
    btn_feuille_de_match : {
        alignSelf : "center",
        paddingHorizontal : wp('15%'),
        paddingVertical : hp('2%'),
        borderRadius : 15,
        borderWidth  : 1,
        backgroundColor : Color.gold
    },
    containerItemJoueur : {
        flexDirection : 'row',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginLeft : wp('3%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6
    },

    photoJoueur : {
        width : wp('16%'), 
        height : wp('16%'), 
        borderRadius : wp('8%'),
        marginRight : wp('3%')
    },
    containerCircle : {
        flex: 1,
        justifyContent: 'center',
    },
}

const mapStateToProps = (state) => {
    return{ 
        JoueursParticipantsPartie : state.JoueursParticipantsPartie,
        nbJoueursRecherchesPartie : state.nbJoueursRecherchesPartie,
    } 
}
export default connect(mapStateToProps) (Fiche_Partie_Rejoindre)
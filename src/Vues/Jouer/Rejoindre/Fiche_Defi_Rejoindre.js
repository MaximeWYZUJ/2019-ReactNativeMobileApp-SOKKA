import React from 'react'

import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity,FlatList,Alert,ScrollView,Picker} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../../Data/Database'
const DAY = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Terrains from '../../../Helpers/Toulouse.json'
import {SkypeIndicator} from 'react-native-indicators';
import Equipe_Nom_Score from '../../../Components/Profil_Equipe/Equipe_Nom_Score'
import Color from '../../../Components/Colors';
import { connect } from 'react-redux'
import actions from '../../../Store/Reducers/actions'
import Joueur_Pseudo_Score from '../../../Components/ProfilJoueur/Joueur_Pseudo_Score';
import LocalUser from '../../../Data/LocalUser.json'

/**
 * Classe qui va permettre d'afficher les informations d'un défi et permettre à l'utilisateur
 * d'y participer si il est capitaine d'une équipe.
 */
class Fiche_Defi_Rejoindre extends React.Component {

    constructor(props) {
        super(props)
        this.idDefi = this.props.navigation.getParam('id','erreur')
        this.equipe1Animation = new Animated.ValueXY({ x: -wp('100%'), y:0 })
        this.equipe2Animation = new Animated.ValueXY({ x: wp('100%'), y:0 })
        this.userData = {
            id : LocalUser.data.id ,
            isCapitaine : true
        }




        this.state = {
            defi : this.props.navigation.getParam('defi',undefined), 
            isLoading : true,
            InsNom : " ",
            N_Voie : ' ',
            Voie : ' ',
            CodePostal : ' ',
            Ville : ' ',
            organisateur : undefined,
            equipeOrganisatrice : this.props.navigation.getParam('equipeOrganisatrice',undefined),
            equipeDefiee : this.props.navigation.getParam('equipeDefiee',undefined),
            show_equipe : false,
            equipes : [],
            buteurDefiee : [],
            buteurOrga: [],
            hommeOgra : undefined,
            hommeDefiee: undefined,
            nbVotantOrga : 0,
            nbVotantDefiee : 0
        }
    }

  

    componentDidMount() {
        this.findTerrain(this.state.defi.terrain)
        this.ChangeThisTitle('Defi ' +this.buildDate(new Date(this.state.defi.jour.seconds * 1000)))

        //this.downloadAllDataDefi()
        this._moveEquipe1()
        this._moveEquipe2()
        this.getButeurs()
        this.getHommeMatch()
        this.setState({isLoading : false})
    }

    static navigationOptions = ({ navigation }) => {
        const {state} = navigation;
        return {
            title: `${state.params.title}`,
        };
    };
      

    ChangeThisTitle = (titleText) => {
        const {setParams} = this.props.navigation;
        setParams({ title: titleText })
    }


  



    /**
     * Fonction qui permet de trouver les noms du terrains correspondant à 
     * celui sur lequel est organisé le défi.
     */
    findTerrain(id) {
        for(var i  = 0 ; i < Terrains.length ; i ++) {
            if(Terrains[i].id == id) {
                this.setState({
                    InsNom : Terrains[i].InsNom,
                    N_Voie : Terrains[i].N_Voie,
                    Voie : Terrains[i].Voie,
                    CodePostal : Terrains[i].CodePostal,
                    Ville : Terrains[i].Ville
                })
            } 
        }
    }



    /**
     * Fonction qui permet de construire un String représentant la date du défi pour 
     * l'afficher dans la vue
     * ex : Dimanche 28/04/2019 - 17h à 19h
     * @param {Date} date 
     */
    buildDateString(date) {
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
            minute = '0' + mois 
        }
        var heureFin = this.calculHeureFin(heure,minute,this.state.defi.duree)

        return DAY[j] + ' ' + numJour  + '/' + mois + '/' + an + ' - ' +  heure + 'h' +minute + ' à ' + heureFin
    }



    /**
     * Fonction qui permet de calculer l'heure de fin d'un défi
     * @param {String} heure 
     * @param {String} minutes 
     * @param {String} duree 
     */
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
     * Fonction qui permet d'enregister la participation dans la db. 
     * On enregistre l'id de l'équipe dans le champ equipeDefiee. Si 
     * l'organisateur ne souhaite pas jouer contre cette équipe il faudra 
     * juste la suppr. On ajoute de plus l'id du joueur dans la liste des 
     * joueurs de l'équipe défiée.
     */
    saveParticipationInDb(idEquipe) {
        
        var db = Database.initialisation()

        var defiRef = db.collection("Defis").doc(this.state.defi.id)
        defiRef.update({
            equipeDefiee : idEquipe,
            recherche : false,
            joueursEquipeDefiee : [this.userData.id]
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }



  

    /**
     * Fonction qui va permettre à l'utilisateur de relever le defi. Si il 
     * n'est pas capitaine alors il y aura une alerte, sinon on lui propose
     * avec quelle équipe il veut relever le défi. 
     */
    releverLeDefi() {
        this.setState({show_equipe : true})
        // Rechercher les équipes dont il est capitaine (à voir si limite le nbr de résultat)
        var equipesArray = []
        var db = Database.initialisation()

        var ref = db.collection("Equipes");
        console.log("in relever Defi !! ")
        // Query sur les partie
        var query = ref.where("capitaines", "array-contains", this.userData.id)
        query.get().then(async (results) => {
            var equipes = []
            console.log("docs length : ", results.docs.length)
            for(var i = 0; i < results.docs.length ; i++) {
                equipes.push(results.docs[i].data())
            }
            this.setState({equipes : equipes, show_equipe : true})

            console.log("after query")
        })
    }


    /**
     * Fonction qui permet de fair bouger l'équipe organisatrice 
     */
    _moveEquipe1 = () => {
        Animated.spring(this.equipe1Animation, {
          toValue: {x: 0, y: 0},
        }).start()

    }

    /**
     */
    _moveEquipe2 = () => {
        Animated.spring(this.equipe2Animation, {
          toValue: {x: 0, y: 0},
        }).start()

    }


    /**
     * Fonction qui renvoie la liste des buteurs du défi et les mets dans les bon 
     * objets du state (buteursOrga ou buteurDefi)
     */
    async getButeurs() {
        var buteurOrga = []
        var buteurDefiee = []
        for(var i =0; i < this.state.defi.buteurs.length; i++) {
            if(this.state.defi.joueursEquipeOrga.includes(this.state.defi.buteurs[i].id)) {
                var j = await Database.getDocumentData(this.state.defi.buteurs[i].id, "Joueurs")
                // Ajout du nombre de but
                j.nbButs = this.state.defi.buteurs[i].nbButs
                buteurOrga.push(j)
            } else {

                var j = await Database.getDocumentData(this.state.defi.buteurs[i].id, "Joueurs")
                // Ajout du nombre de but
                j.nbButs = this.state.defi.buteurs[i].nbButs
                buteurDefiee.push(j)
            }
        }
        this.setState({buteurDefiee : buteurDefiee, buteurOrga : buteurOrga})
    }


    /**
     * Fonction qui permet de trouver les hommes du match de chaque équipe et
     * qui met à jour le state
     */
    async getHommeMatch() {
        console.log("in get homme match")
        var votesOrga = []
        var votesDefiee = []
        var nbVotantDefiee = 0
        var nbVotantOrga = 0
        //Trier les votes en fonction de l'équipe concernée 
        for(var i = 0 ; i < this.state.defi.votes.length ; i++) {
            if(this.state.defi.joueursEquipeOrga.includes(this.state.defi.votes[i].idVote)) {
                votesOrga.push(this.state.defi.votes[i].idVote)
                nbVotantOrga = nbVotantOrga +1
            } else {
                votesDefiee.push(this.state.defi.votes[i].idVote)
                nbVotantDefiee = nbVotantDefiee +1
            }
        }

        // Trouver les hommes du matchs des deux équipes
        var idOrga = this.maxOccurence(votesOrga)
        var hommeOgra = undefined

        if(idOrga != undefined) hommeOgra = await Database.getDocumentData(idOrga, "Joueurs")
        var idDefie = this.maxOccurence(votesDefiee)
        var hommeDefiee = undefined
        if(idDefie != undefined) hommeDefiee = await Database.getDocumentData(idDefie, "Joueurs")
        
        this.setState({hommeOgra : hommeOgra, hommeDefiee : hommeDefiee, nbVotantDefiee : nbVotantDefiee,nbVotantOrga : nbVotantOrga })
    }

  

    /**
     * Fonction qui renvoie l'objet ayant le maximul d'occurence d'un 
     * élément dans un array.
     */
    maxOccurence(array){
        if(array.length == 0)
            return undefined;
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
     * Fonction appelée après le click par l'utilisateur sur un de ses équipe, elle
     * va permettre de séléctionner l'équipe passée en param pour relever le défi.
     */
    chooseEquipe(equipe) {
        this.setState({equipeDefiee : equipe, show_equipe : false})
    }


    /**
     * Fonction qui va permettre de se rendre sur la feuille de match du défi
     * si il est passé. La fonction va de plus sauvegarder la liste des joueurs
     * de l'équipe de l'utilisateur dands le state global
     */
    async goToFeuilleDefiPasse() {
        var joueurs = []
        var equipe = undefined
        var presents = []

        if(this.state.equipeOrganisatrice.joueurs.includes(this.userData.id)) {
            joueurs = this.state.defi.joueursEquipeOrga
            equipe = this.state.equipeOrganisatrice
            presents = this.state.defi.confirmesEquipeOrga
        } else if(this.state.equipeDefiee != undefined && this.state.equipeDefiee.joueurs.includes(this.userData.id)) {
            joueurs=  this.state.defi.joueursEquipeDefiee
            equipe = this.state.equipeDefiee
            presents = this.state.defi.confirmesEquipeDefiee
        }
        const action = { type: actions.STORE_LISTE_JOUEURS_DEFI, value: joueurs}
        this.props.dispatch(action)

        const actionDefi = { type: actions.STORE_ALL_DATA_DEFI, value: this.state.defi}
        this.props.dispatch(actionDefi)

        const actionEq = { type: actions.STORE_EQUIPE_USER, value: equipe}
        this.props.dispatch(actionEq)

        var joueurs = await  Database.getArrayDocumentData(joueurs, "Joueurs")
        const actionDataJ = { type: actions.STORE_DATA_JOUEURS_DEFI, value: joueurs}
        this.props.dispatch(actionDataJ)

        const actionPresent = {type : actions.STORE_JOUEURS_PRESENT, value : presents}
        this.props.dispatch(actionPresent)


        this.props.navigation.push("FeuilleDefiPasse", {
            defi : this.state.defi,
            equipeOrganisatrice : this.state.equipeOrganisatrice,
            equipeDefiee : this.state.equipeDefiee
        })    }
    

        
        
    /**
     * Fonction qui renvoie les données du joueurs à partir de son id. 
     * On ne va pas chercher les données depuis la DB car on les a deja.
     * @param {String} id 
     */
    findPlayerFromId(id) {
        for(var i = 0; i < this.state.joueursData.length; i++) {
            if(this.state.joueursData[i].id == id) {
                return this.state.joueursData[i]
            }
        }
        return undefined
    }


    //=====================================================================
    //=========================== FONCTIONS SI DEFI PASSEE ==============
    //=====================================================================


    /**
     * Fonction qui permet d'afficher un item représentant un buteur de l'équipe 
     * organisatrice
     */
    _renderItemButeurOrga = ({item}) => {
        return(
            <View style = {{flexDirection : 'row', justifyContent : "center",alignsItems : 'center'}}>
                <Joueur_Pseudo_Score
                    pseudo = {item.pseudo} 
                    score = {item.score}
                    photo = {item.photo}
                    id = {item.id}
                    tailleImageJoueur = {wp('12%')}
                    data = {item}

                />
                <View style  = {{alignItems:'center', justifyContent:'center'}}>
                    <Text style = {{justifyContent : "center"}}>{item.nbButs}</Text>
                </View>
            </View>
        )

    }

    /**
     * Fonction qui permet d'afficher un item représentant un buteur de l'équipe 
     * défiee
     */
    _renderItemButeurDefiee = ({item}) => {
        return(
            <View style = {{flexDirection : 'row', justifyContent : "center",alignsItems : 'center'}}>
                <View style  = {{alignItems:'center', justifyContent:'center'}}>
                    <Text style = {{justifyContent : "center"}}>{item.nbButs}</Text>
                </View>

                <Joueur_Pseudo_Score
                    pseudo = {item.pseudo} 
                    score = {item.score}
                    photo = {item.photo}
                    id = {item.id}
                    tailleImageJoueur = {wp('12%')}
                    data = {item}
                />
    
            </View>
        )

    }

    
    /**
     * Fonction qui permet d'afficher les butteurs si la partie est passée et 
     * si la feuille de match a été complétée.
     */
    _renderListButeurs() {
        var date = new Date( this.state.defi.jour.seconds * 1000)
        if(date < new Date()) {
            if(this.state.isLoading) {
                return (
                    <View style = {{marginTop : hp('8%')}}>
                        {/* Indicateur de chargement */}
                        <SkypeIndicator 
                            color='#52C7FD'
                            size = {hp('10%')} />
                    </View>
                )
                } else {

                    // Si les buteurs ont été renseignés
                if(this.state.defi.buteurs.length > 0) {
                    return(
                        <View>
                            <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Buteurs : </Text>
                            
                            {/* View contenant les buteurs*/}
                            <View style = {{flexDirection : 'row', justifyContent : "space-between"}}>

                                {/* View qui contient les buteurs de l'équipe organisatrice */}
                                <View>
                                    <FlatList
                                        data = {this.state.buteurOrga}
                                        renderItem = {this._renderItemButeurOrga}
                                        keyExtractor={(item) => item.id}
                                    />
                                </View>
                                {/* Séaparation */}
                                <View style = {{width : wp('1%'), backgroundColor : 'black'}}/>

                                {/* View qui contient les buteurs de l'équipe Défiée */}
                                <View>
                                    <FlatList
                                        data = {this.state.buteurDefiee}
                                        renderItem = {this._renderItemButeurDefiee}
                                        keyExtractor={(item) => item.id}
                                    />
                                </View>
                            </View>
                        </View>
                    ) 

                } else {
                    return(
                        <View>
                            <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Buteurs : Non renseigné </Text>
                            
                        </View>
                    ) 
                }
            }
           
        } else {
            return (
                <View>
                </View>
            )
        }
    }



    /**
     * Fonction qui affiche un seul homme du match
     * @param {*} joueur
     */
    _renderHomme(joueur) {

        if(joueur != undefined) {
            // Trouver le nbr de vote pour le joueur
            var nbVote = 0
            var votantEq = 0
            console.log("before nbVote calcul")
            for(var i = 0; i < this.state.defi.votes.length; i++) {
                if(this.state.defi.votes[i].idVote == joueur.id) {
                    nbVote  = nbVote +1
                }
            }
            if(this.state.defi.joueursEquipeDefiee.includes(joueur.id)) {
                votantEq = this.state.nbVotantDefiee
            } else {
                votantEq = this.state.nbVotantOrga
            }
            console.log(nbVote)

            return(
                <View>
                    <Joueur_Pseudo_Score
                        id = {joueur.id}
                        pseudo = {joueur.pseudo}
                        photo = {joueur.photo}
                        score = {joueur.score}
                        data = {joueur}

                    />

                    <Text>{nbVote} voix sur {votantEq} votant</Text>
                </View>
            )

        } else {
            return(
                <Text>Pas encore de votes</Text>
            )
        }
    }


    /**
     * Fonction qui permet d'afficher l'homme du match de chaque équipes
     */
    _renderHommesMatch() {
        var date = new Date( this.state.defi.jour.seconds * 1000)
        if(date < new Date()) {
            return(
                <View>
                    <Text style = {{marginLeft : wp('3%'), marginTop : hp('1%'), fontWeight : 'bold'}}>Homme du match : </Text>

                    <View style = {{flexDirection : 'row', justifyContent : "space-between"}}>
                        {this._renderHomme(this.state.hommeOgra)}
                        {this._renderHomme(this.state.hommeDefiee)}
                    </View>
                </View>
                
            )
        }
    }

    /* =======================================================================================
    =================================== FONCTIONS RENDER =====================================
    ==========================================================================================
    */



    _renderTxtMillieu(){
        if(this.state.defi.equipeDefiee == undefined) {
            return(
                <Text style = {styles.textRechercheEquipe}>Cherche une équipe à défier</Text>
            )
        } else {
            return(
                <Image
                    source = {require('../../../../res/vs.png')}
                    style = {styles.vs}
                    />
            )
        }
    }


    /**
     * Permet d'afficher l'équipe défiée
     */
    _renderEquipeDefie(){

        if(this.state.equipeDefiee != undefined) {
            return(
                <Animated.View
                    style = {[this.equipe2Animation.getLayout(), {alignSelf : "flex-end"}]}>

                    <Equipe_Nom_Score
                        photo = {this.state.equipeDefiee.photo}
                        score = {this.state.equipeDefiee.score}
                        nom = {this.state.equipeDefiee.nom}
                    />
                </Animated.View>
            )
        } else {
            return(
                <Animated.View
                    style = {this.equipe2Animation.getLayout()}>
                    <View
                        style = {styles.circleEquipeVide}
                    />
                </Animated.View>
            )
        }
    }


    /**
     * Permet d'afficher le bouton "relever le défi" ou feuille de match;
     * attention pas les même onPress en fonction des cas ?
     */
    _renderBtn(){

        var estPasse = (new Date(this.state.defi.jour.seconds * 1000) < new Date())
        var cap1 =  this.state.equipeOrganisatrice.capitaines.includes(this.userData.id)
        var cap2 = false 
        if( this.state.equipeDefiee != undefined) cap2 =  this.state.equipeDefiee.capitaines.includes(this.userData.id)

        console.log("NON CAP1 et this.state.equipeDefiee == undefined",this.state.equipeDefiee == undefined && (!cap1) )
        var participe =this.state.defi.participants.includes(this.userData.id)
        // Si le défi est passé
        if(estPasse) {
            return(
                <TouchableOpacity
                    style = {styles.btn_feuille_de_match} 
                    onPress = {() => this.goToFeuilleDefiPasse()} >
                    <Text>Feuille de match</Text>
                </TouchableOpacity>
            )

        // Si c'est le capitaine de l'équipe organisatrice ou si il participe
        }else if(cap1 || participe) {
            return(
                <TouchableOpacity
                    style = {styles.btn_feuille_de_match}
                    onPress = {() => this.props.navigation.push("FeuilleDefiAVenir",
                        {
                            equipeDefiee : this.state.equipeDefiee,
                            equipeOrganisatrice : this.state.equipeOrganisatrice,
                            defi : this.state.defi
                        })}
                    >
                    <Text>Feuille de match</Text>
                </TouchableOpacity>
            )
        
        // Si il est capitaine de l'équipe defiee et le défi à été validé
        } else if(cap2 && this.state.defi.defis_valide) {
            return(
                <TouchableOpacity
                    style = {styles.btn_feuille_de_match}
                    onPress = {() => this.props.navigation.push("FeuilleDefiAVenir",
                        {
                            equipeDefiee : this.state.equipeDefiee,
                            equipeOrganisatrice : this.state.equipeOrganisatrice,
                            defi : this.state.defi
                        })}>
                    <Text>Feuille de match</Text>
                </TouchableOpacity>
            )

        // Si pas encore d'équipe défiée
        } else if(this.state.equipeDefiee == undefined && (!cap1)) {
            return(
                <TouchableOpacity
                    style = {styles.btn_relever_defi}
                    onPress = {()=> this.releverLeDefi()}>

                    <Text>Relever le defi</Text>
                </TouchableOpacity>
            )
           
        } else {
            return(
                <View>
                    <Text>Attente de validation par l'organisateur</Text>
                </View>
            )
        }
    }




    /**
     * Va permettre de render les équipes dont l'utilisateur est capitaine
     */
    _renderItemEquipe =({item}) => {  
        if(this.state.show_equipe) {
            return(

                <TouchableOpacity 
                    onPress = {() => {
                        this.chooseEquipe(item)
                        this.saveParticipationInDb(item.id)
                        Alert.alert(
                            ' ',
                            "Ta demande de relever le défi avec ton équipe " +
                            item.nom + " a bien été envoyée à l’équipe " + this.state.equipeOrganisatrice.nom + 
                            '\n' + '\n'
                            + "Tu seras informé dès que l’équipe " + this.state.equipeOrganisatrice.nom + " aura accepté ou refusé"
                        )
                    }}>
                    <Equipe_Nom_Score
                        nom = {item.nom}
                        photo = {item.photo}
                        score = {item.score}
                        />
                </TouchableOpacity>
                
            )
        }

    }


    /**
     * Fonction qui permet d'afficher la liste des équipes ou message "d'erreur" si la
     * liste est vide 
     */
    _show_equipes_cap() {
        if(this.state.equipes.length != 0) {
            <FlatList
                style={{alignSelf : "center"}}
                data={this.state.equipes}
                
                renderItem={this._renderItemEquipe}
            />  
        }  else {
            return(
                <Text style={{alignSelf : "center"}}>
                   {"Seuls les capitaines d’une équipe \n peuvent relever les défis"}
                </Text>
            )
        }
    }

    /**
     * Fonction qui permet d'afficher un cadre montrant les équipes dont l'utilisateur est 
     * capitaine.
     */
    _renderListEquipe() {
        if(this.state.show_equipe) {
            return(
                <View style = {styles.containerListEquipe}>
                    <Text>
                        Tu souhaites relever le défi avec quelle équipe
                    </Text>

                    <FlatList
                            style={{alignSelf : "center"}}
                            data={this.state.equipes}
                            
                            renderItem={this._renderItemEquipe}
                        />
                    <TouchableOpacity
                        onPress = {() => this.setState({show_equipe : false})} >
                        <Text style = {{fontWeight : "bold"}}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
    


    displayRender() {

        var seconds =this.state.defi.jour.seconds
        var date = this.buildDateString(new Date(seconds* 1000))

        return(
            <ScrollView>
                <View style = {{marginTop : hp('0.5%')}}>

                        
                    <View>
                        {/* Information sur le defi */}
                        <Text style = {styles.infoDefis}> Defi {this.state.defi.format} par </Text>
                        <Text style = {styles.separateur}>_____________________________________</Text>
                        <Text style = {styles.infoDefis}> {date}</Text>
                        <Text style = {styles.separateur}>_____________________________________</Text>
                    </View>

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

                    {/* Bloc contenant les équipes */}
                    <View style = {styles.containerEquipe}>
                        <Animated.View
                            style = {this.equipe1Animation.getLayout()}
                            >
                            <Equipe_Nom_Score
                                photo = {this.state.equipeOrganisatrice.photo}
                                score = {this.state.equipeOrganisatrice.score}
                                nom = {this.state.equipeOrganisatrice.nom}
                                id = {this.state.equipeOrganisatrice.id}
                                
                            />
                        </Animated.View>
                        

                    {this. _renderTxtMillieu()}

                    {this._renderEquipeDefie()}

                    {this._renderBtn()}

                    </View>

                    <Text style = {{marginTop : hp('1%'), alignSelf : "center"}}>
                        Prix par équipe = {this.state.defi.prix_par_equipe}€ (à regler sur place)
                    </Text>


                    {this._renderListButeurs()}
                    {this._renderHommesMatch()}
                    
                    <View style = {{alignSelf : "center", width : wp('85%'), marginBottom : hp('2%')}}>
                        <Text style = {styles.txt_message_chauffe}>{this.state.defi.message_chauffe}</Text>

                    </View>

                    {this._renderListEquipe()}
                    
                    
                </View>
            </ScrollView>
        )

        
           
    }

    render() {
        return(
            <View style = {{marginTop : hp('4%')}}>
                {this.displayRender()}
            </View>
        )
    }
}

const styles = {
    containerEquipe : {
        borderWidth : 1,
        borderRadius : 5,
        marginTop : wp('5%'), 
        marginLeft : wp('3%'),
        marginRight : wp('3%'), 
        paddingTop : hp('2%'), 
        paddingBottom : hp('2%'),
        paddingLeft : wp('3%')
    },
    rating: {
        width: 40,
    },

    nomEquipe : {
        fontSize : RF(2.3)
    },

    textRechercheEquipe : {
       alignSelf : "center"
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
        alignSelf : "center"
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

    photoEquipe : {
        width : wp('18%'),
        height :wp('18%'),
        marginLeft : wp('2%'),
        marginRight : wp('2%'),
        marginTop : hp('1%'),
        marginBottom : hp('1%')
    },
    infoDefis : {
        alignSelf : "center",
        fontSize : RF(2.2)
    },

    nomTerrains : {
        fontSize : RF(2.2)
    },

    vs : {
        height : wp('7%'),
        width : wp('8.12%'),
        alignSelf : "center"
    },

    circleEquipeVide : {
        width : wp('16%'), 
        height : wp('16%'), 
        borderRadius : wp('8%'),
        marginRight : wp('3%'),
        borderWidth :1, 
        alignSelf : "flex-end"
    },
    btn_feuille_de_match : {
        alignSelf : "center",
        paddingHorizontal : wp('16%'),
        paddingVertical : hp('2%'),
        borderRadius : 15,
        borderWidth  : 1,
        backgroundColor : Color.gold,
        marginTop : hp('1%')
    },

    btn_relever_defi : {
        alignSelf : "center",
        paddingHorizontal : wp('16%'),
        paddingVertical : hp('2%'),
        borderRadius : 15,
        borderWidth  : 1,
        marginTop : hp('1%')
    },

    containerListEquipe : {
        position : "absolute", 
        backgroundColor : "white", 
        top :100,
        width :wp('90%'), 
        alignItems :"center" ,
        paddingTop : hp('3%'),
        paddingBottom : hp('3%'),
        alignSelf : "center",
        borderWidth : 1,
        borderRadius : 5
    }
}

  
  
export default connect() (Fiche_Defi_Rejoindre)
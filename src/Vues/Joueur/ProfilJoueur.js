import React from 'react'
import { StyleSheet, Text, Image, ScrollView, Button, TouchableOpacity, View, FlatList,RefreshControl } from 'react-native'
import StarRating from 'react-native-star-rating'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Defis_Equipe from '../Equipe/Defis_Equipe'
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import LocalUser from '../../Data/LocalUser.json'
import { Constants, Location, Permissions,Notifications } from 'expo';
import Type_Defis from '../../Vues/Jouer/Type_Defis'
import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie from '../../Components/Defis/Item_Partie'
import Color from '../../Components/Colors';
const latUser = 43.531486   // A suppr quand on aura les vrais coordonnées
const longUser = 1.490306

class ProfilJoueur extends React.Component {

    constructor(props) {
        super(props)
        console.log("in constructor")
        this.id = this.props.navigation.getParam('id', ' ')
        this.monProfil= Database.isUser(this.id);
        this.equipes = this.props.navigation.getParam('equipes', [])
        this.joueur = this.props.navigation.getParam('joueur', ' ')
        this.goToFirstScreen  = this.goToFirstScreen.bind(this)

        this.state = {
            allDefis : [],
            refreshing: false,
        }
    }



    componentDidMount() {
        this.getAllDefisAndPartie()
    }




    static navigationOptions = ({ navigation }) => {
        if(! navigation.getParam("retour_arriere_interdit",false)) {
            return {
                title: navigation.getParam('joueur', ' ').nom,
                
                tabBarOnPress({jumpToIndex, scene}) {
                    jumpToIndex(scene.index);
                    console.log(scene.index)
                },
                
                
            }
            
        } else {
            const {state} = navigation;
            return { title: `${state.params.title}`, 
            headerLeft: (

               <View></View>
              ),
                };
        }

    }

    _displayReglages() {
        if (this.monProfil) {
            return (
                <TouchableOpacity
                    style={{flex: 1, alignItems: 'center'}}
                    onPress={() => this.props.navigation.push('ProfilJoueurReglagesScreen', {id: this.id, joueur: this.joueur, equipes: this.equipes, header: this.joueur.nom})}>
                    <Image
                        style={styles.image_param}
                        source = {require('app/res/icon_reglage.png')}/>
                </TouchableOpacity>
            )
        }
    }

    goToFirstScreen() {
        this.props.navigation.navigate("first", {deconexion : true})  
    }

    deco() {
        this.deconexion()
    }

    async deconexion() {
        console.log("in deconexion")
        var token = await this.registerForPushNotifications()
        console.log(token)
        var db = Database.initialisation()
        console.log("after init")
        db.collection("Login").doc(token).delete().then(this.goToFirstScreen).catch(function(error) {
            console.error("Error removing document: ", error);
        });

        // Supprimer le token de la liste
        var tokens = LocalUser.data.tokens 
        var newTokens = []
        for(var i =0; i < tokens.length; i ++) {
            if(tokens[i].localeCompare(token) != 0) {
                newTokens.push(tokens[i])
            }
        }
        
        console.log("TOKEN  : ", newTokens)
        db.collection("Joueurs").doc(this.id).update({
            tokens : newTokens
        })
    }




    async registerForPushNotifications() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log('in register')
        if (status !== 'granted') {
            console.log("1")
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          if (status !== 'granted') {
            console.log("2")
            return;
          }
        }
        console.log("okook")
        var token = await Notifications.getExpoPushTokenAsync();
        console.log("after await token")
        //this.subscription = Notifications.addListener(this.handleNotification);
    
        return (token)
    }

    renderItemEquipe(id, data) {
        return (
            <TouchableOpacity
                onPress = {() => this.props.navigation.push("Profil_Equipe", {equipeId : id})}>

                <Image
                    style={{width: wp('18%'), height: wp('18%'), marginLeft : wp('2%'), marginRight : wp('2%'), backgroundColor: 'grey'/*, elevation : 5*/}}
                    source = {{uri : data.photo}}/>
            </TouchableOpacity>
        )
    }

     /**
     * Fonction qui permet de renvoyer une liste  contenant les informations
     * utiles pour l'affichage des defis de l'équipe;
     * @param {*} defis
     */
    getDefis(defis) {

        var liste = [];
        for(var i= 0; i < defis.length; i++){
            j = {
                id : defis[i].id,
                format : defis[i].format,
                photo1 : defis[i].photo1,
                photo2 : defis[i].photo2,
                nom1 : defis[i].nom1,
                nom2 : defis[i].nom2,
                date : defis[i].date


            }
            liste.push(j)
        }

        return(liste)
    }


    //================================================================================
    //=================================== POUR LES DEFIS =============================
    //================================================================================


    /** Fonction qui va permettre de trouver tous les défis et parties à venir auxquels 
     * participes l'utilisateur
     */
    getAllDefisAndPartie() {
        var db = Database.initialisation()
        var allDefis = []
        var index = 1
        var now = new Date()
        console.log("DATE PARSE : ",  Date.parse(now) )
        var ref = db.collection("Defis");
        var query = ref.where("participants", "array-contains", this.id)
                        .where("dateParse", ">=", Date.parse(now)).orderBy("dateParse")

        // On regarde si l'utilisateur participe à un defi
        query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                
                allDefis.push(results.docs[i].data())

            }
            this.setState({allDefis : allDefis})


            // Itérer sur toutes les équipes dont il est capitaine
            for(var i = 0 ; i < this.equipes.length ; i++) {
                var equipe = this.equipes[i]
                
                // Vérifier si il est capitaine
                if(equipe.capitaines.includes(this.id)) {

                    // Regarder si cette équipe organise un défi
                    var queryEqOrga = ref.where("equipeOrganisatrice", "==", equipe.id)
                                        .where("dateParse", ">=",Date.parse(now))
                    queryEqOrga.get().then(async (resultsDefiOrga) => {
                        for(var i = 0; i < resultsDefiOrga.docs.length ; i++) {
                            if(! this.allreaddyDownloadDefi(allDefis, resultsDefiOrga.docs[i].data())) {
                                allDefis.push(resultsDefiOrga.docs[i].data())
                            }
                            
                        }
                    })

                    // Regarder si cette équipe est defiée 
                    var queryEqDefiee = ref.where("equipeDefiee", "==", equipe.id)
                                        .where("dateParse", ">=",Date.parse(now))
                    queryEqDefiee.get().then(async (resultsDefiDefiee) => {

                        for(var i = 0; i < resultsDefiDefiee.docs.length ; i++) {
                            if(! this.allreaddyDownloadDefi(allDefis, resultsDefiDefiee.docs[i].data())) { 
                                allDefis.push(resultsDefiDefiee.docs[i].data())
                            }
                        }
                    })

                    this.setState({allDefis : allDefis})
                }
            }

            
        }).catch(function(error) {
              console.log("Error getting documents partie:", error);
        });   
    }


    /**
     * Fonction qui renvoie true si le défi à déja été ajouté à la liste
     * des défi ou partie téléchargés.
     */
    allreaddyDownloadDefi(liste, defi) {
        for(var i = 0; i < liste.length; i++) {
            if(liste[i].id == defi.id)  {
                return true
            }
        }
        return false
    }

    // ===============================================================================
    // ===================== METHODES POUR LE RESEAU =================================
    // ===============================================================================

    async gotoReseau() {
        let reseau = await Database.getArrayDocumentData(this.joueur.reseau, 'Joueurs');

        this.props.navigation.push('ProfilJoueurMonReseauScreen', {joueur: this.joueur, reseau: reseau, header: this.joueur.nom, monProfil: this.monProfil});
    }


    // ===============================================================================
    // ================ METHODES POUR LES EQUIPES FAVORITES ==========================
    // ===============================================================================

    async gotoEquipesFav() {
        equipesFav = [];
        for (idEquipeFav of this.joueur.equipesFav) {
            equipeFavData = await Database.getDocumentData(idEquipeFav, 'Equipes');
            equipesFav.push(equipeFavData);
        }

        this.props.navigation.push('ProfilJoueurMesEquipesFavScreen', {joueur: this.joueur, equipesFav: equipesFav, header: this.joueur.nom, monProfil: this.monProfil});
    }


    // ===============================================================================
    // ================ METHODES POUR LES JOUEURS QUI LIKENT LE PROFIL ===============
    // ===============================================================================


    /**
     * Méthode qui va permettre de récuperer les joueurs qui 
     * likent le joueur et d'afficher la vue.
     */
    async gotoJoueursQuiLikent() {
        joueursLike = [];
        for (idLike of this.joueur.aiment) {
            idLikeData = await Database.getDocumentData(idLike, 'Joueurs');
            joueursLike.push(idLikeData);
        }

        this.props.navigation.push("JoueursQuiLikent", {joueurs: joueursLike, titre: this.joueur.nom});
    }

    /**
     * Méthode qui renvoie l'objet à afficher ou non, qui permet de liker
     * le profil d'un autre joueur et de l'ajouter à notre réseau
     */
    likeJoueur() {
        if (!Database.isUser(this.id)) {
            if (LocalUser.data.reseau.some(elmt => elmt === this.id)) {
                // On aime deja ce profil, donc on le retirera des likes
                return (
                    <TouchableOpacity
                            style={{marginLeft: 10, marginRight: 15, width: 30, height: 30}}
                            onPress={() => {
                                Database.changeSelfToOtherArray_Aiment(this.id, "Joueurs", false);
                                Database.changeOtherIdToSelfArray_Reseau(this.id, false);

                                this.joueur.aiment = this.joueur.aiment.filter(v => !(v === LocalUser.data.id));
                                this.forceUpdate();
                            }}>
                        <Image
                            style={{width: 30, height: 30}}
                            source = {require('app/res/icon_already_like.png')}/>
                    </TouchableOpacity>
                )
            } else {
                // On n'aime pas encore ce profil, donc on l'ajoutera aux likes
                return (
                    <TouchableOpacity
                            style={{marginLeft: 10, marginRight: 15, width: 30, height: 30}}
                            onPress={() => {
                                Database.changeSelfToOtherArray_Aiment(this.id, "Joueurs", true);
                                Database.changeOtherIdToSelfArray_Reseau(this.id, true);

                                this.joueur.aiment.push(LocalUser.data.id);
                                this.forceUpdate();
                            }}>
                        <Image
                            style={{width: 30, height: 30}}
                            source = {require('app/res/icon_like.png')}/>
                    </TouchableOpacity>
                )
            }
        }
    }


    // ===============================================================================
    // ================ METHODES POUR LES TERRAINS FAVORIS ===========================
    // ===============================================================================

    _calculDistance(lat_b,lon_b) {
        let rad_lata = (latUser * Math.PI)/180;
        let rad_long = ((longUser- lon_b) * Math.PI)/180;
        let rad_latb = (lat_b * Math.PI)/180;

        let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
        Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371

        var txtDistance = d.toString().split('.')[0];
        txtDistance = txtDistance +','+ d.toString().split('.')[1][0]
        return txtDistance;
    }


    /**
     * Méthode qui va permettre de récuperer les joueurs qui 
     * likent le terrains et d'afficher la vue.
     */
    async gotoTerrainsFav() {
        terrainsFav = [];
        for (idTerrain of this.joueur.terrains) {
            idTerrainData = await Database.getDocumentData(idTerrain, 'Terrains');
            t = idTerrainData.d;
            distance = this._calculDistance(idTerrainData.d.latitude, idTerrainData.d.longitude)
            t.distance = distance;

            terrainsFav.push(t);
        }

        this.props.navigation.push("ProfilJoueurMesTerrainsFavScreen", {terrains : terrainsFav, titre : this.joueur.nom})
    }

    async getDocumentJoueur() {
        console.log("in get ocument !!!")
        var j  = await Database.getDocumentData(this.id, "Joueurs")
        console.log("PSEUDO : ", j.pseudo)
        return j
    }


    /** Fonction appelée au moment où l'utilisateur pull to refresh */
    _onRefresh = async () => {
        this.setState({refreshing: true});
        console.log("REFRECHING !!!")
        this.joueur =  await this.getDocumentJoueur()
        this.getAllDefisAndPartie()
        //this.joueur = await Database.getDocumentData(this.joueur.id, "Joueurs")
        this.setState({refreshing : false})
    }
    

    // ==========================================================================

    /**
     * Fonction qui permet de construire la liste des participants à une partie, elle 
     * enlève de la liste les joueurs indisponibles
     * @param {*} item 
     */
    buildJoueurs(item) {
        var liste = []
        for(var i = 0; i < item.participants.length ; i++) {
            if(! item.indisponibles.includes(item.participants[i])) {
                liste.push(item.participants[i])
            }
        }
        return liste
    }
    displayDefis(){

        if(this.state.allDefis == undefined ) {
            return (
                <View>
                    <Text>Pas encore de défis</Text>
                </View>
            )
        }else {
            return(
                <FlatList style = {{marginLeft : wp('2%')}}
                        data={this.state.allDefis}
                        numColumns={1}
                        keyExtractor={(item) => item.id}
                        renderItem={this._renderItemDefi}
                />
            )
        }
    }

    _renderItemDefi =({item}) => {   
        if(item.type == Type_Defis.partie_entre_joueurs){
          
            return(
                <Item_Partie
                    id = {item.id}
                    format = {item.format}
                    jour = {new Date(item.jour.seconds *1000)} 
                    duree = {item.duree}
                    joueurs = {this.buildJoueurs(item)}
                    nbJoueursRecherche =  {item.nbJoueursRecherche}
                    terrain=  {item.terrain}
                    latitudeUser = {this.state.latitude}
                    longitudeUser = {this.state.longitude}
                    message_chauffe  = {item.message_chauffe}
                />
            )
        } else if(item.type == Type_Defis.defis_2_equipes) {
            return(
                <Item_Defi
                    format = {item.format}
                    jour = {new Date(item.jour.seconds * 1000)}
                    duree ={item.duree}
                    equipeOrganisatrice = {item.equipeOrganisatrice}
                    equipeDefiee = {item.equipeDefiee}
                    terrain = {item.terrain}
                    allDataDefi = {item}
                        
                />
            )
        } else {
            return(
                <Text>oooo</Text>
            )
        }  
    }

    renderBtnDeco() {
        console.log("mon profil :", this.monProfil)
        if(this.monProfil) {
            return(
                <Button
                onPress={() => this.deco()}
                title="Déconexion"
                color= {Color.agOOraBlue}
                />
            )
        }
    }

    renderBtnCreerEquipe() {
        if(this.monProfil) {
            return(
                <Button
                onPress={() => this.props.navigation.push("CreationEquipeNom")}
                title="Créer une équipe"
                color= {Color.agOOraBlue}
                />
            )
        }
    }

    render() {
        return (
            <ScrollView style={styles.main_container}
            refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }>

                {/* Caracteristiques du joueur */}
                <View style={[styles.perso_container]}>
                    <View style={styles.top_infos_container}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Image
                                style={styles.image_photo}
                                source = {{uri : this.joueur.photo} } />
                        </View>
                        <View style={styles.nom_container}>
                            <Text style={{margin: 5, fontSize : RF(3.25)}}>{this.joueur.age} ans, {this.joueur.ville}</Text>
                            <Text style={{margin: 5,  fontSize : RF(3.25)}}>AKA {this.joueur.pseudo}</Text>
                        </View>
                        {this._displayReglages()}
                    </View>

                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={styles.bot_infos_container}>
                            <Text style={{}}>fiabilité, {this.joueur.fiabilite}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={parseInt(this.joueur.score)}
                                starSize={hp('3.5%')}
                                fullStarColor='#F8CE08'
                                emptyStarColor='#B1ACAC'
                                containerStyle={styles.rating}/>
                            <Text style={{}}>Numéro de téléphone : {this.joueur.telephone}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>

                            <TouchableOpacity
                                style={{}}
                                onPress = {()=> {this.gotoJoueursQuiLikent()}}>
                                <Text style={{paddingVertical: 10, paddingHorizontal: 5}}>{this.joueur.aiment.length} likes</Text>
                            </TouchableOpacity>
                            {this.likeJoueur()}
                        </View>
                    </View>
                </View>


                {/* Equipes dont il fait partie */}
                <View style={[styles.equipes_container, styles.additional_style_container]}>
                    <TouchableOpacity
                        style={styles.header_container}
                        onPress={() => this.props.navigation.push('ProfilJoueurMesEquipesScreen', {joueur: this.joueur, header: this.joueur.nom, monProfil: this.monProfil, equipes: this.equipes})}>
                        <Text style={styles.header}>Equipes</Text>
                    </TouchableOpacity>
                    <View style={{flex: 3}}>
                        <FlatList
                            style={{flex: 1}}
                            horizontal= {true}
                            data={this.equipes}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => this.renderItemEquipe(item.id, item)}

                        />
                    </View>
                </View>


                {/* Favoris */}
                <View style={[styles.favoris_container, styles.additional_style_container]}>
                    <TouchableOpacity
                        style={styles.header_container}
                        onPress={() => this.props.navigation.push('ProfilJoueurMesFavorisScreen', {joueur: this.joueur, header: this.joueur.nom, monProfil: this.monProfil, id: this.id})}>
                        <Text style={styles.header}>Favoris</Text>
                    </TouchableOpacity>
                    <ScrollView
                         horizontal={true}>
                        <View style={styles.favoris_categories}>
                            <Image style={styles.favoris_categorie_icone} source = {require('app/res/icon_joueurs.png')}/>
                            <Button title="Reseau" onPress={() => this.gotoReseau()}/>
                            <Image style={styles.favoris_categorie_icone} source = {require('app/res/icon_team.png')} />
                            <Button title="Equipes" onPress={() => this.gotoEquipesFav()}/>
                            <Image style={styles.favoris_categorie_icone} source = {require('app/res/icon_terrain.png')}/>
                            <Button  title="Terrains" onPress={() => this.gotoTerrainsFav()}/>
                        </View>
                    </ScrollView>

                </View>

                {/* Defis */}
                <View style = {[styles.defis_container, styles.additional_style_container]}>
                    <TouchableOpacity style={styles.header_container} onPress={() => {this.props.navigation.push("CalendrierJoueur")}}>
                        <Text style={styles.header}>Calendrier</Text>
                    </TouchableOpacity>
                    {this.displayDefis()}
                </View>
                {this.renderBtnDeco()}

                {this.renderBtnCreerEquipe()}

            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: hp('1%')
    },

    additional_style_container : {
        width : wp('98%'),
        marginLeft : wp('1%'),
        marginRight : wp('1%'),
        borderRadius : 15,
        marginBottom : hp('1%'),
        paddingBottom : hp('1.5%'),
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 5, width: 5 }, // IOS
        shadowOpacity: 5, // IOS
        shadowRadius: 5, //IOS
       // elevation: 2, // Android
    },

    // Styles de nos caracteristiques
    perso_container: {
        flex: 4,
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingLeft : wp('3%'),
        paddingTop : hp('1.5%')

    },
    top_infos_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bot_infos_container: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    rating: {
        width: 40,
    },
    nom_container: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    image_photo: {
        width : wp('25%'),
        height :wp('25%'),
        borderRadius : 42,
        backgroundColor: 'gray',
    },
    image_param: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        margin: 5
    },

    // Styles de notre liste d'equipes
    equipes_container: {
        flex: 4,
        justifyContent: 'space-evenly',
        alignItems: 'stretch',

    },

    equipe_item: {
        width: 100,
        height: 100,
        margin: 10,
        backgroundColor: 'gray'
    },

    // Styles des categories de favoris
    favoris_container: {
        flex: 3,
        justifyContent: 'space-evenly',
        alignItems: 'stretch',

    },
    favoris_categories: {
        flex: 2,
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    favoris_categorie_icone: {
        width: wp('11%'),
        height: wp('11%'),
        resizeMode:  'cover',
        marginLeft : wp('4%'),
        marginRight : wp('4%')

    },



    // Text styles
    header_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        width : wp('88%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
       // marginVertical: 10,
        //marginHorizontal: 10,
        borderRadius : 15,

       // borderWidth : 1,
       backgroundColor:'#52C3F7',
       //elevation : 5


    },
    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },

})


export default ProfilJoueur;

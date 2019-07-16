import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { Image } from 'react-native-elements';
import Color from '../../Components/Colors'
import Database from '../../Data/Database'
import Terrains from '../../Helpers/Toulouse.json'
import LocalUser from '../../Data/LocalUser.json'
import Distance from '../../Helpers/Distance'
import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie from '../../Components/Defis/Item_Partie'
import Type_Defis from '../../Vues/Jouer/Type_Defis'


const url_icon_like = 'app/res/icon_like.png'

    

/**
 * Classe qui va permettre d'afficher le profil d'un terrain
 */
export default class Profil_Terrain extends React.Component {



    constructor(props) {
        super(props)

        this.id = this.props.navigation.getParam('id', ' ')

        this.localData = this.findTerrainFromLocalDB(this.id);
        if (this.localData == null) {
            console.log("ERROR : pas de localData associee au terrain "+this.id);
        }

        var distance = Distance.calculDistance(this.localData.Latitude, this.localData.Longitude, LocalUser.geolocalisation.latitude, LocalUser.geolocalisation.longitude);
        var distString = distance+"";
        let values = distString.split(".");
            
        if (values.length > 1) {
            this.dispDistance = values[0]+","+values[1].substr(0,2)+" km";
        } else {
            this.dispDistance = "";
        }

        var typeSol = this.localData.TypeSol.split(" ");
        this.gazon = typeSol[0] === "Gazon";
        this.bitume = typeSol[0] === "Bitume" || typeSol[0] === "Béton";
        this.synthetique = typeSol[0] === "Synthétique";

        this.payant = this.localData.Payant;

        this.sanitaire = this.localData.EquSanitairePublic === "-1";

        this.eclairage = this.localData.EquEclairage === "-1";

        this.handicap = this.localData.EquAccesHandimAire === "Oui";

        this.equipements = this.buildIconEquipement();


        this.state = {
            nbAime: 0,
            defis: []
        }

        this.getAllDefisAndPartie();
    }

    
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('titre', ' ')
        }
    }


    findTerrainFromLocalDB(id) {
        for (var i=0; i<Terrains.length; i++) {
            if (Terrains[i].id === id) {
                return Terrains[i];
            }
        }
        return null;
    }


    /**
     * Methode qui va permettre de renvoyer la liste des url des icones pour 
     * les équipements du terrain.
     */
    buildIconEquipement() {
        var liste = []
        
        if(this.sanitaire) {
            liste.push({
                id : 'robinet',
                image : require('../../../res/shower.png'),
            })
        }
        
        if(this.eclairage) {
            liste.push({
                id : 'lumiere',
                image : require('../../../res/light.png'),

            })
        }

        if(this.gazon) {
            liste.push({
                id : 'gazon',
                image : require('../../../res/gazon.png'),

            })
        }
        if(this.synthetique) {
            liste.push({
                id : 'synthetique',
                image : require('app/res/land.png'),

            })
        }
        if(this.bitume) {
            liste.push({
                id : 'bitume',
                image : require('../../../res/bitume.jpg'),

            })
        }

        if(this.handicap) {
            liste.push({
                id : 'handicap',
                image : require('../../../res/disabled.png'),

            })
        }

        if(this.payant) {
            liste.push({
                id : 'payant',
                image : require('../../../res/coin.png'),

            })
        }

        return liste
    }


    
    /** Fonction qui va permettre de trouver tous les défis et parties à venir auxquels 
     * participes l'utilisateur
     */
    async getAllDefisAndPartie() {
        var db = Database.initialisation()
        var allDefis = [];

        var ref = db.collection("Defis");
        var query = ref.where("terrain", "==", this.id).orderBy("dateParse")

        // On regarde s'il y a eu des defis sur ce terrain
        var results = await ref.get();
        console.log("nb results : " + results.docs.length);
        for(var i = 0; i < results.docs.length ; i++) {
            allDefis.push(results.docs[i].data());
        }
        this.setState({defis : allDefis})
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
                    latitudeUser = {LocalUser.geolocalisation.latitude}
                    longitudeUser = {LocalUser.geolocalisation.longitude}
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
                <Text>Erreur</Text>
            )
        }  
    }


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
        if(this.state.defis == undefined || this.state.defis == []) {
            return (
                <View>
                    <Text>Pas encore de défi</Text>
                </View>
            )
        }else {
            console.log("display defi");
            return(
                <FlatList style = {{marginLeft : wp('2%')}}
                        data={this.state.defis}
                        numColumns={1}
                        keyExtractor={(item) => item.id}
                        renderItem={this._renderItemDefi}
                />
            )
        }
    }


    /**
     * Méthode qui va permettre de récuperer les joueurs qui 
     * likent le terrains et d'afficher la vue.
     */
    gotoJoueursQuiLikent() {
        var db = Database.initialisation();
        var docRef = db.collection('Terrains').doc(this.id);
        docRef.get().then(async (doc) => {
            if (doc.exists) {
                const collJoueurs = docRef.collection('aiment')
                const joueursSnapshot = await collJoueurs.get()
                this.getJoueursLike(joueursSnapshot.docs)
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        

    }

    async getJoueursLike(joueurs) {
        var liste = [];
        for(j of joueurs){
            let joueurRef = j.data().joueur
            let gotRefJoueur = await joueurRef.get()
            
            let j = {
                nom  : gotRefJoueur.data().nom,
                score : gotRefJoueur.data().score,
                id : gotRefJoueur.data().id,
                photo : gotRefJoueur.data().photo,
            }
            console.log(j)
        }   
        liste.push(j)
    }


    render(){
        const styleBloc = {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius : 15,
            // borderWidth : 1,
            backgroundColor:'#52C3F7',
            shadowColor: 'rgba(0,0,0, .4)', // IOS
            shadowOffset: { height: 5, width: 5 }, // IOS
            shadowOpacity: 5, // IOS
            shadowRadius: 5, //IOS
            elevation: 5, // Android       marginBottom : hp('2%'),
            marginTop : hp('3%')
        }


        const styleTxtBloc = {
            color: 'white',
            fontSize: RF(2.7),
            fontWeight: 'bold',
            paddingVertical: 4
        }


        return (
            <ScrollView style = {{marginTop : hp('4%')}}>
                
                <View>
                    {/* BLOC INFOS DU TERRAIN */}
                    <View style = {{flexDirection : 'row', marginLeft : wp('2%')}}>

                        {/* Bloc pour le terrain et le dimension */}
                        <View>
                            <View style = {{flexDirection : 'row', marginBottom : hp('1%'), marginTop : hp('1%')}}>
                                <Image source = {require('../../../res/field.png')} style = {{width : wp('30%'),height: wp('19%')}} />
                            </View>
                        </View>

                        {/* Adresse et nom */}
                        <View style = {{flex : 1, marginLeft : wp('4%')}}>
                            <Text style= {{fontWeight : 'bold', fontSize: RF(2.5)}}>{this.localData.InsNom}</Text>
                            <Text style= {{fontSize: RF(2.2)}}>{this.localData.EquNom}</Text>
                            <Text style= {{fontSize: RF(2.2)}}>{this.localData.N_Voie} {this.localData.Voie}</Text>
                            <Text style= {{fontSize: RF(2.2)}}>{this.localData.CodePostal} {this.localData.Ville}</Text>

                            {/* Distance et joueurs qui likent */}
                            <View style = {{flexDirection : 'row', justifyContent: 'space-between'}}>
                                <Text style= {{fontSize: RF(2.2)}}>{this.dispDistance}</Text>

                                {/* bloc du nb de like*/}
                                <View style = {{flexDirection : "row"}}>
                                    <TouchableOpacity
                                        style = {{alignSelf : "center"}}
                                        onPress = {()=> {this.gotoJoueursQuiLikent()}}>
                                        <Text style = {{fontWeight : 'bold', marginLeft : wp('2%'), marginRight : wp('2%')}}>{this.state.nbAime}</Text>

                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image 
                                            source = {require(url_icon_like)} 
                                            style = {{width : wp('8%'), height : wp('8%'), marginLeft : wp('2%'), marginRight : wp('2%')}}/>
                                    </TouchableOpacity>
                            </View>
                            </View>
                        </View>
                    </View>

                    {/*View contenant les équipement du terrains */}
                    <View style = {styleBloc}>   
                        <Text style = {styleTxtBloc}>Equipements de ce terrain</Text>
                    </View>
                    <View style = {{alignItems : 'center', marginTop : hp('2%')}}>
                        <FlatList
                            data={this.equipements}
                            numColumns={this.equipements.length}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) =>
                                <View>
                                    <Image 
                                        source = {item.image}
                                        style = {{width : wp('12%'), height : wp('12%'), marginLeft : wp('2%'), marginRight : wp('2%'),marginBottom : hp('1%'),  marginTop : hp('1%')}}/>
                                </View>
                                
                            }
                        />
                    </View>
                    {/* Pour les défis */}
                    <View style = {styles.main_container_defis}>
                        <View style = {styleBloc}>
                            <Text style = {styleTxtBloc}>Défis et match sur ce terrain</Text>
                        </View>
                    </View>
                    <View style = {{ alignItems : "center"}}>
                        {this.displayDefis()}
                    </View>
                </View>
            </ScrollView>

        )
    }
}

styles = {
    info_equipe : {
        flex : 1,
        //borderWidth: 1,
    },

    main_container_photo : {
        marginLeft : wp('2%'),
        flex : 1,
        backgroundColor : 'green'
    },

    image_profil_equipe : {
        width : wp('23%'),
        height :wp('23%')
    },

    bloc_identite : {
        flex: 1,
        flexDirection: 'row',
        marginTop : hp('2%'),
    },

    main_container_txt : {
        marginLeft : wp('4%')
    },
    main_container_like : {
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection : 'row'
    },

    image_like : {
        height : 35,
        width : 35
    },
    view_txt_defis : {


    },
    txt_defis : {
       
    },
    icon_equipement :{
        
    }
}
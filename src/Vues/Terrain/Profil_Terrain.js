import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { Image, colors } from 'react-native-elements';
import Color from '../../Components/Colors'
import DataBase from '../../Data/Database'
const url_icon_like = 'app/res/icon_like.png'
import Defis_Equipe from '../Equipe/Defis_Equipe'
const latUser = 43.531486   // A suppr quand on aura les vrais coordonnées
const longUser = 1.490306
const equipements = ['robinet','vestiaire','douche', 'lumiere']
    

/**
 * Classe qui va permettre d'afficher le profil d'un terrain
 */
export default class Profil_Terrain extends React.Component {



    constructor(props) {
        super(props)

        this.id = this.props.navigation.getParam('id', ' ')
        this.distance = this.props.navigation.getParam('distance', ' ')

        this.state = {
            id : '',
            longueur: 0,
            largeur : 0,
            Insnom : '',
            Equnom : ' ',
            nbAime : 0,
            lumiere : "0",
            sanitaire : "0",
            vestiaire :  "0",
            horloge :  "0",
            but :  "0",
            douche :  "0",
            defis : []
        }
    }

    
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('titre', ' ')
        }
    }
    componentDidMount(){
       // this.getTerrainwithId(this.props.navigation.getParam('equipeId', null))  A DE COMENTER APRES
       this.getTerrainwithId(this.id)
    }


    /**
     * Méthode qui va permettre de récupérer les donnés du terrain 
     * depuis Firebase
     * @param {String} id 
     */
    getTerrainwithId(id){
        var db = DataBase.initialisation();
        var docRef = db.collection('Terrains').doc(id);
        docRef.get().then(async (doc) => {
            if (doc.exists) {
                this.setState({id : id,docRef : docRef})
               const collDefis = docRef.collection('defis')
               const defisSnapshot = await collDefis.get()
                this.changeTerrain(doc.data(), defisSnapshot.docs)
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    /**
     * Fonction qui permet d'actualiser le state en fonction des données
     * récupéré de la base de données.
     * @param {*} t // data du terrain
     * @param {*} dCollec // collection de ref sur des Defis
     */
    changeTerrain(t, dCollec){
        var data  = t.d
        var nbAime = 0
        console.log(data)
        
        if(data.nbAime != undefined){
            nbAime  = data.nbAime
        }
        this.setState({
            id : data.id,
            longueur : data.EquLongueurEvolution,
            largeur :  data.EquLargeurEvolution,
            Insnom : data.InsNom,
            Equnom : data.EquNom,
            nbAime : nbAime,
            lumiere : data.EquEclairage,
            sanitaire : data.EquSanitairePublic,
            vestiaire : data.vestiaire,
            horloge : data.horloge,
            but : data.but,
            douche : data.douche,            
        })
        this.getDefis(dCollec)
    }


    /**
     * Méthode qui permet de calculer la distance du terrain par rapport
     * à l'utilisateur et renvoi un string bien formé 
     * @param {double} lat_b  // Latitude du terrain 
     * @param {double} lon_b  // Longitude du terrain
     */
    calculDistance(lat_b, lon_b){
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
     * Methode qui va permettre de renvoyer la liste des url des icones pour 
     * les équipements du terrain.
     */
    buildIconEquipement() {
        var eq = equipements;
        var liste = []
        var txt = 'Ce terrain dispose '
        let oui = "-1"
        
        if(this.state.robinet == oui) {
            liste.push({
                id : 'robinet',
                image : require('../../../res/water_tap.png'),
                text :txt + "d'un robinet"
            })
        }
        if(this.state.horloge == oui) {
            liste.push({
                id : 'horloge',
                image : require('../../../res/clock.png'),
                text : txt + "d'une horloge"

            })
        }
        if(this.state.douche) {
            liste.push({
                id : 'douche',
                image : require('../../../res/shower.png'),
                text : txt + "de douches"

            })
        }
        if(this.state.lumiere == oui) {
            liste.push({
                id : 'lumiere',
                image : require('../../../res/light.png'),
                text : txt + "d'un éclairage"

            })
        }
        if(this.state.vestiaire == oui) {
            liste.push({
                id : 'vestiaire',
                image : require('../../../res/dressing-room.png'),
                text : txt + "d'un vestiaire"

            })
        }if(this.state.but == oui) {
            liste.push({
                id : 'but',
                image : require('../../../res/goal.png'),
                text : txt + "de cages de but"

            })
        }
        if(this.state.gazon == oui) {
            liste.push({
                id : 'gazon',
                image : require('../../../res/gazon.png'),
                text : txt + "d'une surface de jeu en gazon"

            })
        }if(this.state.synthetique == oui) {
            liste.push({
                id : 'synthetique',
                image : require(url_icon_like),  // A CHANGER !
                text : txt + "d'une surface de jeu en synthétique "

            })
        }
        if(this.state.sanitaire == oui) {
            liste.push({
                id : 'sanitaire',
                image : require('../../../res/toilet.png'),
                text : txt + " de sanitaire"

            })
        }

        return liste
    }


    
    /**
     * Fonction qui permet de renvoyer une liste  contenant les informations
     * utiles pour l'affichage des defis de l'équipe;
     * @param {*} defis
     */
    async getDefis(defis) {

        var liste = [];
        for(var i = 0; i< defis.length; i++) {
            let d = defis[i]
            let refDefi = d.data().refDefi
            let gotRefDefi = await refDefi.get()
            let defiBeginDate = gotRefDefi.data().dateDebut.toDate()
            let defiEndDate = gotRefDefi.data().dateFin.toDate()

            dateObj = {
                annee: defiBeginDate.getFullYear(),
                heureDebut: defiBeginDate.getHours(),
                heureFin: defiEndDate.getHours(),
                jours: defiBeginDate.getDate(),
                minutesDebut: defiBeginDate.getMinutes(),
                minutesFin: defiEndDate.getMinutes(),
                mois: defiBeginDate.getMonth() + 1
            }

            let gotRefEquipe1 = await gotRefDefi.data().equipe1.get()
            let gotRefEquipe2 = await gotRefDefi.data().equipe2.get()

            j = {
                id : gotRefDefi.id,
                format : gotRefDefi.data().format,
                photo1 : gotRefEquipe1.data().photo,
                photo2 : gotRefEquipe2.data().photo,
                nom1 : gotRefEquipe1.data().nom,
                nom2 : gotRefEquipe2.data().nom,
                date : dateObj
            }
            liste.push(j)    
            
        }

        this.setState({
            defis: liste
        })
    }


    /**
     * Méthode qui va permettre de récuperer les joueurs qui 
     * likent le terrains et d'afficher la vue.
     */
    gotoJoueursQuiLikent() {
        console.log("debut")
        var db = DataBase.initialisation();
        var docRef = db.collection('Terrains').doc(this.state.id);
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


    displayDefis(){
        if(this.state.defis.length == 0) {
            return (
                <View>
                    <Text>Pas encore de défis</Text>
                </View>
            )
        }else {
            return(
                <FlatList
                        data={this.state.defis}
                        numColumns={1}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) =>
                            <View style = {{marginTop : hp('2%')}}>
                                <Defis_Equipe
                                format = {item.format}
                                photo1 = {item.photo1}
                                photo2 = {item.photo2}
                                nom1 = {item.nom1}
                                nom2 = {item.nom2}
                                date = {item.date}
                            />
                            </View>
                           
                        }
                />
            )
        }
    }

   
    
    showAlert = (item) =>{
        Alert.alert(
           item.text
        )

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

        const showAlert = () =>{
            Alert.alert(
               'You need to..llll.'
            )
        }
       var eq  = this.buildIconEquipement();
        return (
            <ScrollView style = {{marginTop : hp('4%')}}>
                 
                <View>
                    {/* BLOC INFOS DE L'EQUIPE */}
                    <View style = {{flexDirection : 'row', marginLeft : wp('2%')}}>

                        {/* Bloc pour le terrain et le dimension */}
                        <View>
                            <View style = {{flexDirection : 'row', marginBottom : hp('1%'), marginTop : hp('1%')}}>
                                <Image source = {require('../../../res/field.png')} style = {{width : wp('30%'),height: wp('19%')}} />
                                <Text 
                                style = {{alignSelf : "center"}}>{this.state.largeur} m </Text>
                            </View>
                            <View style = {{ width : wp('30%'), marginTop : -hp('1%')}}>
                                <Text style = {{alignSelf : "center"}}>{this.state.longueur} m</Text>
                            </View>
                        </View>

                        {/* texte de l'équipe */}
                        <View style = {{flex : 1, marginLeft : wp('4%')}}>
                            <Text style= {{fontWeight : 'bold', fontSize: RF(2.5)}}>{this.state.Insnom}</Text>
                            <Text style= {{fontSize: RF(2.2)}}>{this.state.Equnom}</Text>

                            {/* Distance et joueurs qui likent */}
                            <View style = {{flexDirection : 'row', justifyContent: 'space-between'}}>
                                <Text style= {{fontSize: RF(2.2)}}>{this.distance} km </Text>

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

                        {/* Icon reglage */}
                        <TouchableOpacity>
                            <Image
                                source = {require('../../../res/icon_reglage.png')}
                                style = {{width : wp('9%'), height : wp('9%'),marginLeft : wp('2%')}}/>
                        </TouchableOpacity>
                    </View>

                    {/*View contenant les équipement du terrains */}
                    <View style = {styleBloc}>   
                        <TouchableOpacity>
                            <Text style = {styleTxtBloc}>Equipements de ce terrain</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {{alignItems : 'center', marginTop : hp('2%')}}>
                        <FlatList
                            data={eq}
                            numColumns={5}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) =>
                                <TouchableOpacity
                                    onPress={() =>{ Alert.alert(item.text)}}
                                    >
                                    <Image 
                                        source = {item.image}
                                        style = {{width : wp('12%'), height : wp('12%'), marginLeft : wp('2%'), marginRight : wp('2%'),marginBottom : hp('1%'),  marginTop : hp('1%')}}/>
                                </TouchableOpacity>
                                
                            }
                        />
                    </View>
                    {/* Pour les défis */}
                    <View style = {styles.main_container_defis}>
                        
                        <View style = {styleBloc}>
                            
                            <TouchableOpacity>
                                <Text style = {styleTxtBloc}>Défis et match sur ce terrain</Text>
                            </TouchableOpacity>

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
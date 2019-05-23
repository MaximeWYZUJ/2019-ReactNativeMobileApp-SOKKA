import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity, Alert,FlatList,ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Type_Defis from './Type_Defis'
import actions from '../../Store/Reducers/actions'
import { connect } from 'react-redux'
import {SkypeIndicator} from 'react-native-indicators';
import Database from '../../Data/Database'
import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie from '../../Components/Defis/Item_Partie'
import Color from '../../Components/Colors';

/**
 * Vue d'acceuil pour la création d'un défi ou d'un match
 */
class Accueil_Jouer extends React.Component {

    constructor(props) {
        super(props) ;
        this.state= {
            isLoading : false,
            undefined : []
        }
    }

   
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Jouer',
            tabBarOnPress({jumpToIndex, scene}) {
                jumpToIndex(scene.index);
                console.log(scene.index)
            }
        }
    }

    componentDidMount() {
        this.findAllDefiAndPartie()
    }

    
   sendPushNotification() {

        body = 'voici une notif pour l appli SOKKA !!',
        title = 'Sokka'
        console.log("in send push Notification v2")
        return fetch('https://exp.host/--/api/v2/push/send', {
        body: JSON.stringify({
            to: "ExponentPushToken[1V4azBEDbvUn6l_kx7Mooz]",
            title: "test",
            body: "voici une notif",
            data: { message: `${title} - ${body}` },
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        });
    }

    

    /**
     * Fonction qui va permettre de sauvegarder la postion de l'utilisateur dans le state 
     * global.
     * type : type de défis à créer
     */
    callNextScreen(type) {
        this.setState({isLoading : true})
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                let pos = {
                    latitude : latUser,
                    longitude : longUser
                }
                const action = { type: actions.SAVE_COORDONNATES  , value: pos}
                this.props.dispatch(action)
                this.setState({isLoading : false})
                this.props.navigation.push("ChoixFormatDefi",  {type : type})
        },
        (error) => {
            console.log(error)
            Alert.alert("Tu dois obligatoirement activer ton gps ! ")
            this.setState({isLoading : false})
           
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge : 3600000}
        //{ enableHighAccuracy: true, timeout: 2000, maximumAge : 3600000}

        )
        

    }

     /**
     * fonction qui va permettre d'effectuer une Query dans la base de donnée pour trouver 
     * tous les defis qui cherchent une équipe adverse.
     */
    async findAllDefiAndPartie() {
        var defisArray = []
        var db = Database.initialisation()

        var ref = db.collection("Defis");
        console.log("before query")

        console.log(Date.parse(new Date()))
        // Query sur les partie
        var query = ref.where("dateParse", ">=", Date.parse(new Date()))
                        .where("recherche","==",true)
                        .orderBy("dateParse");
        query.get().then(async (results) => {
            console.log("in then")
            // go through all results
            for(var i = 0; i < results.docs.length ; i++) {
                defisArray.push(results.docs[i].data())
                console.log(results.docs[i].data().message_chauffe)
            }

            this.setState({allDefisPartie : defisArray})
            


              //this.setState({equipesAutour : equipeArray, equipeFiltrees : equipeArray})
              //return defisArray
            
        }).catch(function(error) {
              console.log("Error getting documents partie:", error);
        });   
    }

    /**
     * Fonction qui permet de construire la liste des participants à une partie, elle 
     * enlève de la liste les joueurs indisponibles
     * @param {*} participants 
     */
    buildJoueurs(partie) {
        var liste = []
        for(var i = 0; i < partie.participants.length ; i++) {
            if(! partie.indisponibles.includes(partie.participants[i])) {
                liste.push(partie.participants[i])
            }
        }
        return liste
    }


    _renderItem = ({item}) => {       
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
                console.log("fffffffffffffffffffffffffffffffffffffffff")
                console.log(new Date(item.jour.seconds * 1000))
                console.log(item.equipeOrganisatrice)
                console.log("fffffffffffffffffffffffffffffffffffffffff")

            
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

   displayListDefisAndParties() {
        if(this.state.allDefisPartie != undefined) {

       

            if(this.state.allDefisPartie.length != 0) {

                return(
                    <ScrollView style = {{paddingBottom : hp('20%')}}>
                        <View style = {{ alignContent : "center", paddingBottom : 180, marginBottom : hp('60%')}}>
                            <FlatList
                                data = {this.state.allDefisPartie}
                                renderItem = {this._renderItem}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    </ScrollView>
                
                )
            } else {
                return(
                    <Text>Aucun défi ou partie n'est disponible</Text>
                )
            }
        
        } else {
            return(
                <Text>Chargement des suggestions ...</Text>
            )
        }
    }


    render() {
        if( !this.state.isLoading) {
            return(
                <View style = {styles.mainContainer}>
                    <View style = {{borderBottomRightRadius : 20,  borderBottomLeftRadius : 20, backgroundColor : 'white',paddingBottom : hp('2%')}}>
                        <TouchableOpacity 
                            style = {styles.bloc}
                            onPress = {() => this.callNextScreen(Type_Defis.defis_2_equipes)}>
                            <Text style ={styles.txtTitre}>Proposer un défis entre deux équipes</Text>
                            <Text style  = {styles.txt}>Avec ton équipe, propose une rencontre à une autre équipe</Text>
                        </TouchableOpacity>

                        <TouchableOpacity  
                                style = {styles.bloc}
                                onPress = {() =>this.callNextScreen(Type_Defis.partie_entre_joueurs)}>
                                
                            <Text style ={styles.txtTitre} >Proposer une partie entre joueurs</Text>
                            <Text style  = {styles.txt}>Seul ou à plusieurs propose une rencontre à d'autre joueurs</Text>
                        </TouchableOpacity>

                        {/* Juste un test */}
                        <TouchableOpacity  
                            style = {styles.bloc}
                            onPress = {() =>  {
                                //this.sendPushNotification()
                                this.props.navigation.push("CalendrierJoueur")}}>
                            <Text style ={styles.txtTitre}>Afficher ton calendrier</Text>
                       </TouchableOpacity>
                       {/*<TouchableOpacity  
                            style = {styles.bloc}
                            onPress = {() => this.props.navigation.push("RejoindrePartieDefi")}>
                            <Text style ={styles.txtTitre}>Rejoindre un défi / partie déjà créé</Text>
                       </TouchableOpacity>*/}
                    </View>
                
                    <View style ={{backgroundColor : Color.lightGray}}>
                        <Text style = {styles.txtSuggestion}>Suggestions</Text>
                        {this.displayListDefisAndParties()}
                    </View>
                

                </View>
            )
        } else {
            return(
                <View style = {styles.main_container}>
                    {/* Image de l'herbre */}
                    <View style = {styles.View_grass}>
                        <Image 
                            source = {require('app/res/grass.jpg')}
                            style = {styles.grass}
                        />
                    </View>

                    {/* View contenant le text Agoora */}
                    <View style = {styles.view_agoora}>
                        <Text style = {styles.txt_agoora}>AgOOra</Text>
                    </View>
                
                    {/* View contenant le texte */}
                    <View style = {{marginTop :hp('30%')}}>
                        <Text style = {{fontSize : RF(2.5)}}>Chargement</Text>
                    </View>

                    {/* Indicateur de chargement */}
                    <SkypeIndicator 
                    color='#52C7FD'
                    size = {hp('10%')} />
                </View>
            )
        }
    }
}

const styles = {
    mainContainer : {
        marginTop : hp('2%'),
        backgroundColor : Color.lightGray
    },

    bloc  : {
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        borderWidth : 1,
        borderRadius : 8,
        alignSelf : 'center',
        width : wp('80%'),
        paddingVertical : hp('1%'),
        backgroundColor : '#313131'
    
    },

    txtTitre : {
        fontWeight : 'bold',
        fontSize : RF(2.4),
        marginLeft : wp('3%'),
        color : '#DE6868'
    },

    txt : {
        marginLeft : wp('3%'),
        color : 'white'
    },
    grass : {
        width : wp('100%'),
        height : wp('22%')
    },

    txtSuggestion : {
        marginTop : hp('2%'),
        fontSize : RF(4.3),
        alignSelf  : "center"
    }
} 

const mapStateToProps = (state) => {
    return{ 
		state
    } 
}

export default  connect(mapStateToProps) (Accueil_Jouer)
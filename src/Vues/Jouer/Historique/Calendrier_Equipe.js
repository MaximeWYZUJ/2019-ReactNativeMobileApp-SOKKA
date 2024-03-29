
import React from 'react'

import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity,FlatList,Alert,ScrollView,SectionList,Button} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../../Data/Database';
import Item_Defi from '../../../Components/Defis/Item_Defi'
import Item_Partie  from '../../../Components/Defis/Item_Partie'
import Type_Defis from '../Type_Defis'
import Colors from '../../../Components/Colors'
import LocalUser from '../../../Data/LocalUser.json'


/**
 * Permet d'afficher l'historique d'un joueur
 */
export default class Calendrier_Equipe extends React.Component {

    constructor(props) {
        super(props)
        this.monId = this.props.navigation.getParam('id', LocalUser.data.id);
        this.equipeId = this.props.navigation.getParam("idEquipe", "erreur")
        this.nomEquipe = this.props.navigation.getParam("nomEquipe", "erreur")

        this.state  = {
            defisPassesDisp : [],
            nbPassesDisp : 0,
            defisPasses : [],
            defisaVenir : [],
            latitude : 0,
            longitude : 0,
            allDefis : [],
            isLoading : true,
            index : 0,
            refreshing: false
        }
    }

    componentDidMount() {
        this.getAllDefisAndPartie()
    }


    static navigationOptions = ({ navigation }) => {
        return { 
            title: navigation.getParam('header', 'Calendrier'),
        };
    }


    /** Fonction qui va permettre de trouver tous les défis et parties auxquels 
     * participes l'equipe
     */
    getAllDefisAndPartie() {
        var db = Database.initialisation()
        var defisPasses = []
        var defisaVenir = []
        var allDefis = []
        var index = 1
        var now = new Date()
        var ref = db.collection("Defis");
        var query = ref.where("equipesConcernees", "array-contains", this.equipeId).orderBy("dateParse")

        query.get().then(async (results) => {
            console.log("CALENDRIER :",results.docs.length )
            for(var i = 0; i < results.docs.length ; i++) {
                var dateDefi = new Date(  results.docs[i].data().jour.seconds*1000 - 7200000)

                var defi = results.docs[i].data()
                defi.jour.seconds = defi.jour.seconds -7200
                // Si le defi ou la partie est passés
                if(dateDefi < now) {
                    var def
                    defisPasses.push(defi)
                    index ++
                }else {
                    defisaVenir.push(defi)
                }
                allDefis.push(defi)
                
                //defisArray.push(results.docs[i].data())
            }
            this.setState({
                defisaVenir : defisaVenir,
                defisPasses : defisPasses,
                allDefis : allDefis,
                isLoading : false,
                index : index
            })
            
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
  
    /**
     * Fonction qui permet de construire la liste des participants à une partie, elle 
     * enlève de la liste les joueurs indisponibles
     * @param {*} partie 
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

  


    _renderItem =({item, index, section}) => {   
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
                    partieData = {item}
                    dateString = {item.dateString}

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
                    dateString = {item.dateString}

                />
            )
        } else {
            return(
                <Text>oooo</Text>
            )
        }  
    }

    _renderSectionHeader({section: {title}}) {
        return(
            <View
            style = {{width : wp('100%'), height : hp('1.5%'), backgroundColor   :'black'}}/>
        )
    }

      

    /**
     * Fonction qui affiche la liste des défis et parties de l'utilisateur
     * ou un message si il n'en a pas
     */
    renderListDefiPartie() {
        if(this.state.allDefis != 0 ) {
            return(
                <View style = {{backgroundColor : Colors.grayItem, marginBottom : hp('10%')}} >
                    <Text style = {{fontSize : RF(2.5), alignSelf : "center", marginBottom : hp('2%'), marginTop : hp('2%')}}>Calendrier</Text>

                    <SectionList
                        ref={ref => (this.sectionListRef = ref)}
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderSectionHeader}
                        getItemLayout={this.getItemLayout}
                        initialScrollIndex={0}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({refreshing: true});

                            var n = Math.min(this.state.nbPassesDisp + 5, this.state.defisPasses.length);
                            this.setState({
                                nbPassesDisp: n,
                                defisPassesDisp: this.state.defisPasses.slice(-n)
                            })

                            this.setState({refreshing: false});
                        }}
                        sections={[
                            {title: 'Title1', data: this.state.defisPassesDisp},
                            {title: 'Title2', data: this.state.defisaVenir},
                        ]}
                        keyExtractor={(item, index) => item + index}
                        style = {{marginBottom : hp('10%')}}

                    />
                </View>
            ) 
        } else {
            return(
                <View>
                    <Text>Pas encore de défi ou partie</Text>
                </View>
            )
        }
    }

    render() {
        if(! this.state.isLoading) {

            return(
                <View>
                    {this.renderListDefiPartie()}
                </View>
            )
            
        } else{
            return(
                <View>
                    <Text>Chargement ...</Text>
                </View>
            )
        }
    }
}
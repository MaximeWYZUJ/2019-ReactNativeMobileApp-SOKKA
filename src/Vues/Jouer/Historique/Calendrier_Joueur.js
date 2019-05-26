
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
export default class Calendrier_Joueur extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id
        this.monPseudo = LocalUser.data.pseudo
        this.state  = {
            defisPasses : [],
            defisaVenir : [],
            latitude : 0,
            longitude : 0,
            allDefis : [], 
            isLoading : true,
            index : 0
            
        }

    }

    componentDidMount() {
        this.getAllDefisAndPartie()
      
    }

    


    /** Fonction qui va permettre de trouver tous les défis et parties auxquels 
     * participes l'utilisateur
     */
    getAllDefisAndPartie() {
        var db = Database.initialisation()
        var defisPasses = []
        var defisaVenir = []
        var allDefis = []
        var index = 1
        var now = new Date()
        var ref = db.collection("Defis");
        var query = ref.where("participants", "array-contains", this.monId).orderBy("dateParse")

        // On regarde si l'utilisateur participe à un defi
        query.get().then(async (results) => {
            for(var i = 0; i < results.docs.length ; i++) {
                var dateDefi = new Date(  results.docs[i].data().jour.seconds*1000)

                // Si le defi ou la partie est passés
                if(dateDefi < now) {
                    defisPasses.push(results.docs[i].data())
                    index ++
                }else {
                    defisaVenir.push(results.docs[i].data())
                }
                allDefis.push(results.docs[i].data())
                //defisArray.push(results.docs[i].data())
            }

            // Query pour trouver les équipes dont l'user est capitaine
            var refEquipe = db.collection("Equipes");
            var queryEqCap = refEquipe.where("capitaines", "array-contains", this.monId)
            queryEqCap.get().then(async (resultsEquipe) => {
                for(var i = 0; i < resultsEquipe.docs.length ; i++) {

                    var idEquipe =resultsEquipe.docs[i].data().id
                    // Query pour trouver si cette équipe organise un defi
                    var queryEqOrga = ref.where("equipeOrganisatrice", "==", idEquipe)

                    queryEqOrga.get().then(async (resultsDefiOrga) => {
                        for(var i = 0; i < resultsDefiOrga.docs.length ; i++) {
                            var dateDefi = new Date(  resultsDefiOrga.docs[i].data().jour.seconds*1000)
                            if(! this.allreaddyDownloadDefi(allDefis, resultsDefiOrga.docs[i].data())) {
                                // Si le defi ou la partie est passés
                                if(dateDefi < now) {
                                    defisPasses.push(resultsDefiOrga.docs[i].data())
                                    index ++
                                }else {
                                    defisaVenir.push(resultsDefiOrga.docs[i].data())
                                }
                                allDefis.push(resultsDefiOrga.docs[i].data())
                            }
                            
                        }
                    })

                    // Query pour trouver si cette équipe est defiée pour un  defi
                    var queryEqDefiee = ref.where("equipeDefiee", "==",idEquipe)

                    queryEqDefiee.get().then(async (resultsDefiDefiee) => {
                    
                        for(var i = 0; i < resultsDefiDefiee.docs.length ; i++) {
                            var dateDefi = new Date(  resultsDefiDefiee.docs[i].data().jour.seconds*1000)
                            if(! this.allreaddyDownloadDefi(allDefis, resultsDefiDefiee.docs[i].data())) {

                                // Si le defi ou la partie est passés
                                if(dateDefi < now) {
                                    defisPasses.push(resultsDefiDefiee.docs[i].data())
                                    index ++
                                }else {
                                    defisaVenir.push(resultsDefiDefiee.docs[i].data())
                                }
                                allDefis.push(resultsDefiDefiee.docs[i].data())
                            }
                        }

                        this.setState({
                            defisaVenir : defisaVenir,
                            defisPasses : defisPasses,
                            allDefis : allDefis,
                            isLoading : false,
                            index : index
                        })
                    })
                }

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

    _renderSectionHeader({section: {title}}) {
        return(
            <View
            style = {{width : wp('100%'), height : hp('1.5%'), backgroundColor   :'black'}}/>
        )
    }



    scrollToSection =() => {
        this.sectionListRef.scrollToLocation({
          animated: true,
          sectionIndex: 1,
          itemIndex: 0,
          viewPosition: 0
        });
      };
      

    /**
     * Fonction qui affiche la liste des défis et parties de l'utilisateur
     * ou un message si il n'en a pas
     */
    renderListDefiPartie() {
        if(this.state.allDefis != 0 ) {
            return(
                <View style = {{backgroundColor : Colors.grayItem}} >
                    <Text style = {{fontSize : RF(2.5), alignSelf : "center", marginBottom : hp('2%'), marginTop : hp('2%')}}>Calendrier</Text>
                   
                    <SectionList
                        ref={ref => (this.sectionListRef = ref)}
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderSectionHeader}
                        getItemLayout={this.getItemLayout}
                        initialScrollIndex={this.state.index}
                        sections={[
                            {title: 'Title1', data: this.state.defisPasses},
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
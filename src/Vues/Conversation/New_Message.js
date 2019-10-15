
import React from 'react'
import { StyleSheet, Text, Image, ScrollView, TouchableOpacity, View, FlatList,RefreshControl, Alert,TextInput,KeyboardAvoidingView,SafeAreaView } from 'react-native'

import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';
import Simple_Loading from '../../Components/Loading/Simple_Loading'
import StarRating from 'react-native-star-rating'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import AlphabetListView from 'react-native-alphabetlistview'
import CheckBox from 'react-native-checkbox'

import firebase from 'firebase'
import '@firebase/firestore'
import Joueur_Pseudo_Score from '../../Components/ProfilJoueur/Joueur_Pseudo_Score'
export default class New_Message extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isLoading : true,
            joueurs : [],
            newGroupe : false,
            joueursSelectiones : [],
            joueursFiltres : [],
            ajoutGroupeExistant: this.props.navigation.getParam('ajoutGroupeExistant', false),
            groupe : this.props.navigation.getParam('groupe', undefined),
        }

     
    }

    static navigationOptions = ({ navigation }) => {
        return { 
            title:"Discussions",    
        }; 
    }

    componentDidMount(){
        this.getJoueur()
    }

    async getJoueur(){
        var joueurs = await Database.getArrayDocumentData(LocalUser.data.reseau, "Joueurs")
        var joueurBuild = this.buildJoueurs(joueurs)
        this.setState({joueurs : joueurs,joueursFiltres : joueurBuild , isLoading : false})
    }

    texteChanged = (searchedText) => {
        var newJoueurs = []
        for(var i =0 ; i < this.state.joueurs.length; i++){
            var joueur = this.state.joueurs[i]
            if(joueur.pseudo.startsWith(searchedText)) {
                newJoueurs.push(joueur)
            }
        }
        var jbuild = this.buildJoueurs(newJoueurs)
        this.setState({joueursFiltres : jbuild})
    }

    async creerSimpleConv(joueur){
        this.setState({isLoading : true})
        // Verifier si la conv existe pas déja 
        var db = Database.initialisation()
        var refConv  = db.collection("Conversations");
        var query = refConv.where("participants", 'array-contains' , LocalUser.data.id).where("estUnGroupe", "==",false)
        query.get().then(async (results) => {
            console.log("query ok !!!")
            var pasResultat = results.docs.length == 0
            var existePas = true
            for( var i  = 0 ; i < results.docs.length; i++) {
                existePas = existePas && !results.docs[i].data().participants.includes(joueur.id)
                if(results.docs[i].data().participants.includes(joueur.id)) {
                    var conv = results.docs[i].data()
                    conv.joueur = joueur
                }
            }
            console.log("==== pseudo  §§§ ====", joueur.pseudo)
           if(pasResultat || existePas) {
               var ref = db.collection("Conversations").doc()
                await ref.set({
                    aLue : false,
                    id : ref.id,
                    lecteurs : [],
                    participants : [joueur.id, LocalUser.data.id],
                    estUnGroupe : false
                })
                var conv = {
                    aLue : false,
                    id : ref.id,
                    lecteurs:[],
                    participants : [id, LocalUser.data.id],
                    estUnGroupe : false,
                    joueur : joueur
                }
                this.props.navigation.push("ListMessages", {conv : conv})
           } else {
                this.props.navigation.push("ListMessages", {conv : conv})
           }
        })
        
        
    }


    buildDataJoueursNav(){
        var liste = []
        for(var i =0; i < this.state.joueurs.length; i++){
            if(this.state.joueursSelectiones.includes(this.state.joueurs[i].id)) {
                liste.push(this.state.joueurs[i])
            }
        } 
        return liste
    }
    
    /**
     * Fonction qui permet de trier les joueurs en fonction de l'ordre laphabethique
     * de leur pseudo.
     * @param {*} joueurs 
     */
    buildJoueurs(joueurs) {
        let  data =  {
            A: [],
            B: [],
            C: [],
            D: [],
            E: [],
            F: [],
            G: [],
            H: [],
            I: [],
            J: [],
            K: [],
            L: [],
            M: [],
            N: [],
            O: [],
            P: [],
            Q: [],
            R: [],
            S: [],
            T: [],
            U: [],
            V: [],
            W: [],
            X: [],
            Y: [],
            Z: [],
        }
        for(var i = 0; i < joueurs.length ; i ++) {
            joueur = joueurs[i]
            let lettre = joueur.pseudo[0].toUpperCase()
            let arrayj = data[lettre]
            let j = {
                pseudo : joueur.pseudo,
                photo : joueur.photo,
                score : joueur.score,
                id : joueur.id
            }
            arrayj.push(j)
            data[lettre] = arrayj
        }
        return data
    }

    selectionnerUnJoueur(id) {
        var joueurs = this.state.joueursSelectiones
        if(this.state.joueursSelectiones.includes(id)) {
            var newJoueurs = []
            for(var i = 0 ; i < joueurs.length; i++) {
                if(joueurs[i] != id) newJoueurs.push(joueurs[i])
            }
        } else {
            var newJoueurs = joueurs
            newJoueurs.push(id)
        }
        this.setState({joueursSelectiones : newJoueurs})
    }

    async ajoutGroupeExistant(){
        console.log("in ajout groupe existant")
        this.setState({isLoading : true})
        console.log("after set state")
        var db = Database.initialisation()
        console.log(this.state.joueursSelectiones)
        console.log(this.state.groupe.id)
        for(var i = 0; i < this.state.joueursSelectiones.length; i++){
            await db.collection("Conversations").doc(this.state.groupe.id).update({
                participants : firebase.firestore.FieldValue.arrayUnion(this.state.joueursSelectiones[i])
            }).catch(function(error){
                console.log(error)
            })
        }
        this.setState({isLoading : false})

        console.log("before concat")
        console.log(this.state.groupe.participants)
        var groupe = this.state.groupe
        groupe.participants = groupe.participants.concat(this.state.joueursSelectiones)
        console.log("after concat")
        console.log(groupe.participants)
        this.props.navigation.push("ListMessages", {conv : groupe})
    }

    _renderCell= ({item}) => {
        return(
            <View style = {{marginRight : wp('8%'), flexDirection : "row"}}>
                <TouchableOpacity style = {[styles.containerItemJoueur, this.props.style]}
                    onPress = {() =>{
                        if(! this.state.newGroupe) {
                            this.creerSimpleConv(item)
                        }
                    }}>

                    <Image
                        source = {{uri : item.photo}}
                        style = {styles.photoJoueur}
                    /> 

                    {/* View contenant le pseudo est le score*/}
                    <View style = {{justifyContent : "center"}}>
                        <Text>{item.pseudo}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.score}
                            starSize={hp('2.2%')}
                            fullStarColor='#F8CE08'
                            emptyStarColor='#B1ACAC'
                        />
                    </View> 
            </TouchableOpacity>
            

            {this.renderCheckBox(item.id)}
                
          </View>
            
        )
    }

    


    renderCheckBox(id){
        if(this.state.ajoutGroupeExistant) {
            var checked = this.state.groupe.participants.includes(id) || this.state.joueursSelectiones.includes(id)
            return(
                <CheckBox
                
                label=' '
                containerStyle={{backgroundColor: 'white', borderWidth :0,alignSelf : "center"}}                    
                checked={checked}
                onChange={() => {
                    if(! this.state.groupe.participants.includes(id)) {
                        this.selectionnerUnJoueur(id)
                    }
                }}
            />
            )
        } else if(this.state.newGroupe) {
            
            return(
                <CheckBox
                
                label=' '
                containerStyle={{backgroundColor: 'white', borderWidth :0,alignSelf : "center"}}                    
                checked={this.state.joueursSelectiones.includes(id)}
                onChange={() => {
                    this.selectionnerUnJoueur(id)
                }}
            />
            )
        }
    }



    renderNewGroupe(){
        if(! this.state.newGroupe) {
            return(
                <TouchableOpacity
                    style = {{flexDirection :"row", marginTop : hp('2%'), marginLeft : wp('2%')}}
                    onPress = {() => this.setState({newGroupe : true})}>

                    <Image
                        source= {require('../../../res/group_blue.png')}
                        style = {{width : wp('6%'), height : wp('6%'), marginRight : wp('3%')}}/>

                    <Text style =  {styles.annuler}>Nouveau groupe</Text>
                </TouchableOpacity>
            )
        }
    }


    renderListReseau(){
        if(this.state.isLoading) {
            return(
                <Simple_Loading
                    taille = {hp('4%')}
                />
            )
        } else {
            return(
                <View style = {{flex :1, marginTop : wp('1%')}}>

                    <AlphabetListView
                        data={this.state.joueursFiltres}
                        cell={this._renderCell}
                        cellHeight={60}
                        sectionListItem={SectionItem}
                        sectionHeader={SectionHeader}
                        sectionHeaderHeight={22.5}
                    />
                </View>
            )
        }
    }


    renderHeader(){
        if(this.state.newGroupe || this.state.ajoutGroupeExistant) {
            return(
                <View style = {{flexDirection : "row", justifyContent : "space-between"}}>
                    <TouchableOpacity 
                        onPress = {() => this.setState({newGroupe : false, joueursSelectiones : []})}>
                        <Text style = {[styles.annuler , {marginLeft : wp('2%')}]}>Annuler</Text>
                    </TouchableOpacity> 

                    <View>
                        <Text style = {styles.titre}>Ajouter des participants</Text>
                        <Text>{this.state.joueursSelectiones.length} / {LocalUser.data.reseau.length}</Text>

                    </View>                   
                    <TouchableOpacity
                        onPress = {() => {
                            if(this.state.ajoutGroupeExistant && this.state.joueursSelectiones.length > 0) {
                                this.ajoutGroupeExistant()
                            } else  if(! this.state.ajoutGroupeExistant && this.state.joueursSelectiones.length > 1) {
                                    this.props.navigation.push("NewGroupe", {joueurs :this.buildDataJoueursNav()})
                            }
                        }}>
                        <Text style = {styles.annuler}>Suivant</Text>
                    </TouchableOpacity>     
                   
                </View>
            )
        } else  if(! this.state.newGroupe){
            return(
                <View style = {{flexDirection : "row", justifyContent : "space-between"}}>
                    <View style = {{width : wp('2%')}}></View>
                    <Text style = {styles.titre}>Nouv. Discussion</Text>
                    <TouchableOpacity>
                        <Text style = {styles.annuler}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )
        } 
    }

    render() {
        return(
            <View style = {{flex : 1}}>

                {this.renderHeader()}

                {this.renderNewGroupe()}

                <TextInput
                    style = {styles.searchBar }
                    placeholder = {"Rechercher"}
                    onChangeText = {this.texteChanged}/>

                {this.renderListReseau()}
            </View>
        )
    }
}

class SectionHeader extends React.Component {

    render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      color:'black',
      fontWeight:'bold',
      fontSize:RF(2.5),
      marginLeft : wp('2.5%')
    };

    var viewStyle = {
      backgroundColor: '#F7F7F7'
    };
  
    return (
        <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
      
    );
  }
}

class SectionItem extends React.Component {
  render() {
    

    return (
        <Text style={{color:'black'}}>{this.props.title}</Text>
    );
  }
}

class Cell extends React.Component {
  
    render() {
    return (
        <View style = {{marginRight : wp('8%')}}>
        <Joueur_Pseudo_Score 
            pseudo = {this.props.item.pseudo}
            score = {this.props.item.score}
            photo = {this.props.item.photo}
        />
            
      </View>
    );
  }
}

const styles = {
    titre : {
        fontWeight : "bold",
        fontSize : RF(2.5)
    },

    annuler : {
        color : Color.agOOraBlue,
        marginRight : wp('2%')
    },
    
    searchBar : {
        width : wp('85%'),
        height :hp('5%'),
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        backgroundColor : Color.grayItem,
        alignSelf : "center"
    },
    containerItemJoueur : {
        flexDirection : 'row',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6
    },

    photoJoueur : {
        marginRight : wp('3%'),
        width :  wp('16%'),
        height :  wp('16%'),
        borderRadius : wp('8%')
    },
}
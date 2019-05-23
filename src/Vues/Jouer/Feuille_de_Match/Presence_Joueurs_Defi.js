import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Animated, } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import { connect } from 'react-redux'
import StarRating from 'react-native-star-rating'
import { CheckBox } from 'react-native-elements'
import actions from '../../../Store/Reducers/actions'
import {SkypeIndicator} from 'react-native-indicators';
import Database from '../../../Data/Database'
import Joueur_Pseudo_Score from '../../../Components/ProfilJoueur/Joueur_Pseudo_Score'
import LocalUser from '../../../Data/LocalUser.json'


/**
 * Classe qui permet d'afficher les joueurs présent à un défi passé. Chaque 
 * joueurs affichés fait parti de l'équipe de l'utilisateur
 */
class Presence_Joueurs_Defi extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id
        this.state = {
            isLoading : true,
            joueurs : [],
            joueursPresent : []
        }

    }



    componentDidMount() {
        this.getAllDataJoueurs()
    }



    /**
     * Fonction qui va permettre de récupérer les données de joueurs 
     * participants au défi
     */
    async getAllDataJoueurs() {

        var j = []
        var capitaines = []
        var confirme = []
        
        for(var i = 0; i < this.props.dataJoueursDefi.length ; i++) {
            var joueur =this.props.dataJoueursDefi[i]

            // Ajouter le joueur à la bonne liste
            if(this.props.equipeUserDefi.capitaines.includes(joueur.id)) {
                capitaines.push(joueur)
            } else {
                j.push(joueur)
            }

            // Trouver l'équipe concernée
            if(this.props.equipeUserDefi.id == this.props.defi.equipeOrganisatrice) {
                if(this.props.defi.confirmesEquipeOrga.includes(joueur.id)) confirme.push(joueur.id)
            } else {
                if(this.props.defi.confirmesEquipeDefiee.includes(joueur.id)) confirme.push(joueur.id)
            }

            
        }

        j = j.sort(function (a, b) {
            if(a.pseudo == b.pseudo ) {
                return 0
            } else {
                return a.pseudo.toLowerCase().localeCompare(b.pseudo.toLowerCase())
            }
        })

        capitaines = capitaines.sort(function (a, b) {
            if(a.pseudo == b.pseudo ) {
                return 0
            } else {
                return a.pseudo.toLowerCase().localeCompare(b.pseudo.toLowerCase())
            }
        })
        this.setState({joueurs : capitaines.concat(j), joueursPresent : confirme,isLoading : false, })

    }


  

    /**
     * Fonction qui permet d'ajouter un joueur de la liste des joueurs présents
     * et donc renvoyer un nouveau array dans le state 
     */
    addPlayerFromListePresents(joueur){
        var liste = [] 
        for(var i = 0; i <this.state.joueursPresent.length; i++) {
            liste.push(this.state.joueursPresent[i])
        }
        liste.push(joueur.id)
        
        this.setState({joueursPresent : liste})
        

        const action = { type: actions.STORE_JOUEURS_PRESENT, value: liste}
        this.props.dispatch(action)
    }


    /**
     * Fonction qui permet de supprimer un joueur de la liste des joueurs présents
     * et donc renvoyer un nouveau array dans le state 
     */
    removePlayerFromListePresents(joueur){
        var liste = [] 
        for(var i = 0; i <this.state.joueursPresent.length; i++) {
            if (this.state.joueursPresent[i] != joueur.id) liste.push(this.state.joueursPresent[i])
        }
        this.setState({joueursPresent : liste})
        const action = { type: actions.STORE_JOUEURS_PRESENT, value:liste}
        this.props.dispatch(action)
    }
    

    _renderCheckBox(joueur) {
        var isCheck = this.state.joueursPresent.includes(joueur.id)
        
        return(
            <CheckBox
                right
                title=' '
                checkedColor = {Colors.agOOraBlue}
                
                containerStyle={{backgroundColor: 'white', borderWidth :0, justifyContent : 'center'}}                    
                checked={isCheck}
                onPress = {()=> {
                    if(this.props.equipeUserDefi.capitaines.includes(this.monId)){
                        if(isCheck) {
                        
                            this.removePlayerFromListePresents(joueur)
                        } else {
                            this.addPlayerFromListePresents(joueur)
                        }   
                    } else {
                        Alert.alert(
                            '',
                            'Seuls les capitaines peuvent renseigner les présences'
                        )
                    }
                    
                }} 
                
            />
        )
    }
    

   

    _renderItem = ({item}) => {
        
        return(
            <View style = {{flexDirection : "row", justifyContent : "space-between"}}>
                <Joueur_Pseudo_Score
                    pseudo = {item.pseudo}
                    score = {item.score}
                    photo = {item.photo}/>

                {this._renderCheckBox(item)}
                
            </View>
        )
        
    
    }
   

    render() {
        console.log(this.props.joueursPresents)
       if( !this.state.isLoading) {
            return(
                <View>
                    <FlatList
                        data = {this.state.joueurs}
                        renderItem = {this._renderItem}
                        extraData= {this.props.joueursPresents}
                    />
                </View>
            )
       } else {
           return(
               <View style = {{marginTop : hp('9%')}}>
                   <SkypeIndicator 
                    color='#52C7FD'
                    size = {hp('10%')} />
                </View>
           )
       }
        
    }
}

const mapStateToProps = (state) => {
    return{ 
        defi : state.defi,
        equipeUserDefi: state.equipeUserDefi,
        joueursDefi : state.joueursDefi,
        dataJoueursDefi : state.dataJoueursDefi,
        joueursPresents : state.joueursPresents
    } 
}

export default connect(mapStateToProps) (Presence_Joueurs_Defi)
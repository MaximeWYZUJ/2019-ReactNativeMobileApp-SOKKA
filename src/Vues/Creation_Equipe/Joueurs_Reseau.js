
import React from 'react'

import {View, Text,Image,TouchableOpacity, TextInput, ScrollView,FlatList} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Joueurs from '../../Helpers/JoueursForAjout'
import { connect } from 'react-redux'
import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'
import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import {SkypeIndicator} from 'react-native-indicators';
import Barre_Recherche from '../../Components/Recherche/Barre_Recherche'

/**
 * Classe qui va permettre à l'utilisateur permettre de choisir les joueurs de son 
 *  réseau à ajouter à l'équipe qu'il est en train de creer
 */
class Joueurs_Reseau_Final extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            joueurs : [],
            allJoueurs : [],
            joueurFiltres : [],
            distanceMax : 50,
            isLoading : true
        }
        this.reseau = LocalUser.data.reseau
    }

    testAppartient(x,e) {
        var ok = false;
        for(var i = 0; i < x.length; i ++) {
            if(e == x[i]) {
                ok =  true
            }
        }
        
        return ok
    }

    componentDidMount() {
        this.downloadDataJoueur()
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



    /**
     * Fonction qui permet de télécharger les données des joueurs du réseau 
     * de l'utilisateur
     */
    async downloadDataJoueur() {
        var liste = []
        for(var i = 0 ; i < this.reseau.length; i++) {
            var joueur = await Database.getDocumentData(this.reseau[i], "Joueurs")
            liste.push(joueur)
        }

        this.setState({allJoueurs : liste, joueurFiltres : liste, isLoading : false})
    }

    /**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les equipes 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
		this.setState({
            joueurFiltres : data,
		})
    }

    renderItem = ({item}) => {
        return (
        <Joueurs_Ajout_Item 
            joueur = {item}
            isShown = {this.props.joueursSelectionnes.includes(item.id)}
            txtDistance = ' '
        />)
    }

    _renderCell= ({item}) => {
        return(
            <Cell
                item = {item}
                isShown = {this.props.joueursSelectionnes.includes(item.id)}
            />
        )
    }
    render() {
       // const joueursSelectionnes = this.props.joueursSelectionnes;
       // const renderItem = ({ item }) => ( <Joueurs_Ajout_Item 
           // joueur = {item}
           // isShown = {this.testAppartient(joueursSelectionnes,item.id)}
        

       // />);
       if(! this.state.isLoading) {

            return(
                <View>
                    {/* View contenant la bare de recherche */}
                    <Barre_Recherche
                        handleTextChange ={this.recherche}
                        data = {this.state.allJoueurs}
                        field = "pseudo"
                     />
                    <ScrollView style = {{marginBottom : hp('7%')}}>
                            <FlatList
                                style = {{flex : 1}}
                                removeClippedSubviews = {true}
                                data = {this.state.joueurFiltres}
                                keyExtractor={(item) => item.id}
                                extraData = {this.props.joueursSelectionnes}
                                renderItem={this.renderItem}
                            />
                
                        
                
                </ScrollView>
                <Text> </Text>

                </View>

            )
        } else {
            return(
                <View style = {{marginTop : hp('15%')}}>
                    <SkypeIndicator 
                     color='#52C7FD'
                     size = {hp('10%')} />
                 </View>
            )
        }
    }
}
const styles = {
    search_image: {
        width: wp('7%'),
        height: wp('7%'),
    },
}


const mapStateToProps = (state) => {
    return{ 
        joueurs : state.joueurs,
        joueursSelectionnes : state.joueursSelectionnes

    } 
}
  
export default connect(mapStateToProps)(Joueurs_Reseau_Final)
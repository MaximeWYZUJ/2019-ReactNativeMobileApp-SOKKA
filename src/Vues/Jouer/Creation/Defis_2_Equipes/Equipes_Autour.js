
import React from 'react'
import {View,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../.././../../Components/Colors'
import Barre_Recherche from '../../../../Components/Recherche/Barre_Recherche'
import DataBase from '../../../../Data/Database'
import { connect } from 'react-redux'

import Item_Equipe_Creation_Defis from '../../../../Components/Profil_Equipe/Item_Equipe_Creation_Defis'
// A suppr 
const ville = "Toulouse"

/**
 * Classe qui va permettre à l'utilisateur de voir et de selectionner une équipe dans 
 * la même ville que lui.
 */
class Equipes_Autour extends React.Component {

    constructor(props) {
        super(props) 
        this.monEquipe = this.props.monEquipe
        this.state = {
            equipesAutour : [],
            equipeFiltrees : []
        }
        
    }

    /**
     * On va effectuer une query pour sortir 15 équipes dans la même ville que l'utilisateur
     */
    componentDidMount() {

        var equipeArray = []
        var db = DataBase.initialisation()

        var ref = db.collection("Equipes");
        var query = ref.where("ville", "==", ville).limit(15);
        query.get().then(async (results) => {
            if(results.empty) {
              console.log("No documents found!");   
            } else {
              // go through all results
              for(var i = 0; i < results.docs.length ; i++) {
                if(results.docs[i].data().id != this.monEquipe) {
                    equipeArray.push(results.docs[i].data())

                }
              }
              
              this.setState({equipesAutour : equipeArray, equipeFiltrees : equipeArray})

              

            }

        
          }).catch(function(error) {
              console.log("Error getting documents:", error);
          });
        

        
    }

    /**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les equipes 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
		this.setState({
			equipeFiltrees : data
		})
    }
    
    _renderItem = ({item}) => {
        return(
            <Item_Equipe_Creation_Defis
                id = {item.id}
                nom = {item.nom}
                photo = {item.photo}
                score = {item.score}
                nbJoueurs = {item.joueurs.length}
                isChecked = {this.props.equipeAdverse == item.id}
            />
        )
    }



    render() {
        return(
            <View style = {{marginTop : hp('1%')}}>
                <Barre_Recherche
                    handleTextChange ={this.recherche}
                    data = {this.state.equipesAutour}
                    field = "nom"
                />

                <FlatList
                    data = {this.state.equipeFiltrees}
                    keyExtractor={(item) => item.id}
                    renderItem = {this._renderItem}
                    extraData = {this.props.equipeAdverse}
                />

            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return{ 
        equipeAdverse : state.equipeAdverse,
        monEquipe : state.monEquipe
		
    } 
}
export default connect(mapStateToProps) (Equipes_Autour)
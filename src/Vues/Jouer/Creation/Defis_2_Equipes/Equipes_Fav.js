
import React from 'react'
import {View,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../.././../../Components/Colors'
import BarreRecherche from '../../../../Components/Recherche/Barre_Recherche'
import FiltrerEquipe from '../../../../Components/Recherche/FiltrerEquipe'
import DataBase from '../../../../Data/Database'
import Item_Equipe_Creation_Defis from '../../../../Components/Profil_Equipe/Item_Equipe_Creation_Defis'

import { connect } from 'react-redux'


/**
 * Classe qui permet d'afficher la liste des équipes favorites de l'utilisateur. Elle
 * va de plus lui permettre de selectionner une équipe à affronter lors de la création
 * d'un défi entre deux équipes.
 */
class Equipes_Fav extends React.Component {

    constructor(props) {
        super(props) 
        this.monEquipe = this.props.monEquipe
        this.mesEquipesFav = this.props.equipesFav //Equipes_Fav_User
        this.state = {
            equipesFav : [],
            equipeFiltrees : [],
            filtres: null,
            displayFiltres: false
        }
    }

    /**
     * On va se connecter à la db et récupérer les équipes favorites de l'utilisateur
     *
     */
    componentDidMount() {

        var equipeArray = []
        var db = DataBase.initialisation()

        // Boucler sur les equipes pour récuperer les données. 
        for(var i = 0 ; i < this.mesEquipesFav.length; i++) {
            var equipeRef = db.collection('Equipes').doc(this.mesEquipesFav[i]);
            equipeRef.get().then(async(docEquipe) => {
                if(docEquipe.exists) {
                    var equipe = docEquipe.data()
                    if(equipe.id != this.monEquipe) {
                        equipeArray.push(equipe)

                    }
                } else {
                    console.log("No such document!");
                }
                this.setState({equipesFav : equipeArray, equipeFiltrees : equipeArray})
            })
        }

    }

    validerRecherche = (data) => {
        var dataF = FiltrerEquipe.filtrerEquipes(data, this.state.filtres);
        this.setState({
            equipeFiltrees: dataF,
        })
    }


    displayFiltresComponents() {
        if (this.state.displayFiltres) {
            return (<FiltrerEquipe handleValidate={this.handleValidateFilters} init={this.state.filtres}/>)
        }
    }


    handleFilterButton = () => {
        this.setState({
            displayFiltres: !this.state.displayFiltres
        })
    }


    handleValidateFilters = (q, f) => {
        var dataF = FiltrerEquipe.filtrerEquipes(this.state.equipesFav, f);
        this.setState({
                equipeFiltrees: dataF,
                filtres: f,
                displayFiltres: false
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
                
                <BarreRecherche
                    handleTextChange={this.validerRecherche}
                    data={this.state.equipesFav}
                    field={"queryName"}
                    filterData={(data) => FiltrerEquipe.filtrerEquipes(data, this.state.filtres)}
                    handleFilterButton={this.handleFilterButton}
                />
                {this.displayFiltresComponents()}

                <FlatList
                    data = {this.state.equipeFiltrees}
                    keyExtractor={(item) => item.id}
                    renderItem={this._renderItem}
                    extraData = {this.props.equipeAdverse}
                />
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return{ 
        equipeAdverse : state.equipeAdverse,
        equipesFav : state.equipesFav,
        monEquipe : state.monEquipe
		
    } 
}
export default connect(mapStateToProps)  (Equipes_Fav)

import React from 'react'
import LocalUser from '../../../../Data/LocalUser.json'
import Item_Equipe_Creation_Defis from '../../../../Components/Profil_Equipe/Item_Equipe_Creation_Defis'
import ComposantRechercheTableau from '../../../../Components/Recherche/ComposantRechercheTableau'

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
            <ComposantRechercheTableau
                type={"Equipes"}
                donneesID={LocalUser.data.equipesFav}
                renderItem={this._renderItem}
            />
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
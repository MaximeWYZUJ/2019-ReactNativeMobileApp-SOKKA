
import React from 'react'
import { connect } from 'react-redux'

import Item_Equipe_Creation_Defis from '../../../../Components/Profil_Equipe/Item_Equipe_Creation_Defis'
import ComposantRechercheAutour from '../../../../Components/Recherche/ComposantRechercheAutour'


/**
 * Classe qui va permettre à l'utilisateur de voir et de selectionner une équipe autour de lui
 */
class Equipes_Autour extends React.Component {

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
            <ComposantRechercheAutour
                type={"Equipes"}
                renderItem={this._renderItem}
            />
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

import React from 'react'
import Item_Equipe_Creation_Defis from '../../../../Components/Profil_Equipe/Item_Equipe_Creation_Defis'
import ComposantRechercheBDD from '../../../../Components/Recherche/ComposantRechercheBDD'
import { connect } from 'react-redux'


/**
 * Classe qui va permettre à l'utilisateur de faire une recherche (par nom ) d'une équipe
 * à défier. Pour limiter le nombre de requetes on commence à chercher dans la DB à partir 
 * de 4 caractères entrée
 */
class Rechercher_Equipe extends React.Component {

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
        return (

            <ComposantRechercheBDD
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
export default connect(mapStateToProps)(Rechercher_Equipe)
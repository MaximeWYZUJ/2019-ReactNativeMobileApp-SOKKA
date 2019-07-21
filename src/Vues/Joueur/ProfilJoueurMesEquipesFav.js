
import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import SearchList from '../../Components/SearchList.js'
import Item_Equipe from '../../Components/Profil_Equipe/Item_Equipe.js'
import LocalUser from '../../Data/LocalUser.json'


class ProfilJoueurMesEquipesFav extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Mes Equipes Fav')
        }
    }
    
    constructor(props) {
        super(props)
        this.joueur = this.props.navigation.getParam('joueur', null);
        this.equipesFav = this.props.navigation.getParam('equipesFav', null);
    }

    _get_header_title() {
        if (this.props.monProfil) {
            return "Mes Equipes Favorites"
        } else {
            return "Equipes Favorites"
        }
    }

    check_captain(idSelf, idCaptains) {
        for (idC of idCaptains) {
            if (idC === idSelf) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <View style={styles.main_container}>
                <SearchList
                    title={this._get_header_title()}
                    type={"EquipesFav"}
                    data={this.equipesFav}
                    renderItem={({item}) => <Item_Equipe
                        isCaptain={item.capitaines.some(elmt => elmt === this.joueur.id)}
                        alreadyLike={item.aiment.some(elmt => elmt === this.joueur.id)}
                        id={item.id}
                        nom={item.nom}
                        score={item.score}
                        photo={item.photo}
                        nbJoueurs={item.joueurs.length}
                        nav={this.props.navigation}
                    />}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    }
})

export default ProfilJoueurMesEquipesFav
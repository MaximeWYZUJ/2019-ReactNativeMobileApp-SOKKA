import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import SearchList from '../../Components/SearchList.js'
import Item_Equipe from '../../Components/Profil_Equipe/Item_Equipe.js';

class ProfilJoueurMesEquipes extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Mes Equipes')
        }
    }

    constructor(props) {
        super(props)
        this.equipes = this.props.navigation.getParam('equipes', null)
        this.joueur = this.props.navigation.getParam('joueur', null)
    }

    _get_header_title() {
        if (this.props.monProfil) {
            return "Mes Equipes"
        } else {
            return "Equipes"
        }
    }


    render() {
        return (
            <View style={styles.main_container}>
                <SearchList
                    title={this._get_header_title()}
                    list={<FlatList
                        data={this.equipes}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) =>
                            <Item_Equipe
                                isCaptain={item.capitaines.some(elmt => elmt === this.joueur.id)}
                                alreadyLike={item.aiment.some(elmt => elmt === this.joueur.id)}
                                id={item.id}
                                nom={item.nom}
                                score={item.score}
                                photo={item.photo}
                                nbJoueurs={item.joueurs.length}
                                nav={this.props.navigation}
                            />}
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

export default ProfilJoueurMesEquipes
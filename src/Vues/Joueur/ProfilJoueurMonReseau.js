import React from 'react'
import {View, StyleSheet, FlatList } from 'react-native'
//import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import JoueurItem from '../../Components/ProfilJoueur/JoueurItem.js'
import SearchList from '../../Components/SearchList.js'


class ProfilJoueurMonReseau extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Mon Réseau')
        }
    }

    constructor(props) {
        super(props)
        this.joueur = this.props.navigation.getParam('joueur', null)
        this.reseau = this.props.navigation.getParam('reseau', null)
    }


    _get_header_title() {
        if (this.props.monProfil) {
            return "Mon Réseau"
        } else {
            return "Réseau"
        }
    }


    render() {
        return (
            <View style={styles.main_container}>
                <SearchList
                    title={this._get_header_title()}
                    type={"Joueurs"}
                    data={this.reseau}
                    renderItem={({item}) => <JoueurItem
                        id={item.id}
                        nom={item.nom}
                        score={item.score}
                        photo={item.photo}
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

export default ProfilJoueurMonReseau

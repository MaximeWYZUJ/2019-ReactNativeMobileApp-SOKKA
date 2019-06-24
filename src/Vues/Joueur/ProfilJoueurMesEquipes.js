import React from 'react'
import { TouchableOpacity, View, StyleSheet, FlatList } from 'react-native'
import SearchList from '../../Components/SearchList.js'
import Item_Equipe from '../../Components/Profil_Equipe/Item_Equipe.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';


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


    getPlusButton() {
        return (
            <TouchableOpacity
                style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%')}}
                onPress={() => Alert.alert(
                                '',
                                "Que veux-tu faire ?",
                                [
                                    {
                                        text: 'Créer',
                                        onPress: () => this.props.navigation.push("CreationEquipeNom")
                                    },
                                    {
                                        text: 'Rechercher',
                                        onPress: () => this.props.navigation.navigate("AccueilRechercher"),
                                        style: 'cancel',
                                    },
                                ],
                        )}
                >
                <Text style={styles.header}>+</Text>
            </TouchableOpacity>
        )
    }


    render() {
        return (
            <View style={styles.main_container}>
                <SearchList
                    title={this._get_header_title()}
                    type={"Equipes"}
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
    },

    header_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        width : wp('88%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
        borderRadius : 15,
        backgroundColor:'#52C3F7'
    }
})

export default ProfilJoueurMesEquipes
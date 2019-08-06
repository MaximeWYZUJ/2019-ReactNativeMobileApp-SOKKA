import React from 'react'
import { View, StyleSheet, FlatList,Text } from 'react-native'
import SearchList from '../../Components/SearchList.js'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'



class ProfilJoueurMesTerrainsFav extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Terrains Fav')
        }
    }

    constructor(props) {
        super(props)
        this.terrains = this.props.navigation.getParam('terrains', ' ');
        this.monProfil = this.props.navigation.getParam('monProfil', false);
    }

    _get_header_title() {
        if (this.props.navigation.getParam("monProfil", false)) {
            return "Mes Terrains Favoris"
        } else {
            return "Terrains Favoris"
        }
    }

    render() {


        return (
            <View style={styles.main_container}>
                <SearchList
                    title={this._get_header_title()}
                    type={"Terrains"}
                    data={this.terrains}
                    renderItem={({item}) => <ItemTerrain
                        id={item.id}
                        distance={item.distance}
                        InsNom={item.InsNom}
                        EquNom={item.EquNom}
                        Ville = {item.Ville}
                        Payant = {item.Payant}
                    />}
                    monProfil={this.monProfil}
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

export default ProfilJoueurMesTerrainsFav
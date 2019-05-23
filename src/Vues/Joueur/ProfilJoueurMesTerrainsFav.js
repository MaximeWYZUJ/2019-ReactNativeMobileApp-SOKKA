import React from 'react'
import { View, StyleSheet, FlatList,Text } from 'react-native'
import SearchList from '../../Components/SearchList.js'
import ItemTerrain from '../../Components/Terrain/ItemTerrain'



class ProfilJoueurMesTerrainsFav extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('titre', 'Mes Terrains Fav')
        }
    }

    constructor(props) {
        super(props)
        this.terrains = this.props.navigation.getParam('terrains', ' ')
        console.log(this.terrains)

    }

    _get_header_title() {
        if (this.props.monProfil) {
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
                    list={<FlatList
                        data={this.terrains}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => <ItemTerrain
                            id={item.id}
                            distance={item.distance}
                            InsNom={item.InsNom}
                            EquNom={item.EquNom}
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

export default ProfilJoueurMesTerrainsFav
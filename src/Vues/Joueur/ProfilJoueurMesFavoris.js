import React from 'react'
import {View, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, Text} from 'react-native'
import JoueurIcon from "../../Components/ProfilJoueur/JoueurIcon.js"
import ItemTerrain from '../../Components/Terrain/ItemTerrain.js'
import Database from '../../Data/Database'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';


class ProfilJoueurMesFavoris extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', 'Mes Favoris')
        }
    }


    constructor(props) {
        super(props)
        this.joueur = this.props.navigation.getParam('joueur', null)
        this.monProfil = this.props.navigation.getParam('monProfil', false)
        this.id = this.props.navigation.getParam('id', null)

        this.state = {
            reseau: [],
            terrainsFav: [],
            equipesFav: [],
        }
        this.getData()
    }


    calculerDistance(lat2,long2) {
        var rad2 = Math.cos(lat2)/Math.cos(lat2);
        var rad3 = Math.cos(lat)/Math.cos(lat);
        var radBis = Math.cos(long2-long)/Math.cos(long2-long);
        return (
            Math.acos(Math.sin(rad2)*Math.sin(rad3)+
            Match.cos(rad2)*Math.cos(rad3)*Math.cos(radBis))*6371
        )
    }


    async getData() {
        arrayJ = await Database.getArrayDocumentData(this.joueur.reseau, 'Joueurs')
        this.setState({reseau: arrayJ})

        arrayE = await Database.getArrayDocumentData(this.joueur.equipesFav, 'Equipes')
        this.setState({equipesFav: arrayE})

        arrayT = await Database.getArrayDocumentData(this.joueur.terrains, 'Terrains')
        this.setState({terrainsFav: arrayT})
    }


    _disp_header_reseau() {
        if (this.monProfil) {
            return (
                <Text style={styles.header}>Mon Réseau</Text>
            )
        } else {
            return (
                <Text style={styles.header}>Réseau</Text>
            )
        }
    }

    _disp_header_equipes() {
        if (this.monProfil) {
            return (
                <Text style={styles.header}>Mes Equipes Favorites</Text>
            )
        } else {
            return (
                <Text style={styles.header}>Equipes Favorites</Text>
            )
        }
    }

    _disp_header_terrains() {
        if (this.monProfil) {
            return (
                <Text style={styles.header}>Mes Terrains Favoris</Text>
            )
        } else {
            return (
                <Text style={styles.header}>Terrains Favoris</Text>
            )
        }
    }

    _dispEquipesFlatlist(dataArray) {
        if (dataArray.length > 0) {
            return (
                <FlatList style={{flex: 1}}
                    columnWrapperStyle={{/*justifyContent: 'space-between'*/}}
                    horizontal={false}
                    numColumns={5}
                    keyExtractor={(item) => item.id.toString()}
                    data={dataArray}
                    renderItem={({item}) =>
                        <TouchableOpacity
                            onPress = {() => this.props.navigation.push("Profil_Equipe", {equipeId : item.id})}>
                            <Image
                                style={{width: wp('18%'), height: wp('18%'), marginLeft : wp('2%'), marginRight : wp('2%'), backgroundColor: 'grey'/*, elevation : 5*/}}
                                source = {{uri : item.photo}}/>
                        </TouchableOpacity>
                    }
                />
            )
        }
    }

    _dispJoueursFlatlist(dataArray) {
        if (dataArray.length > 0) {
            return (
                <FlatList style={{flex: 1}}
                    columnWrapperStyle={{/*justifyContent: 'space-between'*/}}
                    horizontal={false}
                    numColumns={5}
                    keyExtractor={(item) => item.id.toString()}
                    data={dataArray}
                    renderItem={({item}) => <JoueurIcon
                        style={{flex: 1}}
                        id={item.id}
                        photo={item.photo}
                        nav={this.props.navigation}
                        />}
                />
            )
        }
    }

    _renderItemTerrain = ({item}) => {
       
        return (
			<ItemTerrain
				InsNom = {item.InsNom}
				EquNom = {item.EquNom}
				//distance = {txtDistance}
				id = {item.id}
		/>)
	}

    _dispTerrainsFlatlist(dataArray) {
        if (dataArray.length > 0) {

            return (
                <FlatList style={{flex: 1}}
                    keyExtractor={(item) => item.id.toString()}
                    data={dataArray}
                    renderItem={this._renderItemTerrain}
                />
            )
        }
    }


    renderBtnPlus(route, navOption) {
        if(this.monProfil) {
            return(
                <TouchableOpacity
                    style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%'), width: wp('8%')}}
                    onPress={() => this.props.navigation.navigate(route, navOption)}
                    >
                    <Text style={styles.header}>+</Text>
                </TouchableOpacity>
            )
        }
    }


    render() {
        return (
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}
                        onPress={() => this.props.navigation.navigate('ProfilJoueurMonReseauScreen', {joueur: this.joueur, header: this.joueur.nom, monProfil: this.monProfil})}>
                        {this._disp_header_reseau()}
                    </TouchableOpacity>
                    {this.renderBtnPlus("OngletRecherche_Defaut", {type: "Joueurs"})}
                </View>
                {this._dispJoueursFlatlist(this.state.reseau)}

                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}
                        onPress={() => this.props.navigation.navigate('ProfilJoueurMesEquipesFavScreen', {joueur: this.joueur, header: this.joueur.nom, monProfil: this.monProfil})}>
                        {this._disp_header_equipes()}
                    </TouchableOpacity>
                    {this.renderBtnPlus("OngletRecherche_Defaut", {type: "Equipes"})}
                </View>
                {this._dispEquipesFlatlist(this.state.equipesFav)}

                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}
                        onPress={() => this.props.navigation.navigate('ProfilJoueurMesTerrainsFavScreen', {joueur: this.joueur, header: this.joueur.nom, monProfil: this.monProfil})}>
                        {this._disp_header_terrains()}
                    </TouchableOpacity>
                    {this.renderBtnPlus("OngletRecherche_Defaut", {type: "Terrains"})}
                </View>
                {this._dispTerrainsFlatlist(this.state.terrainsFav)}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    main_container:{
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 10
    },
    category_container: {
        flex: 1
    },

    header_container: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        //width : wp('88%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
        borderRadius : 15,
        backgroundColor:'#52C3F7',
    },

    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
})

export default ProfilJoueurMesFavoris
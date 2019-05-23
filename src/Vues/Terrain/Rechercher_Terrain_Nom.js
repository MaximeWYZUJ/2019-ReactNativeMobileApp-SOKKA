import React from 'react'
import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity, Slider,ListView,ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Barre_Recherche from '../../Components/Recherche/Barre_Recherche'
import Colors from '../../Components/Colors'
import Color from '../../Components/Colors';
import Terrains from '../../Helpers/Toulouse.json'
import { FlatList } from 'react-native-gesture-handler';
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
//import Slider from "react-native-slider";
import Distance from '../../Helpers/Distance'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const DISTANCE_MAX = 20
const latUser = 43.5834
const longUser = 1.4342

export default class Rechercher_Terrain_Nom extends React.Component {

    constructor(props) {
		super(props)

		this.latitude = this.props.navigation.getParam('latitude', ' ')
		this.longitude = this.props.navigation.getParam('longitude', ' ')
		this.allTerrains = this.fetchClosestTerrains(this.buildTerrains()),
		
        this.state = {
			txtRecherche : '',
			allTerrains :   this.allTerrains,
			sliderValue : DISTANCE_MAX
        }

	}
	
	buildTerrains() {
		let liste = []
		for(var i =0 ; i < Terrains.length ; i++) {
			let distance =  Distance.calculDistance(this.latitude,this.longitude, Terrains[i].Latitude,Terrains[i].Longitude)
			console.log(this.latitude)
			if(distance <= DISTANCE_MAX) {
				let t = {
					id : Terrains[i].id,
					Latitude: Terrains[i].Latitude,
					Longitude : Terrains[i].Longitude,
					InsNom: Terrains[i].InsNom,
					EquNom : Terrains[i].EquNom,
					distance : distance
				}
				liste.push(t)
			}
		}
		return liste
	}

	/**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les terrains 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
		this.setState({
			allTerrains : data
		})
	}


	FiltrerTerrainsDistance(){
		let maxDistance = this.state.sliderValue
		let terrainsFiltres = this.allTerrains.filter(function(terrain) {
			return terrain.distance <= maxDistance
		});
		this.setState({allTerrains : terrainsFiltres})
	}
	
	/**
	 * Fonction qui va permettre de trouver le terrain le plus proche de l'utilisateur 
	 * à partir d'une liste. Elle va renvoyer un couple dont le 1ier elt est le 
	 * terrain et le second la liste sans le terrain
	 *
	 * @param {*} liste 
	 * @returns [terrain, newListe] : terrain le plus proche , liste sans le terrain
	 */
	closestTerrain(liste){

		if(liste.length > 0) {
			var terrain = liste[0]
			newListe = []
			for(var i = 1; i < liste.length; i++) {
				/* On trouve un nouveau min. */
				if( terrain.distance > liste[i].distance) {
					newListe.push(terrain)
					terrain = liste[i]
				}else {
					newListe.push(liste[i])
				}
			}
            return [terrain, newListe]
		}else {
			return [null,[]]
		}
	}


	/**
	 * Fonction qui va permettre de trier les terrains en fonction de leur distance 
	 * par rapport à l'utilisateur.
	 */
	fetchClosestTerrains(Terrains) {
		
		let liste = []
		let terrain = null
        let newListe = Terrains 
        // A suppr
        
		for(var i = 0; i< Terrains.length; i++) {
			var x = this.closestTerrain(newListe)
			terrain = x[0]
			newListe  = x[1]
            liste.push(terrain)
		}
		
		
		return liste


	}
	  
	/**
	 * Fonction qui va permettre de renvoyer un composant item pour les terrains
	 * @param {any} terrain 
	 */
	renderItemTerrain (terrain){
		return(
			<View style = {{backgroundColor : "white"}}>
				<Text>{terrain.InsNom}</Text>
				<Text>{terrain.EquNom}</Text>
			</View>
		)
	}

	_renderItem = ({item}) => {
        var distance = item.distance
        var txtDistance = distance.toString().split('.')[0];
        txtDistance = txtDistance +','+ distance.toString().split('.')[1][0]
        return (
			<ItemTerrain
				InsNom = {item.InsNom}
				EquNom = {item.EquNom}
				distance = {txtDistance}
				id = {item.id}
		/>)
	}

	goToMapTerrains() {
		this.props.navigation.push("RechercherTerrainsMap",  {latitude : this.latitude, longitude : this.longitude})
	}
	
	

    render() {
        return(
            <View>
                <Barre_Recherche
					handleTextChange ={this.recherche}
					data = {this.state.allTerrains}
					field = "InsNom"
				/>
				<View style  = {{backgroundColor : Color.grayItem}}>
					<Slider
							minimumValue={0}
							maximumValue={DISTANCE_MAX}
							step = {0.5}
							style = {{width : wp('65%'), alignSelf :"center"}}
							onValueChange={(value) => {
								this.setState({ sliderValue : value, })
								this.FiltrerTerrainsDistance()
							}}							
							minimumTrackTintColor={Colors.agOOraBlue}
							maximumTrackTintColor= {Colors.agooraBlueStronger}
							thumbTintColor= {Colors.agooraBlueStronger} 
					/>
							
					<Text style = {{alignSelf : 'center'}}>{this.state.sliderValue} km </Text>
				</View>
				
				
				<View style = {{backgroundColor : Colors.lightGray, height : hp('75%')}}>
					<FlatList
						data= {this.state.allTerrains}
						keyExtractor={(item) => item.id}
						renderItem={this._renderItem}
						extraData = {this.state.allTerrains}
					/>
					
					</View>

				<View>
					<TouchableOpacity 
						style = {{padding : wp('4%'),position : "absolute",bottom : hp('1%'), right: wp('1%')}}
						onPress={() => this.goToMapTerrains()}
						>
						<Image
							source = {require('../../../res/map.png')}
							style = {{width : wp('17%'), height : wp('17%')}}/>
					</TouchableOpacity>

				</View>

            </View>
        )
    }
}

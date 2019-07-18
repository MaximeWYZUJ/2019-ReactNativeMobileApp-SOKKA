import React from 'react'
import {View, Animated,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import MapView, { MAP_TYPES, ProviderPropType } from 'react-native-maps';
import Terrains from '../../../Helpers/Toulouse.json'
import ItemTerrain from '../../../Components/Terrain/ItemTerrain'
import Item_Terrain_creation_defis from '../../../Components/Terrain/Item_Terrain_creation_defis'
import Item_Terrain_Map_Creation_Defis from '../../../Components/Terrain/Item_Terrain_Map_Creation_Defis'
import Distance from '../../../Helpers/Distance'
import { connect } from 'react-redux'
import Barre_Recherche from '../../../Components/Recherche/Barre_Recherche'
import { withNavigation } from 'react-navigation'
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import Slider from "react-native-slider";
import Color from '../../../Components/Colors'
import FiltrerTerrain from '../../../Components/Recherche/FiltrerTerrain'
import LocalUser from '../../../Data/LocalUser.json'


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / hp('48%');
const LATITUDE_DELTA = 0.0522;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 750, right: 200, bottom: 750, left: 200 };
const DISTANCE_MAX = 1500
const LISTE = 'liste'
const MAP = 'map'
const SLIDER_DISTANCE_MAX = 20;


/**
 * Composant qui permet à l'utilisateur de voir les terrains autours de lui et d'en
 * sélectionner un pour un défi qu'il est en train de créer.
 */
class Terrains_Autours extends React.Component {

    constructor(props) {
		super(props)
		this.latitude =	LocalUser.geolocalisation.latitude;//this.props.latitude
		this.longitude =  LocalUser.geolocalisation.longitude;
		this.allTerrains = this.fetchClosestTerrains(this.buildTerrains())

		console.log(this.latitude+"  ;  "+this.longitude);
		
        this.state = {
			txtRecherche : '',
			allTerrains :   this.allTerrains,
			terrainFiltres : this.allTerrains,
			terrainsFiltresEtDistance : this.allTerrains,
			sliderValue : DISTANCE_MAX, 
			typeDisplay : LISTE,
			markers: [],
			sliderValueList : SLIDER_DISTANCE_MAX,
			displayFiltres: false,
			filtres: null,
			region : {
				latitude: this.latitude,
				longitude: this.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			  },

			selectedTerrain : undefined
		}
	}

	componentDidMount() {

		var markers = []
		for(var i =0 ; i < 8; i ++) {
			var t =  {
				title: ' ',
				coordinates: {
					latitude: parseFloat(this.allTerrains[i].Latitude)  ,
					longitude: parseFloat(this.allTerrains[i].Longitude),
				  },
				  id : this.allTerrains[i].id
			}
			markers.push(t)
		}
		this.setState({markers : markers, selectedTerrain : markers[0]})
	}
	
	


    buildTerrains() {
		let liste = []
		for(var i =0 ; i < Terrains.length ; i++) {
			let distance =  Distance.calculDistance(this.latitude,this.longitude, Terrains[i].Latitude,Terrains[i].Longitude)
			
			if(distance <= DISTANCE_MAX) {
				let t = {
					id : Terrains[i].id,
					Latitude: Terrains[i].Latitude,
					Longitude : Terrains[i].Longitude,
					InsNom: Terrains[i].InsNom,
					distance : distance,
					N_Voie : Terrains[i].N_Voie,
					Voie : Terrains[i].Voie,
					Ville : Terrains[i].Ville,
					id : Terrains[i].id,
					Payant :  Terrains[i].Payant, // true, false
					queryName : Terrains[i].queryName
					// ajouter les champs relatifs aux sanitaires, type de sol, etc.
				}
				liste.push(t)
			}
		}
		return liste
	}
	

	/**
	 * Fonction qui va permettre de mettre en forme les terrains et calculer leur distance
	 * par rapport à la nouvelle région de la carte
	 */
	buildTerrainsWithRegionChanged() {
		let liste = []
		for(var i =0 ; i < Terrains.length ; i++) {
			var latitude = this.state.region.latitude
			var longitude = this.state.region.longitude
			let distance =  Distance.calculDistance(latitude,longitude, Terrains[i].Latitude,Terrains[i].Longitude)
			if(distance <= DISTANCE_MAX) {
				let t = {
					id : Terrains[i].id,
					Latitude: Terrains[i].Latitude,
					Longitude : Terrains[i].Longitude,
					InsNom: Terrains[i].InsNom,
					distance : distance,
					N_Voie : Terrains[i].N_Voie,
					Voie : Terrains[i].Voie,
					Ville : Terrains[i].Ville,
					id : Terrains[i].id,
					Payant :  Terrains[i].Payant,
					queryName : Terrains[i].queryName
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
			terrainFiltres : data,
			terrainsFiltresEtDistance : this.filtrerDistanceSlider(data)
		})
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
	 * Pour filtrer les terrains, utilisé dans le composant BarreRecherche
	 */
	filtrerData = (data) => {
		f = this.state.filtres;
		filteredData = data;

		if (f!=null) {
			if (f.gratuit) {
				filteredData = data.filter(function (terrain) {
					return (terrain.Payant == false);
				})
			}

			// faire des data.filter(condition) pour filtrer
		}
        return filteredData;
	}

	handleFilterButton = () =>{
		this.setState({displayFiltres: !this.state.displayFiltres});
	}

	handleValidateFilters = (q, f) => {
		this.handleFilterButton();
		this.setState({filtres: f})
	}

	displayFiltres() {
		if (this.state.displayFiltres) {
			return (<FiltrerTerrain handleValidate={this.handleValidateFilters} init={this.state.filtres}/>);
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
		

		var max = 8;
		var markers = []
		if(liste.length < max) max = liste.length
		
		
		return liste
	}


	relancerRecherche() {

		var newListe = this.fetchClosestTerrains(this.buildTerrainsWithRegionChanged())

		var markers = []
		for(var i =0 ; i < 8; i ++) {
			var t =  {
				title: ' ',
				coordinates: {
					latitude: parseFloat(newListe[i].Latitude)  ,
					longitude: parseFloat(newListe[i].Longitude),
				  },
				  id : newListe[i].id
			}
			markers.push(t)
		}

		var region = {
			latitude: parseFloat(newListe[0].Latitude),
			longitude: parseFloat(newListe[0].Longitude),
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421,
		}
		this.map.animateToRegion(region,1000)
		this.setState({markers : markers, terrainFiltres : newListe,terrainSelectionne : markers[0]})
	}


	filtrerDistanceSlider(liste) {
		if (this.state.sliderValueList <= SLIDER_DISTANCE_MAX) {
			let listeOK = [];
			for (var i = 0; i<liste.length; i++) {
				distance = liste[i].distance;
				if (distance < this.state.sliderValueList) {
					listeOK.push(liste[i]);
				}
			}
			return listeOK;
		} else {
			return liste;
		}
	}

	
	changeMarkerWithSlider(index) {

		let liste = []
		let t = {
			title: ' ',
			  	coordinates: {
				  		latitude: parseFloat(this.state.terrainFiltres[index].Latitude)  ,
				  		longitude: parseFloat(this.state.terrainFiltres[index].Longitude),
				},
				id : this.state.terrainFiltres[index].id
		}
		liste.push(t)
        this.setState({ indexState : index,selectedTerrain : t})
		this.fitAllMarkers(index)

	}

	fitAllMarkers(index) {

		let markers = [
				{latitude : parseFloat(this.state.terrainFiltres[index].Latitude), longitude : parseFloat(this.state.terrainFiltres[index].Longitude)}
			]
			var region = {
				latitude: parseFloat(this.state.terrainFiltres[index].Latitude),
				longitude: parseFloat(this.state.terrainFiltres[index].Longitude),
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}
			this.map.animateToRegion(region,1000)
    //	this.map.fitToCoordinates(markers, {edgePadding: DEFAULT_PADDING,animated: true,});
	}
	  


	onRegionChange = (region) => {
		oldRegion = this.state.region
		distance = Distance.calculDistance(oldRegion.latitude, oldRegion.longitude, region.latitude, region.longitude)
		if(distance >= 0.8) {
			this.setState({ region : region })
		}
	
	};


    
	goToMapTerrains() {
		this.props.navigation.push("RechercherTerrainsMap",  {latitude : this.latitude, longitude : this.longitude, typeTuille : "creer_defis"})
	}

	// =============================================================================================
	//====================================== RENDER ================================================
	// =============================================================================================


	_renderItem = ({item}) => {
        var distance = item.distance
        var txtDistance = distance.toString().split('.')[0];
		txtDistance = txtDistance +','+ distance.toString().split('.')[1][0]
		
		if (this.props.gotoItemOnPress != undefined && this.props.gotoItemOnPress != null && this.props.gotoItemOnPress) {
			return (
				<ItemTerrain
                    id={item.id}
                    distance={distance}
                    InsNom={item.InsNom}
                    EquNom={item.EquNom}
					Ville={item.Ville}
                />
			)
		} else {
			return (
				<Item_Terrain_creation_defis
					InsNom = {item.InsNom}
					EquNom = {item.EquNom}
					distance = {txtDistance}
					id = {item.id}
					isShown = {this.props.terrainSelectionne == item.id}
					payant = {item.Payant}
					N_Voie = {item.N_Voie}
					Voie = {item.Voie}
					Ville = {item.Ville}
				/>)
		}
	}



  	/**
	   * Fonction qui permet d'appeller un item pour le caroussel
	   * @param {*} param0 
	*/
    _renderItemCarrousel = ({item,index}) => {

		var distance = item.distance
        var txtDistance = distance.toString().split('.')[0];
		txtDistance = txtDistance +','+ distance.toString().split('.')[1][0]

		var gotoItem = this.props.gotoItemOnPress != undefined && this.props.gotoItemOnPress;

		return (
			<Item_Terrain_Map_Creation_Defis				
				InsNom = {item.InsNom}
				EquNom = {item.EquNom}
				Voie = {item.Voie}
				N_Voie = {item.N_Voie}
				id = {item.id}
				isShown = {this.props.terrainSelectionne == item.id}
				distance = {txtDistance}
				gotoItemOnPress = {gotoItem}
				nav = {this.props.navigation}
			/>
		)
	}


	/**
	 * Fonction qui permet d'affihcer le boutton pour relancer une recherche dans un quartier.
	 */
	renderBtnRelancerRecherche() {

		return(
			<TouchableOpacity style = {{backgroundColor : Color.agOOraBlue, padding : hp('1%'), borderRadius : 5, position : "absolute" , top : hp('1%')}}
				onPress = {() =>this.relancerRecherche()}>
				<Text style = {{color : "white" }}>Relancer la recherche dans ce quartier</Text>
			</TouchableOpacity>
		)
	}
	

	/**
	 * Méthode qui permet de choisir quoi afficher en fonction de si l'utilisateur veut 
	 * séléctionner un terrain en mode liste ou non.
	 */
	displayRender() {
		if(this.state.typeDisplay == LISTE ) {
			return(
				<View>
				<ScrollView style = {{marginBottom : hp('1%')}}>
					<View style = {{flex : 1}}>
						<Barre_Recherche
							handleTextChange ={this.recherche}
							data = {this.allTerrains}
							field = "queryName"
							filtrerData = {this.filtrerData}
							handleFilterButton={this.handleFilterButton}

						/>
						<View style={{flex: 1, justifyContent: 'center', alignContent: 'center', marginHorizontal: wp('5%')}}>
							<View style={{flex: 1, alignItems: 'center'}}>
								<Text>{this.state.sliderValueList > SLIDER_DISTANCE_MAX ? '> 20 km' : this.state.sliderValueList + " km"}</Text>
							</View>
							<Slider
								minimumValue={1}
								maximumValue={SLIDER_DISTANCE_MAX+1}
								onValueChange={(v) => this.setState({
									sliderValueList: v,
									terrainsFiltresEtDistance: this.filtrerDistanceSlider(this.state.terrainFiltres)
								})}
								step={1}
								value={this.state.sliderValueList}
								minimumTrackTintColor={Color.lightGray}
								maximumTrackTintColor={Color.lightGray}
								thumbTintColor={Color.agOOraBlue}
							/>
						</View>
						{this.displayFiltres()}
						<FlatList
								data= {this.state.terrainsFiltresEtDistance}
								keyExtractor={(item) => item.id}
								renderItem={this._renderItem}
								extraData = {this.props.terrainSelectionne}
						/>
						
					</View>
				</ScrollView>
				<TouchableOpacity 
								style = {{position : "absolute",bottom : hp('20%'), right: wp('1%')}}
								onPress={() => this.setState({typeDisplay : MAP})}
								>
								<Image
									source = {require('../../../../res/map.png')}
									style = {{width : wp('17%'), height : wp('17%')}}/>
						</TouchableOpacity>
				</View>
			)
		} else {
			return(
				<View>
					<Barre_Recherche
						handleTextChange ={this.recherche}
						data = {this.allTerrains}
						field = "queryName"
						filtrerData = {this.filtrerData}
						handleFilterButton={this.handleFilterButton}
					/>

					<View style = {styles.container}>
					

						<MapView
							provider={this.props.provider}
							ref={ref => { this.map = ref; }}
							mapType={MAP_TYPES.STANDARD}
							
							style={styles.map}
							initialRegion = {
									{latitude: this.latitude,
									longitude: this.longitude,
									latitudeDelta: LATITUDE_DELTA,
									longitudeDelta: LONGITUDE_DELTA}
							}
							
							onRegionChange={this.onRegionChange}
							>

							
							{/* Marker pour la position de l'utilisateur */}
							<MapView.Marker
								coordinate={
									{latitude: this.latitude,
									longitude:  this.longitude}
								}
								title={"title"}
								description={"description"}>
							</MapView.Marker>

							{/* Marker depuis le state : va etre le terrain en 1ier plan*/}
							{this.state.markers.map(marker =>{
								console.log("marker id : ", marker.id)
								console.log("this.state.selectedTerrain.id", this.state.selectedTerrain.id)
								if(marker.id  == this.state.selectedTerrain.id) {
									return(
										<MapView.Marker 
											coordinate={marker.coordinates}
											title={marker.title}
											description = {"okok"}>
											<Image source = {require('../../../../res/marker_terrain_selected.png')} style = {{width : 80, height : 80}}/>
										</MapView.Marker>
									)
								} else {
									return(
										<MapView.Marker 
											coordinate={marker.coordinates}
											title={marker.title}
											description = {"okok"}>
											<Image source = {require('../../../../res/marker_terrain.png')} style = {{width : 80, height : 80}}/>
										</MapView.Marker>
									)
								}
							})}
						</MapView>

						{/* Vue contenant le carousel*/}
						<View style = {{position : "absolute", bottom : hp('1%')}}>
							<Carousel
								ref={c => this._slider1Ref = c}
								data={this.state.terrainFiltres}	
								extraData = {this.props.terrainSelectionne}		 
								//renderItem={this._renderItemCarrousel.bind(this)}
								renderItem={this._renderItemCarrousel}
								sliderWidth={wp('100%')}
								itemWidth={wp('80%')}
								hasParallaxImages={true}
								inactiveSlideScale={0.94}
								inactiveSlideOpacity={0.7}
								containerCustomStyle={styles.slider}
								onSnapToItem={(index) =>this.changeMarkerWithSlider(index) }
								contentContainerCustomStyle={styles.sliderContentContainer}
							/>
						</View>
						{this.renderBtnRelancerRecherche()}

						<TouchableOpacity
							style = {{padding : wp('4%'),position : "absolute",bottom : hp('6%'), right: wp('1%')}}
							onPress={() => this.setState({typeDisplay : LISTE})}

						>
							<Image
								source = {require('../../../../res/list.png')}
								style = {{width : wp('17%'), height : wp('17%')}}/>

						</TouchableOpacity>

					</View>
				</View>
				
			)
		}
	}
	
    
    render() {
        return(
			<View>
				{this.displayRender()}
			</View>
		)
    }

}


Terrains_Autours.propTypes = {
	provider: ProviderPropType,
  }; 

const mapStateToProps = (state) => {
    return{ 
		latitude : state.latitude,
		longitude : state.longitude,
		terrainSelectionne :state.terrainSelectionne
    } 
}

const styles = StyleSheet.create({
	container: {
		height : hp('54.5%'),
	  //...StyleSheet.absoluteFillObject,
	  justifyContent: 'flex-end',
	  alignItems: 'center',
	},
	map: {
	  ...StyleSheet.absoluteFillObject,
	},

	slider: {
        marginTop: hp('2%'),
        overflow: 'visible' // for custom animations
	},

	sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },

	
})

export default connect(mapStateToProps) (withNavigation(Terrains_Autours))
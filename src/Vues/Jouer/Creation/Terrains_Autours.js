import React from 'react'
import {View, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, StyleSheet, Text, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import MapView, { MAP_TYPES, ProviderPropType } from 'react-native-maps';
import Terrains from '../../../Helpers/Toulouse.json'
import Villes from '../../../Components/Creation/villes.json'
import ItemTerrain from '../../../Components/Terrain/ItemTerrain'
import Item_Terrain_creation_defis from '../../../Components/Terrain/Item_Terrain_creation_defis'
import Item_Terrain_Map_Creation_Defis from '../../../Components/Terrain/Item_Terrain_Map_Creation_Defis'
import Distance from '../../../Helpers/Distance'
import { connect } from 'react-redux'
import Barre_Recherche from '../../../Components/Recherche/Barre_Recherche'
import { withNavigation } from 'react-navigation'
import Carousel from 'react-native-snap-carousel';
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
const SLIDER_DISTANCE_MAX = 10;

const image_map = require('app/res/map.png');
const image_list = require('app/res/list.png');
const image_terrain = require('app/res/marker_terrain_selected.png');
const image_terrain_selected = require('app/res/marker_terrain.png');


/**
 * Composant qui permet à l'utilisateur de voir les terrains autours de lui et d'en
 * sélectionner un pour un défi qu'il est en train de créer.
 */
class Terrains_Autours extends React.Component {

    constructor(props) {
		super(props)

		
        this.state = {
			latitude: LocalUser.geolocalisation.latitude,
			longitude: LocalUser.geolocalisation.longitude,

			txtRecherche : '',
			allTerrains :   [],
			terrainFiltres : [],
			terrainsFiltresEtDistance : [],
			sliderValue : DISTANCE_MAX, 
			typeDisplay : LISTE,
			markers: [],
			sliderValueList : SLIDER_DISTANCE_MAX,
			displayFiltres: false,
			filtres: null,

			region : {
				latitude: LocalUser.geolocalisation.latitude,
				longitude: LocalUser.geolocalisation.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			  },

			selectedTerrain : undefined
		}
	}

	componentDidMount() {
		this.triTerrains().then(() => {
			var markers = [];
			for(var i =0 ; i < Math.min(8, this.state.allTerrains.length); i ++) {
				var t =  {
					title: ' ',
					coordinates: {
						latitude: parseFloat(this.state.allTerrains[i].Latitude)  ,
						longitude: parseFloat(this.state.allTerrains[i].Longitude),
					},
					id : this.state.allTerrains[i].id
				}
				markers.push(t)
			}
			this.setState({markers : markers, selectedTerrain : markers[0]})
		})

        this.didFocusSubscription = this.props.navigation.addListener('didFocus', this.didFocusAction);
        this.demanderGeolocalisation();
	}
	


    didFocusAction = () => {
        this.demanderGeolocalisation();
    }


    componentWillUnmount() {
        this.didFocusSubscription.remove();
    }


	demanderGeolocalisation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let latUser = position.coords.latitude
                let longUser = position.coords.longitude
                let pos = {
                    latitude : latUser,
                    longitude : longUser
                }
                LocalUser.geolocalisation = pos;
                this.setState({
                    latitude: pos.latitude,
                    longitude: pos.longitude
                })
                this.triTerrains().then(() => {
					var markers = [];
					for(var i =0 ; i < Math.min(8, this.state.allTerrains.length); i ++) {
						var t =  {
							title: ' ',
							coordinates: {
								latitude: parseFloat(this.state.allTerrains[i].Latitude)  ,
								longitude: parseFloat(this.state.allTerrains[i].Longitude),
							},
							id : this.state.allTerrains[i].id
						}
						markers.push(t)
					}
					this.setState({markers : markers, selectedTerrain : markers[0]})
				})
        },
        (error) => {
            

            Alert.alert(
                '', 
                "Nous ne parvenons pas à capter votre position. Nous utiliserons celle de " + LocalUser.data.ville.charAt(0).toUpperCase() + LocalUser.data.ville.slice(1),
			)
			var pos = this.findPositionVilleFromName(LocalUser.data.ville)
			LocalUser.geolocalisation = pos;
			this.setState({
				latitude: pos.latitude,
				longitude: pos.longitude
			})
			this.triTerrains().then(() => {
				var markers = [];
				for(var i =0 ; i < Math.min(8, this.state.allTerrains.length); i ++) {
					var t =  {
						title: ' ',
						coordinates: {
							latitude: parseFloat(this.state.allTerrains[i].Latitude)  ,
							longitude: parseFloat(this.state.allTerrains[i].Longitude),
						},
						id : this.state.allTerrains[i].id
					}
					markers.push(t)
				}
				this.setState({markers : markers, selectedTerrain : markers[0]})
			})
        },
        {enableHighAccuracy: true, timeout:    5000, maximumAge :300000}
        )
	}
	

	findPositionVilleFromName(name) {
        for(var i  =  0 ; i < Villes.length; i++) {
            if(name.toLocaleLowerCase() == Villes[i].Nom_commune.toLocaleLowerCase()) {
                var position = Villes[i].coordonnees_gps
                var latitude = position.split(',')[0]
                var longitude = position.split(', ')[1]
                 var pos = {
                    latitude : parseFloat(latitude),
                    longitude : parseFloat(longitude)
                }
               return pos

            }
        }
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
				let t = {...Terrains[i], distance: distance};
				
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
	 * Pour filtrer les terrains, utilisé dans le composant BarreRecherche
	 */
	filtrerData = (data, f) => {
		var filteredData = data;
		filteredData = FiltrerTerrain.filtrerTerrains(data, f)
		
		return filteredData;
	}

	handleFilterButton = () =>{
		this.setState({displayFiltres: !this.state.displayFiltres});
	}

	handleValidateFilters = (q, f) => {
		this.handleFilterButton();

		var terrainsDistance = this.filtrerDistanceSlider(this.state.allTerrains);

		this.setState({
			filtres: f,
			terrainFiltres: this.filtrerData(this.state.allTerrains, f),
			terrainsFiltresEtDistance: this.filtrerData(terrainsDistance, f)
		})
	}

	displayFiltres() {
		if (this.state.displayFiltres) {
			return (<FiltrerTerrain handleValidate={this.handleValidateFilters} init={this.state.filtres}/>);
		}
	}




	async triTerrains() {
        this.setState({isLoading: true});

        // Suppression des villes trop loin
        var terrainsProches = this.getTerrainsProches(SLIDER_DISTANCE_MAX, Terrains, false);

        // Tri des villes par distance
        var terrainsTriesSansDoublons = terrainsProches.sort(this.comparaisonDistanceTerrains);

		var terrainsFiltres = FiltrerTerrain.filtrerTerrains(terrainsTriesSansDoublons, this.state.filtres);

        this.setState({
			allTerrains: terrainsTriesSansDoublons,
			terrainFiltres: terrainsFiltres,
			terrainsFiltresEtDistance: terrainsFiltres,
            isLoading: false,
        })
    }


    // Comparaison de deux villes en fonction de leur distance par rapport à soi
    comparaisonDistanceTerrains = (terrain1, terrain2) => {
        if (terrain1.distance < terrain2.distance) {
            return -1;
        } else if (terrain1.distance > terrain2.distance) {
            return 1;
        } else {
            return 0;
        }
	}
	

    // Renvoie la liste des villes proches de notre position
    getTerrainsProches(distanceMax, tableau, doBreak) {
        if (tableau != undefined) {
            var terrainsProches = [];
            for (v of tableau) {
                vLat = v.Latitude;
                vLong = v.Longitude;
                d = Distance.calculDistance(this.state.latitude, this.state.longitude, vLat, vLong);
                
                if (d < distanceMax) {
                    terrainsProches.push({...v, distance: d});
                } else {
                    if (doBreak) {
                        break;
                    }
                }
            }

            return terrainsProches;
        }
    }




	relancerRecherche() {

		this.triTerrains(this.buildTerrainsWithRegionChanged()).then(() => {
			var markers = []
			for(var i =0 ; i < Math.min(8, this.state.allTerrains.length); i ++) {
				var t =  {
					title: ' ',
					coordinates: {
						latitude: parseFloat(this.state.allTerrains[i].Latitude)  ,
						longitude: parseFloat(this.state.allTerrains[i].Longitude),
					},
					id : newListe[i].id
				}
				markers.push(t)
			}

			var region = {
				latitude: parseFloat(this.state.allTerrains[0].Latitude),
				longitude: parseFloat(this.state.allTerrains[0].Longitude),
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}
			this.map.animateToRegion(region,1000)
			this.setState({markers : markers, terrainFiltres : this.state.allTerrains, terrainSelectionne : markers[0]})
		})
	}


	filtrerDistanceSlider(liste) {
		if (this.state.sliderValueList <= SLIDER_DISTANCE_MAX) {
			let v = this.state.sliderValueList;
			return liste.filter((t) => {
				return t.distance < v;
			});
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
	}
	  

onRegionChange = (region) => {
oldRegion = this.state.region
distance = Distance.calculDistance(oldRegion.latitude, oldRegion.longitude, region.latitude, region.longitude)
if(distance >= 0.8) {
this.setState({ region : region })
}

};


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
					N_Voie = {item.N_Voie}
					Voie = {item.Voie}
					Ville = {item.Ville}
					Payant = {item.Payant}
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
			<TouchableOpacity style = {{flex: 1, backgroundColor : Color.agOOraBlue, padding : hp('1%'), borderRadius : 5, marginHorizontal: hp('10%')}}
				onPress = {() =>this.relancerRecherche()}>
				<Text style = {{color : "white", textAlign: 'center'}}>Relancer la recherche dans ce quartier</Text>
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
				[<ScrollView style = {{marginBottom : hp('1%')}}>
					<View style = {{flex : 1}}>
						<Barre_Recherche
							handleTextChange ={this.recherche}
							data = {this.state.allTerrains}
							field = "queryName"
							filtrerData = {(data) => FiltrerTerrain.filtrerTerrains(data, this.state.filtres)}
							handleFilterButton={this.handleFilterButton}

						/>
						<View style={{flex: 1, justifyContent: 'center', alignContent: 'center', marginHorizontal: wp('5%')}}>
							<View style={{flex: 1, alignItems: 'center'}}>
								<Text>{this.state.sliderValueList > SLIDER_DISTANCE_MAX ? '> 20 km' : this.state.sliderValueList + " km"}</Text>
							</View>
							<Slider
								minimumValue={1}
								maximumValue={SLIDER_DISTANCE_MAX+1}
								onValueChange={(v) => this.setState({sliderValueList: v})}
								onSlidingComplete={(v) => this.setState({
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
				</ScrollView>,

				<TouchableOpacity 
					style = {{padding : wp('4%'),position : "absolute",bottom : hp('6%'), right: wp('1%')}}
					onPress={() => this.setState({typeDisplay : MAP})}
					>
					<Image style = {{width : wp('17%'), height : wp('17%')}} source = {image_map}/>
				</TouchableOpacity>]

			)
		} else {
			return(
					[<Barre_Recherche
						handleTextChange ={this.recherche}
						data = {this.state.allTerrains}
						field = "queryName"
						filtrerData = {(data) => FiltrerTerrain.filtrerTerrains(data, this.state.filtres)}
						handleFilterButton={this.handleFilterButton}
					/>,

					<View style={{marginVertical : hp('1%'), flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						{this.renderBtnRelancerRecherche()}
					</View>,

					<MapView
						provider={this.props.provider}
						ref={ref => { this.map = ref; }}
						mapType={MAP_TYPES.STANDARD}
						
						style={styles.map}
						initialRegion = {
								{latitude: this.state.latitude,
								longitude: this.state.longitude,
								latitudeDelta: LATITUDE_DELTA,
								longitudeDelta: LONGITUDE_DELTA}
						}
							
						onRegionChange={this.onRegionChange}
						>

							
						{/* Marker pour la position de l'utilisateur */}
						<MapView.Marker
							coordinate={
								{latitude: this.state.latitude,
								longitude:  this.state.longitude}
							}
							title={"title"}
							description={"description"}>
						</MapView.Marker>

						{/* Marker depuis le state : va etre le terrain en 1ier plan */}
						{this.state.markers.map(marker =>{
							if(marker.id  == this.state.selectedTerrain.id) {
								return(
									<MapView.Marker 
										coordinate={marker.coordinates}
										title={marker.title}
										description = {"okok"}>
										<Image source = {image_terrain_selected} style = {{width : 80, height : 80}}/>
									</MapView.Marker>
								)
							} else {
								return(
									<MapView.Marker 
										coordinate={marker.coordinates}
										title={marker.title}
										description = {"okok"}>
										<Image source = {image_terrain} style = {{width : 80, height : 80}}/>
									</MapView.Marker>
								)
							}
						})}
					</MapView>,

					/* Vue contenant le carousel */
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
					</View>,

					<TouchableOpacity
						style = {{padding : wp('4%'),position : "absolute",bottom : hp('6%'), right: wp('1%')}}
						onPress={() => this.setState({typeDisplay : LISTE})}
						>
						<Image
							source = {image_list}
							style = {{width : wp('17%'), height : wp('17%')}}/>

					</TouchableOpacity>]
			)
		}
	}
	
    
    render() {
        return this.displayRender();
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

map: {
 flex: 1,
 alignItems: 'center'
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
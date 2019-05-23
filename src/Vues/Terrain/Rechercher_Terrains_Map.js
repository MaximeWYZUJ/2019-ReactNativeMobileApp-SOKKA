
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import MapView, { MAP_TYPES, ProviderPropType } from 'react-native-maps';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import Carousel from 'react-native-snap-carousel';
import Terrains from '../../Helpers/Toulouse.json'
import Colors from '../../Components/Colors'
import Item_Terrain_search_map from '../../Components/Terrain/Item_Terrain_search_map'
const { width, height } = Dimensions.get('window');
import Database from '../../Data/Database'
//const ASPECT_RATIO = width / height;
const ASPECT_RATIO = width / hp('60%');
const LATITUDE = 4.3602142;
const LONGITUDE = 145561;
const LATITUDE_DELTA = 0.0522;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DEFAULT_PADDING = { top: 350, right: 200, bottom: 350, left: 200 };

var  terrains = function(){
	return Terrains
}

   
   
/**
 * Classe qui permet d'afficher un map avec la position de l'utilisateur ainsi que les terrains.
 * autours de lui. Cette classe permet de visiter les profil des terrains autours.
 */
export default class Rechercher_Terrains_Map  extends React.Component {

       constructor(props) {
		super(props);
		this.latitude = this.props.navigation.getParam('latitude', ' ')
		this.longitude = this.props.navigation.getParam('longitude', ' ')
		console.log("eee: ",this.longitude)

		let terrains = this.fetchClosestTerrains()
		let marker = {
			title: 'hello',
			  	coordinates: {
				  		latitude: terrains[0].Latitude ,
				  		longitude: terrains[0].Longitude,
				  }
			}
		//console.log(terrains)
		this.state = {
			indexState : 0,
			location : null,
			terrains :  terrains,
            markers: [],		
			terrainsQuery : [],
			region : {
				latitude: this.latitude,
				longitude: this.longitude,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA,
			},
		}
	
	}
	

	static navigationOptions = {
		title: 'Rechercher un terrain',
	};




	componentDidMount() {
		//this.fitAllMarkers(0)

		/*navigator.geolocation.getCurrentPosition(
			(position) => {
		
				// Calculer la distance pour tous les terrains
				let latUser = position.coords.latitude
				let longUser = position.coords.longitude
				let terrains = []
				/*for(var i = 0; i< Terrains.length ; i++) {
					let rad_lata = (latUser * Math.PI)/180;
					let rad_long = ((longUser- Terrains[i].Longitude) * Math.PI)/180;
					let rad_latb = (Terrains[i].Latitude * Math.PI)/180;
					let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
					Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371
					var txtDistance = d.toString().split('.')[0];
					txtDistance = txtDistance +','+ d.toString().split('.')[1][0]
					
					terrains.push({
						InsNom: Terrains[i].InsNom,
						EquNom:  Terrains[i].EquNom,
						Longitude: Terrains[i].Longitude ,
						Latitude: Terrains[i].Latitude,
						distance : txtDistance,
						id : i
					})
				}
				

			  	this.setState({
					region : {
						latitude: parseFloat(position.coords.latitude),
						longitude: parseFloat(position.coords.longitude),
						latitudeDelta: LATITUDE_DELTA,
			  			longitudeDelta: LONGITUDE_DELTA,
					},
					//terrains : terrains,
					loadingFinish : true
					//markers : terrains
			  });
			  
			},
			//(error) => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 2000, maximumAge: 10 },
		);*/

		// TEST GEOQUERY
		/*const geofirestore  = new GeoFirestore(Database.initialisation())
		const geocollection = geofirestore.collection('Terrains')
		const query = geocollection.near({ center: new firebase.firestore.GeoPoint(this.latitude, this.longitude), radius: 10 });
		query.limit(1).get().then((value) => {
			console.log("nb docs : ",value.docs.length); // All docs returned by GeoQuery
			
			this.setState({terrainsQuery : value.docs})
		});*/

	}
	  
	
   
	
	/**
	 * Méthode qui va permettre de construire une liste de markers pour les 
	 * terrains (à modifier)
	 */
	buildMarkers() {

		let liste = []
		for(var i = 0; i < 20; i++) {
			let t = {
				title: 'hello',
			  	coordinates: {
				  		latitude: parseFloat(this.state.terrains[i].Latitude)  ,
				  		longitude: parseFloat(this.state.terrains[i].Longitude),
				}

			}
			liste.push(t)
		}
		return liste
	}

	buildTuille ({item, index})  {
		if(this.props.typeTuille = "creer_defis") {
			return (
				<Text>fffff</Text>
			)
		} else {
			this._renderItemCarrousel
		}
	}


	/**
	 * Méthode qui va permettre de construire une liste de markers pour les 
	 * terrains (à modifier)
	 */
	buildMarkersAfterQuery() {

		let liste = []
		for(var i = 0; i < this.state.terrainsQuery.length; i++) {
			let t = {
				title: 'hello',
			  	coordinates: {
				  		latitude: parseFloat(this.state.terrainsQuery[i].Longitude)  ,
				  		longitude: parseFloat(this.state.terrainsQuery[i].Latitude),
				}

			}
			liste.push(t)
		}
		return liste
	}

	
	

	
	changeMarkerWithSlider(index) {

		let liste = []
		let t = {
			title: 'hello',
			  	coordinates: {
				  		latitude: parseFloat(this.state.terrains[index].Latitude)  ,
				  		longitude: parseFloat(this.state.terrains[index].Longitude),
				}
		}
		liste.push(t)
        this.setState({markers : liste, indexState : index})
        //console.log(this.state.markers)
		this.fitAllMarkers(index)

	}

	fitAllMarkers(index) {
        //console.log("IN FIT ALL MARKERS")
		let markers = [
				{latitude : this.latitude, longitude: this.longitude}, 
				{latitude : parseFloat(this.state.terrains[index].Latitude), longitude : parseFloat(this.state.terrains[index].Longitude)}
            ]
            //console.log(this.state.terrains[index].Latitude)
            //console.log(this.state.terrains[index].Longitude)
    	this.map.fitToCoordinates(markers, {edgePadding: DEFAULT_PADDING,animated: true,});
  	}
	
	
	
	calculDistance(stade) {
		let rad_lata = (this.latitude * Math.PI)/180;
		let rad_long = ((this.longitude- parseFloat(stade.Longitude)) * Math.PI)/180;
		let rad_latb = (parseFloat(stade.Latitude) * Math.PI)/180;
		let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
		Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371
		return d
	}

	comparedistance(stade1,stade2) {
		return (this.calculDistance(stade1) - this.calculDistance(stade2))
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
				if(this.comparedistance(terrain, liste[i]) > 0) {
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
	fetchClosestTerrains() {
		
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
		
		//console.log("Terrain : ", Terrains.length)
		console.log("liste triée : ", liste.length )
		return liste


	}
	goToListeTerrain(){
		this.props.navigation.push("RechercherTerrainsNom", {latitude : this.latitude, longitude : this.longitude})
	}
         

  	/**
	   * Fonction qui permet d'appeller un item pour le caroussel
	   * @param {*} param0 
	*/
	_renderItemCarrousel ({item, index}) {
		console.log("eee: ")

		return(
			
				<Item_Terrain_search_map
					InsNom = {item.InsNom}
					EquNom = {item.EquNom}
					id = {item.id}
				/>
		)
		/* Calcul de la distance 
		let rad_lata = (this.props.navigation.getParam('latitude', ' ') * Math.PI)/180;
		let rad_long = ((this.props.navigation.getParam('longitude', ' ')- parseFloat(item.Longitude)) * Math.PI)/180;
		let rad_latb = (parseFloat(item.Latitude) * Math.PI)/180;
		let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
		Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371
		var txtDistance = d.toString().split('.')[0];
		txtDistance = txtDistance +','+ d.toString().split('.')[1][0]*/
        /*return (
            <Item_Terrain_search_map 
				InsNom = {item.InsNom}
				EquNom = {item.EquNom}
                distance = {"txtDistance"}
                id = {item.id}
				isChoosen = {this.state.indexState == index}
			/>
        );*/
    }
	
	
    render() {
		console.log("ekkkee: ",this.props.navigation.getParam('latitude', ' '))

        return (
			<View>
         		<View style={styles.container}>

					{/* Carte google map */}
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
						}>

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
                        {this.state.markers.map(marker => (
                            console.log(marker.coordinates)
                        ))}
						{this.state.markers.map(marker => (
							<MapView.Marker 
								coordinate={marker.coordinates}
								title={marker.title}
                                description = {"okok"}>
                                <Image source = {require('../../../res/marker_terrain.png')} style = {{width : 80, height : 80}}/>
							</MapView.Marker>
                        ))}

                        
							
					

					</MapView>
			
                            

					{/* Vue contenant le carousel*/}
					<View style = {{position : "absolute", bottom : 0}}>
						<Carousel
							ref={c => this._slider1Ref = c}
							data={this.state.terrains}			 
							//renderItem={this._renderItemCarrousel.bind(this)}
							renderItem={this._renderItemCarrousel}
							sliderWidth={wp('100%')}
							itemWidth={wp('62%')}
							hasParallaxImages={true}
							inactiveSlideScale={0.94}
							inactiveSlideOpacity={0.7}
							containerCustomStyle={styles.slider}
							contentContainerCustomStyle={styles.sliderContentContainer}
							onSnapToItem={(index) =>this.changeMarkerWithSlider(index) }
						/>
					</View>
					<TouchableOpacity
						style = {{padding : wp('4%'),position : "absolute",bottom : hp('0.2%'), right: wp('1%')}}
						onPress={() => this.goToListeTerrain()}

					>
						<Image
							source = {require('../../../res/list.png')}
							style = {{width : wp('17%'), height : wp('17%')}}/>

					</TouchableOpacity>
           		</View>  
			</View>
        );
      }
    }
    
    Rechercher_Terrains_Map.propTypes = {
      provider: ProviderPropType,
    };
    
    const styles = StyleSheet.create({
      container: {
		  height : hp('88.5%'),
        //...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
      },
      latlng: {
        width: 200,
        alignItems: 'stretch',
      },
      button: {
        width: 100,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
      },
      buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
      },
      buttonText: {
        textAlign: 'center',
    },
   
	  title : {
		 
	  },
	  slider: {
        marginTop: hp('2%'),
        overflow: 'visible' // for custom animations
	},
	sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    });


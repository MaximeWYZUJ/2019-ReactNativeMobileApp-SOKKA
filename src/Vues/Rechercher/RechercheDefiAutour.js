import React from 'react'
import {View, Alert,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import MapView, { MAP_TYPES, ProviderPropType } from 'react-native-maps';
import Terrains from '../../Helpers/Toulouse.json'
import Villes from '../../Components/Creation/villes.json'
import Simple_Loading from '../../Components/Loading/Simple_Loading'

import Item_Defi from '../../Components/Defis/Item_Defi'
import Item_Partie  from '../../Components/Defis/Item_Partie'
import Type_Defis from '../Jouer/Type_Defis'
import FiltrerDefi from '../../Components/Recherche/FiltrerDefi'

import Distance from '../../Helpers/Distance'
import { withNavigation } from 'react-navigation'
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import Slider from 'react-native-slider';
import Color from '../../Components/Colors'
import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database';


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
class RechercheDefiAutour extends React.Component {

    constructor(props) {
		super(props)

		var latitude = LocalUser.geolocalisation.latitude;
		var longitude = LocalUser.geolocalisation.longitude; 

		var allTerrains = this.fetchClosestTerrains(this.buildTerrains(latitude, longitude))
		
        this.state = {
			latitude: latitude,
			longitude: longitude,

            isLoading: false,
			terrainFiltres : allTerrains,
			terrainsFiltresEtDistance : allTerrains,
			sliderValue : DISTANCE_MAX, 
			typeDisplay : LISTE,
			markers: [],
			sliderValueList : 1,
			displayFiltres: false,
            filtres: null,
            query: null,
			region : {
				latitude: latitude,
				longitude: longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
            },
            defis: [],
			selectedTerrain : undefined
		}
    }
    

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Autour de moi"
        }
    }


	componentDidMount() {

		var markers = []
		for(var i =0 ; i < Math.min(10, this.state.defis.length); i ++) {
			var t =  {
				title: ' ',
				coordinates: {
					latitude: parseFloat(this.state.defis[i].latitude)  ,
					longitude: parseFloat(this.state.defis[i].longitude),
				  },
				  id : this.state.defis[i].data.id
			}
			markers.push(t)
		}
		this.setState({markers : markers, selectedTerrain : markers[0]})

		this.didFocusSubscription = this.props.navigation.addListener('didFocus', this.didFocusAction);
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
				
				var terrainList = this.fetchClosestTerrains(this.buildTerrains(pos.latitude, pos.longitude));
				this.setState({
					latitude: pos.latitude,
                    longitude: pos.longitude,
					terrainFiltres : terrainList,
					terrainsFiltresEtDistance : terrainList,
				})
			},
			(error) => {
				
				Alert.alert(
					'',
					"Nous ne parvenons pas à capter ta position. Nous utiliserons celle de " + LocalUser.data.ville.charAt(0).toUpperCase() + LocalUser.data.ville.slice(1),
				)
				var pos = this.findPositionVilleFromName(LocalUser.data.ville);
				LocalUser.geolocalisation = pos;
				
				var terrainList = this.fetchClosestTerrains(this.buildTerrains(pos.latitude, pos.longitude));
				this.setState({
					latitude: pos.latitude,
					longitude: pos.longitude,
					terrainFiltres : terrainList,
					terrainsFiltresEtDistance : terrainList,
				})
			},
			{ enableHighAccuracy: true, timeout:    5000, maximumAge :300000}
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


    buildTerrains(latitude, longitude) {
		let liste = []
		for(var i =0 ; i < Terrains.length ; i++) {
			let distance =  Distance.calculDistance(latitude, longitude, Terrains[i].Latitude,Terrains[i].Longitude)
			
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
		var la = this.state.region.latitude;
		var lo = this.state.region.longitude;
		var distanceMax = Distance.calculDistance(la, lo, la+this.state.region.latitudeDelta, lo+this.state.region.longitudeDelta);

		let liste = []
		for(var i =0 ; i < Terrains.length ; i++) {
			var latitude = this.state.region.latitude
			var longitude = this.state.region.longitude
			let distance =  Distance.calculDistance(latitude,longitude, Terrains[i].Latitude,Terrains[i].Longitude)
			if(distance <= distanceMax) {
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


	handleFilterButton = () =>{
		this.setState({displayFiltres: !this.state.displayFiltres});
	}

	handleValidateFilters = (q, f) => {
		this.handleFilterButton();
        this.setState({filtres: f, query: q, isLoading: true})
        this.rechercheDefis(this.state.terrainsFiltresEtDistance, q);
	}

	displayFiltres() {
		if (this.state.displayFiltres) {
			return (<FiltrerDefi handleValidate={this.handleValidateFilters} init={this.state.filtres}/>);
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
        
		for(var i = 0; i< Terrains.length; i++) {
			var x = this.closestTerrain(newListe)
			terrain = x[0]
			newListe  = x[1]
            liste.push(terrain)
		}
		

		var max = 8;
		if(liste.length < max) max = liste.length
		
		
		return liste
	}


	relancerRecherche() {
		this.setState({isLoading: true});

		var newListe = this.fetchClosestTerrains(this.buildTerrainsWithRegionChanged());
		this.setState({terrainFiltres: newListe});

		this.rechercheDefis(newListe, this.state.query).then(() => {

			var markers = []
			for(var i =0 ; i < Math.min(10, this.state.defis.length); i ++) {
				var t =  {
					title: ' ',
					coordinates: {
						latitude: parseFloat(this.state.defis[i].latitude)  ,
						longitude: parseFloat(this.state.defis[i].longitude),
					},
					id : this.state.defis[i].data.id
				}
				markers.push(t)
			}

			var region = {
				latitude: parseFloat(this.state.defis[0].latitude),
				longitude: parseFloat(this.state.defis[0].longitude),
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}
			this.map.animateToRegion(region,1000)
			this.setState({markers : markers, selectedTerrain : markers[0]})
		})
	}


	filtrerDistanceSlider(liste, sliderValue) {
		if (sliderValue <= SLIDER_DISTANCE_MAX) {
			let listeOK = [];
			for (var i = 0; i<liste.length; i++) {
				distance = liste[i].distance;
				if (distance < sliderValue) {
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
				  		latitude: parseFloat(this.state.defis[index].latitude)  ,
				  		longitude: parseFloat(this.state.defis[index].longitude),
				},
				id : this.state.defis[index].data.id
		}
		liste.push(t)
        this.setState({ indexState : index,selectedTerrain : t})
		this.fitAllMarkers(index)

	}

	fitAllMarkers(index) {

		var region = {
			latitude: parseFloat(this.state.defis[index].latitude),
			longitude: parseFloat(this.state.defis[index].longitude),
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
    

    async rechercheDefis(terrainList, query) {
        var db = Database.initialisation();
        let listeDefis = [];
        for (var i=0; i<terrainList.length; i++) {

            if (query == null) {
                defisTerrain = await db.collection("Defis").where("terrain", "==", terrainList[i].id).get();

            } else {
                defisTerrain = await query.where("terrain", "==", terrainList[i].id).get();
            }

            for (var d=0; d<defisTerrain.docs.length; d++) {
                listeDefis.push({
					data: defisTerrain.docs[d].data(),
					latitude: terrainList[i].Latitude,
					longitude: terrainList[i].Longitude,
					terrain: terrainList[i],
				});
            }
		}
        this.setState({
            defis: listeDefis,
            isLoading: false
        });
    }


	// =============================================================================================
	//====================================== RENDER ================================================
	// =============================================================================================

    buildJoueurs(partie) {
        var liste = []
        for(var i = 0; i < partie.participants.length ; i++) {
            if(! partie.indisponibles.includes(partie.participants[i])) {
                liste.push(partie.participants[i])
            }
        }
        return liste
    }

	_renderItem = ({item}) => {
		var item2 = item.data;
        if(item2.type == Type_Defis.partie_entre_joueurs){
            
            return(
                <Item_Partie
                    id = {item2.id}
                    format = {item2.format}
                    jour = {new Date(item2.jour.seconds *1000)} 
                    duree = {item2.duree}
                    joueurs = {this.buildJoueurs(item2)}
                    nbJoueursRecherche =  {item2.nbJoueursRecherche}
                    terrain=  {item2.terrain}
                    latitudeUser = {LocalUser.geolocalisation.latitude}
                    longitudeUser = {LocalUser.geolocalisation.longitude}
                    message_chauffe  = {item2.message_chauffe}
                />
            )
        } else if(item2.type == Type_Defis.defis_2_equipes) {
            return(
                <Item_Defi
                    format = {item2.format}
                    jour = {new Date(item2.jour.seconds * 1000)}
                    duree ={item2.duree}
                    equipeOrganisatrice = {item2.equipeOrganisatrice}
                    equipeDefiee = {item2.equipeDefiee}
                    terrain = {item2.terrain}
                    allDataDefi = {item2}
                />
            )
        }
	}


	async gotoItemCarrousel(item) {
		if (item.type == Type_Defis.partie_entre_joueurs) {
			var navParams = {id: item.id};
			this.props.navigation.navigate("FichePartieRejoindre", navParams);
		} else {
			var db = Database.initialisation();
			
			defi = item;
			equipeOrga = await db.collection("Equipes").doc(item.equipeOrganisatrice).get();
			equipeDef  = await db.collection("Equipes").doc(item.equipeDefiee).get();

			var navParams = {defi: item, equipeOrganisatrice: equipeOrga.data(), equipeDefiee: equipeDef.data()};
			this.props.navigation.navigate("FicheDefiRejoindre", navParams);
		}
	}


  	/**
	   * Fonction qui permet d'appeller un item pour le caroussel
	   * @param {*} param0 
	*/
    _renderItemCarrousel = ({item,index}) => {

		var date = new Date(item.data.dateParse);
		var dateTxt = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
		var distance = Distance.calculDistance(item.latitude, item.longitude, LocalUser.geolocalisation.latitude, LocalUser.geolocalisation.longitude)+"";
		var distanceTxt = distance.split('.')[0]+","+distance.split('.')[1][0];
		

		return (
			<View style = {{
				width : wp('70%'),
				borderRadius : 8,
				paddingTop : hp('0.5%'),
				paddingLeft : wp('1%'),
				paddinRight : wp('1%'),
				backgroundColor : 'white', 
				flexDirection : 'row' ,
				marginBottom : hp('1%'),
			}}>

                {/* View contenant les informations sur le terrain*/}
                <View style={{flex: 5}}>
                    <Text>{item.data.type}</Text>
                    <Text>{dateTxt}</Text>
					<Text>{item.terrain.InsNom}</Text>

                    {/* View contenant le txt de la distance et l'image*/}
                    <View style = {{flexDirection : 'row'}}>
                        <Image 
                            style = {{width : wp('5%'), height : wp('5%'), marginRight : wp('2%')}}
                            source = {require('app/res/distance.png')}/>
                        <Text>{distanceTxt} km</Text>
                    </View>
                </View>

                {/* View contenant la checkBox */}
                <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
					<TouchableOpacity
						style={{flexDirection :'row', justifyContent: 'center', alignItems: 'center'}}
						onPress={() => {
							this.gotoItemCarrousel(item.data);
						}}
						>
                    	<Text>GO !</Text>
                	</TouchableOpacity>
                </View>                    
            </View>
		)
	}


	/**
	 * Fonction qui permet d'affihcer le boutton pour relancer une recherche dans un quartier.
	 */
	renderBtnRelancerRecherche() {

		if (!this.state.isLoading) {
			return(
				<TouchableOpacity style = {{flex: 1, backgroundColor : Color.agOOraBlue, padding : hp('1%'), borderRadius : 5, marginHorizontal: hp('10%')}}
					onPress = {() =>this.relancerRecherche()}>
					<Text style = {{color : "white", textAlign: 'center'}}>Relancer la recherche dans ce quartier</Text>
				</TouchableOpacity>
			)
		} else {
			return(
				<View>
					<View style = {{flex: 1, backgroundColor : Color.agOOraBlue, padding : hp('1%'), borderRadius : 5, marginHorizontal: hp('10%'), flexDirection: 'row', alignItems: 'center'}}>
						<Text style = {{color : "white", textAlign: 'center'}}>Recherche en cours</Text>
					</View>
					<Simple_Loading taille={wp('30%')}/>
				</View>
			)
		}
	}
	

	/**
	 * Méthode qui permet de choisir quoi afficher en fonction de si l'utilisateur veut 
	 * séléctionner un terrain en mode liste ou non.
	 */
	displayRender() {
		if(this.state.typeDisplay == LISTE ) {
			if (this.state.isLoading) {
				return (
					<View>
						<Simple_Loading taille={hp('3%')}/>
					</View>
				)
			}
			return(
				
				[<ScrollView style = {{marginBottom : hp('1%')}}>
					<View style = {{flex : 1}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', marginHorizontal: wp('5%')}}>
                                <View style={{flex: 1, alignItems: 'center'}}>
                                    <Text>{this.state.sliderValueList > SLIDER_DISTANCE_MAX ? '> 20 km' : this.state.sliderValueList + " km"}</Text>
                                </View>
                                <Slider
                                    minimumValue={1}
                                    maximumValue={SLIDER_DISTANCE_MAX+1}
                                    onSlidingComplete={(v) => {
                                        var t = this.filtrerDistanceSlider(this.state.terrainFiltres, v);
                                        this.setState({
                                            sliderValueList: v,
                                            terrainsFiltresEtDistance: t,
                                            isLoading: true
                                        });
                                        this.rechercheDefis(t, this.state.query);
                                    }}
                                    step={1}
                                    value={this.state.sliderValueList}
                                    minimumTrackTintColor={Color.lightGray}
                                    maximumTrackTintColor={Color.lightGray}
                                    thumbTintColor={Color.agOOraBlue}
                                />
                            </View>
                            {/* Pour les filtres*/}
                            <TouchableOpacity
                                style = {{backgroundColor : 'white', flexDirection : 'row', marginLeft : wp('3%'),paddingVertical : hp('1%'), paddingHorizontal :wp('3%')}}
                                onPress={() => {this.handleFilterButton()}}
                                >
                                    <Image
                                        style={{width : wp('7%'), height : wp('7%'), alignSelf : 'center'}}
                                        source = {require('app/res/controls.png')} />
                            </TouchableOpacity>
                        </View>
						{this.displayFiltres()}
						<FlatList
								data= {this.state.defis}
								keyExtractor={(item) => item.id}
								renderItem={this._renderItem}
								//extraData = {this.state.selectedTerrain}
						/>
						
					</View>
				</ScrollView>,

				<TouchableOpacity 
					style = {{padding : wp('4%'),position : "absolute",bottom : hp('6%'), right: wp('1%')}}
					onPress={() => this.setState({typeDisplay : MAP})}
					>
					<Image
						source = {require('app/res/map.png')}
						style = {{width : wp('17%'), height : wp('17%')}}/>
				</TouchableOpacity>]
			)
		} else {
			return(
						[<MapView
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

							{/* Marker depuis le state : va etre le terrain en 1ier plan*/}
							{this.state.markers.map(marker =>{
								if(marker.id  == this.state.selectedTerrain.id) {
									return(
										<MapView.Marker 
											coordinate={marker.coordinates}
											title={marker.title}
											description = {"okok"}>
											<Image source = {require('app/res/marker_terrain_selected.png')} style = {{width : 80, height : 80}}/>
										</MapView.Marker>
									)
								} else {
									return(
										<MapView.Marker 
											coordinate={marker.coordinates}
											title={marker.title}
											description = {"okok"}>
											<Image source = {require('app/res/marker_terrain.png')} style = {{width : 80, height : 80}}/>
										</MapView.Marker>
									)
								}
							})}
						</MapView>,

						// Vue contenant le carrousel
						<View style = {{position : "absolute", bottom : hp('1%')}}>
							<Carousel
								ref={c => this._slider1Ref = c}
								data={this.state.defis}	
								extraData = {this.state.selectedTerrain}		 
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

						<View style={{position : "absolute" , top : hp('6%'), flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
							{this.renderBtnRelancerRecherche()}
						</View>,

						<TouchableOpacity
							style = {{padding : wp('4%'),position : "absolute",bottom : hp('6%'), right: wp('1%')}}
							onPress={() => this.setState({typeDisplay : LISTE})}
						>
							<Image
								source = {require('app/res/list.png')}
								style = {{width : wp('17%'), height : wp('17%')}}/>

						</TouchableOpacity>]
			)
		}
	}
	
    
    render() {
        return this.displayRender();
    }

}

const styles = StyleSheet.create({

	map: {
		flex: 1,
		alignItems: 'center',
	},

	slider: {
        marginTop: hp('2%'),
        overflow: 'visible' // for custom animations
	},

	sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },

	
})

export default withNavigation(RechercheDefiAutour)
import React from 'react'

import {View, Text,Image,TouchableOpacity, TextInput,ListView, ScrollView,Dimensions, SectionList,} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import { TabView, SceneMap , TabBar} from 'react-native-tab-view';
import Slider from "react-native-slider";
import { RNFluidicSlider } from 'react-native-fluidic-slider'
import Color from '../../Components/Colors';
import JoueurItem from '../../Components/ProfilJoueur/JoueurItem'
import Joueurs from '../../Helpers/JoueursForAjout'
import Joueurs_Ajout_Item from '../../Components/Creation/Joueurs_Ajout_Item'
import StarRating from 'react-native-star-rating'
import { FlatList } from 'react-native-gesture-handler';

var joueurs = Joueurs

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const ThirdRoute = () => (
    <View style={[styles.scene, { backgroundColor: 'yellow' }]} />
);




export default class Creation_Equipe_Ajout_Joueurs extends React.Component {
    
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('nom', 'ollo')
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            joueurs : [],

            allPlayers : this.initiliserJoueurs(),
            playerSelected : [],
            index: 0,
            txt : 'Salut',
            value :10,
            routes: [
                { key: 'first', title: 'Autours \n de moi' },
                { key: 'second', title: 'Mon reseau' },
                { key: 'third', title: 'Rechercher' },


            ],

        }
    }

    initiliserJoueurs() {

        var j = []
        for (var i = 0; i < Joueurs.length; i++) {
            let joueur = {
                nom : Joueurs[i].nom,
                photo : Joueurs[i].photo,
                id : Joueurs[i].id,
                check : false,
                position : Joueurs[i].position
            }
            j.push(joueur);
        }
        return j
    }  
    

    getJoueurFromid(id) {

    }

    ajouterJoueur(idJoueur) {
        var j = this.state.joueurs;

        j.push(idJoueur)
        this.setState({joueurs :j , txt :'aaaa', allPlayers : []})
    }

    getColor(id, state) {
        if(state.joueurs.includes(id)) {
            return "blue"
        }else {
            return "white"
        }
    } 

    /**
     * Fonction qui permet de gérer l'affichage des joueurs dans la liste 
     * de joueurs à ajouter à l'équipe
     * @param {String} nom 
     * @param {String} rate 
     * @param {String} photo 
     * @param {String} id 
     */
    renderPlayerList = (player) => {
        var color = 'white'
        var nom = player.nom
        var rate = player.rate
        var photo = player.photo
        var id = player.id
        if(joueurs.includes(id)) {
            color = 'blue'
        }

        /* Définition du style du container. */
        var styleContainer  = {
            flex: 1,
            flexDirection: 'row',
            marginTop : hp('1.5%'), 
            marginBottom : hp('1.5%'), 
            marginLeft : wp('2%')  , 
            marginRight  : wp('2%'),     
            justifyContent: 'space-between'
        }

        return (
            <View>
                <TouchableOpacity 
                    style = {styleContainer}
                    onPress = {()=> {
                        this.ajouterJoueur(id)
                        this.forceUpdate()
                    }}
                    >
                    <View style = {{flexDirection : 'row'}}>
                        <Image 
                                style={{ width: wp('12%'), height: wp('12%'), borderRadius :28}}
                                source = {{uri : photo}}
                        />

                        {/* View contenant le nom, la note et l'indication d'ajout */}
                        <View style={{flexDirection: 'column'}}>
                            
                            <Text>{nom}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={rate}
                                starSize={20}
                                fullStarColor='#C0C0C0'
                                emptyStarColor='#C0C0C0'
                                containerStyle={{width: 30}}
                            />
                        </View>
                    </View>

                    <View style = {{width : wp('5%'),height : wp('5%'), borderWidth : 1, borderRadius : 10, backgroundColor : this.getColor(id,this.state) }}></View>
                </TouchableOpacity>
            </View>
      )
    } 

    /**
     * Permet d'afficher la vue correspondant à "Autours de moi"
     */
    FirstRoute = () => (
        <View style={[styles.scene, { backgroundColor: 'white' }]}>

            {/* View contenant la bare de recherche et le slider de km */}
            <View>

                {/* La bare de recherche */}
                <View style = {{flexDirection : 'row', paddingTop : hp('3%'), alignContent : "center", alignItems : "center"}}>
                    <TextInput
                        placeholder = "Rechercher" 
                        style = {{width : wp('55%'),borderWidth : 1 , borderRadius : 15,  marginLeft : wp('17.5%'), textAlign : "center"}}
                    />
                    <TouchableOpacity>
                        <Image
                            source = {require('app/res/controls.png')}
                            style = {{width : wp('7%'),height : wp('7%'),alignSelf : 'center', marginLeft : wp('3%')}} 
                        />
                    </TouchableOpacity>    
                </View>

                {/* Le slider de KM */}
                <View style={{alignItems: 'stretch', justifyContent: 'center', alignContent : 'center' , marginTop : hp('3%')}}>
                    <Text style = {{alignSelf : "center"}}>km</Text>
                    
                    <Slider
                        minimumValue={-10}
                        maximumValue={42}
                        style = {{width : wp('65%'), alignSelf :"center"}}
                        value={this.state.value}
                        minimumTrackTintColor={Colors.agOOraBlue}
                        maximumTrackTintColor= {Colors.agooraBlueStronger}
                        thumbTintColor= {Colors.agooraBlueStronger}
                        onValueChange={value => this.setState({value : value})}
                    />
                </View>
            </View>

            {/*View contenant la liste des joueurs */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                <FlatList
                        data ={this.state.allPlayers}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => 
                            <Joueurs_Ajout_Item joueur = {item}/>}
                /> 
                
                <Text>TEST</Text>
                </View>
            
                </ScrollView>
        </View>
    );
    

    
    SecondRoute = () => (
        <View style={[styles.scene, { backgroundColor: 'green' }]} />
    );

    renderScene = function(route) {
        const scenes = {
        '1': this.FirstRoute,
        '2': this.FirstRoute,
        '3' : this.ThirdRoute
        };
        return scenes[route.route.key];
        };

    
   
    renderLabel = ({route, index}) => (
        <View style={styles.containerLabel}>
            <Text style = {{color : "white", alignSelf : "center", fontWeight : "bold"}}>{route.title}</Text>
     </View>
    )

    render() {
        return(
            <View style = {{flex :1}}>
                <View style = {styles.bandeau}>
                        <Text style= {{ alignSelf : "center", marginLeft : wp('15%'), marginRight : wp('13%'), fontSize : RF(3.1)}}>Ajouter des joueurs</Text>
                        <TouchableOpacity
                            onPress = {()=> this.props.navigation.push("CreationEquipeAjoutJoueurs", {nom : this.state.nom, departement : this.state.departement, ville : this.state.ville})}
                        >
                            <Text style = {{fontSize : RF(3.1), color : Colors.agOOraBlue}}>Suivant</Text>
                        </TouchableOpacity>
                    </View>

                    {/* View contenant le nb de joueurs selectionnées */}
                    <View style = {{flexDirection : 'row'}}>
                        <Text style = {{marginLeft : wp('2%')}} >{this.state.joueurs.length} </Text>
                        <Text>joueur(s) séléctionné(s)</Text>
                </View>
                <TabView
                    navigationState={this.state}
                    
                    renderScene={SceneMap({
                    first: this.FirstRoute,
                    second: this.SecondRoute,
                    third : ThirdRoute,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    
                    renderTabBar={(props) =>
                        <TabBar
                          {...props}
                          style={{backgroundColor: Colors.agOOraBlue, height : hp('60%')}}
                          renderIcon={this.renderIcon}
                          indicatorStyle={{backgroundColor: "white", height : 5, borderRadius : 5}}
                          renderLabel={this.renderLabel}
                        />
                    }
                />
            </View>
        )
    }
}
const styles = {
    main_container : {
        marginTop:hp('0%'),
        flex:1
    },

    bandeau : {
        flexDirection : 'row',
        //backgroundColor : Colors.lightGray,
        paddingTop : hp('1%'),
        paddingBottom : hp('1%')
    },
    scene: {
        flex: 1,
    },
    containerLabel : {
        backgroundColor: Colors.agOOraBlue, 
        paddingLeft : wp('3%'),
        paddingRight : wp('3%'), 
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        borderRadius : 20, 
        alignContent : "center", 
        alignItems : "center"
    },
 
        sliderDummy: {
            backgroundColor: '#d3d3d3',
            width: 300,
            height:30,
            borderRadius: 50,
            position: 'absolute',                
        },
        sliderReal: {
            backgroundColor: '#119EC2',
            height:30,
        }
    

}
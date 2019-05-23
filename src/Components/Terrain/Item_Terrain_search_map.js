import React from 'react';
import {StyleSheet, View,Dimensions,TouchableOpacity,Text,Image} from 'react-native';
import Colors from '../Colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { colors } from 'react-native-elements';
import RF from 'react-native-responsive-fontsize';
const { width, height } = Dimensions.get('window');
import { withNavigation } from 'react-navigation'

/**
 * Classe qui permet d'afficher un item pour le caroussel dans la recherche de terrains 
 * avec la map.
 */
class Item_Terrain_search_map extends React.Component {

    constructor(props) {
        super(props)
     
        this.state = {
            InsNom : this.props.InsNom,
            EquNom :this.props.EquNom,
            isChoosen :this.props.isChoosen,
            distance : this.props.distance
        }
    }

    displayRender() {
         
		/*if(this.state.InsNom.length > "Association Sportive du C.E.A.T".length) {
            console.log("Trop grand  :",this.state.InsNom)
        }*/
		
		const InsNomStyle = {
            fontWeight : 'bold',
            alignSelf : 'center',
           // color : Colors.agooraBlueStronger
           fontSize  : RF(2.2)
        }
        
        const styleImg = {
            height : wp('22%'), 
            width  : wp('33'),
            alignSelf : "center", 
            borderRadius : 8, 
            marginTop : hp('2%'), 
            marginBottom : hp('1%') ,
        }

        const styleBtn = {
            position : "absolute",
            bottom : 0,
            flexDirection : 'row',
            alignSelf : 'flex-end',
            backgroundColor : Colors.agOOraBlue,
            paddingLeft : wp('2%'),
            paddinRight : wp('2%'),
            paddingTop : hp('1%'),
            paddingBottom  : hp('1%'),
            borderBottomRightRadius : 8,
            borderBottomLeftRadius : 8,
            width : wp('60%'),
            alignContent : 'flex-end'

        }
		
        
        return(
            <View style={styles.slide}>

                <View>
                <Text style = {styles.InsNomStyle}>{this.state.InsNom}</Text>
                    <Text style={styles.title}>{ this.state.EquNom }</Text>

                    {/* View contenant le txt de la distance et l'image*/}
                    <View style = {{flexDirection : 'row', alignSelf : 'flex-end'}}>
                        <Image 
                            style = {{width : wp('5%'), height : wp('5%'), marginRight : wp('2%')}}
                            source = {require('../../../res/distance.png')}/>
                        <Text style = {{}}>{this.state.distance} km </Text>

                    </View>
                </View>

                {/* Boutton de profil */}
                <TouchableOpacity 
                    style = {styleBtn}
                    onPress = {()=> this.props.navigation.push("ProfilTerrain", {id :this.props.id , distance : this.state.distance, titre : this.state.InsNom})}>
                    <View style = {{ postion : "aboslute", right : 0,flexDirection : 'row'}}>
                        <Text style = {{color : 'white', fontWeight : "bold"}}>Visiter le profil</Text>
                        <Image 
                            style = {{ width : wp('5%'), height : wp('5%')}}
                            source = {require('../../../res/right-arrow.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    render(){
        if(this.state.isChoosen) {
            console.log(this.state.InsNom, "okokokok")
        }
        return(
            <View>
                {this.displayRender()}
            </View>
        )
    }
}
styles = {
    slide : {
        width : wp('60%'),
        height : hp('17%'),
        borderRadius : 8,
        paddingTop : hp('0.5%'),
        paddingLeft : wp('1%'),
        paddinRight : wp('1%'),
        backgroundColor : 'white',    
    },

    InsNomStyle : {
        fontWeight : 'bold',
        alignSelf : 'center',
       // color : Colors.agooraBlueStronger
       fontSize  : RF(2.2)
    }
}
export default withNavigation(Item_Terrain_search_map)
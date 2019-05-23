import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Image,TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import SearchListDistance from '../../../Components/SearchListDistance'
import { colors } from 'react-native-elements';
import Slider from "react-native-slider";

/**
 * Vue qui va permettre à l'utilisateur de choisir un terrains par rapport à sa 
 * distance pour la création d'un défi
 */
export default class Choix_Terrain_Distance extends React.Component {


    renderItem = ({item}) => {
        
        return (
            <Text>{item}</Text>
        )
    }

    render() {
        return(
            <View style = {{backgroundColor : Colors.lightGray, marginTop : 100}}>

                {/* View contenant la bare de recherche */}
                <View style = {styles.view_recherche}>
                    
                    {/* Barre de recherche*/}
                    <TextInput
                        style={{flex: 1, borderWidth: 1, width : wp('9%'), backgroundColor : 'white'}}
                        placeholder = "Rechercher"
                        onChangeText={this.searchedJoueurs}
                    />

                    {/* Icon de la loupe*/}
                    <View style = {{backgroundColor : Colors.agOOraBlue, padding : wp('1%')}}>
                        <Image 
                            style={{width : wp('7%'), height : wp('7%'), borderWidth : 1}}
                            source = {require('app/res/search_glass.png')} />
                    </View>

                   {/* Pour les filtres*/}
                   <TouchableOpacity style = {{backgroundColor : 'white', flexDirection : 'row', marginLeft : wp('3%')}}>
                        <Image 
                            style={{width : wp('7%'), height : wp('7%')}}
                            source = {require('app/res/controls.png')} />
                        <Text style = {{alignSelf : "center", marginLeft : wp('2%')}}>Filtres</Text>
                   </TouchableOpacity>
                </View>
                <View style = {{backgroundColor : Colors.grayItem}}>
                    <Slider
                        minimumValue={0}
                        maximumValue={30}
                        style = {{width : wp('65%'), alignSelf :"center"}}
                        minimumTrackTintColor={Colors.agOOraBlue}
                        maximumTrackTintColor= {Colors.agooraBlueStronger}
                        thumbTintColor= {Colors.agooraBlueStronger} 
                    />
                </View>

                {/* ========= LISTES DES TERRAINS =========*/}
                <FlatList
                    data = {[1,3]}
                    renderItem = {this.renderItem}
                />
                




            </View>
        )
    }
}

const styles = {
    view_recherche : {
        flexDirection : 'row', 
        //marginLeft : wp('5%'), 
        //marginRight : wp('5%'), 
        backgroundColor : Colors.grayItem, 
        paddingVertical: hp('2%'),
        paddingHorizontal : wp('4%')
    }
}
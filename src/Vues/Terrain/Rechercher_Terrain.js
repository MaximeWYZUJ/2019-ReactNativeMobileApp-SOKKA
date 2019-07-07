import React from 'react'

import {View, Text,Image,TouchableOpacity, TextInput,ListView,ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import Slider from "react-native-slider";
import ItemTerrain from '../../Components/Terrain/ItemTerrain'
import Terrains from '../../Helpers/Toulouse.json'
// A SUPPR !!!!!
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const lat = 43.531486
const long =  1.490306
export default class Rechercher_Terrain extends React.Component {


    calculerDistance(lat2,long2) {
        var rad2 = Math.cos(lat2)/Math.cos(lat2);
        var rad3 = Math.cos(lat)/Math.cos(lat);
        var radBis = Math.cos(long2-long)/Math.cos(long2-long);
        return (
            Math.acos(Math.sin(rad2)*Math.sin(rad3)+
            Match.cos(rad2)*Math.cos(rad3)*Math.cos(radBis))*6371
        )
    }

    renderTerrainList = (terrain) => {

        return (
            <View>
                <ItemTerrain
                    nom = {terrain.fields.ins_nom}
                    distance = {36}/>
            </View>
        )
    }
    render() {
        console.log(Math.acos(0.5))
        return (

            <View style = {styles.main_container} >

                {/* View contenant les trois bouttons */}
                <View style = {styles.container_tab}>
                    {/* Autours de moi */}
                    <View style = {{flex: 1,flexDirection: 'column',justifyContent: 'space-between',}}>
                        <TouchableOpacity style ={{backgroundColor : Colors.agooraBlueStronger, width : wp('33%')}} >
                            <Text style ={styles.txt_tab} >{"Autour\n de moi"}</Text>
                        </TouchableOpacity>
                        <View style = {{backgroundColor : Colors.agooraBlueStronger, width : wp('33%'), height : hp('1%')}}></View>
                    </View>

                    {/*Mes terrains favoris*/}
                    <View style = {{flex: 1,flexDirection: 'column',justifyContent: 'space-between',}}>
                        <TouchableOpacity style ={{backgroundColor : Colors.agooraBlueStronger, width : wp('33%')}} >
                            <Text style ={styles.txt_tab}>{"Mes terrains \n favoris"}</Text>
                        </TouchableOpacity>
                        <View style = {{backgroundColor : Colors.agooraBlueStronger, width : wp('33%'), height : hp('1%')}}></View>

                    </View>

                    {/* Rechercher*/}
                    <View style = {{flex: 1,flexDirection: 'column',justifyContent: 'space-between',}}>
                        <TouchableOpacity style ={{backgroundColor : Colors.agOOraBlue, width : wp('33%')}} >
                            <Text style ={styles.txt_tab} >Rechercher</Text>
                        </TouchableOpacity>
                        <View style = {{backgroundColor :"white", width : wp('33%'), height : hp('1%')}}></View>
                    </View>
                </View>

                {/*View contenant la barre de recherche */}
                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                    <Image style={styles.search_image}
                        source = {require('app/res/search.png')} />
                    <TextInput
                        style={{flex: 1, borderWidth: 1, marginHorizontal: 15, borderRadius : 10}}
                    />
                    <TouchableOpacity onPress={() => this.setState({text: ''})}>
                        <Image style={styles.search_image}
                                source = {require('app/res/cross.png')}/>
                    </TouchableOpacity>
                </View>

                {/* Slider pour les kms */}
                <Slider
                        minimumValue={-10}
                        maximumValue={42}
                        style = {{width : wp('65%'), alignSelf :"center"}}
                        value={10}
                        minimumTrackTintColor={Colors.agOOraBlue}
                        maximumTrackTintColor= {Colors.agooraBlueStronger}
                        thumbTintColor= {Colors.agooraBlueStronger}
                 />

                {/*Vue contenant la liste des terrains */}
                <ScrollView>
                    <ListView
                        dataSource={ds.cloneWithRows(Terrains)}
                        renderRow={this.renderTerrainList} />
                </ScrollView>
            </View>
        )
    }
}
const styles = {

    main_container : {
        flex : 1,
        marginTop : hp('4%')
    },

    container_tab : {
        flexDirection : 'row', 
        backgroundColor : Colors.agOOraBlue,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android
    
    },

    txt_tab : {
        color : "white",
        fontSize : RF(2.5),
        fontWeight : 'bold'
    },
    search_image: {
        width: 30,
        height: 30,
    },

}
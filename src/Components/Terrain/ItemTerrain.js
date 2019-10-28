import React from 'react'

import {View, Text,Image,TouchableOpacity} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import { withNavigation } from 'react-navigation'
import LocalUser from '../../Data/LocalUser.json'
import Database from '../../Data/Database'
import Color from '../../Components/Colors';


/**
 * Classe permetant de définir un item terrain à utiliser dans les listes de terrains
 * Props : 
 *      - InsNom : Nom de l'instalation 
 *      - EqNom  : 
 *      - distance : distance du terrain par rapport à l'utilisateur
 *      
 */
class ItemTerrain extends React.Component{

    constructor(props){
        super(props)
        this.state={
            likes: LocalUser.data.terrains.includes(this.props.id)
        }
    }

    gotoProfilTerrain() {
        this.props.navigation.push("ProfilTerrain", {id : this.props.id, header: this.props.InsNom})
    }

    displayWordKm() {
        if (this.props.distance != undefined) {
            let distString = this.props.distance+"";
            let values = distString.split(".");
            
            if (values.length > 1) {
                let dispDistance = values[0]+","+values[1].substr(0,2);
                return (<Text>{dispDistance} km</Text>)
            }
        }
    }


    likeTerrain() {
        if (this.state.likes) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        Database.changeSelfToOtherArray_Aiment(this.props.id, "Terrains", false);
                        Database.changeOtherIdToSelfArray_TerrainsFav(this.props.id, false);

                        this.setState({
                            likes: false
                        })
                    }}>
                    <Image 
                        source = {require('app/res/icon_already_like.png')} 
                        style = {{width : wp('8%'), height : wp('8%'), marginLeft : wp('2%'), marginRight : wp('2%')}}/>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => {
                        Database.changeSelfToOtherArray_Aiment(this.props.id, "Terrains", true);
                        Database.changeOtherIdToSelfArray_TerrainsFav(this.props.id, true);

                        this.setState({
                            likes: true
                        })
                    }}>
                    <Image
                        source = {require('app/res/icon_like.png')} 
                        style = {{width : wp('8%'), height : wp('8%'), marginLeft : wp('2%'), marginRight : wp('2%')}}/>
                </TouchableOpacity>
            )
        }
    }


    render() {
        var borderwidth = 0;
        if (this.props.Payant) {
            borderwidth = 1;
        }
        return (
            <View style = {{flexDirection : 'row',marginBottom : hp('2%'), backgroundColor : "white", paddingBottom : hp('2%'),paddingTop : hp('2%')}}>
               
                <TouchableOpacity 
                    style = {{backgroundColor : "white",flexDirection : 'row', flex : 1, marginLeft : wp('4%'), borderWidth: borderwidth, borderColor: Color.agOOraBlue}}
                    onPress = {() => this.gotoProfilTerrain()}>
                    
                    {/* ==== ICONE TERRRAIN ET DISTANCE ====*/}
                    <View>
                        <Image
                            source = {require('../../../res/icon_terrain.png')}
                            style = {{width : wp('9%'), height : wp('9%')}}
                        />
                       {this.displayWordKm()}
                    </View>

                    {/* ===== NOM DE L'INSTALLATION ET DU TERRAIN ====*/}
                    <View style = {{alignSelf: "center", marginLeft : wp('4%')}}>
                        <Text style = {{fontWeight : "bold",color : Colors.agooraBlueStronger, fontSize : RF(2.35)}}>{this.props.InsNom}</Text>
                        <Text>{this.props.EquNom}</Text>
                        <Text>{this.props.N_Voie == undefined ? "" : this.props.N_Voie == " " ? "" : this.props.N_Voie + " "}{this.props.Voie == undefined ? " " : this.props.Voie == "" ? "" : this.props.Voie}</Text>
                        <Text>{this.props.Ville}</Text>
                    </View>
                </TouchableOpacity>

                {/* ===== ICON LIKE =====*/}
                {this.likeTerrain()}
            </View>
        )
    }
}

export default withNavigation(ItemTerrain)

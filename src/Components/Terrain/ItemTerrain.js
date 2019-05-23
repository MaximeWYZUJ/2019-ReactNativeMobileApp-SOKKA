import React from 'react'

import {View, Text,Image,TouchableOpacity} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import { withNavigation } from 'react-navigation'


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
    }

    gotoProfilTerrain() {
        this.props.navigation.push("ProfilTerrain", {id : this.props.id})
    }

    displayWordKm() {
        if (this.props.distance != undefined) {
            return (<Text>{this.props.distance} km</Text>)
        }
    }


    render() {
        console.log(this.props.nom)
        return (
            <View style = {{flexDirection : 'row',marginBottom : hp('2%'), backgroundColor : "white", paddingBottom : hp('2%'),paddingTop : hp('2%')}}>
               
                <TouchableOpacity 
                    style = {{backgroundColor : "white",flexDirection : 'row', flex : 1, marginLeft : wp('4%')}}
                    onPress = {() => this.gotoProfilTerrain()}>
                    
                    {/* ==== ICONE TERRRAIN ET DISTANCE ====*/}
                    <View>
                        <Image
                            source = {require('../../../res/icon_terrain.png')}
                            style = {{width : wp('9%'), height : wp('9%')}}
                        />
                       {this.displayWordKm()}
                    </View>

                    {/* ===== NOM DE L'INSTALATION ET DU TERRAINS ====*/}
                    <View style = {{alignSelf: "center", marginLeft : wp('4%')}}>
                        <Text style = {{fontWeight : "bold",color : Colors.agooraBlueStronger, fontSize : RF(2.35)}}>{this.props.InsNom}</Text>
                        <Text>{this.props.EquNom}</Text>
                    </View>
                </TouchableOpacity>

                {/* ===== ICON LIKE =====*/}
                <TouchableOpacity 
                    style = {{backgroundColor : "white", alignContent : "center",justifyContent:'center'}}
                    >
                    <Image
                        source = {require('../../../res/icon_like.png')}
                        style = {{width : wp('9%'), height : wp('9%'),alignSelf : 'center', marginRight : wp('4%')}}/>
                </TouchableOpacity>
            </View>
        )
        /*return (
            <View style = {[styles.main_container, {backgroundColor : Colors.grayItem}]}>
                <TouchableOpacity 
                    style = {{flex:1, flexDirection : 'row'}}
                    onPress={() => this.gotoProfilTerrain()}>
                    <Image 
                        source = {{uri : this.props.photo}}
                        style = {{width : wp('15%'), height : wp('15%'), marginBottom : hp('1%'), marginTop : hp('1%')}}/>
                    <View style = {styles.txt_container}>                    
                        <Text style = {{fontSize : RF(2.3), marginLeft : wp('2%')}}>{this.props.nom} - {this.props.distance} km</Text>
                        <Text style = {{fontSize : RF(2.3), marginLeft : wp('2%')}}>{this.props.ville}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style = {{alignSelf: 'center'}}>
                    <Image 
                        style = {{width : wp('10%'), height : wp('10%')}}
                        source ={require('app/res/icon_like.png')}/>
                </TouchableOpacity>
            </View>
        )*/
    }
}
const styles = {
    main_container : {
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginLeft : wp('2%'),
        marginRight : wp('2%'),
        paddingLeft : wp('2%'),
        paddingRight : wp('2%'),
        borderRadius : 8,
        flexDirection : 'row',
        justifyContent: 'space-between',
        backgroundColor : '#F9F9F9',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 4, // Android
        //paddingTop : hp('1.5%'),
        //paddingBottom : hp('1.5%')
    },
    txt_container : {
        alignSelf : 'center'
    }
}
export default withNavigation(ItemTerrain)

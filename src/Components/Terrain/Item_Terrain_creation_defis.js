import React from 'react'

import {View, Text,Image,TouchableOpacity} from 'react-native'
import { CheckBox } from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import { withNavigation } from 'react-navigation'
import actions from '../../Store/Reducers/actions'
import { connect } from 'react-redux'
import Color from '../Colors';

/**
 * Classe permetant de définir un item terrain à utiliser dans les listes de terrains
 * Props : 
 *      - InsNom : Nom de l'instalation 
 *      - EqNom  : 
 *      - distance : distance du terrain par rapport à l'utilisateur
 *      
 */
class Item_Terrain_creation_defis extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            checked : this.props.isShown,
        }
    }

    gotoProfilTerrain() {
        this.props.navigation.push("ProfilTerrain", {id : this.props.id})
    }

     /**
     * Permet de choisir un terrain et le stock dans un state global 
     * 
     * @param {String} idTerrain 
     */
    _chooseTerrain(idTerrain ) {
            const action = { type: actions.CHOISIR_TERRAIN, value: idTerrain}
            this.props.dispatch(action)

            const action2 = {type : actions.SAVE_NOM_TERRAIN , 
                value : {
                    InsNom : this.props.InsNom,
                    EquNom : this.props.EquNom
                }
            }
            this.props.dispatch(action2)

    }

    render() {
        const  isShown  = this.props.isShown
        var borderWidth = 0
        if(this.props.payant) {
            borderWidth  = 1
        }
        return (
            <View style = {{flexDirection : 'row',marginBottom : hp('2%'), backgroundColor : "white", paddingBottom : hp('2%'),paddingTop : hp('2%')}}>
               
                <TouchableOpacity 
                    style = {{backgroundColor : "white",flexDirection : 'row', flex : 1, marginLeft : wp('4%'), borderWidth : borderWidth , borderColor : Color.agOOraBlue}}
                    >
                    
                    {/* ==== ICONE TERRRAIN ET DISTANCE ====*/}
                    <View>
                        <Image
                            source = {require('../../../res/icon_terrain.png')}
                            style = {{width : wp('9%'), height : wp('9%'), marginTop : hp('0.5%')}}
                        />
                        <Text>{this.props.distance} km</Text>
                    </View>

                    {/* ===== NOM DE L'INSTALATION ET DU TERRAINS ====*/}
                    <View style = {{alignSelf: "center", marginLeft : wp('4%')}}>
                        <Text style = {{fontWeight : "bold",color : Colors.agooraBlueStronger, fontSize : RF(2.35)}}>{this.props.InsNom}</Text>
                        <Text>{this.props.N_Voie} {this.props.Voie}</Text>
                        <Text>{this.props.Ville}</Text>
                    </View>
                </TouchableOpacity>

                {/* ===== ICON LIKE =====*/}
                <CheckBox
                    title=' '
                    checkedColor = {Colors.agOOraBlue}
                    right
                    containerStyle={{backgroundColor: 'white', borderWidth :0}}                    
                    checked={isShown}
                    onPress={() => {
                        this._chooseTerrain(this.props.id)
                        var checked = this.state.isShown
                        this.setState({isShown: !checked})
                    }}
                />
            </View>
        )
       
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
const mapStateToProps = (state) => {
    return{ 
        terrainSelectionne : state.terrainSelectionne,
        nomsTerrainSelectionne : state.nomsTerrainSelectionne
    } 
}

export default connect(mapStateToProps) (withNavigation(Item_Terrain_creation_defis))


import React from 'react'

import {View, Text,Image,TouchableOpacity} from 'react-native'
import { CheckBox } from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import { withNavigation } from 'react-navigation'
import actions from '../../Store/Reducers/actions'
import { connect } from 'react-redux'


/**
 * Composant qui va permettre de selectionner un terrain depuis la vue map lors 
 * de la création d'un défi.
 */
class Item_Terrain_Map_Creation_Defis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShown : this.props.isShown,
        }
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
                    EquNom : this.props.EquNom,
                    N_Voie : this.props.N_Voie,
                    Voie : this.props.Voie,
                    CodePostal : this.props.CodePostal,
                    Ville : this.props.Ville,
                    distance : this.props.distance

            }
        }
        this.props.dispatch(action2)
    }


    renderCheckBox() {
        if (this.props.gotoItemOnPress) {
            return (
                <TouchableOpacity style={{flexDirection :'row', justifyContent: 'center', alignItems: 'center'}} onPress={() => this.props.nav.navigate("ProfilTerrain", {id: this.props.id, header: this.props.InsNom})}>
                    <Text>GO !</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View style = {{flexDirection :'row'}}>
                    <CheckBox
                        title=' '
                        checkedColor = {Colors.agOOraBlue}
                        right
                        containerStyle={{backgroundColor: 'white', borderWidth :0,marginTop : hp('0.1%'), alignSelf : 'center'}}                    
                        checked={this.state.isShown}
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


    render() {

        const  isShown  = this.props.isShown

        return(
                <View style = {styles.slide}>

                    {/* View contenant les informations sur le terrain*/}
                    <View style={{flex: 5}}>
                        <Text style = {styles.InsNomStyle}>{this.props.InsNom}</Text>
                        <Text style={styles.title}>{this.props.N_Voie} {this.props.Voie} </Text>

                        {/* View contenant le txt de la distance et l'image*/}
                        <View style = {{flexDirection : 'row'}}>
                            <Image 
                                style = {{width : wp('5%'), height : wp('5%'), marginRight : wp('2%')}}
                                source = {require('../../../res/distance.png')}/>
                            <Text style = {{}}>{this.props.distance} km</Text>
                        </View>
                    </View>

                    {/* View contenant la checkBox */}
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                        {this.renderCheckBox()}
                    </View>
                    
                </View>
        )
    }
}
const styles = {
    slide : {
        width : wp('70%'),
        //height : hp('12%'),
        borderRadius : 8,
        paddingTop : hp('0.5%'),
        paddingLeft : wp('1%'),
        paddinRight : wp('1%'),
        backgroundColor : 'white', 
        flexDirection : 'row' ,
        marginBottom : hp('1%'),
    },

    InsNomStyle :{
        fontWeight : 'bold',
        color : Colors.agooraBlueStronger,
        fontSize  : RF(2.2)
    }
}

const mapStateToProps = (state) => {
    return{ 
        terrainSelectionne : state.terrainSelectionne,
        nomsTerrainSelectionne : state.nomsTerrainSelectionne
    } 
}

export default connect(mapStateToProps) (Item_Terrain_Map_Creation_Defis)
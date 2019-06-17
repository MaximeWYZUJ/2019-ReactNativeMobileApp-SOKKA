import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import NormalizeString from '../../Helpers/NormalizeString';

/**
 * Composant barre de recherche 
 * Props : 
 *      handleTextChange : Arrow Fonction à exécuter dans le composant parent 
 *          au moment où le texte change
 * 
 *      data : Données sur lesquelles effectuer la recherche
 * 
 *      field : champs sur lequel filtrer les données
 * 
 *      filterData : fonction qui permet de filtrer les données récoltées
 * 
 *      handleFilterButton : fonction appelée quand on appuie sur le bouton de display des filtres
 * 
 * Il faut obligatoirement que un des champs de data ai le même nom que le field 
 * et que l'objet associé soit un string
 */     
export default class Barre_Recherche extends React.Component {
    
    constructor(props) {
        super(props)
        this.DataDepart = this.props.data;
        this.field = this.props.field
        this.state = {
            data :this.props.data
        } 

    }


   

    /**
	 * Fonction qui va permettre de filtrer les données en fonction de ce que 
     * searchedText
	 */
	searchedTerrains = (searchedText) => {
        if (searchedText === "") {
            if(this.filterData != undefined) {
                this.props.handleTextChange(this.props.filterData(this.DataDepart))
            } else {
                this.props.handleTextChange(this.DataDepart)

            }
        } else {
            let field = this.field
            let searchData = this.props.data.filter(function(data) {
                return data[field].includes(NormalizeString.normalize(searchedText)) // toLowerCase().startsWith(searchedText.toLowerCase()) ;
            });
            if(this.props.filterData != undefined) {
                searchData = this.props.filterData(searchData);
            }
            this.props.handleTextChange(searchData)
        }
    };

    render(){

        return (
            <View>
                <View style = {{backgroundColor : Colors.lightGray}}>

                    {/* View contenant la bare de recherche */}
                    <View style = {styles.view_recherche}>
                        
                        {/* Barre de recherche*/}
                        <TextInput
                            style={{flex: 1, borderWidth: 1, width : wp('9%'), backgroundColor : 'white'}}
                            placeholder = "  Rechercher"
                            onChangeText={this.searchedTerrains}
                        />

                        {/* Icon de la loupe*/}
                        <TouchableOpacity
                            style = {{backgroundColor : Colors.agooraBlueStronger, paddingVertical : hp('1%'), paddingHorizontal : wp('3%'), borderRightWidth : 1, borderBottomWidth : 1, borderTopWidth : 1}}
                            onPress={() => this.searchedTerrains("")}
                            >
                            <Image 
                                style={{width : wp('5%'), height : wp('5%'), borderWidth : 1}}
                                source = {require('app/res/search_glass.png')} />
                        </TouchableOpacity>

                    {/* Pour les filtres*/}
                    <TouchableOpacity
                        style = {{backgroundColor : 'white', flexDirection : 'row', marginLeft : wp('3%'),paddingVertical : hp('1%'), paddingHorizontal :wp('3%')}}
                        onPress={() => {this.props.handleFilterButton()}}
                        >
                            <Image 
                                style={{width : wp('7%'), height : wp('7%'), alignSelf : 'center'}}
                                source = {require('app/res/controls.png')} />
                    </TouchableOpacity>
                    </View>
                
                </View>

                
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
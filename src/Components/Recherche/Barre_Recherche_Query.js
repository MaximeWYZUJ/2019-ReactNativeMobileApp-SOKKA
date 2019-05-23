import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import DataBase from '../../Data/Database'

/**
 * Bare de recherche qui va permettre d'effectuer des query depuis la base de données
 * 
 * Props : 
 *      handleResults : Arrow Fonction à exécuter dans le composant parent 
 *          au moment où on récupère les résultats de la query
 * 
 *      collection  : collection sur la quelle lancer la query
 * 
 *      field : champs sur lequel effectuer la query
 *      
 *      nbOfChar : Nombre de cractères min pour lancer une query
 * 
 *      non_pris_en_compte : id d'un doc à ne pas prendre en compte
 * 
 */     

export default class Barre_Recherche extends React.Component {

    constructor(props) {
        super(props)
        this.monId = "aPyjfKVxEU4OF3GtWgQrYksLToxW2"
        this.state = {
            texte : ''
        }
    }

    
    /**
	 * Fonction qui va permettre de filtrer les données en fonction de ce que 
     * searchedText
	 */
	texteChanged = (searchedText) => {
        this.setState({texte : searchedText})
    };

    runQuery() {
        if(this.state.texte.length >= this.props.nbOfChar) {
            var array = []
            var db = DataBase.initialisation()

            var ref = db.collection(this.props.collection);
            var query = ref.orderBy(this.props.field).startAt(this.state.texte.toLowerCase())
                                .endAt(this.state.texte.toLocaleLowerCase() + '\uf8ff')
                                .limit(15);
            query.get().then(async (results) => {
            if(results.empty) {
              console.log("No documents found!"); 
              this.props.handleResults(array)  
            } else {
              // go through all results
              for(var i = 0; i < results.docs.length ; i++) {
                if(results.docs[i].data().id != this.props.non_pris_en_compte) {
                    array.push(results.docs[i].data())
                }
            }
            console.log(array)
              
            this.props.handleResults(array)
           // this.setState({equipes : equipeArray})
            //console.log(this.state)
              

            }

        
          }).catch(function(error) {
              console.log("Error getting documents:", error);
          });
    
        } else {
            Alert.alert(
                "Tu dois rechercher au moins " + this.props.nbOfChar +" caractères"
            )
        }
    }
    
    render() {
        return(
            <View>
                <View style = {{backgroundColor : Colors.lightGray}}>

                    <Text>Entre au moins {this.props.nbOfChar} caractères</Text>

                    {/* View contenant la bare de recherche */}
                    <View style = {styles.view_recherche}>
                        
                        {/* Barre de recherche*/}
                        <TextInput
                            style={{flex: 1, borderWidth: 1, width : wp('9%'), backgroundColor : 'white'}}
                            placeholder = "  Rechercher"
                            onChangeText={this.texteChanged}
                        />

                        {/* Icon de la loupe*/}
                        <View style = {{backgroundColor : Colors.agooraBlueStronger, paddingVertical : hp('1%'), paddingHorizontal : wp('3%'), borderRightWidth : 1, borderBottomWidth : 1, borderTopWidth : 1}}>  
                            <TouchableOpacity
                                onPress = {() => this.runQuery()}>
                                <Image 
                                    style={{width : wp('5%'), height : wp('5%'), borderWidth : 1}}
                                    source = {require('app/res/search_glass.png')} />
                            </TouchableOpacity> 
                        </View>

                    {/* Pour les filtres*/}
                    <TouchableOpacity 
                        style = {{backgroundColor : 'white', flexDirection : 'row', marginLeft : wp('3%'),paddingVertical : hp('1%'), paddingHorizontal :wp('3%')}}
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
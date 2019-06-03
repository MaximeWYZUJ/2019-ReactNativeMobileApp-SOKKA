import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import DataBase from '../../Data/Database'
import LocalUser from '../../Data/LocalUser'
import NormalizeString from "../../Helpers/NormalizeString"

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
 *      handleFilterButton : Arrow Fonction qui est appelée quand on appuie
 *          sur le bouton de filtrage
 * 
 *      handleFilterQuery : query relative aux filtres
 * 
 */

export default class Barre_Recherche extends React.Component {

    constructor(props) {
        super(props)
        this.monId = LocalUser.data.id;
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
        console.log("in run query")
        if(this.state.texte.length >= this.props.nbOfChar || !(this.props.handleFilterQuery===null)) {
            console.log("in if RUN QUERY")
            var array = []
            var db = DataBase.initialisation()

            var ref;
            var query;
            console.log("CONDITION : ",this.props.handleFilterQuery === null )
            if (this.props.handleFilterQuery === null ) {
                console.log("before ref ")
                ref = db.collection(this.props.collection);
                console.log("after ref")
                query = ref.where(this.props.field, 'array-contains', NormalizeString.normalize(this.state.texte))
                    .limit(15);
            } else {
                console.log("in else marque")
                // Si on applique des filtres, on peut faire une recherche sans nom dans la barre de recherche
                // et il n'y a pas de limite basse au nombre de caractères
                ref = this.props.handleFilterQuery;
                if (this.state.texte.length > 0) {
                    query = ref.where(this.props.field, 'array-contains', NormalizeString.normalize(this.state.texte))
                        .limit(15);
                } else {
                    console.log("in ELSE recherche")
                    query = ref;
                }
            }
            /*var query = ref.orderBy(this.props.field).startAt(NormalizeString.normalize(this.state.texte))
                                .endAt(this.state.texte.toLocaleLowerCase() + '\uf8ff')
                                .limit(15);*/
            
            
            
            query.get().then(async (results) => {
            if(results.empty) {
                console.log("No documents found!");
                console.log("Collection : " + this.props.collection);
                console.log("Field : " + this.props.field);
                console.log("Texte de recherche : " + this.state.texte);
                this.props.handleResults(array)
            } else {
                // go through all results
                for(var i = 0; i < results.docs.length ; i++) {
                    if(results.docs[i].data().id != this.props.non_pris_en_compte) {
                        array.push(results.docs[i].data())
                    }
                }
                
                this.props.handleResults(array)
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
                                onPress = {() => this.runQuery()}
                                >
                                <Image 
                                    style={{width : wp('5%'), height : wp('5%'), borderWidth : 1}}
                                    source = {require('app/res/search_glass.png')} />
                            </TouchableOpacity>
                        </View>

                        {/* Pour les filtres*/}
                        <TouchableOpacity 
                            style = {{backgroundColor : 'white', flexDirection : 'row', marginLeft : wp('3%'),paddingVertical : hp('1%'), paddingHorizontal :wp('3%')}}
                            onPress={() => this.props.handleFilterButton()}
                            >
                                <Image 
                                    style={{width : wp('7%'), height : wp('7%'), alignSelf : 'center'}}
                                    source = {require('app/res/controls.png')}/>
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
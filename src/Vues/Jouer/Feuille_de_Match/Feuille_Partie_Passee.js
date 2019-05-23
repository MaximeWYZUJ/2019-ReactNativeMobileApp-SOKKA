import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Animated} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import StarRating from 'react-native-star-rating'
import Database from '../../../Data/Database'
import TabFeuillePasse from './TabFeuillePasse'
import { connect } from 'react-redux'

 
/**
 * Classe qui permet d'afficher la feuille de match d'une partie déja jouée.
 */
class Feuille_Partie_Passee extends React.Component {

    constructor(props) {
        super(props)
        this.monId = "aPyjfKVxEU4OF3GtWgQrYksLToxW2"
        this.state = {
            partie : this.props.navigation.getParam('partie', undefined),
            joueurs : this.props.navigation.getParam('joueurs', []),
        }
        this.joueurAnimation = new Animated.ValueXY({ x: -wp('100%'), y:0 })

    }


    componentDidMount(){
        // this.rechecherJoueurManquant()
        this._moveJoueur()
    }



 


    /**
     * Fonction qui permet de déplacer les joueurs
     */
    _moveJoueur= () => {
        Animated.spring(this.joueurAnimation, {
          toValue: {x: 0, y: 0},
        }).start()

    }

    /**
     * Fonction qui permet de renvoyer la liste de tous les joueurs ayant confirmés
     */
    buildListOfJoueursConfirme() {
        var liste = []
        console.log(this.state.partie.confirme)
        for(var i =0; i < this.state.joueurs.length; i++) {
            if(this.state.partie.confirme.includes(this.state.joueurs[i].id)){
                console.log(this.state.joueurs[i].id)
                liste.push(this.state.joueurs[i])
            }
        }
        return liste
    }

    /**
     * Fonction qui va permettre d'enregistrer les données dans la db, pas besoin de changer 
     * attente car vu le fait qu'un joueurs soit dans les confirmé suffit.
     */
    enregistrerDonnees() {
        var db = Database.initialisation()
        var defisRef = db.collection("Defis").doc(this.state.partie.id);

     
        defisRef.update({
           votes : this.props.votes,
           buteurs : this.props.buteurs,
           confirme : this.props.joueursPresents 
        })
        .then(
            Alert.alert(
                '',
                'Les modifications ont bien été enregistrées'
            )
        )
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }


    _renderItem = ({item}) => {

        var color  = "white"
        if(this.state.partie.confirme.includes(item.id)) {
            color = "#13C840"
       
        
            return(
                <Animated.View style = {this.joueurAnimation.getLayout()}>
                    <Image
                        source = {{uri : item.photo}}
                        style = {{width : wp('15%'), height : wp('15%'), borderRadius : wp('7%'), marginRight : wp('2%'), marginTop : hp('1%'), marginLeft : wp('1%')}}/>
                </Animated.View>
              
            )
        }        
    }

    



    render() {
        return(
            <View style = {{flex :1}}>
                {/* Bandeau superieur */}
                <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        >
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>

                    <Text> Feuille de match </Text>
                    
                    <TouchableOpacity
                        onPress= {() => this.enregistrerDonnees()}
                        >
                        <Text style = {styles.txtBoutton}>Enregister</Text>
                    </TouchableOpacity>
                </View>

                {/* View contenant la liste des joueurs ayant confirmés */}
                <View style  = {styles.containerJoueur}>
                    
                    {/* Liste des joueurs */}
                    <FlatList
                        data = {this.buildListOfJoueursConfirme()}
                        renderItem = {this._renderItem}
                        numColumns={5}
                        keyExtractor={(item) => item.id}
                            
                    />
                </View>

                <Text>Statistiques joueurs</Text>

                <TabFeuillePasse/>
            </View>
        )
    }
}
const styles = {
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },
    texte : {
        fontSize : RF('2.6'),
        alignSelf : "center"
    },

    containerJoueur : {
        borderWidth : 1,
        marginLeft  : wp('2%'),
        marginRight : wp('2%')
    }
}

const mapStateToProps = (state) => {
    return{ 
        buteurs : state.buteurs,
        votes : state.votes,
        joueursPresents : state.joueursPresents

    } 
}
export default connect(mapStateToProps) (Feuille_Partie_Passee)
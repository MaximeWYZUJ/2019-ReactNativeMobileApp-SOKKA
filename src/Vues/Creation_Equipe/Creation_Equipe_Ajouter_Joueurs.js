import React from 'react'
import {View, Text,Image,TouchableOpacity,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'
import TabAjouterJoueursEquipe from './TabAjouterJoueursEquipe'
import { connect } from 'react-redux'

/**
 * Classe qui va permettre à l'utilisateur d'ajouter des joueurs à 
 * l'équipe qu'il est en train de créer.
 */
class Creation_Equipe_Ajouter_Joueurs_Final extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('nom', ' ')
        }
    }

    constructor(props) {
        super(props) 
        this.state = {
            nbJoueursSelectionnes : 0
        }  
    }

    render(){
        
        return(
            <View style = {{flex :1}}>
            <View style = {styles.bandeau}>
            <TouchableOpacity
                        onPress ={() => Alert.alert(
                                '',
                                "Es-tu sûr de vouloir quitter ?",
                                [
                                    {
                                        text: 'Oui',
                                        onPress: () =>  this.props.navigation.push("ProfilJoueur")
                                        
                                    },
                                    {
                                        text: 'Non',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                            )}>
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>
                <Text style= {{ fontSize : RF(2.6)}}>Ajouter des joueurs</Text>
                <TouchableOpacity
                    onPress = {()=> this.props.navigation.push(
                        "CreationEquipeCitation",
                        {
                            nom : this.props.navigation.getParam('nom', undefined),
                            ville :  this.props.navigation.getParam('ville', undefined),
                            departement :  this.props.navigation.getParam('departement', undefined),
                            joueurs : this.props.joueursSelectionnes,  
                        })}
                    >
                    <Text style = {{fontSize : RF(3.1), color : Colors.agOOraBlue}}>Suivant</Text>
                </TouchableOpacity>
                
                </View>

                {/* Texte du nombre de joueurs séléctionnés */}
                <Text style = {{marginLeft : wp('2%')}} >{this.props.joueursSelectionnes.length} joueur(s) séléctionné(s) </Text>
                
                <TabAjouterJoueursEquipe/>

            </View>
        )
    }
}

const styles = {
    bandeau : {
        flexDirection : 'row',
        backgroundColor : Colors.lightGray,
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        justifyContent: 'space-between',

    },

}

const mapStateToProps = (state) => {
    return{ 
        joueurs : state.joueurs,
        joueursSelectionnes : state.joueursSelectionnes
    } 
}

export default connect(mapStateToProps)(Creation_Equipe_Ajouter_Joueurs_Final)
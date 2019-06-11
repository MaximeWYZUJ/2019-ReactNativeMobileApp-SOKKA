import React from 'react'

import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors'
import Type_Defis from '../Type_Defis'

/**
 * Classe qui va permettre à l'utilisateur de choisir un message de chauffe
 * lors de la création d'un défis.
 */
export default class  Choix_Message_Chauffe extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            message : ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        if(navigation.getParam('type', ' ') == Type_Defis.defis_2_equipes){
            return {
                title: 'Proposer un défi'
            }
        } else {
            return {
                title: 'Proposer une partie'
            }
        }
        
    }


    /**
	 * Fonction qui va permettre de filtrer les données en fonction de ce que 
     * searchedText
	 */
	changeText = (text) => {
        this.setState({message : text})
    };

    goToNextScreen()  {

        if( this.props.navigation.getParam('type', ' ')  == Type_Defis.defis_2_equipes) {
            this.props.navigation.push("RecapitulatifDefis", 
            {
                format : this.props.navigation.getParam('format', ' '),
                type : this.props.navigation.getParam('type', ' '),
                jour : this.props.navigation.getParam('jour', ' '),
                heure :this.props.navigation.getParam('heure', ' '),
                terrain : this.props.navigation.getParam('terrain', ' '),
                duree : this.props.navigation.getParam('duree', ' '),
    
                allDataEquipe : this.props.navigation.getParam('allDataEquipe', ' '),
                userData : this.props.navigation.getParam('userData', ' '),
                joueursSelectionnes : this.props.navigation.getParam('joueursSelectionnes', ' '),
                contreQui :this.props.navigation.getParam('contreQui', ' '), 
                equipeAdverse : this.props.navigation.getParam('equipeAdverse', ' '),
                nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' '),
                messageChauffe : this.state.message
    
            }) 
        } else {
            console.log(this.props.navigation.getParam('nomsTerrains', ' '),)
            this.props.navigation.push("RecapitulatifPartie", 
            {
                format : this.props.navigation.getParam('format', ' '),
                type : this.props.navigation.getParam('type', ' '),
                jour : this.props.navigation.getParam('jour', ' '),
                heure :this.props.navigation.getParam('heure', ' '),
                duree : this.props.navigation.getParam('duree', ' '),
                terrain : this.props.navigation.getParam('terrain', ' '),

                //allDataEquipe : this.props.navigation.getParam('allDataEquipe', ' '),
               // joueursSelectionnes : this.props.navigation.getParam('joueursSelectionnes', ' '),
               // contreQui :this.props.navigation.getParam('contreQui', ' '), 
               // equipeAdverse : this.props.navigation.getParam('equipeAdverse', ' '),
                nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' '),
                messageChauffe : this.state.message,
                joueurs : this.props.navigation.getParam('joueurs', ''),
                nbrJoueurs : this.props.navigation.getParam('nbrJoueurs', ''),

    
            }) 
        }
       
    }

    

    render() {
        return(
            <View>

                {/* Bandeau superieur */}
                <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        onPress ={() => Alert.alert(
                                '',
                                "Es-tu sûr de vouloir quitter ?",
                                [
                                    {
                                        text: 'Oui',
                                        onPress: () => this.props.navigation.push("AccueilJouer")},
                                    {
                                        text: 'Non',
                                        onPress: () => {},
                                        style: 'cancel',
                                    },
                                ],
                            )}>
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>

                    <Text> Message </Text>
                    
                    <TouchableOpacity
                        onPress ={() =>{this.goToNextScreen()}}>
                        <Text style = {styles.txtBoutton}>Suivant</Text>
                    </TouchableOpacity>
                </View>

                <View style = {{marginTop : hp('4%')}}>
                    <Text style = {styles.texte}> Quel message souhaites-tu envoyer </Text>
                    <Text style = {styles.texte}>à tes futures adverssaires</Text>
                </View>
                

                <TextInput
                    placeholder = {"____________________"}
                    style = {styles.txt_input}
                    onChangeText = {this.changeText}
                />
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

    txt_input : {
        borderWidth : 1, 
        width : wp('85%'),
        alignSelf : "center" , 
        borderRadius :5, 
        paddingLeft : wp('2%'),
        marginTop : hp('5%'), 
        paddingVertical : hp('1%')
    }
}
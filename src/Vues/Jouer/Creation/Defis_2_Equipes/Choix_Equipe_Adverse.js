import React from 'react'
import {View,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../.././../../Components/Colors'
import TabChoixEquipeAdverse from './TabChoixEquipeAdverse'
import { connect } from 'react-redux'


class Choix_Equipe_Adverse extends React.Component {

    constructor(props) {
        super(props)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Proposer un défi'
        }
    }


    buttonNext(){
        
        if(this.props.equipeAdverse != undefined ) {
            return( 
                <TouchableOpacity
                    onPress ={() => {this.goToNextScreen()}}>
                    <Text style = {styles.txtBoutton}>Suivant</Text>
                </TouchableOpacity>
            ) 
        } else {
            return (
                <Text>Suivant</Text>
            )
        }
    }

   goToNextScreen() {
 
    this.props.navigation.push("ChoixMessageChauffe", 
    {
        format : this.props.navigation.getParam('format', ' '),
        type : this.props.navigation.getParam('type', ' '),
        jour : this.props.navigation.getParam('jour', ' '),
        heure :this.props.navigation.getParam('heure', ' '),
        duree : this.props.navigation.getParam('duree', ''),
        terrain : this.props.navigation.getParam('terrain', ' '),
        allDataEquipe : this.props.navigation.getParam('allDataEquipe', ' '),
        userData : this.props.navigation.getParam('userData', ' '),
        joueursSelectionnes : this.props.navigation.getParam('joueursSelectionnes', ' '),
        contreQui :this.props.navigation.getParam('contreQui', ' '), 
        equipeAdverse : this.props.equipeAdverse,
        nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' ')
    }) 
   }



    render() {

        return (
            <View style = {{flex : 1}}>
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

                    <Text> Contre qui </Text>
                    
                    {this.buttonNext()}
                </View>

                <Text style = {styles.txt_message}> Quelle équipe souhaites-tu défier </Text>

                <TabChoixEquipeAdverse/>
                
            </View>
        )
    }
}

const styles = {
    mainContainer : {
        marginTop : 55
    },

    
    bloc  : {
        marginTop : hp('4%'),
        marginBottom : hp('3%'),
        borderWidth : 1,
        borderRadius : 8,
        alignSelf : 'center',
        width : wp('80%'),
        paddingVertical : hp('1%'),
        paddingHorizontal : wp('4%')
    
    },

    txt_message : {
        fontSize : RF(2.7),
        alignSelf : "center",
        marginBottom : hp('3%')

    },



    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    }
        
    
   
} 

const mapStateToProps = (state) => {
    return{ 
        equipeAdverse : state.equipeAdverse,
   } 
}
export default connect(mapStateToProps)  (Choix_Equipe_Adverse)
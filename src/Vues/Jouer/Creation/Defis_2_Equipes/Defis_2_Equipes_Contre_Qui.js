import React from 'react'
import {View,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../.././../../Components/Colors'


/**
 * Classe qui va permette à l'utilisateur de choisir si il veut défier une autre équipe 
 * ou poster une annonce lors de la création d'un defi entre 2 equipes
 */
class Defis_2_Equipes_Contre_Qui extends React.Component {


    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Proposer un défi'
        }
    }


    buttonNext(){
        
        if(false ) {
            return( 
                <TouchableOpacity
                    onPress ={() => {}}>
                    <Text style = {styles.txtBoutton}>Suivant</Text>
                </TouchableOpacity>
            ) 
        } else {
            return (
                <Text>Suivant</Text>
            )
        }
    }

    goToRechercherUneEquipe() {
        this.props.navigation.push("ChoixEquipeAdverse", 
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
                    contreQui : 'rechercher_une_equipe',
                    nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' ')
                }) 
    }

    goToPosterUneAnnonce(){
        console.log("okkookokokokkokgff")
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
                    contreQui : 'poster_une_annonce',
                    nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' ')
                }) 
    }



    render() {
        return (
            <View style = {{flex :1}}>

                {/* Bandeau superieur */}
                <View style = {{backgroundColor : Colors.grayItem, flexDirection : 'row', justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%'), marginBottom : hp('2%')}}>
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

                <Text style ={styles.txt_message} >Souhaites-tu rechercher une équipe ou </Text>
                <Text style ={styles.txt_message}>Poster une annonce</Text>

                <TouchableOpacity 
                    style = {styles.bloc}
                    onPress = {() => {this.goToRechercherUneEquipe()}}>
                   <Text style ={styles.txtTitre}>Rechercher une équipe</Text>
                   <Text style  = {styles.txt}>Recherche une équipe et propose-lui un défi !</Text>
               </TouchableOpacity>

               <TouchableOpacity 
                    style = {styles.bloc}
                    onPress = {() => {this.goToPosterUneAnnonce()}}>
                   <Text style ={styles.txtTitre}>Poster une annonce</Text>
                   <Text style  = {styles.txt}>Poste une annonce, tu seras informé(e) dès qu'une équipe aura accepté le défi 😉</Text>
               </TouchableOpacity>
            </View>
        )
    }
}
const styles = {
    mainContainer : {
        marginTop : 55
    },

    txt_message : {
        fontSize : RF(2.7),
        alignSelf : "center"
    },

    bloc  : {
        marginTop : hp('%'),
        marginBottom : hp('3%'),
        borderWidth : 1,
        borderRadius : 8,
        alignSelf : 'center',
        width : wp('80%'),
        paddingVertical : hp('1%'),
        paddingHorizontal : wp('4%')
    
    },

    txtTitre : {
        fontWeight : 'bold',
        fontSize : RF(2.4),
        marginLeft : wp('2%')
    },

    txt : {
        marginLeft : wp('2%'),
        fontSize : RF(2.2),

    }
} 
export default (Defis_2_Equipes_Contre_Qui)
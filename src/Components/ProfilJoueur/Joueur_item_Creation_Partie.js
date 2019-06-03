import React from 'react'
import {View, Animated,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import Barre_Recherche from '../Recherche/Barre_Recherche'
import StarRating from 'react-native-star-rating'
import { CheckBox } from 'react-native-elements'
import { connect } from 'react-redux'
import actions from '../../Store/Reducers/actions'

/**
 * Composant qui affiche un item joueurs, il va permettre de selectionner des  joueur 
 * lors de la création d'une PARTIE 
 * ATTENTION : ne pas confondre avec Joueur_item_Creation_Defis !!!
 * 
 */
class Joueur_item_Creation_Partie extends React.PureComponent{

    constructor(props) {
        super(props)
        this.state = {
            isChecked : this.props.isChecked    
        }
    }

    /**
     * Renvoie vrai si l'id du joueur correspond à un objet dans la liste
     * @param {liste d'objet {id : String, photo : String}} liste 
     * @param {String :  id du joueur à tester} idJoueur 
     */
    checkIfUserIsPresent(liste, idJoueur) {
        
        for(var i = 0; i < liste.length; i++) {
            if(liste[i].id == idJoueur) {
                return true
            }
        }
        return false
    }



    /**
     * Permet de choisir un joueur et le stock dans un state global 
     * 
     * @param {String} idJoueur 
     */
    _chooseJoueur(idJoueur, photoJoueur, tokens) {

            // Premier cas : On veut déselectionner un joueur : 
            if(this.checkIfUserIsPresent(this.props.joueursPartie, idJoueur)) {
                const action = { type: actions.CHOISIR_JOUEUR_PARTIE, value:  {id : idJoueur, photo : photoJoueur, tokens : tokens}}
                this.props.dispatch(action)
            
            // Le joueurs n'est pas selectionné
            } else {
                
                // Cas où on dépasse le nombre de joueurs recherchés,  this.props.nbJoueursRecherchesPartie = undefined lors de la creation d'une partie
                if(this.props.joueursPartie.length   >= this.props.nbJoueursRecherchesPartie ) {
                    console.log("in if")
                    Alert.alert(
                        '',
                        "Seulement " + this.props.nbJoueursRecherchesPartie +  " sont recherchés pour cette partie"
                    )

                // 
                } else {
                    console.log("this.props.JoueursParticipantsPartie : ", this.props.JoueursParticipantsPartie )
                    if(! this.props.JoueursParticipantsPartie.includes(idJoueur)) {
                        console.log("in deuxieme if")
                        const action = { type: actions.CHOISIR_JOUEUR_PARTIE, value:  {id : idJoueur, photo : photoJoueur, tokens : tokens}}
                        this.props.dispatch(action)
                        console.log("after dispatch")
                    } else if(this.props.joueursPartie.length  < this.props.nbJoueursRecherchesPartie ) {
                        Alert.alert(
                            '',
                            "Ce joueur participe déjà à la partie, tu ne peux pas l'ajouter"
                        )
                    }
                }
            }
                // Cas où on dépasse le nombre de joueurs recherchés,  this.props.nbJoueursRecherchesPartie = undefined lors de la creation d'une partie
            /*if(this.props.joueursPartie.length +1  >= this.props.nbJoueursRecherchesPartie ) {
                console.log("in if")
                Alert.alert(
                    '',
                    "Seulement " + this.props.nbJoueursRecherchesPartie +  " sont recherchés pour cette partie"
                )

            // 
            } else {
                console.log("this.props.JoueursParticipantsPartie : ", this.props.JoueursParticipantsPartie )
                if(! this.props.JoueursParticipantsPartie.includes(idJoueur)) {
                    console.log("in deuxieme if")
                    const action = { type: actions.CHOISIR_JOUEUR_PARTIE, value:  {id : idJoueur, photo : photoJoueur}}
                    this.props.dispatch(action)
                    console.log("after dispatch")
                } else if(this.props.joueursPartie.length  < this.props.nbJoueursRecherchesPartie ) {
                    Alert.alert(
                        '',
                        "Ce joueur participe déjà à la partie, tu ne peux pas l'ajouter"
                    )
                }
            }*/
    }
        
    

    render()  {
        const  isChecked  = this.props.isChecked

        return(
            <View style = {{flexDirection : "row",justifyContent: "space-between", marginTop : hp('3%'), backgroundColor : "white", paddingVertical : hp('2%')}}>

                    <View style = {{flexDirection : "row"}}>
                        {/* Image du joueurs */}
                        <Image
                            source = {{uri : this.props.photo}}
                            style = {{width : wp('15%'), height : wp('15%'), marginLeft : wp('2%'), marginRight : wp('2%'), borderRadius : wp('7%'), backgroundColor : "gray"}}
                        />
                        
                        {/* Nom et note de l'équipe */}
                        <View>
                            <Text>{this.props.pseudo.toString()}</Text>

                            <View style = {{flexDirection : 'row', marginTop : hp("1%")}}>

                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={this.props.score}
                                    starSize={hp('2.5%')}
                                    fullStarColor='#F8CE08'
                                    emptyStarColor='#B1ACAC'
                                />
                            </View>
                        </View>
                    </View>

                    <CheckBox
                        title=' '
                        checkedColor = {Colors.agOOraBlue}
                        right
                        containerStyle={styles.checkBox}                    
                        checked={isChecked}
                        onPress = {() => {
                            this._chooseJoueur(this.props.id, this.props.photo, this.props.tokens)
                            var checked = this.state.isChecked
                            this.setState({isChecked: !checked})
                        }}

                    />
                </View>
        )
    }
}
const styles = {
    checkBox : {
        backgroundColor : 'white',
        borderWidth :0, 
        alignSelf : 'center' 
    }
}
const mapStateToProps = (state) => {
    return{ 
        joueursPartie : state.joueursPartie,
        JoueursParticipantsPartie : state.JoueursParticipantsPartie,
        nbJoueursRecherchesPartie : state.nbJoueursRecherchesPartie        
   } 
}
export default connect(mapStateToProps) (Joueur_item_Creation_Partie)
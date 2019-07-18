import React from 'react'
import {View, Animated,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
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
class Joueur_item_Rejoindre_Partie extends React.PureComponent{

    constructor(props) {
        super(props)
        this.state = {
            isChecked : this.props.isChecked    
        }
    }

    /**
     * Permet de choisir un joueur et le stock dans un state global 
     * 
     * @param {String} idJoueur 
     */
    _chooseJoueur(idJoueur, photoJoueur) {
        console.log("length ",this.props.joueursPartie.length)

       
            if(this.props.joueursPartie.length  >= this.props.nbJoueursRecherchesPartie ) {
                Alert.alert(
                    '',
                    "Seulement " + this.props.nbJoueursRecherchesPartie +  " sont recherchés pour cette partie"
                )
            } else {
                if(! this.props.JoueursParticipantsPartie.includes(idJoueur)) {
                    const action = { type: actions.CHOISIR_JOUEUR_PARTIE, value:  {id : idJoueur, photo : photoJoueur}}
                    this.props.dispatch(action)
                } else if(this.props.joueursPartie.length  < this.props.nbJoueursRecherchesPartie ) {
                    Alert.alert(
                        '',
                        "Ce joueur participe déjà à la partie, tu ne peux pas l'ajouter"
                    )
                }
            }
        }


    render()  {
        const  isChecked  = this.props.isChecked;

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
                            this._chooseJoueur(this.props.id, this.props.photo)
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
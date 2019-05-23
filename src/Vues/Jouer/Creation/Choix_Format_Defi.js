import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,Picker} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '../../../Components/Colors';
import Type_Defis from '../Type_Defis'
import actions from '../../../Store/Reducers/actions'
import { connect } from 'react-redux'


/**
 * Vue qui va permettre de choisir le format d'un défi ou d'une partie. 
 * On va de plus indiquer dans le state global le nbr de joueurs recherchés, 
 * et on va remettre à zéro la liste des participants à un défi et celle des 
 * joueurs séléctionnées.
 */
class Choix_Format_Defi extends React.Component {

    constructor(props){
        super(props)
        this.type =  this.props.navigation.getParam('type', ' ')
        this.inputRefs = {
            firstTextInput: null,
            favSport0: null,
            favSport1: null,
            lastTextInput: null,
          };
          
        this.state = {
            format : "5 x 5"
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



    render(){
        return(
            <View>

			{/* Bandeau superieur */}
			<View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
				<TouchableOpacity
                    onPress ={() => this.props.navigation.push("AccueilJouer")}>
					<Text style = {styles.txtBoutton} >Annuler</Text>
				</TouchableOpacity>

                <Text> Format </Text>
				<TouchableOpacity
                    onPress ={() =>  {

                            // Le nbr de joueurs recherchés correspond au format
                            const action = { type: actions.STORE_NB_JOUEURS_RECHERCHES_PARTIES, value:  Infinity}
                            this.props.dispatch(action)

                            // On remet à zéro la liste de participants à une partie
                            const action2 = { type: actions.STORE_PARTICIPANTS_PARTIE, value: []}
                            this.props.dispatch(action2)

                            // On remet à zero la liste des joueurs selectionnes
                            const action3 = { type: actions.RESET_JOUEURS_PARTIE, value: []}
                            this.props.dispatch(action3)

                            // On sauvegarde le nbr min de joueur pour une équipe
                            const action4 = { type: actions.STORE_NB_MIN_JOUEURS_EQUIPE, value: parseFloat(this.state.format.split(' ')[0])}
                            this.props.dispatch(action4)

                            this.props.navigation.push("ChoixDateDefis", 
                                        {   format : this.state.format,
                                            type : this.type
                                        })}
                            }
                    >
					<Text style = {styles.txtBoutton}>Suivant</Text>
				</TouchableOpacity>
			</View>

            <Text style = {{alignSelf : 'center', fontSize : RF(2.5), marginTop : hp('2%')}}>Quel type de défis souhaite-tu proposer ? </Text>
			{/* Texte et picker */}
			<View style = {{flexDirection : 'row',justifyContent : 'center', marginTop : hp('4%')}}>
                <View style = {{ height : hp('4%'),justifyContent : 'center'}}>
                    <Text>Format : </Text>
                </View>
				<Picker
					selectedValue={this.state.format}
					style={{width  : wp('34%'),height: hp('4%')}}
					onValueChange={(itemValue, itemIndex) =>
					this.setState({format: itemValue})
					}>
					<Picker.Item label="2 x 2" value="2 x 2" />
					<Picker.Item label="3 x 3" value="3 x 3" />
					<Picker.Item label="4 x 4" value="4 x 4" />
					<Picker.Item label="5 x 5" value="5 x 5" />
					<Picker.Item label="6 x 6" value="6 x 6" />
					<Picker.Item label="7 x 7" value="7 x 7" />
					<Picker.Item label="8 x 8" value="8 x 8" />
					<Picker.Item label="9 x 9" value="9 x 9" />
					<Picker.Item label="10 x 10" value="10 x 10" />
					<Picker.Item label="11 x 11" value="11x 11" />

              </Picker>
			</View>
                
            </View>
        )
    }
}
const styles = {
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    }
}

const mapStateToProps = (state) => {
    return{ 
        nbJoueursRecherchesPartie : state.nbJoueursRecherchesPartie,
        JoueursParticipantsPartie : state.JoueursParticipantsPartie,
        joueursPartie : state.joueursPartie
    } 
}
export default connect(mapStateToProps) (Choix_Format_Defi)
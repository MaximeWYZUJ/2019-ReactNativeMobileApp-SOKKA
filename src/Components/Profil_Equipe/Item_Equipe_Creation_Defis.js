import React from 'react'
import {View, Animated,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { CheckBox } from 'react-native-elements'
import Colors from '../Colors'
import StarRating from 'react-native-star-rating'
import { connect } from 'react-redux'
import actions from  '../../Store/Reducers/actions'
import { withNavigation } from 'react-navigation'


/**
 * Composant qui permettra de  choisir une équipe à défier.
 */
class Item_Equipe_Creation_Defis extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isChecked : this.props.isChecked    
        }
    }

    HandleSelectionEquipe() {
        // Verifier le nbr de joueur de l'équipe 
        if(this.props.nbJoueurs < this.props.nbJoueursMinEquipe) {
            Alert.alert(
                '',
                'Ton équipe doit au moins avoir ' + this.props.nbJoueursMinEquipe + ' joueurs pour un ' + this.props.nbJoueursMinEquipe + 'x' + this.props.nbJoueursMinEquipe
            )
        } else {
            this._chooseEquipe(this.props.id)
            var checked = this.state.isChecked
            this.setState({isChecked: !checked})
        }
        
    }


    /**
     * Permet de choisir un terrain et le stock dans un state global 
     * 
     * @param {String} idEquipe 
     */
    _chooseEquipe(idEquipe) {
        const action = { type: actions.CHOISIR_EQUIPE_ADVERSE, value: idEquipe}
        this.props.dispatch(action)
    }

    render() {

        const  isChecked  = this.props.isChecked

        return(
            <View style = {{flexDirection : "row", marginTop : hp('3%'), marginBottom : hp('3%')}}>

                {/* Image de l'équipe */}
                <View
                    style = {{flexDirection : 'row'}}>
                    <Image
                        source = {{uri : this.props.photo}}
                        style = {{width : wp('15%'), height : wp('15%'), marginLeft : wp('2%'), marginRight : wp('2%')}}
                    />

                    {/* Nom et note de l'équipe */}
                    <View>
                        <Text>{this.props.nom}</Text>

                        <View style = {{flexDirection : 'row', marginTop : hp("1%")}}>

                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.props.score}
                                starSize={hp('2.5%')}
                                fullStarColor='#F8CE08'
                                emptyStarColor='#B1ACAC'
                            />
                            <Text style = {{marginLeft : wp('5%')}}>{this.props.nbJoueurs} joueurs</Text>
                        </View>
                        
                    </View>
                </View>

                <CheckBox
                    title=' '
                    checkedColor = {Colors.agOOraBlue}
                    right
                    containerStyle={{backgroundColor: 'white', borderWidth :0, alignSelf : 'flex-end'}}                    
                    checked={isChecked}
                    onPress={() => {
                        this.HandleSelectionEquipe()
                        
                    }}

                />
                
            </View>
        )
    }
}
const styles = {
    
}



const mapStateToProps = (state) => {
    return{ 
        equipeAdverse : state.equipeAdverse,
        nbJoueursMinEquipe : state.nbJoueursMinEquipe
		
    } 
}
export default connect(mapStateToProps) (withNavigation(Item_Equipe_Creation_Defis))

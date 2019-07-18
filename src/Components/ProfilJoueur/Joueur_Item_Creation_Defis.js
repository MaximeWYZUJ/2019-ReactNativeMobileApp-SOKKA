import React from 'react'
import {View, Animated,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import StarRating from 'react-native-star-rating'
import { CheckBox } from 'react-native-elements'

/**
 * Composant qui affiche un item joueurs, ilva permettre de selectionner un joueur 
 * lors de la création d'un défi
  Props : 
 *      handleSelectJoueur : Arrow Fonction à exécuter dans le composant parent 
 *          au moment où un joueur est selectionné
 * 
 */
class Joueur_Item_Creation_Defis extends React.PureComponent{

    constructor(props) {
        super(props)
        this.state = {
            isChecked : this.props.isChecked
        }
    }


    render()  {
        const checked = this.props.isChecked
        return(
            <View style = {{flexDirection : "row",justifyContent: "space-between", marginTop : hp('3%'), backgroundColor : "white", paddingVertical : hp('2%')}}>

                    <View style = {{flexDirection : "row"}}>
                        {/* Image du joueurs */}
                        <Image
                            source = {{uri : this.props.photo}}
                            style = {{width : wp('15%'), height : wp('15%'), marginLeft : wp('2%'), marginRight : wp('2%'), borderRadius : wp('7%')}}
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
                        checked={checked}
                        onPress = {() => {
                            this.props.handleSelectJoueur(this.props.id)
                            var isChecked = this.state.isChecked
                            this.setState({isChecked : ! isChecked})
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
export default Joueur_Item_Creation_Defis
import React from 'react'

import {View, Text,Image,TouchableOpacity,FlatList, ScrollView,Alert,Animated} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import StarRating from 'react-native-star-rating'
import { withNavigation } from 'react-navigation'

class Equipe_Nom_Score extends React.Component {

    
    render(){

        var direction = "row"
        if(this.props.reverse != undefined) {
            direction = "row-reverse"
        }
        return(
            <TouchableOpacity 
                onPress = {() => 
                    {
                        console.log("idEquipe : ",this.props.id)
                        this.props.navigation.push("Profil_Equipe", {equipeId : this.props.id})
                    }
            
            }
                style = {[styles.containerItemEquipe, this.props.style, {flexDirection : direction}]}>

                <Image
                    source = {{uri : this.props.photo}}
                    style = {styles.photoEquipe}
                /> 

                {/* View contenant le pseudo est le score*/}
                <View style = {{justifyContent : "center"}}>
                    <Text>{this.props.nom}</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.props.score}
                        starSize={hp('2.2%')}
                        fullStarColor='#F8CE08'
                        emptyStarColor='#B1ACAC'
                    />

                    
                </View> 
            </TouchableOpacity>
        )
    }
}


const styles = {
    containerItemEquipe : {
        flexDirection : 'row',
        alignsItems : 'center',
        backgroundColor : "white",
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        marginRight : wp('3%'),
        paddingTop : hp("1%"),
        paddingBottom :hp('1%'),
        paddingLeft : wp('3%'),
        borderRadius : 6
    },

    photoEquipe : {
        width : wp('16%'), 
        height : wp('16%'), 
        borderRadius : wp('8%'),
        marginRight : wp('3%')
    },
}

export default withNavigation (Equipe_Nom_Score)
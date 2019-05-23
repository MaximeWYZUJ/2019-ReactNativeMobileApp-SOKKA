import React from 'react'
import {View, Text,Image} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import { CheckBox } from 'react-native-elements'
import { connect } from 'react-redux'
import StarRating from 'react-native-star-rating'


class Joueurs_Ajout_Item extends React.PureComponent{

    constructor(props) {
        super(props)
        var checked = false
        var nom = this.props.joueur.nom
        var isShown = this.props.isShown;
        this.state = {
            checked : isShown,
            nom : nom
        }
    }

     /**
     * Permet d'ajouter un joueur à la liste des joueurs à ajouter si 
     * il n'est pas déja présent, le supprime sinon
     * @param {String} joueur 
     */
    _addJoueur(idJoueur ) {
        console.log("okokokoko")

      // if(! this.propsisShown) {
            const action = { type: "AJOUTER_JOUEUR_EQUIPE_CREATION", value: idJoueur}
            this.props.dispatch(action)
       // }else {
         //   const action = { type: "SUPPRIMER_JOUEUR_EQUIPE_CREATION", value: idJoueur}
         //   this.props.dispatch(action)
         //   this.setState({isShown : false})
      // }
    }



    render(){
        const  isShown  = this.props.isShown
        
        return(
            <View style = {styles.styleMain}>

            {/* Photo, nom et note du joueur */}
            <View style = {{flexDirection : 'row'}}>

                <Image 
                    style={{ width: wp('12%'), height: wp('12%'), borderRadius :wp('6%'), alignSelf : 'center'}}
                    source = {{uri : this.props.joueur.photo}}
                />

                {/* Nom et note du joueurs */}
                <View style = {{marginLeft : wp('3%'), alignSelf : 'center'}}>
                    <Text>{this.props.joueur.nom} {this.props.txtDistance} </Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.props.joueur.note}
                        starSize={wp('4%')}
                        fullStarColor={Colors.fullStar}
                        emptyStarColor={Colors.emptyStar}
                        containerStyle={{width: wp('10%')}}
                    />
                </View>
            </View>
            <CheckBox
                    right
                    title=' '
                    checkedColor = {Colors.agOOraBlue}
                    
                    containerStyle={{backgroundColor: '#F7F7F7', borderWidth :0}}                    
                    checked={isShown}
                    onPress={() => {
                        this._addJoueur(this.props.joueur.id)
                        var checked = this.state.isShown
                        this.setState({isShown: !checked})

                        //Creation_Equipe_Ajouter_Joueurs._addJoueur(id)
                        //this.props.callback(id)

                        //this._addJoueur(id)
                    }}
                />
            </View>
        )
    }
}
const styles = {
    styleMain : {
        flexDirection : 'row',
        backgroundColor : '#F7F7F7',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 4,
        marginBottom : hp('1%'),
        marginTop : hp('1%'),
        borderRadius : 8,
        marginLeft : wp('2%'),
        marginRight : wp('2%'),
        justifyContent: 'space-between',
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        paddingLeft : wp('2%')

    }
}

const mapStateToProps = (state) => {
    return{ 
        joueurs : state.joueurs
    } 
}
  
export default connect(mapStateToProps)(Joueurs_Ajout_Item)
import React from 'react'
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,TextInput } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { Image } from 'react-native-elements';
import Color from '../../Components/Colors'
import AlphabetListView from 'react-native-alphabetlistview'
import JoueurItem from '../../Components/ProfilJoueur/JoueurItem'
/**
 * Classe qui permet d'afficher une liste des joueurs qui on liké un profil, une équipe 
 * ou un terrain : 
 * 
 * props : liste des joueurs où chaque item est de la forme : 
 *      {
 *          nom :"..." ,
 *          photo : "...",
 *          id : "...",
 *          score : "..."
 *      }
 */
class SectionHeader extends React.Component {

  	render() {
      // inline styles used for brevity, use a stylesheet when possible
      var textStyle = {
        color:'black',
        fontWeight:'bold',
        fontSize:RF(2.5),
        marginLeft : wp('2.5%')
      };
  
      var viewStyle = {
        backgroundColor: '#F7F7F7'
      };
      return (
        <View style={viewStyle}>
          <Text style={textStyle}>{this.props.title}</Text>
        </View>
      );
    }
}
  
  class SectionItem extends React.Component {
    render() {
      return (
        <Text style={{color:'black'}}>{this.props.title}</Text>
      );
    }
  }
  
  class Cell extends React.Component {
    render() {
      return (
		  <View style = {{marginRight : wp('8%')}}>
        <JoueurItem
            id={this.props.item.id}
            nom={this.props.item.pseudo}
            score={this.props.item.score}
            photo={this.props.item.photo}
            nav={this.props.item.nav}
        />
        </View>
      );
    }
  }
  
 export default  class Joueurs_qui_likent extends React.Component {
  
    constructor(props, context) {
      super(props, context);
      this.joueurs = this.props.navigation.getParam('joueurs', ' ')
      this.state = {
		data : {},
		joueurs: this.joueurs,
		nbLike : this.joueurs.length
	  }
	  

	}
	
	componentDidMount() {
		this.setState({data  : this.buildJoueurs(this.joueurs)})
	}
    static navigationOptions = ({ navigation }) => {
      return {
          title: navigation.getParam('titre', ' ')
      }
    }
   

    buildJoueurs(joueurs) {
        let  data =  {
            A: [],
            B: [],
            C: [],
            D: [],
            E: [],
            F: [],
            G: [],
            H: [],
            I: [],
            J: [],
            K: [],
            L: [],
            M: [],
            N: [],
            O: [],
            P: [],
            Q: [],
            R: [],
            S: [],
            T: [],
            U: [],
            V: [],
            W: [],
            X: [],
            Y: [],
            Z: [],
        }
        for(var i = 0; i < joueurs.length ; i ++) {
            joueur = joueurs[i]
            let lettre = joueur.nom[0].toUpperCase()
            let arrayj = data[lettre]
            let j = {
                nom : joueur.nom,
                photo : joueur.photo,
                score : joueur.score,
                id : joueur.id,
                nav : this.props.navigation
            }
            arrayj.push(j)
            data[lettre] = arrayj
        }
        return data
    }


	/**
     * Fonction qui permet de filtrer les joueurs en fonction de ce que tappe 
     * l'utilisateur.
     */
    searchedJoueurs = (searchedText) => {
        let searchedJoueurs = this.state.joueurs.filter(function(joueur) {
            return joueur.nom.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({data : this.buildJoueurs(searchedJoueurs)});
    }
  
    render() {
        return (
          <View style = {{flex : 1}}>
            
            {/* Indication du nombre de j'aime */}
            <View style = {{backgroundColor : Color.lightGray, alignContent : 'center'}}>
              <Text style = {{alignSelf : 'center', fontSize : RF(2.5)}}>Nombre de joueurs qui ont liké</Text>
              <Text style = {{alignSelf : 'center',fontSize : RF(2.5)}}>{this.state.nbLike}</Text>
            </View>

            {/* View contenant la bare de recherche */}
            <View style = {{flexDirection : 'row', marginTop : hp('2%'), marginLeft : wp('5%'), marginRight : wp('5%'), marginBottom : hp('2%')}}>
                    <Image style={styles.search_image}
                        source = {require('app/res/search.png')} />
                    <TextInput
                        style={{flex: 1, borderWidth: 1, marginHorizontal: 15, borderRadius : 10, width : wp('10%')}}
                        onChangeText={this.searchedJoueurs}

                    />
                    <TouchableOpacity onPress={() => this.setState({text: ''})}>
                        <Image style={styles.search_image}
                                source = {require('app/res/cross.png')}/>
                    </TouchableOpacity>
                </View>
            <AlphabetListView
              data={this.state.data}
              cell={Cell}
              cellHeight={30}
              sectionListItem={SectionItem}
              sectionHeader={SectionHeader}
              sectionHeaderHeight={22.5}
        />
          </View>
        
            
          
      );
    }
}
const styles = {
  search_image: {
    width: wp('7%'),
    height: wp('7%'),
},
}
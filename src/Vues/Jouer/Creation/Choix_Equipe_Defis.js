import React from 'react'
import {View, Animated,TouchableOpacity,FlatList, Image,Dimensions,StyleSheet,Text,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../Components/Colors';
import Database from '../../../Data/Database'
import StarRating from 'react-native-star-rating'
import { CheckBox } from 'react-native-elements'
import Barre_Recherche from '../../../Components/Recherche/Barre_Recherche'
import { connect } from 'react-redux'
import actions from '../../../Store/Reducers/actions'
import LocalUser from '../../../Data/LocalUser.json'

/* A VOIR COMMENT ON RECUPRERE LES IDS DES EQUIPES */

/**
 * Classe qui va permettre à l'utilisateur de selectionner l'équipe pour le terrain
 *  qu'il est en train d'organiser.
 */
class Choix_Equipe_Defis extends React.Component  {

    constructor(props) {
        super(props)
       
        
        this.type = this.props.navigation.getParam('type', ' ')
        this.heure = this.props.navigation.getParam('heure', ' ')
        this.jour = this.props.navigation.getParam('jour', ' ')
        this.format = this.props.navigation.getParam('format', ' ')
        this.terrain = this.props.navigation.getParam('terrain',' ')
        this.nbJoueurMin = parseFloat(this.format.split(' ')[0])
        this.state = {
            mesEquipes : [],
            equipesFiltrees : [],
            equipeSelectionnee : undefined,
            allDataEquipeSelectionnee : undefined,
            userData : undefined
        }
        this.MON_ID =  LocalUser.data.id
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Proposer un défi'
        }
    }




    componentDidMount() {
        let equipesArray = []
        var db = Database.initialisation();

        // Récuperer la liste des equipes de l'utilisateur
        var docRef = db.collection('Joueurs').doc(this.MON_ID);
        docRef.get().then(async (doc) => {
            if (doc.exists) {

                // Sauvegarder les donnnes de l'utilisateur dans le state
                this.setState({userData : doc.data()})
                
                var mesEquipes = doc.data().equipes     // Liste des id des equipes de l'utilisateur
               
                //!!!!!!!!!!!!!!!!!!!!!!!!!!! AMELIORER !!!!!!!
                // Boucler sur les equipes pour récuperer les données. 
                for(var i = 0 ; i < mesEquipes.length; i++) {
                    var equipeRef = db.collection('Equipes').doc(mesEquipes[i]);
                    equipeRef.get().then(async(docEquipe) => {
                        if(docEquipe.exists) {
                            var equipe = docEquipe.data()

                            // Vérifier si on est capitaine
                            for(var j = 0; j< equipe.capitaines.length; j ++) {
                                if(equipe.capitaines[j]== this.MON_ID) {
                                    equipesArray.push(equipe)

                                    break;
                                }
                            }
                            this.setState({mesEquipes : equipesArray, equipesFiltrees : equipesArray})
                        
                        }



                    })
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
                console.log("Error getting document:", error);
        });
    }


    /**
	 * Fonction qui va être passé en props du componant
	 * BareRecherche et qui va permettre de filtrer les equipes 
	 * en fonction de ce que tappe l'utilisateur
	 */
    recherche = (data)  => {
		this.setState({
			equipesFiltrees : data
		})
    }


    /**
     * Fonction qui va permettre de se rendre sur l'écran suivant pour choisir les 
     * joueur à convoquer.
     */
    gotoChoixJoueur() {
        console.log("in go to choix joueur")
        const action = { type: actions.CHOISIR_UNE_DE_MES_EQUIPES, value: this.state.equipeSelectionnee}
        this.props.dispatch(action)

        console.log(action)
        const action2 = { type: actions.SAVE_EQUIPES_FAVORITES, value: this.state.userData.equipesFav}
        this.props.dispatch(action2)
        console.log(action2)


        console.log("::::::::::::::::")
        console.log('------' +  this.props.navigation.getParam('duree', '')+ '---------')
        console.log('::::::::::::::')
        this.props.navigation.push("ChoixJoueursDefis2Equipes", 
        {
            format : this.format,
            type : this.type,
            jour : this.jour,
            heure : this.heure,
            duree : this.props.navigation.getParam('duree', ''),
            terrain : this.terrain,
            equipe : this.state.equipeSelectionnee,
            allDataEquipe : this.state.allDataEquipeSelectionnee,
            userData : this.state.userData,
            nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' '),
            prix: this.props.navigation.getParam('prix', null)
        })
        
    }

    HandleSelectionEquipe(equipe) {
        // Verifier le nbr de joueur de l'équipe 
        if(equipe.joueurs.length < this.nbJoueurMin) {
            Alert.alert(
                '',
                'Tu dois choisir une équipe avec au moins ' + this.nbJoueurMin + ' joueurs'
            )
        } else {
            if(this.state.equipeSelectionnee == equipe.id) {
                this.setState({equipeSelectionnee : undefined, allDataEquipeSelectionnee: undefined})
            } else {
                this.setState({equipeSelectionnee : equipe.id, allDataEquipeSelectionnee: equipe})
            }
        }
        
    }
    



    buttonNext(){

        
        if(this.state.equipeSelectionnee != undefined) {
            return( 
                <TouchableOpacity
                    onPress ={() => {this.gotoChoixJoueur()}}>
                    <Text style = {styles.txtBoutton}>Suivant</Text>
                </TouchableOpacity>
            ) 
        } else {
            return (
                <Text>Suivant</Text>
            )
        }
    }

    
    

    _renderItem = ({item}) => {
        console.log("ID == ",item.id)
        return(
            <View style = {{flexDirection : "row", marginTop : hp('3%'), backgroundColor : "white", paddingVertical : hp('2%')}}>

                {/* Image de l'équipe */}
                <TouchableOpacity
                    style = {{flexDirection : 'row'}}
                    onPress = {() => this.props.navigation.push("Profil_Equipe", {equipeId : item.id})}>
                    <Image
                        source = {{uri : item.photo}}
                        style = {{width : wp('15%'), height : wp('15%'), marginLeft : wp('2%'), marginRight : wp('2%')}}
                    />

                    {/* Nom et note de l'équipe */}
                    <View>
                        <Text>{item.nom}</Text>

                        <View style = {{flexDirection : 'row', marginTop : hp("1%")}}>

                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item.score}
                                starSize={hp('2.5%')}
                                fullStarColor='#F8CE08'
                                emptyStarColor='#B1ACAC'
                            />
                            <Text style = {{marginLeft : wp('5%')}}>{item.joueurs.length} joueurs</Text>
                        </View>
                        
                    </View>
                </TouchableOpacity>

                <CheckBox
                    title=' '
                    checkedColor = {Colors.agOOraBlue}
                    right
                    containerStyle={{ backgroundColor : 'white',borderWidth :0, alignSelf : 'center'}}                    
                    checked={this.state.equipeSelectionnee == item.id}
                    onPress = {() => {
                       this.HandleSelectionEquipe(item)
                    }}

                />
                
            </View>
        )
    }
        
    render() {
        return(
            <View>
                
                {/* Bandeau superieur */}
                <View style = {{backgroundColor : Colors.grayItem, flexDirection : 'row', justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        onPress ={
                            () => Alert.alert(
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

                    <Text> Avec qui </Text>

                    {this.buttonNext()}

			    </View>

                <Text style = {{fontSize : RF(2.4), alignSelf : "center", paddingVertical : hp('2%')}}>Avec quelle équipe souhaites-tu jouer ?</Text>

                {/* Bare de recherche */}
                <Barre_Recherche
                    handleTextChange ={this.recherche}
					data = {this.state.mesEquipes}
					field = "nom"
                />

                <View
                    style={styles.header_container}>
                    <Text style={styles.header}>Mes equipes</Text>
                </View>

                {/* View contenant la liste des équipe dont l'user est capitaine */}
                <View>
                    <FlatList
                        data = {this.state.equipesFiltrees}
                        renderItem={this._renderItem}
                        extraData = {this.state.equipeSelectionnee}

                    />
                </View>
            </View>
        )
    }
}
const styles = {
    header_container: {
        backgroundColor:Colors.agOOraBlue,
        width : wp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        //marginLeft : wp('5%'),
        //marginRight : wp('5%'),
        marginTop : hp('3%'),
        //borderRadius : 15,



    },

    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },

    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    }
}

const mapStateToProps = (state) => {
    return{ 
        monEquipe : state.monEquipe,
        equipesFav : state.equipesFav
		
    } 
}
export default connect(mapStateToProps)(Choix_Equipe_Defis)
import React from 'react'
import {View, Text,Image,  StyleSheet, Animated,TouchableOpacity, Picker} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../../../Components/Colors'
import Database from '../../../../Data/Database'

export default class Choix_Nbr_Joueurs_Partie extends React.Component {

    constructor(props)  {
        super(props)
        console.log("in constructor")
        this.nbJoueurInvite = this.props.navigation.getParam('joueurs', '').length
        this.nbJoueurMin = parseFloat( this.props.navigation.getParam('format', '').split(' ')[0])* 2
        console.log("Nb JOUEUR INVITE ", this.nbJoueurInvite)
        console.log("Nb JOUEUR MIN ", this.nbJoueurMin)
        var nbJoueur = 0 ; 
        if(this.nbJoueurMin > this.nbJoueurInvite ) {
            nbJoueur = this.nbJoueurMin - this.nbJoueurInvite
        }
        this.state = {
            listeNbJoueur : [],
            nbJoueurs : nbJoueur
        }
        console.log("end constructor")
        this.goToFichePartie = this.goToFichePartie.bind(this)

    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Proposer une partie'
        }
    }

    
    componentDidMount() {
        this.setState({listeNbJoueur : this.buildListofItem(this.nbJoueurMin,this.nbJoueurInvite)})
    }



    buildListofItem(nbJoueurMin,nbJoueurInvite) {
        console.log("ooooo")
        var nbJoueurRechercheMin = nbJoueurMin - nbJoueurInvite
        var nbJoueurRechercheMax = nbJoueurRechercheMin + 10
        console.log("nbJoueurRechercheMax ", nbJoueurRechercheMax)
        console.log("nbJoueurRechercheMin ", nbJoueurRechercheMin)

        var liste = []
        for(var i = nbJoueurRechercheMin; i < nbJoueurRechercheMax; i++) {
            console.log(i)
            if(i >= 0) {
                liste.push(i.toString())
            }
        }
        return liste
    }


    goToFichePartie() {
        
        this.props.navigation.push("FichePartieRejoindre",
        {
            download_All_Data_Partie : true,
            id :  this.props.navigation.getParam('id_partie', ''),
        })
        
        
    }
    
    goToNextScreen() {
        console.log("NOMBRE === ", this.state.nbJoueurs)

        if(this.props.navigation.getParam('ajout_Partie_existante', '')) {

            var db = Database.initialisation()

            var partieRef = db.collection("Defis").doc(this.props.navigation.getParam('id_partie', 'erreur'))
            partieRef.update({
                nbJoueursRecherche : parseInt(this.state.nbJoueurs)
            }).then(this.goToFichePartie)

            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        } else {
            
            this.props.navigation.push("ChoixMessageChauffe",
            {
                                    
                format : this.props.navigation.getParam('format', ''),
                type : this.props.navigation.getParam('type', ''),
                jour : this.props.navigation.getParam('jour', ''),
                heure : this.props.navigation.getParam('heure', ''),
                duree : this.props.navigation.getParam('duree', ''),
                terrain : this.props.navigation.getParam('terrain', ''),
                joueurs : this.props.navigation.getParam('joueurs', ''),
                nbrJoueurs : parseInt(this.state.nbJoueurs),
                nomsTerrains : this.props.navigation.getParam('nomsTerrains', ' '),
            })
        }
        
    }

    _renderPickerItem() {

    }
    render() {
        let listItem = this.state.listeNbJoueur.map( (s, i) => {
            return <Picker.Item key={i} value={s} label={s} />
        });

        return(
            <View>
                
                 {/* Bandeau superieur */}
                 <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        onPress ={() => this.props.navigation.push("AccueilJouer")}>
                        <Text style = {styles.txtBoutton} >Annuler</Text>
                    </TouchableOpacity>

                    <Text> Joueurs recherchés </Text>
                    
                    <TouchableOpacity
                        onPress ={() =>{this.goToNextScreen()}}>
                        <Text style = {styles.txtBoutton}>Suivant</Text>
                    </TouchableOpacity>
                </View>

                <Text style = {{marginTop : hp('2%'), fontSize : RF(2.6), alignSelf : "center" }}> Combien de joueurs recherches-tu ? </Text>

                {/* Texte et picker */}
                <View style = {{flexDirection : 'row',justifyContent : 'center', marginTop : hp('4%')}}>
                    <Picker
                        selectedValue={this.state.nbJoueurs}
                        style={{width  : wp('34%'),height: hp('4%')}}
                        onValueChange={(itemValue, itemIndex) =>
                            {
                            console.log("new value = ", itemValue)
                            this.setState({nbJoueurs: itemValue})}
                            }>
                        {listItem}

                    </Picker>
                    
                    <View style = {{ height : hp('4%'),justifyContent : 'center'}}>
                        <Text>Joueurs</Text>
                    </View>
                </View>
            
            </View>
        )
    }
}

const styles = {
    txtBoutton : {
        color : Colors.agOOraBlue,
        fontSize : RF('2.6')
    },
  
}
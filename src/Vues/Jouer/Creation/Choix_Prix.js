import React from 'react'
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native'
import Colors from '../../../Components/Colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Type_Defis from '../Type_Defis'


export default class Choix_Prix extends React.Component {

    constructor(props) {
        super(props);

        this.type = this.props.navigation.getParam('type', '');
        console.log("CHOIX DU PRIX", this.type);
        if (this.type == Type_Defis.partie_entre_joueurs) {
            this.texte = "Sélectionne le prix par joueur";
        } else {
            this.texte = "Sélectionne le prix par équipe";
        }

        this.state={
            value: "0"
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


    buttonNext() {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.type == Type_Defis.partie_entre_joueurs) {
                        this.props.navigation.push("ChoixJoueursPartie", {...this.props.navigation.state.params, prix: this.state.value})
                    } else {
                        this.props.navigation.push("ChoixEquipeDefis", {...this.props.navigation.state.params, prix: this.state.value});
                    }
                }}>
                <Text style={{color : Colors.agOOraBlue, fontSize : RF('2.6')}}>Suivant</Text>
            </TouchableOpacity>
        )
    }


    render() {
        return (
            <View style={{flex: 1}}>
                {/* Bandeau superieur */}
                <View style = {{flexDirection : 'row', backgroundColor : Colors.grayItem, justifyContent: 'space-between',paddingVertical : hp('2%'),paddingHorizontal : wp('3%')}}>
                    <TouchableOpacity
                        onPress ={() => Alert.alert(
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
                        <Text style = {{color : Colors.agOOraBlue, fontSize : RF('2.6')}}>Annuler</Text>
                    </TouchableOpacity>

                    <Text> Prix </Text>
                    
                    {this.buttonNext()}
                </View>

                <Text>Tu as réservé un terrain payant</Text>
                <Text>{this.texte}</Text>
                <View style={{alignItems: 'center'}}>
                    <TextInput
                        style={{width: wp('50%')}}
                        placeholder={"prix en €"}
                        onChangeText={(t) => this.setState({value: t})}
                        keyboardType={'numeric'}
                    />
                </View>
                <Text>A régler sur place</Text>
            </View>
        )
    }

}
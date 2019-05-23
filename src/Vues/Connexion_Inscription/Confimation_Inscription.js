import React from 'react'

import {View, Text,Image ,TouchableOpacity, Animated, TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import LocalUser from '../../Data/LocalUser.json'

export default class Confimation_Inscription extends React.Component {

    static navigationOptions = { title: '', header: null };


    constructor(props) {
        super(props)
        /* On recupère le mail et le mdp de l'utilisateur. */
        const { navigation } = this.props;
        const pseudo = navigation.getParam('pseudo', ' ');
        const photo = navigation.getParam('photo', ' ');

        this.state = {
            pseudo : pseudo,
            photo : photo,
        }
    }

    callNextScreen() {
        /*console.log(this.pseudo)
        obj = {
            age: this.age,
            aiment: [],
            equipes: [],
            equipesFav: [],
            fiabilite: 0,
            mail: this.mail,
            naissance: this.naissance,
            nom: this.prenom+" "+this.nom,
            photo: this.photo,
            //position: ???,
            position: null,
            pseudo: this.pseudo,
            queryPseudo: NormalizeString.normalize(this.pseudo),
            reseau: [],
            score: 0,
            telephone: "XX.XX.XX.XX.XX",
            terrains: [],
            ville: this.ville,
            zone: this.zone
        }
        Database.addDocToCollection(obj, 'Joueurs')
        .then((docRef) => {
            obj.id = docRef.id;*/
            j = LocalUser.data;
            this.props.navigation.push("ProfilJoueur", {id: j.id, joueur: j, equipes: []});
        //})
    }

    render() {
        return (
            <View style = {styles.main_container}>
                {/* Image de l'herbre */}
                <View style = {styles.View_grass}>
                    <TouchableOpacity 
                        style = {{alignContent : 'center', alignItems : 'center'}}
                        onPress = {()=> this.callNextScreen()}>
                        <Text style = {{fontSize : RF(4)}}>Continuer</Text>
                        <Image
                            source = {require('app/res/grass.jpg')}
                            style = {styles.grass}
                        />
                    </TouchableOpacity>
                    
                </View>

                {/* View contenant le text Agoora */}
                <View style = {styles.view_agoora}>
                    <Text style = {styles.txt_agoora}>AgOOra</Text>
                </View>

                {/* View contenant le texte */}
                <View style = {{alignContent : 'center', alignItems : 'center', marginTop : -hp('20%')}}>
                    <Text style = {styles.txt}>Félicitation {this.state.pseudo}</Text>
                    <Text style = {styles.txt}>ton inscription est terminée</Text>
                </View>

                {/* View contenant l'image */}
                <View style = {{marginTop : hp('5%'), alignItems : 'center'}}>
                    <Image
                        source = {{uri : this.state.photo}}
                        style = {{width : wp('30%'), height : wp('30%')}}
                    />
                    <Text style = {{fontSize : RF(3.1)}}>{this.state.pseudo}</Text>
                </View>
            </View>
        
        )
    }
}

const styles = {
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    grass : {
        width : wp('100%'),
        height : wp('22%'),

    },

    View_grass : {
        backgroundColor : 'white',
        alignItems : 'center',
        alignContent : 'center',
        position : 'absolute',
        bottom : 0,
        right : 0,
        left : 0,
        paddingTop : hp('2%'),
        borderTopWidth : 1

        
    },

    view_agoora : {
        borderWidth : 1,
        position : 'absolute',
        top : hp('2%'),
        paddingTop : hp('2%'),
        paddingBottom : hp('2%'),
        width : wp('70%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        
    },

    txt_agoora : {
        fontSize : RF(3.5),
        fontWeight : 'bold'
    },

    txt : {
        fontSize : RF(3.5)
    }
}


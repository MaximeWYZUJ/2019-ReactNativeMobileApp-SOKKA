import React from 'react'
import {View,Text,Button, Picker, TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from "react-native-responsive-fontsize"
import Database from '../../Data/Database';

const policeSize = RF(2.4);

export default class Reglages_Equipe extends React.Component {
    
    constructor(props) {
        super(props)
        this.equipeData = this.props.navigation.getParam('equipeData', null);
        this.joueursData = this.props.navigation.getParam('joueursData', null);

        this.niveau = 0;
        for (j of this.joueursData) {
            this.niveau = this.niveau + j.score;
        }
        this.niveau = this.niveau / this.joueursData.length;

        this.ville = "";
        this.citation = "";
        this.photoURI = "";
        this.contactsPossibles = [];
        this.mailsPossibles = [];
        for (j of this.joueursData) {
            // On verifie que j est un capitaine de l'equipe
            if (this.equipeData.capitaines.some(elmt => elmt === j.id)) {
                this.contactsPossibles.push(j.telephone);
                this.mailsPossibles.push(j.mail);
            }
        }

        this.state = {
            contactSelected: this.equipeData.telephone,
            mailSelected: this.equipeData.mail
        }
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('header', "Réglage de l'équipe")
        }
    }


    renderPickerContact() {
        return (
            <Picker
                selectedValue={this.state.contactSelected}
                style={{height: 50, width: wp('50%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({contactSelected: itemValue})}
                >
                {this.renderPickerItem(this.contactsPossibles)}
            </Picker>
        )
    }

    
    renderPickerMail() {
        return (
            <Picker
                selectedValue={this.state.mailSelected}
                style={{height: 50, width: wp('50%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({mailSelected: itemValue})}
                >
                {this.renderPickerItem(this.mailsPossibles)}
            </Picker>
        )
    }


    renderPickerItem(array) {
        let arrayItem = [];
        for (var i=0; i<array.length; i++) {
            arrayItem.push(<Picker.Item label={array[i]} key={i} value={array[i]}/>);
        }

        return arrayItem;
    }


    validate() {
        modifs = {};

        if (this.ville) {
            modifs["ville"] = this.ville;
        }

        if (this.citation) {
            modifs["citation"] = this.citation;
        }

        modifs["mail"] = this.state.mailSelected;
        
        modifs["telephone"] = this.state.contactSelected;

        db = Database.initialisation();
        db.collection("Equipes").doc(this.equipeData.id).set(modifs, {merge: true})
        .then(() => {
            console.log("Successfully updated team. Now goback");
            this.props.navigation.goBack();
        })
    }


    render() {
       
        return(
            <View style = {styles.main_container}>
                {/* CHAMPS A REMPLIR */}
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text>Age moyen :  {this.equipeData.age}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text>Ville :  </Text>
                    <TextInput
                        style={{flex: 1, borderColor: '#C0C0C0'}}
                        onChangeText={(t) => this.ville=t}
                        placeholder={this.equipeData.ville}
                        />
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text>Phrase fétiche :  </Text>
                    <TextInput
                        style={{flex: 1, borderColor: '#C0C0C0'}}
                        onChangeText={(t) => this.citation=t}
                        placeholder={this.equipeData.citation}
                        />
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text>Niveau :  {this.niveau}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text>Fiabilite :  {this.equipeData.fiabilite}</Text>
                </View>

                {/* COORDONNEES PICKER */}
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: "#C0C0C0"}}>
                    <Text>Coordonnées de l'équipe</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text>Contact :  </Text>
                    {this.renderPickerContact()}
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text>Mail :  </Text>
                    {this.renderPickerMail()}
                </View>

                {/* BLANK SPACE */}
                <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                </View>

                {/* VALIDER */}
                <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Button
                        title="Valider"
                        onPress={() => this.validate()}
                    />
                </View>
            </View>
        )
    }
}

const styles = {
    main_container : {
        marginTop : hp('1%'),
        flex: 1,
        flexDirection: 'column'
    },

    view_icon_reglage : {
        width: wp('100%'), 
        height: 50, 
        marginBottom : hp('0.8%')
    },

    icon_reglage : {
        width : wp('12%'),
        height : wp('12%'),
        alignSelf : 'center'
    },

    view_image_equipe : {
        marginTop : wp('4%'),
        marginLeft : wp('3%'),
        flexDirection : 'row'

    },

    image_equipe : {
        width : wp('25%'),
        height : wp('25%')
    },

    view_txt_photo : {
        marginLeft : wp('4%'),
        alignItems : 'center', 
        flexDirection : 'row',
    },

    txt_modif_photo : {
        alignSelf : 'center',
        fontSize : policeSize

    },

    view_champ : {
        marginTop : hp('1%'),
        marginLeft : wp('3%'),

    },

    text_champs : {
        fontSize : policeSize,
        alignSelf : 'center',

    },

    text_input_champs : {
        fontSize : policeSize,
        paddingLeft:20,
        alignSelf : 'center',
        
    },
    image_niveau : {
        height : hp('3%'),
        width : wp('33%')
    },

    view_txt_partie : {
        width: wp('100%'), 
    },

    view_container : {
        borderBottomWidth : 2
    },

    txt_capitaine : {
        alignSelf : 'center',
        fontSize : policeSize,
    },

    view_picker : {
        marginLeft : wp('3%')
    },

    bouton : {
        backgroundColor : 'rgba(13, 169, 27, 1.0)',
        marginTop : hp('1%'),
        marginBottom : hp('1%'),
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        alignSelf : 'center',
        width : wp('40%'),
        borderRadius :  30,
        borderWidth : 2,
        borderColor : 'rgba(13,134,23,1)'
    },

    txt_boutton : {
        alignSelf : 'center',
        fontSize :  policeSize
    }

}
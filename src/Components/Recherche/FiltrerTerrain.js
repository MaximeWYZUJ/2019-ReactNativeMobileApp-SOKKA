import React from 'react'
import { Text, Button, StyleSheet, View, ScrollView, TextInput, Switch, Picker } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Database from '../../Data/Database'


export default class FiltrerTerrain extends React.Component {

    /**
     * Props du composant FiltrerJoueur :
     *      handleValidate: fonction appelée à la validation du filtrage
     */
    constructor(props) {
        super(props);

        this.state = {
            sanitaires: false,
            eclairage: false,
            handicap: false,
            decouvert: false,
            departement: "",
            ville: "",
            gratuit: false,
            surface: null
        }
    }


    renderPickerSurface() {
        return (
            <Picker
                selectedValue={this.state.surface}
                style={{width: wp('60%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({surface: itemValue})}
                >
                <Picker.Item label={"indifférent"} key={0} value={null}/>
                <Picker.Item label={"Gazon naturel"} key={1} value={"Gazon naturel"}/>
                <Picker.Item label={"Gazon synthétique"} key={2} value={"Gazon synthétique"}/>
                <Picker.Item label={"Bitume"} key={3} value={"Bitume"}/>
                <Picker.Item label={"Synthétique (hors gazon)"} key={4} value={"Synthétique (hors gazon)"}/>
            </Picker>
        )
    }


    createQuery() {
        var db = Database.initialisation();
        var ref = db.collection('Terrains');
        var bool = false;

        if (this.state.ville.length > 0) {
            ref = ref.where('Ville', '==', this.state.ville);
            bool = true;
        }
        if (this.state.ville.length > 0) {
            ref = ref.where('Departement', '==', this.state.departement);
            bool = true;
        }
        if (this.state.sanitaires) {
            this.state.sanitaires ? qSan = "-1" : qSan = "0";
            ref = ref.where('EquSanitairePublic', '==', qSan);
            bool = true;
        }
        if (this.state.eclairage) {
            this.state.eclairage ? qEcl = "-1" : qEcl = "0";
            ref = ref.where('EquEclairage', '==', qEcl);
            bool = true;
        }
        if (this.state.handicap) {
            this.state.handicap ? qHandi = "Oui" : qHandi = "Non";
            ref = ref.where('EquAccesHandimAire', '==', qHandi);
            bool = true;
        }
        if (this.state.decouvert) {
            this.state.decouvert ? qDecouv = "Découvert" : qDecouv = "Intérieur";
            ref = ref.where('Decouvert_Couvert', '==', qDecouv);
            bool = true;
        }
        if (this.state.gratuit) {
            this.state.gratuit ? qGrat = "false" : qGrat = "true";
            ref = ref.where('Payant', '==', qGrat);
            bool = true;
        }
        if (this.state.surface !== null) {
            ref = ref.where('TypeSol', '==', this.state.surface);
            bool = true;
        }

        if (!bool) {ref=null}
        return ref;
    }


    returnFilter() {
        return null;
    }


    render() {
        return (
            <View>
                {/* Filtrer sur le lieu */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%')}}>Département : </Text>
                    <TextInput style={{width: wp('60%')}} onChangeText={(t) => this.setState({departement: t})} placeholder={"Département de recherche"}/>
                </View>
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%')}}>Ville : </Text>
                    <TextInput style={{width: wp('60%')}} onChangeText={(t) => this.setState({ville: t})} placeholder={"Ville de recherche"}/>
                </View>

                {/* Sanitaires */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%'), marginRight: wp('5%')}}>Sanitaires</Text>
                    <Switch value={this.state.sanitaires} onValueChange={() => this.setState({sanitaires: !this.state.sanitaires})}/>
                </View>

                {/* Couvert / Decouvert */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%'), marginRight: wp('5%')}}>Decouvert</Text>
                    <Switch value={this.state.decouvert} onValueChange={() => this.setState({decouvert: !this.state.decouvert})}/>
                </View>

                {/* Eclairage */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%'), marginRight: wp('5%')}}>Eclairage</Text>
                    <Switch value={this.state.eclairage} onValueChange={() => this.setState({eclairage: !this.state.eclairage})}/>
                </View>

                {/* Gratuit */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%'), marginRight: wp('5%')}}>Gratuit</Text>
                    <Switch value={this.state.gratuit} onValueChange={() => this.setState({gratuit: !this.state.gratuit})}/>
                </View>

                {/* Type de sol */}
                {this.renderPickerSurface()}

                {/* Validation */}
                <View style={styles.rowFilter}>
                    <Button
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'center', borderRadius : 15, marginHorizontal: wp('30%'), marginTop: 5}}
                        title="valider"
                        color="#13D10C"
                        onPress={() => {this.props.handleValidate(this.createQuery(), this.returnFilter())}}
                    />
                </View>
            </View>
        )
    }

}

const styles=StyleSheet.create({
    rowFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    }
})
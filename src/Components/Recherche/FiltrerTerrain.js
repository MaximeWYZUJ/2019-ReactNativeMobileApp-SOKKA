import React from 'react'
import { KeyboardAvoidingView, Text, Button, StyleSheet, View, ListView, ScrollView, TextInput, Switch, Picker, TouchableOpacity } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import villes from '../../Components/Creation/villes.json'
import departements from '../../Components/Creation/departements.json'
import Colors from '../../Components/Colors'
import NormalizeString from '../../Helpers/NormalizeString'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


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
            searchedDepartements: [],
            searchedVilles: [],
            gratuit: false,
            surface: null
        }
    }


    renderPickerSurface() {
        return (
            <Picker
                selectedValue={this.state.surface}
                style={{width: wp('60%'), marginRight: wp('5%')}}
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


    /**
     * Fonction qui permet de controler l'affichage des noms des villes
     */
    renderVille = (adress) => {
        if(this.state.ville.length > 0) {
            var txt = adress.Nom_commune.toLowerCase()
            
            return (
                <TouchableOpacity
                    onPress = {() => this.setState({ville :this.jsUcfirst(txt), searchedVilles : [] })}
                    style = {{backgroundColor : Colors.grayItem,  marginTop : hp('1%'), marginBottom : hp('1'),paddingVertical : hp('1%')}}
                    >
                
                    <View style = {{flexDirection : 'row'}}>
                            <Text>{adress.Code_postal} - </Text>
                            <Text style = {{fontWeight : 'bold', fontSize :RF(2.6)}}>{this.state.ville}</Text>
                            <Text style = {{fontSize :RF(2.6)}}>{txt.substr(this.state.ville.length)}</Text>
                    </View>
                
                </TouchableOpacity>
            );
        } else {
            return(<View/>)
        }
    };


    /**
     * Fonction qui permet de controler l'affichage des noms des villes
     */
    renderDepartement = (adress) => {
        if(this.state.departement.length > 0) {
            var txt = adress.departmentName.toLowerCase()
            
            return (
                <TouchableOpacity
                    onPress = {() => this.setState({departement :this.jsUcfirst(txt), searchedDepartements : [] })}
                    style = {{backgroundColor : Colors.grayItem,  marginTop : hp('1%'), marginBottom : hp('1'),paddingVertical : hp('1%')}}
                    >
                
                    <View style = {{flexDirection : 'row'}}>
                            <Text>{adress.departmentCode} - </Text>
                            <Text style = {{fontWeight : 'bold', fontSize :RF(2.6)}}>{this.state.departement}</Text>
                            <Text style = {{fontSize :RF(2.6)}}>{txt.substr(this.state.departement.length)}</Text>
                    </View>
                
                </TouchableOpacity>
            );
        } else {
            return(<View/>)
        }
    };


    /**
     * Pour mettre la première lettre en capitale
     * @param {} string 
     */
    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    /**
     * Fonction qui permet de renvoyer une liste des villes qui
     * commencent par searchedText
     */
    searchedVilles= (searchedText) => {
        let searchedAdresses = villes.filter(function(ville) {
            
            return ville.Nom_commune.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({searchedVilles: searchedAdresses,ville : searchedText});
    };


    /**
     * Fonction qui permet de renvoyer une liste des departements qui
     * commencent par searchedText
     */
    searchedDepartements= (searchedText) => {
        let searchedAdresses = departements.filter(function(dep) {
            
            return dep.departmentName.toLowerCase().startsWith(searchedText.toLowerCase()) ;
        });
        this.setState({searchedDepartements: searchedAdresses, departement : searchedText});
    };


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
        b0 = this.state.departement.length > 0;
        b1 = this.state.ville.length > 0;
        b2 = this.state.sanitaires;
        b3 = this.state.eclairage;
        b4 = this.state.handicap;
        b5 = this.state.decouvert;
        b6 = this.state.gratuit;
        b7 = this.state.surface !== null;
        if (b0 || b1 || b2 || b3 || b4 || b5 || b6 || b7) {
            return {...this.state};
        } else {
            return null;
        }
    }


    render() {
        console.log(this.state.ville);
        console.log(this.state.departement);
        return (
            <View>
                {/* Filtrer sur le lieu */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Département : </Text>
                    <ScrollView style={{borderBottomWidth: 1, flexDirection: 'row'}}>
                        <TextInput
                            style={{width: wp('60%')}}
                            onChangeText={(t) => this.searchedDepartements(t)}
                            placeholder={"Département de recherche"}
                            value={this.state.departement}
                        />
                        
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.searchedDepartements)}
                            renderRow={this.renderDepartement}
                        />
                    </ScrollView>
                </View>
                <View style={{...styles.rowFilter}}>
                    <Text style={{width: wp('30%')}}>Ville : </Text>
                    <ScrollView style={{borderBottomWidth: 1, flexDirection: 'row'}}>
                        <TextInput
                            style={{width: wp('60%')}}
                            onChangeText={(t) => this.searchedVilles(t)}
                            placeholder={"Ville de recherche"}
                            value={this.state.ville}
                            />
                    
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.searchedVilles)}
                            renderRow={this.renderVille}
                        />
                    </ScrollView>
                </View>

                {/* Sanitaires */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%'), marginRight: wp('5%')}}>Sanitaires</Text>
                    <Switch value={this.state.sanitaires} onValueChange={() => this.setState({sanitaires: !this.state.sanitaires})}/>
                </View>

                {/* Couvert / Decouvert */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%'), marginRight: wp('5%')}}>Decouvert</Text>
                    <Switch value={this.state.decouvert} onValueChange={() => this.setState({decouvert: !this.state.decouvert})}/>
                </View>

                {/* Eclairage */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%'), marginRight: wp('5%')}}>Eclairage</Text>
                    <Switch value={this.state.eclairage} onValueChange={() => this.setState({eclairage: !this.state.eclairage})}/>
                </View>

                {/* Gratuit */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%'), marginRight: wp('5%')}}>Gratuit</Text>
                    <Switch value={this.state.gratuit} onValueChange={() => this.setState({gratuit: !this.state.gratuit})}/>
                </View>

                {/* Type de sol */}
                <View style={styles.rowFilter}>
                    {this.renderPickerSurface()}
                </View>

                {/* Validation */}
                <View style={{...styles.rowFilter, justifyContent: 'center'}}>
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
        marginBottom: 5,
        marginHorizontal: wp('5%')
    }
})
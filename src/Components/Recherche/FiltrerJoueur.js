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

export default class FiltrerJoueur extends React.Component {

    static filtrerJoueurs = (data, f) => {
        if (f != null) {
            if (f.ageMin != 0) {
                data = data.filter(((elmt) => {return parseInt(elmt["age"], 10) > parseInt(f.ageMin, 10)}));
            }
            if (f.ageMax != 99) {
                data = data.filter(((elmt) => {return parseInt(elmt["age"], 10) < parseInt(f.ageMax, 10)}));
            }
            if (f.departement != "") {
                data = data.filter(((elmt) => {return NormalizeString.normalize(elmt["departement"]) == NormalizeString.normalize(f.departement)}))
            }
            if (f.ville != "") {
                data = data.filter(((elmt) => {return NormalizeString.normalize(elmt["ville"]) == NormalizeString.normalize(f.ville)}))
            }
            if (f.score != null) {
                data = data.filter(((elmt) => {return parseInt(elmt["score"], 10) == parseInt(f.score, 10)}))
            }
            if (f.sexe != null) {
                data = data.filter(((elmt) => {return elmt["sexe"] === f.sexe}))
            }
            if (f.poste != null) {
                data = data.filter(((elmt) => {return elmt["poste"] === f.poste}))
            }
        }
        return data;
    }


    /**
     * Props du composant FiltrerJoueur :
     *      handleValidate: fonction appelée à la validation du filtrage
     */
    constructor(props) {
        super(props);

        if (this.props.init == null || this.props.init == undefined) {
            this.villePlaceholder = "Ville de recherche";
            this.depPlaceholder = "Département de recherche";
            this.ageMinPlaceholder = "0";
            this.ageMaxPlaceholder = "99";
            
            this.state = {
                ageMin: 0,
                ageMax: 99,
                score: null,
                poste: null,
                sexe: null,
                ville: "",
                searchedVilles: [],
                departement: "",
                searchedDepartements: [],
                lookForCaptain: false,
            }
        } else {
            var init = this.props.init;
            this.villePlaceholder = init.ville;
            this.depPlaceholder = init.departement;
            this.ageMinPlaceholder = init.ageMin;
            this.ageMaxPlaceholder = init.ageMax;

            this.state = {
                ageMin: init.ageMin,
                ageMax: init.ageMax,
                score: init.score,
                poste: init.poste,
                sexe: init.sexe,
                ville: init.ville,
                searchedVilles: [],
                departement: init.departement,
                searchedDepartements: [],
                lookForCaptain: init.lookForCaptain
            }
        }
    }


    renderPickerScore() {
        return (
            <Picker
                selectedValue={this.state.score}
                style={{width: wp('60%'), marginRight: wp('5%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({score: itemValue})}
                >
                <Picker.Item label={"indifférent"} key={0} value={null}/>
                <Picker.Item label={"0 étoile"} key={1} value={0}/>
                <Picker.Item label={"1 étoile"} key={2} value={1}/>
                <Picker.Item label={"2 étoiles"} key={3} value={2}/>
                <Picker.Item label={"3 étoiles"} key={4} value={3}/>
                <Picker.Item label={"4 étoiles"} key={5} value={4}/>
                <Picker.Item label={"5 étoiles"} key={6} value={5}/>
            </Picker>
        )
    }


    renderPickerPoste() {
        return (
            <Picker
                selectedValue={this.state.poste}
                style={{width: wp('60%'), marginRight: wp('5%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({poste: itemValue})}
                >
                <Picker.Item label={"indifférent"} key={0} value={null}/>
                <Picker.Item label={"mixte"} key={1} value={"mixte"}/>
                <Picker.Item label={"offensif"} key={2} value={"offensif"}/>
                <Picker.Item label={"defensif"} key={3} value={"defensif"}/>
                <Picker.Item label={"gardien"} key={4} value={"gardien"}/>
            </Picker>
        )
    }


    renderPickerSexe() {
        return (
            <Picker
                selectedValue={this.state.sexe}
                style={{width: wp('60%'), marginRight: wp('5%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({sexe: itemValue})}
                >
                <Picker.Item label={"indifférent"} key={0} value={null}/>
                <Picker.Item label={"Masculin"} key={1} value={"masculin"}/>
                <Picker.Item label={"Féminin"} key={2} value={"feminin"}/>
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
        var ref = db.collection('Joueurs');
        var bool = false;

        if (this.state.departement.length > 0) {
            ref = ref.where('departement', '==', NormalizeString.normalize(this.state.departement));
        }
        if (this.state.ville.length > 0) {
            ref = ref.where('ville', '==', NormalizeString.normalize(this.state.ville));
            bool = true;
        }
        if (this.state.ageMin > 0) {
            ref = ref.where('age', '>=', this.state.ageMin);
            bool = true;
        }
        if (this.state.ageMax < 99) {
            ref = ref.where('age', '<=', this.state.ageMax);
            bool = true;
        }
        if (this.state.score != null) {
            ref = ref.where('score', '==', this.state.score)
            bool = true;
        }
        if (this.state.poste != null) {
            ref = ref.where('poste', '==', this.state.poste)
            bool = true;
        }
        if (this.state.sexe != null) {
            ref = ref.where('sexe', '==', this.state.sexe)
            bool = true;
        }

        if (!bool) {ref=null}
        return ref;
    }


    returnFilter() {
        b0 = this.state.departement.length > 0;
        b1 = this.state.ville.length > 0;
        b2 = this.state.ageMin > 0;
        b3 = this.state.ageMax < 99;
        b4 = this.state.score != null;
        b5 = this.state.poste != null;
        b6 = this.state.sexe != null;
        if (b0 || b1 || b2 || b3 || b4 ||b5 || b6) {
            console.log("on retourne le state");
            return {...this.state}
        } else {
            return null;
        }
    }


    render() {
        return (
            <View>
                {/* Filtrer sur le lieu */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Département : </Text>
                    <ScrollView style={{borderBottomWidth: 1, flexDirection: 'row'}}>
                        <TextInput
                            style={{width: wp('60%')}}
                            onChangeText={(t) => this.searchedDepartements(t)}
                            placeholder={this.depPlaceholder}
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
                            placeholder={this.villePlaceholder}
                            value={this.state.ville}
                            />
                    
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.searchedVilles)}
                            renderRow={this.renderVille}
                        />
                    </ScrollView>
                </View>

                {/* Filtrer sur le poste */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Poste : </Text>
                    {this.renderPickerPoste()}
                </View>

                {/* Filtrer sur le sexe */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Sexe : </Text>
                    {this.renderPickerSexe()}
                </View>

                {/* Filtrer sur l'age */}
                <KeyboardAvoidingView style={styles.rowFilter} behavior="padding" enabled>
                    <Text style={{width: wp('30%')}}>Age : </Text>
                    <TextInput style={{width: wp('25%'), marginHorizontal: wp('5%')}} onChangeText={(t) => t==="" ? this.setState({ageMin: 0}) : this.setState({ageMin: parseInt(t,10)})} placeholder={"min : "+this.ageMinPlaceholder}/>
                    <TextInput style={{width: wp('25%'), marginHorizontal: wp('5%')}} onChangeText={(t) => t==="" ? this.setState({ageMax: 99}) : this.setState({ageMax: parseInt(t,10)})} placeholder={"max : "+this.ageMaxPlaceholder}/>
                </KeyboardAvoidingView>

                {/* Filtrer sur le score */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Score : </Text>
                    {this.renderPickerScore()}
                </View>

                {/* Capitaine d'équipe */}
                {/*<View style={styles.rowFilter}>
                    <Text style={{width: wp('25%')}}>Capitaine ? </Text>
                    <Switch value={this.state.lookForCaptain} onValueChange={() => this.setState({lookForCaptain: !this.state.lookForCaptain})}/>
                </View>*/}

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
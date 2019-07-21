import React from 'react'
import { KeyboardAvoidingView, Text, Button, StyleSheet, View, ListView, ScrollView, TextInput, Switch, Picker, TouchableOpacity } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DatePicker from 'react-native-datepicker'
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import villes from '../../Components/Creation/villes.json'
import departements from '../../Components/Creation/departements.json'
import Colors from '../../Components/Colors'
import NormalizeString from '../../Helpers/NormalizeString'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


export default class FiltrerDefi extends React.Component {


    /**
     * Props du composant FiltrerJoueur :
     *      handleValidate: fonction appelée à la validation du filtrage
     */
    constructor(props) {
        super(props);

        var ajd = new Date();
        this.today = ajd.getFullYear() + '-' + (ajd.getMonth() + 1) + '-' +  ajd.getDate();
        var s = this.today.split('-');
        this.todayTxt = s[2]+'-'+s[1]+'-'+s[0];

        if (this.props.init == null || this.props.init == undefined) {
            this.villePlaceholder = "Ville de recherche";
            this.depPlaceholder = "Département de recherche";
            
            this.state = {
                ville: "",
                searchedVilles: [],
                departement: "",
                searchedDepartements: [],
                format: null,
                defiOuPartie: null,
                gratuit: false,
                dateDebut: "2000-01-01",
                dateFin: this.today,
                recherche: false,
                dateDebutTxt: "01-01-2000",
                dateFinTxt: this.todayTxt
            }
        } else {
            var init = this.props.init;
            this.villePlaceholder = init.ville;
            this.depPlaceholder = init.departement;

            this.state = {
                ville: init.ville,
                searchedVilles: [],
                departement: init.departement,
                searchedDepartements: [],
                format: init.format,
                defiOuPartie: init.defiOuPartie,
                gratuit: init.gratuit,
                dateDebut: init.dateDebut,
                dateFin: init.dateFin,
                recherche: init.recherche,
                dateDebutTxt: init.dateDebutTxt,
                dateFinTxt: init.dateFinTxt
            }
        }
    }


    renderPickerDefiOuPartie() {
        return (
            <Picker
                selectedValue={this.state.defiOuPartie}
                style={{width: wp('60%'), marginRight: wp('5%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({defiOuPartie: itemValue, recherche: true})}
                >
                <Picker.Item label={"indifférent"} key={0} value={null}/>
                <Picker.Item label={"Défis entre 2 équipes"} key={1} value={"Défis entre 2 équipes"}/>
                <Picker.Item label={"Partie entre joueurs"} key={2} value={"Partie entre joueurs"}/>
            </Picker>
        )
    }


    renderPickerFormat() {
        return (
            <Picker
                selectedValue={this.state.format}
                style={{width: wp('60%'), marginRight: wp('5%')}}
                onValueChange={(itemValue, itemIndex) => this.setState({format: itemValue})}
                >
                <Picker.Item label={"indifférent"} key={0} value={null}/>
                <Picker.Item label={"2 x 2"} key={1} value={"2 x 2"}/>
                <Picker.Item label={"3 x 3"} key={2} value={"3 x 3"}/>
                <Picker.Item label={"4 x 4"} key={3} value={"4 x 4"}/>
                <Picker.Item label={"5 x 5"} key={4} value={"5 x 5"}/>
                <Picker.Item label={"6 x 6"} key={5} value={"6 x 6"}/>
                <Picker.Item label={"7 x 7"} key={6} value={"7 x 7"}/>
                <Picker.Item label={"11 x 11"} key={7} value={"11 x 11"}/>
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



    renderPhraseRecherche() {
        var phrase = "";
        if (this.state.defiOuPartie != null) {
            if (this.state.defiOuPartie === "Partie entre joueurs") {
                phrase = "Parties avec au moins 1 joueur recherché";
            } else {
                phrase = "Défis avec une équipe recherchée";
            }

            return (
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('60%')}}>{phrase}</Text>
                    <Switch value={this.state.recherche} onValueChange={() => this.setState({recherche: !this.state.recherche})}/>
                </View>
            )
        }
    }


    createQuery() {
        var db = Database.initialisation();
        var ref = db.collection('Defis');
        var bool = false;

        if (this.state.departement.length > 0) {
            ref = ref.where('departement', '==', this.state.departement);
        }
        if (this.state.ville.length > 0) {
            ref = ref.where('ville', '==', this.state.ville);
            bool = true;
        }
        if (this.state.defiOuPartie != null) {
            ref = ref.where('type', '==', this.state.defiOuPartie)
            bool = true;
            
            ref = ref.where('recherche', '==', this.state.recherche)
        }
        if (this.state.format != null) {
            ref = ref.where('format', '==', this.state.format)
            bool = true;
        }
        /*if (this.state.gratuit) {
            ref = ref.where('gratuit', '==', this.state.gratuit);
            bool = true;
        }*/
        if (this.state.dateDebut != "2000-01-01") {
            ref = ref.where('dateParse', '>=', Date.parse(this.state.dateDebut));
            bool = true;
        }
        if (this.state.dateFin != this.today) {
            ref = ref.where('dateParse', '<=', Date.parse(this.state.dateFin));
            bool = true;
        }


        if (!bool) {ref=null}
        return ref;
    }


    returnFilter() {
        b0 = this.state.departement.length > 0;
        b1 = this.state.ville.length > 0;
        b2 = this.state.defiOuPartie != null;
        b4 = this.state.format != null;
        b5 = this.state.dateDebut != "2000-01-01";
        b6 = this.state.dateFin != this.today;
        if (b0 || b1 || b2 || b4 ||b5 || b6) {
            return {...this.state}
        } else {
            return null;
        }
    }


    render() {
        return (
            <ScrollView>
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

                {/* Filtrer sur le type */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Défi ou partie ? </Text>
                    {this.renderPickerDefiOuPartie()}
                </View>

                {/* Filtrer sur le fait qu'on veut un defi qui recherche des gens ou non */}
                {this.renderPhraseRecherche()}

                {/* Filtrer sur le format */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Format </Text>
                    {this.renderPickerFormat()}
                </View>

                {/* Filtrer sur la gratuite du terrain */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('60%')}}>Terrains gratuits seulement </Text>
                    <Switch value={this.state.gratuit} onValueChange={() => this.setState({gratuit: !this.state.gratuit})}/>
                </View>

                {/* Filtrer sur la date */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('30%')}}>Quand ?</Text>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style = {{color : '#CECECE'}}>Du</Text>
                            <DatePicker
                                style={{width: wp('45%'), alignItems : 'center'}}
                                date= {this.state.dateDebutTxt}
                                mode="date"
                                placeholder="select date"
                                format="DD-MM-YYYY"
                                minDate="01-01-2000"
                                maxDate={"01-01-"+((new Date()).getFullYear()+2)}
                                confirmBtnText="Confirmer"
                                cancelBtnText="Annuler"
                                customStyles={{
                                dateInput: {
                                    marginLeft: 0,
                                    borderWidth : 0
                                }
                                }}
                                onDateChange={(date) => {
                                    s = date.split('-');
                                    s2 = s[2]+'-'+s[1]+'-'+s[0];
                                    this.setState({dateDebut: s2, dateDebutTxt: date})
                                }}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style = {{color : '#CECECE'}}>Au</Text>
                            <DatePicker
                                style={{width: wp('45%'), alignItems : 'center'}}
                                date= {this.state.dateFinTxt}
                                mode="date"
                                placeholder="select date"
                                format="DD-MM-YYYY"
                                minDate="01-01-2000"
                                maxDate={"01-01-"+((new Date()).getFullYear()+2)}
                                confirmBtnText="Confirmer"
                                cancelBtnText="Annuler"
                                customStyles={{
                                dateInput: {
                                    marginLeft: 0,
                                    borderWidth : 0
                                }
                                }}
                                onDateChange={(date) => {
                                    s = date.split('-');
                                    s2 = s[2]+'-'+s[1]+'-'+s[0];
                                    this.setState({dateFin: s2, dateFinTxt: date})
                                }}
                            />
                        </View>
                    </View>
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
            </ScrollView>
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
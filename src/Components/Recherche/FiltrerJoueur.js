import React from 'react'
import { Text, Button, StyleSheet, View, ScrollView, TextInput, Switch, Picker } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Database from '../../Data/Database'


export default class FiltrerJoueur extends React.Component {

    /**
     * Props du composant FiltrerJoueur :
     *      handleValidate: fonction appelée à la validation du filtrage
     */
    constructor(props) {
        super(props);

        
        this.state = {
            ageMin: 0,
            ageMax: 99,
            score: null,
            ville: "",
            lookForCaptain: false
        }
    }


    renderPickerScore() {
        return (
            <Picker
                selectedValue={this.state.score}
                style={{width: wp('60%')}}
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


    createQuery() {
        var db = Database.initialisation();
        var ref = db.collection('Joueurs');
        var bool = false;

        if (this.state.ville.length > 0) {
            ref = ref.where('ville', '==', this.state.ville);
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

        if (!bool) {ref=null}
        return ref;
    }


    returnFilter() {
        b1 = this.state.ville.length > 0;
        b2 = this.state.ageMin > 0;
        b3 = this.state.ageMax < 99;
        b4 = this.state.score != null;
        if (b1 || b2 || b3 || b4) {
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
                    <Text style={{width: wp('15%')}}>Ville : </Text>
                    <TextInput style={{width: wp('60%')}} onChangeText={(t) => this.setState({ville: t})} placeholder={"Ville de recherche"}/>
                </View>

                {/* Filtrer sur l'age */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%')}}>Age : </Text>
                    <TextInput style={{width: wp('25%'), marginHorizontal: wp('5%')}} onChangeText={(t) => t==="" ? this.setState({ageMin: 0}) : this.setState({ageMin: parseInt(t,10)})} placeholder={"min"}/>
                    <TextInput style={{width: wp('25%'), marginHorizontal: wp('5%')}} onChangeText={(t) => t==="" ? this.setState({ageMax: 99}) : this.setState({ageMax: parseInt(t,10)})} placeholder={"max"}/>
                </View>

                {/* Filtrer sur le score */}
                <View style={styles.rowFilter}>
                    <Text style={{width: wp('15%')}}>Score : </Text>
                    {this.renderPickerScore(true)}
                </View>

                {/* Capitaine d'équipe */}
                {/*<View style={styles.rowFilter}>
                    <Text style={{width: wp('25%')}}>Capitaine ? </Text>
                    <Switch value={this.state.lookForCaptain} onValueChange={() => this.setState({lookForCaptain: !this.state.lookForCaptain})}/>
                </View>*/}

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
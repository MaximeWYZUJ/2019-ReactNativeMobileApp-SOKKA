import React from 'react';
import {View, Text,  StyleSheet, Animated,TouchableOpacity,ScrollView,FlatList, Alert,Image, TextInput} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
export default class Reglage_Terrain extends React.Component {


     constructor(props) {
        super(props)
        this.longueur = "100"
        this.largeur = "70"
        this.state = {
            id : '',
            longueur: 100,
            largeur : 70,
            Insnom : 'Complexe du lautard',
            Equnom : 'Annexe 1',
            nbAime : 0,
            lumiere : "0",
            sanitaire : "1",
            vestiaire :  "0",
            horloge :  "0",
            but :  "1",
            douche :  "0",
        }
    }

    render() {
        return(
            <View>
                {/* BLOC INFOS DE L'EQUIPE */}
                <View style = {{flexDirection : 'row', marginLeft : wp('2%')}}>


                    {/* Bloc pour le terrain et le dimension */}
                    <View>
                         {/* Bloc pour le terrain et le dimension */}
                         <View>
                            <View style = {{flexDirection : 'row', marginBottom : hp('1%'), marginTop : hp('1%')}}>
                                <Image source = {require('../../../res/field.png')} style = {{width : wp('30%'),height: wp('19%')}} />
                                <TextInput
                                    style = {{alignSelf : "center",borderColor: '#C0C0C0'}}
                                    placeholder = {this.largeur}
                                    keyboardType = 'number-pad'
                                />
                            </View>
                            <View style = {{ width : wp('30%'), marginTop : -hp('1%')}}>
                                <TextInput
                                    style = {{alignSelf : "center",borderColor: '#C0C0C0'}}
                                    placeholder = {this.longueur}
                                    keyboardType = 'number-pad'
                                />
                            </View>
                        </View>
                        
                    </View>
                    {/* texte de l'équipe */}
                    <View style = {{flex : 1, marginLeft : wp('4%')}}>
                        <Text style= {{fontWeight : 'bold', fontSize: RF(2.5)}}>{this.state.Insnom}</Text>
                        <Text style= {{fontSize: RF(2.2)}}>{this.state.Equnom}</Text>

                      
                    </View>

                    

                   
                </View>   
            </View>
        )
    }
}
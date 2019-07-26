import React from 'react'

import {View, Text,TouchableOpacity,ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';


const CGU = "lknmnOMFNO MOINoinazmd mkj MOINMOnf KMJ MNionML f jIONMFnm fionFMONFz z m EFMOinfFINF\niùnfOIFNMFOn\npinfùFINZfionfze eomznfozfn FZ\nmoNFEOInfzio,fÖIFNZ\nfNFIOFNFMOMfinfî\nEomiNFOIFNoinOENFflmnf iojfpNFOF NO I? moinpeioNOINFKJF OMIGNÖEIRNSE MNO\nmnamoineromnaemo anoinonnglmer gomainpanag amkaj onaoùn\nagmongomnaiononiaoinm amonaoinominzf omanoainzon\nùaznoamiznaoinonfiofnazoinzmon om zomin 	nzinotnamo' on' iônt\noinoizn oin oin"


export default class Inscription_CGU extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <ScrollView>
                <View style={{alignItems: 'center', marginVertical: hp('5%')}}>
                    <Text style={{fontSize : RF(2.7), fontWeight: 'bold'}}>Conditions Générales d'Utilisation</Text>
                </View>
                <Text style={{marginHorizontal: wp('2%')}}>{CGU}</Text>
                <Text style={{marginVertical: hp('5%')}}>En cliquant sur "Suivant", j'accepte les conditions générales ci-dessus.</Text>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style = {{
                            backgroundColor:'#52C3F7',
                            width : wp('78%'),
                            paddingTop : wp('3%'),
                            paddingBottom : wp('3%'),
                            paddingLeft : wp('2%'),
                            borderRadius : 20,
                            alignItems : 'center',
                            shadowColor: 'rgba(0,0,0, .4)', // IOS
                            shadowOffset: { height: 1, width: 1 }, // IOS
                            shadowOpacity: 1, // IOS
                            shadowRadius: 1, //IOS
                            elevation: 5, // Android,
                            marginTop : hp('5%')
                        }}
                        onPress = {()=> this.props.navigation.push("InscriptionNomPseudo", {
                            mail: this.props.navigation.getParam("mail", null),
                            mdp: this.props.navigation.getParam("mdp", null)
                        })}>
                        <Text style = {{fontSize : RF(2.7), color : 'white', fontWeight : 'bold'}}>Suivant</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

}
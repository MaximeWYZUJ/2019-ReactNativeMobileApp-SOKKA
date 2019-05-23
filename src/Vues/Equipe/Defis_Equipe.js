import React from 'react'
import {View,ScrollView,Text,TouchableOpacity,Image} from 'react-native'

import RF from "react-native-responsive-fontsize"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../Components/Colors'

export default class Defis_Equipe extends React.Component {

   
    render() {
        minutesDebut = this.props.date.minutesDebut
        if (minutesDebut < 10)  minutesDebut = '0'+minutesDebut;

        minutesFin = this.props.date.minutesFin
        if (minutesFin < 10)  minutesFin= '0'+minutesFin;

        var txt = 'Defis ' + this.props.format + ' - ' +  this.props.date.jours + '/' + this.props.date.mois +  
                    '/' +  this.props.date.annee + ' - ' + this.props.date.heureDebut + 'h' + minutesDebut + ' à '
                    + this.props.date.heureFin + 'h' + minutesFin
        
        var nom1 = this._buildText(this.props.nom1)
        var nom2 = this._buildText(this.props.nom2)

        return(
            <ScrollView
            horizontal={true}>
            <View style = {styles.main_container}>
                <TouchableOpacity>

                     {/* Pour le texte du défis */}
                     <View >
                        <Text style= {{fontSize: RF(2.2),marginLeft : wp('3%')} }>{txt}</Text>
                    </View>

                    {/* Pour le reste du défis */}
                    <View style = {{flexDirection : 'row',alignContent : 'center',       alignItems: 'center' }}>
                        
                        {/* Image de l'équipe 1 */}
                        <View 
                            style ={styles.image_view_defis}>
                            <Image
                                source = {{uri : this.props.photo1}}
                                style = {styles.image_defis}
                            />
                        </View>

                        
                        {/*Nom et notation de l'équipe 1 */}
                        <View style = {{marginLeft : wp('2%')}}>
                            <Text   style = {styles.txt_defis}>
                                {nom1}
                            </Text>

                            <Image
                                source = {require('app/res/5_etoiles.png')}
                                style = {styles.note_equipe_defis}
                            />
                        </View>

                          {/* Image VS*/}
                          <View style = {{marginLeft : wp('2.5%')}}>
                            <Image
                                source = {require('app/res/vs.png')} 
                                style = {{width : wp('6,33%'), height : wp('5.75%')}}   
                            />
                        </View>

                         {/*Nom et notation de l'équipe 2 */}
                         <View style = {{marginLeft : wp('2.5%')}}>
                            <Text   style = {styles.txt_defis}>
                                {nom2}
                            </Text>

                            <Image
                                source = {require('app/res/5_etoiles.png')}
                                style = {styles.note_equipe_defis}
                            />
                        </View>

                         {/* Image de l'équipe 2 */}
                         <View 
                            style ={styles.image_view_defis} >
                            <Image
                                source = {{uri : this.props.photo2}}
                                style = {styles.image_defis}
                            />
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
            </ScrollView>
        )
    }
    _buildText(txt) {
        
        return txt
    }
}

const styles = {

    main_container : {
        flexDirection : 'row',
        backgroundColor : '#F7F7F7',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 4,
        marginBottom : hp('1%'),
        marginTop : hp('1%'),
        borderRadius : 8,
        marginLeft : wp('2%'),
        marginRight : wp('2%'),
        justifyContent: 'space-between',
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        paddingLeft : wp('2%')
    },


 

    vue_txt : {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
    },
    txt : {
        fontSize : RF(3)
   },

   txt_defis : {
       fontSize : RF(2.3)
   },

   image_defis : {
    width : wp('13.5%'), 
    height : wp('13.5%'),
    alignSelf : 'center', 
    resizeMode: 'cover', 
    marginLeft : wp('1%'),
    marginRight : wp('1%')
   },

   note_equipe_defis : {
    width : wp('17%'), 
    height : wp('3.08%'),  
    alignSelf: 'stretch' 
   },

   image_view_defis : {
   // borderRadius : 80, 
   // alignContent : 'center',       
   // alignItems: 'center', 
   // marginLeft : wp('2%'), 
   // marginTop : wp('1%'),
    //marginBottom : wp('0.8%'),
    //padding : wp('2%'), 
    //width : wp('18%')
   }
}
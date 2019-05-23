import React from 'react'
import {View, ScrollView,Text,TouchableOpacity,Image} from 'react-native'

import RF from "react-native-responsive-fontsize"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Profil_Equipe extends React.Component {

   
    render() {

        minutesDebut = this.props.date.minutesDebut
        if (minutesDebut < 10)  minutesDebut = '0'+minutesDebut;

        minutesFin = this.props.date.minutesFin
        if (minutesFin < 10)  minutesFin= '0'+minutesFin;

        var txt = 'Defis ' + this.props.format + ' - ' +  this.props.date.jours + '/' + this.props.date.mois +  
                    '/' +  this.props.date.annee + ' - ' + this.props.date.heureDebut + 'h' + minutesDebut + ' à '
                    + this.props.date.heureFin + 'h' + minutesFin
       
        var x = "nulll"
        return(
            <View style = {{borderWidth : 1, marginRight : wp('1.5%'), marginLeft : wp('1.5%')}}>
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
                                {x}
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
                                style = {{width : wp('7.33%'), height : wp('6.66%')}}   
                            />
                        </View>

                         {/*Nom et notation de l'équipe 2 */}
                         <View style = {{marginLeft : wp('2.5%')}}>
                            <Text   style = {styles.txt_defis}>
                                {this.props.nom2}
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
        )
    }

    _buildText(txt) {
        let textTab = txt.split(' ')
        return 'eeeeeeeeee'
    }
}

const styles = {

    main_container : {
        marginTop:50
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
    width : wp('13%'), 
    height : wp('13%'),
    alignSelf : 'center', 
    resizeMode: 'cover'
   },

   note_equipe_defis : {
    width : wp('16%'), 
    height : wp('2.9%'),  
    alignSelf: 'stretch' 
   },

   image_view_defis : {
    borderRadius : 80, 
    borderWidth : 1, 
    alignContent : 'center',       
    alignItems: 'center', 
    marginLeft : wp('2%'), 
    marginTop : wp('1%'),
    marginBottom : wp('0.8%'),
    padding : wp('2%'), 
    width : wp('18%')
   }
}
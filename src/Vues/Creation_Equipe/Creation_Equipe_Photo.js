import React from 'react'

import {View, Text,Image,TouchableOpacity} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../../Components/Colors'

export default class Creation_Equipe_Photo extends React.Component {

    constructor(props) {
        super(props),
        this.state = {
            photo : require('app/res/choix_photo.png')
        }
    }

     /**
     * Fonction qui permet d'ouvrir la galerie et de permettre à l'utilisateur
     * de choisir une photo de profil
     */
    _pickImage = async () => {

        
        /* Obtenir les permissions. */
        const { Permissions } = Expo;
        const { status: cameraRollPermission } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        /* Ouvrir la galerie. */
        let result = await Expo.ImagePicker.launchImageLibraryAsync({
        });

        /* Si l'utilisateur à choisis une image. */
        if (!result.cancelled) {
            this.setState({ 
              photo: {uri : result.uri },
              
            });
        }
    };

   

    render(){
        return(
            <View style = {styles.main_container}>

                {/* Bandeau superieur */}
                <View style = {styles.bandeau}>
                    <Text> </Text>
                    <Text style= {{ alignSelf : "center", marginLeft : wp('22%'), marginRight : wp('13%'), fontSize : RF(3.1)}}>Photo</Text>
                    <TouchableOpacity
                    >
                        <Text style = {{fontSize : RF(3.1), color : Colors.agOOraBlue}}>Suivant</Text>
                    </TouchableOpacity>
                </View>

                {/* View contenant l'image de l'appareil photo */}
                <View style = {{alignItems : 'center', alignContent : 'center', marginTop : hp('8%')}  }>
                    <Text style = {{fontSize : RF(3)}}>Choisis une photo d'équipe  </Text>
                    <TouchableOpacity 
                        style = {{marginTop : hp('5%')}}
                        onPress={this._pickImage}>
                
                        <Image
                        source = {this.state.photo}
                        style = {{width : wp('35%'), height : wp('35%')}}/>
                    </TouchableOpacity>
                    
                    <Text style = {{fontSize : RF(3), marginTop : hp('5%')}}>{"Elle permettra aux autres  joueurs de \n reconnaître ton équipe plus facilement"}</Text>
                </View>
              

                {/* View contenant les "compteur d'etape de creation"*/}
                <View style ={{alignItems : 'center', alignContent : 'center'}}>
                    <View style = {{flexDirection : 'row', marginTop :hp('5%')}}>
                        <View  style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
                        <View style = {[styles.step, styles.curent_step]}></View>
                    </View>
                </View>
            </View>
        )
    }

}
const styles = {
    main_container : {
        marginTop:hp('0%')
    },

    bandeau : {
        flexDirection : 'row',
        backgroundColor : '#DCDCDC',
        paddingTop : hp('1%'),
        paddingBottom : hp('1%'),
        justifyContent: 'space-between',

    },

    txt_input : {
        borderWidth : 1,
        marginTop : hp('8%'),
        width : wp('70%'),
        fontSize : RF(3.4),
        borderRadius : 10,
        padding : wp("2%")
    },

    step : {
        width :wp('5%'), 
        height : wp('5%'), 
        borderWidth : 1,
        borderRadius : 10,
        marginLeft : wp('3%'),
        marginRight : wp('3%')
    },

    curent_step : {
        backgroundColor : Colors.agOOraBlue
    }

}
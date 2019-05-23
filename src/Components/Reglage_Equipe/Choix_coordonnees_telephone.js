import React from 'react'
import {View,Text,TouchableOpacity, Image} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { CustomPicker } from 'react-native-custom-picker'
import RF from 'react-native-responsive-fontsize';

export default class Choix_coordonnees_telephone extends React.Component {

  
    constructor(props) {
        super(props)
        this.state = {
            data  : props.data
        }
    }
   
    changeTelephone(value) {
      this.props.callback(value);
    }

    render() {
       
        return (
          <View style={{  flexDirection: 'row'}}>
            <Text style= {styles.text}>Contact : </Text>
            <CustomPicker
            
              placeholder={this.props.placeholder}
              options={this.props.data}
              getLabel={item => item.nom}
              style_txt_picker = {this.props.style_txt_picker}
              fieldTemplate={this.renderField}
              optionTemplate={this.renderOption}
              headerTemplate={this.renderHeader}
              footerTemplate={this.renderFooter}
              onValueChange={value => {
                this.changeTelephone(value)
              }}
            />
          </View>
        )
      }

    

      
      
      
      renderHeader() {
        return (
          <View style={styles.headerFooterContainer}>
            {/*Changer ici pour le txt du header */}
            <Text></Text>
          </View>
        )
      }
     
      renderFooter(action) {
        return (
          <TouchableOpacity
            style={styles.headerFooterContainer}
            onPress={() => {
              Alert.alert('Footer', "You've click the footer!", [
                {
                  text: 'OK'
                },
                {
                  text: 'Close Dropdown',
                  onPress: action.close.bind(this)
                }
              ])
            }}
          >
            {/*Changer ici pour le txt du footer */}
            <Text></Text>
          </TouchableOpacity>
        )
      }
     
      renderField(settings) {
        const { selectedItem, defaultText, getLabel, clear, style_txt_picker } = settings
        return (
          <View style={styles.container}>
            <View>
              {!selectedItem && <Text style={styles.text}>{defaultText}</Text>}
              {selectedItem && (
                <View style={styles.innerContainer}>
                  <TouchableOpacity style={styles.clearButton} onPress={clear}>
                    <Text style={{ color: '#fff' }}>Clear</Text>
                  </TouchableOpacity>
                  <Text style={[styles.text, { color: selectedItem.color }]}>
                    {getLabel(selectedItem)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )
      }

     
     
      renderOption(settings) {
        const { item, getLabel } = settings
        return (
            <View style = {{flexDirection : 'row',marginTop : wp('1.5%')}}>
                <View style = {{marginLeft : wp('3%')}}>
                    <Image source = {item.photo} style = {styles.image}/>
                </View>
                
                <View style = {styles.view_txt}>
                    <Text></Text>
                    <Text>{item.nom}</Text>
                    <Text>{item.num}</Text>
                </View>
            </View>

         
        )
      }
    }
     
    const styles = {
      container: {
        color : 'red',
        marginLeft : wp('1.5%')
      },
      innerContainer: {
        flexDirection: 'row',
        alignItems: 'stretch'
      },
      text: {
        fontSize: RF(2.9),
        color : 'black'
      },
      headerFooterContainer: {
        padding: 10,
        alignItems: 'center'
      },
      clearButton: { backgroundColor: 'grey', borderRadius: 5, marginRight: 10, padding: 5 },
      optionContainer: {
        padding: 10,
        borderBottomColor: 'red',
        borderBottomWidth: 1
      },
      optionInnerContainer: {
        flex: 1,
        flexDirection: 'row'
      },
      box: {
        width: 20,
        height: 20,
        marginRight: 10
      }, 

    image : {
          height : wp('15%'),
          width : wp('15%'),
          borderRadius : 30
    },

    view_txt : {
        marginLeft : wp('3%'),
        alignItems : 'center'
    },

    txt : {
    
    },



    
}

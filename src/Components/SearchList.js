import React from 'react'
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native'
import RF from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation'


class SearchList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
        console.log(this.props.type)
    }


    renderBtnPlus() {
            return(
                <TouchableOpacity
                    style={{...styles.header_container, backgroundColor: "#0BE220", marginLeft: wp('2%'), width: wp('8%')}}
                    onPress={() => this.props.navigation.navigate("OngletRecherche_Defaut", {type: this.props.type})}
                    >
                    <Text style={styles.header}>+</Text>
                </TouchableOpacity>
            )
    }


    render() {
        const list = this.props.list
        const title = this.props.title
        return (
            <View style={styles.main_container}>
                {/* Barre de recherche */}
                <View style={styles.search_container}>
                    <Image style={styles.search_image}
                       source = {require('app/res/search.png')} />
                    <TextInput
                        style={{flex: 1, borderWidth: 1, marginHorizontal: 15, borderRadius : 10}}
                        onChangeText={(t) => this.setState({text: t})}
                        value={this.state.text}
                    />
                    <TouchableOpacity onPress={() => this.setState({text: ''})}>
                        <Image style={styles.search_image}
                                source = {require('app/res/cross.png')}/>
                    </TouchableOpacity>
                </View>

                {/* Liste des joueurs de mon reseau */}
                <View style={{flex: 7}}>
                    {/* HEADER */}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{...styles.header_container, flex: 4, marginRight: wp('2%')}}>
                            <Text style={styles.header}>{title}</Text>
                        </View>
                        {this.renderBtnPlus()}
                    </View>

                    {/* LISTE */}
                    {list}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    search_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    search_image: {
        width: 30,
        height: 30,
    },
    header_container: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : hp('2%'),
        //width : wp('88%'),
        height: hp('10%'),
        marginLeft : wp('5%'),
        marginRight : wp('5%'),
        marginTop : hp('3%'),
        borderRadius : 15,
        backgroundColor:'#52C3F7',
    },

    header: {
        color: 'white',
        fontSize: RF(2.7),
        fontWeight: 'bold',
        paddingVertical: 4
    },
})

export default withNavigation(SearchList)
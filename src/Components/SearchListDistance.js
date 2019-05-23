import React from 'react'
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native'

/**
 * Composant qui va être utilisé pour rechercher des items par rapport à 
 * leur distance par rapport à l'utilisateur
 */
class SearchListDistance extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
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
                    <Text style={styles.header}>{title}</Text>
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
    header: {
        color: 'black',
        backgroundColor: '#C0C0C0',
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 4,
        textAlign: 'center'
    }
})

export default SearchListDistance
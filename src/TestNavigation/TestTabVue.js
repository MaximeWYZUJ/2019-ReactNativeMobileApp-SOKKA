import React from 'react';
import { Text, View, Button } from 'react-native';
import TabNav from './TabNab'


export default class TestVue extends React.Component {

    constructor(props) {
        super(props);
        this.txt = this.props.navigation.getParam('txt', '');
    }

    render() {
        return (
            <View>
                <Text>{this.txt}</Text>
                <TabNav/>
            </View>
        )
    }
}
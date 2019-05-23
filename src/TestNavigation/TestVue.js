import React from 'react';
import { Text, View, Button } from 'react-native';


export default class TestVue extends React.Component {

    constructor(props) {
        super(props);
        this.txt = this.props.navigation.getParam('txt', '');
        this.buttonTxt = this.props.navigation.getParam('buttonTxt', '');
        this.next = this.props.navigation.getParam('next', '');
        this.isStack = this.props.navigation.getParam('isStack', '');
    }

    buttonRender() {
        if (this.isStack) {
            return (<Button title={this.buttonTxt} onPress={()=>{this.props.navigation.push(this.next)}}/>)
        }
    }

    render() {
        return (
            <View>
                <Text>{this.txt}</Text>
                {this.buttonRender()}
            </View>
        )
    }
}
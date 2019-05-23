import React from 'react';
import { createAppContainer,createBottomTabNavigator, createStackNavigator, TabBarTop } from 'react-navigation';
import TestVue from './TestVue'


const TabNavigator = createBottomTabNavigator({
    firstTab: {
        screen: TestVue,
        params: {
            txt: "first tab",
            buttonTxt: "goto tab 2",
            isStack: true,
            next: "secondTab"
        },
        navigationOptions: {
            tabBarLabel: "FIRST"
        }
    },

    secondTab: {
        screen: TestVue,
        params: {
            txt: "second tab",
            buttonTxt: "goto tab 1",
            isStack: true,
            next: "firstTab"
        },
        navigationOptions: {
            tabBarLabel: "SECOND"
        }
    }
})

export default (createStackNavigator({TabNavigator}, {headerMode: "none"}))
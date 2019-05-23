import React from 'react';
import { createStackNavigator, createAppContainer,createBottomTabNavigator, TabNavigator } from 'react-navigation';
import TestVue from './TestVue'
import TestTabVue from './TestTabVue'
import TabNab from './TabNab'

const FirstStackNav = createStackNavigator({

    first:{
        screen: TestVue,
        params: {
            txt: "first screen",
            buttonTxt: "goto 2",
            isStack: true,
            next: "second"
        }
    },

    second: {
        screen: TestVue,
        params: {
            txt: "second screen",
            buttonTxt: "goto last",
            isStack: true,
            next: "last"
        }
    },

    last:{
        screen: TabNab
    }

})

export default createAppContainer(FirstStackNav);
import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
//Screens
import {BackgroundScreen, InfomationScreen} from '../views';
import IndexTab from '../tabs/indexTab';
//components
import { ButtonBackComponent } from '../component';
const Stack = createStackNavigator();

const IconBack = (title) => ({
    headerShown: true,
    title: title,
    headerTitleAlign: 'center',  // Đưa tiêu đề vào giữa
    headerLeft: () => (
        <ButtonBackComponent
            color="#000000"
        />
    ),
});

const StackNavigator = () => {
    return(
        <Stack.Navigator initialRouteName='IndexTab'>
            <Stack.Screen name='IndexTab' component={IndexTab} options={{headerShown: false}}/>
            <Stack.Screen name='BackgroundScreen' component={BackgroundScreen} options={{headerShown: false}}/>
            <Stack.Screen name='InfomationScreen' component={InfomationScreen}
                    options={() => IconBack("Thông Tin Cá Nhân")} />
        </Stack.Navigator>
    )
}
export default StackNavigator;
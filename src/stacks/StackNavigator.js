import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
//Screens
import {WellcomScreen, LoginScreen, RegisterScreen, ForgotPassword} from '../views';
import IndexTab from '../tabs/indexTab';
//components
import { ButtonBackComponent, IconComponent } from '../component';
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

const IconHeaderRight = (text, onPress) => ({
    headerRight: () => (
        <IconComponent text={text} color={'#000000'} onPress={onPress} />
    ),
});



const StackNavigator = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <Stack.Navigator initialRouteName='WellcomScreen'>
            <Stack.Screen name='WellcomScreen' component={WellcomScreen} options={{ headerShown: false }} />
            <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} />
            <Stack.Screen name='IndexTab' component={IndexTab} options={{ headerShown: false }} />
            
        </Stack.Navigator>
    )
}
export default StackNavigator;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PictureScreen, DetailPostScreen } from "../views"
import HomeTab from '../tabs/homeTab';

const Stack = createStackNavigator();

const IndexRouter = () => {
    return (
        <Stack.Navigator screenOptions={({ route }) => ({
            headerShown: false, tabBarStyle: {
                display: route.name === 'picture' ? 'none' : 'flex',
            },
        })}>
            <Stack.Screen name="HomeTab" component={HomeTab} />
            <Stack.Screen name='picture' component={PictureScreen} />
            <Stack.Screen name='DetailPost' component={DetailPostScreen} />
        </Stack.Navigator>
    );
};



export { IndexRouter };

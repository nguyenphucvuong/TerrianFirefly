import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PictureScreen } from "../views"
import HomeTab from './homeTab';

const Stack = createStackNavigator();

const IndexRouter = () => {
    return (
        <Stack.Navigator screenOptions={({ route }) => ({
            headerShown: false, tabBarStyle: {
                display: route.name === 'picture' ? 'none' : 'flex',
            },
        })}>
            <Stack.Screen name="HomeTab" component={HomeTab} />
            <Stack.Screen
                name='picture'
                component={PictureScreen}
            />
        </Stack.Navigator>
    );
};

export default IndexRouter;

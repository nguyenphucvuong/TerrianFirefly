import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeRouter from './homeRouter';
import { PictureScreen } from "../views"

const Stack = createStackNavigator();

const IndexRouter = () => {
    return (
        <Stack.Navigator screenOptions={({ route }) => ({
            headerShown: false, tabBarStyle: {
                display: route.name === 'picture' ? 'none' : 'flex',
            },
        })}>
            <Stack.Screen name="HomeRouter" component={HomeRouter} />
        </Stack.Navigator>
    );
};

export default IndexRouter;

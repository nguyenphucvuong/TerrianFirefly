
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeRouter from './homeRouter'

const Stack = createStackNavigator();
const IndexRouter = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <HomeRouter /> */}
            <Stack.Screen name="HomeRouter" component={HomeRouter} />
        </Stack.Navigator>
    )
}

export default IndexRouter

import { createStackNavigator } from "@react-navigation/stack"
import { PictureScreen } from "../views"
import HomeTab from "./homeTab"
import React from "react"

const Stack = createStackNavigator()


const HomeRouter = () => {
    return (
        <Stack.Navigator
            initialRouteName="homeRouter"
            screenOptions={{ headerShown: false, }}>
            <Stack.Screen name='homeRouter' component={HomeTab} />
            <Stack.Screen
                name='picture'
                component={PictureScreen}
            />
        </Stack.Navigator>
    );
}

export default HomeRouter


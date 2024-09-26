import { createStackNavigator } from "@react-navigation/stack"
import { PictureScreen } from "../views"
import HomeTab from "./homeTab"
import React from "react"
const Router = createStackNavigator()
const HomeRouter = () => {
    return (
        <Router.Navigator screenOptions={{ headerShown: false }}>
            <Router.Screen name='homeRouter' component={HomeTab} />
            <Router.Screen name='picture' component={PictureScreen} />
        </Router.Navigator>
    )
}

export default HomeRouter


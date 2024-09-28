import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';


import React from 'react'
import { IndexRouter, EventTab, NewPost, NotiTab, PersonTab } from './'
// import * from "";

const Tab = createBottomTabNavigator();


const IndexTab = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={IndexRouter}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabicons/homeC.png') : require('../../assets/bottomtabicons/home.png')}
                            style={{ width: 25, height: 25 }} />
                    )
                }} />
            <Tab.Screen
                name="Event"
                component={EventTab}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabicons/eventC.png') : require('../../assets/bottomtabicons/event.png')}
                            style={{ width: 25, height: 25 }} />
                    )
                }} />
            <Tab.Screen
                name="NewPost"
                component={NewPost}
                options={{
                    tabBarIcon: () => (
                        <Image
                            source={require('../../assets/bottomtabicons/plus.png')}
                            style={{ width: 30, height: 30 }} />
                    )
                }} />
            <Tab.Screen
                name="Noti"
                component={NotiTab}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabicons/notiC.png') : require('../../assets/bottomtabicons/noti.png')}
                            style={{ width: 25, height: 25 }} />
                    )
                }} />
            <Tab.Screen
                name="Person"
                component={PersonTab}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabicons/personC.png') : require('../../assets/bottomtabicons/person.png')}
                            style={{ width: 25, height: 25 }} />
                    )
                }} />

        </Tab.Navigator>
    )
}

export default IndexTab

const styles = StyleSheet.create({})
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import React from 'react';

import { EventTab, NewPostTab, NotiTab, PersonTab } from './';
import IndexRouter from '../routers/indexRouter';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const getRouteName = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName == 'picture') {
        return 'none';
    }
    return 'flex';
}

const IndexTab = () => {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    elevation: 0,
                    shadowOpacity: 0,
                    overflow: 'hidden', // Đảm bảo không có phần thừa
                },

            }}>
            <Tab.Screen
                name="Home"
                component={IndexRouter}
                options={({ route }) => ({
                    tabBarStyle: {
                        display: getRouteName(route),
                    },
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabIcons/homeC.png') : require('../../assets/bottomtabIcons/home.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="Event"
                component={EventTab}
                options={({ route }) => ({

                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabIcons/eventC.png') : require('../../assets/bottomtabIcons/event.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                })}
            />
            <Tab.Screen
                name="NewPostTab"
                component={NewPostTab}
                options={{
                    tabBarIcon: () => (
                        <Image
                            source={require('../../assets/bottomtabIcons/plus.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Noti"
                component={NotiTab}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabIcons/notiC.png') : require('../../assets/bottomtabIcons/noti.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Person"
                component={PersonTab}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? require('../../assets/bottomtabIcons/personC.png') : require('../../assets/bottomtabIcons/person.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default IndexTab;
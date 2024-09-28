import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FollowScreen, HomeScreen } from '../views/index';

import Feather from 'react-native-vector-icons/Feather';

const Tab = createMaterialTopTabNavigator();

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appcolor } from '../constains/appcolor';
import { appInfo } from '../constains/appInfo';
import EventRouter from './eventRouter';

const HomeTab = () => {
  const inset = useSafeAreaInsets();

  const AnimatedView = Animated.createAnimatedComponent(View);

  // const animatedValue = React.useRef(new Animated.Value(0)).current;

  const showAnimated = React.useRef(new Animated.Value(0)).current;
  const hideAnimated = React.useRef(new Animated.Value(0)).current;
  const showAnimatedSearch = React.useRef(new Animated.Value(0)).current;
  const hideAnimatedSearch = React.useRef(new Animated.Value(0)).current;

  const toggleExpand = (e) => {
    // setExpanded(!expanded);
    Animated.timing(showAnimated, {
      toValue: e === 2 ? -100 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(hideAnimated, {
      toValue: e === 2 ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(showAnimatedSearch, {
      toValue: e === 2 ? 0 : -50,
      duration: 100,
      useNativeDriver: true,
    }).start();
    Animated.timing(hideAnimatedSearch, {
      toValue: e === 2 ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {/* Container */}


      <View
        style={{
          width: appInfo.widthWindows,
          height: 50,
          position: 'absolute',
          top: inset.top + 50,
          left: 0,
          right: 0,
          zIndex: 999,

        }}
      >
        {/* children */}

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: appcolor.gray,
            marginHorizontal: '4%',
            marginVertical: '2%',
            borderRadius: 100,
            paddingHorizontal: '2%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Feather name="search" color={appcolor.textGray} size={13} />
          <View style={{ width: 10, height: 'auto' }} />
          <Text style={{ color: appcolor.textGray }}> Điểm danh</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenListeners={{
          state: (e) => {
            toggleExpand(e.data.state.index);
          },
        }}
        style={{ paddingTop: inset.top }}
        screenOptions={{
          tabBarLabelStyle: {
            textTransform: 'capitalize',
            fontWeight: 600,
            fontSize: 17,
          },
          tabBarPressColor: 'transparent',
          tabBarIndicatorStyle: {
            backgroundColor: appcolor.primary,
            width: 0.2,
            height: 4,
            borderRadius: 100,
          },
          tabBarItemStyle: {
            width: 'auto',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarIndicatorContainerStyle: {
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarStyle: { elevation: 0 },
          tabBarAllowFontScaling: true,
        }}
        sceneContainerStyle={{ backgroundColor: 'white', paddingTop: 50 }}
        initialRouteName="homeTab"
      >
        <Tab.Screen
          name="followTab"
          component={FollowScreen}
          options={{ title: 'Theo Dõi' }}
        />
        <Tab.Screen
          name="homeTab"
          component={HomeScreen}
          options={{ title: 'Trang Chủ' }}
        />

        {/* <Tab.Screen
          name="eventTab"
          component={EventRouter}
          options={{ title: 'Sự Kiện' }}
        /> */}
      </Tab.Navigator>
    </>
  );
};

export default HomeTab;

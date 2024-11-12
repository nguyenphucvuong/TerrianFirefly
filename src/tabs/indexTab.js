import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { React, useEffect, useState } from "react";
import { EventTab, NewPostTab, NotiTab, PersonTab } from "./";
import { IndexRouter } from "../routers/indexRouter";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { auth } from '../firebase/FirebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import EventScreen from "../views/EventScreen";
import { ButtonsComponent } from "../component";

import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();
const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName == "picture" || routeName == "DetailPost") {
    return "none";
  }
  return "flex";
};

const IndexTab = () => {
  const navigation = useNavigation();
  //firebase

  const [user, setUser] = useState("");
  useEffect(() => {
  
    // Kiểm tra trạng thái xác thực của người dùng
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Hủy đăng ký lắng nghe khi thành phần bị hủy
    return () => unsubscribe();
  }, []);


  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          shadowOpacity: 0,
          overflow: "hidden", // Đảm bảo không có phần thừa
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={IndexRouter}
        options={({ route }) => ({
          tabBarStyle: {
            display: getRouteName(route),
          },
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/bottomtabicons/homeC.png")
                  : require("../../assets/bottomtabicons/home.png")
              }
              style={{ width: 25, height: 25 }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Sự Kiện"
        component={EventTab}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/bottomtabicons/eventC.png")
                  : require("../../assets/bottomtabicons/event.png")
              }
              style={{ width: 25, height: 25 }}
            />
          ),
          headerShown: true,
          headerTitleAlign: "center",
        })}
      />
      <Tab.Screen
        name="NewPostTab"
        component={NewPostTab}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../../assets/bottomtabicons/plus.png")}
              style={{ width: 30, height: 30 }}
            />
          ),
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Thông Tin"
        component={NotiTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/bottomtabicons/notiC.png")
                  : require("../../assets/bottomtabicons/noti.png")
              }
              style={{ width: 25, height: 25 }}
            />
          ),
          headerShown: true,
          gestureEnabled: false,
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Person"
        component={PersonTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/bottomtabicons/personC.png")
                  : require("../../assets/bottomtabicons/person.png")
              }
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default IndexTab;

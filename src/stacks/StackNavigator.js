import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
//Screens
import {
  BackgroundScreen,
  InfomationScreen,
  AchievementsScreen,
  NickNameScreen,
  UserManagementScreen,
  SettingScreen,
  AccountDetailsScreen,
  NotificationManagement,
  ManagePostsScreen,
  SetUpAccountScreen,
  WellcomScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPassword,
  VerificationCodeScreen,
  FollowerScreen,
  ResetPasswordScreen,
  HashtagManagerScreen,
  FollowUp,
  PictureScreen,
  DetailPostScreen,
  EventManagementScreen,
  AddEditEventScreen,
  PersonScreen,
  SplashScreenComponent,
  CommentScreen,
  RequestAdminScreen,
  ManageRequestScreen,
} from "../views";

import IndexTab from "../tabs/indexTab";
import EventScreen from "../views/EventScreen";
//components
import { ButtonBackComponent, IconComponent } from "../component";
import NotiTabScreen from "../views/NotiTabScreen";
import DetailEventScreen from "../views/DetailEventScreen";
import NewEventScreen from "../views/NewEventScreen";
import NotificationScreen from "../views/NotificationScreen";
const Stack = createStackNavigator();

const IconBack = (title) => ({
  headerShown: true,
  title: title,
  headerTitleAlign: "center", // Đưa tiêu đề vào giữa
  headerLeft: () => <ButtonBackComponent color="#000000" />,
});

const IconHeaderRight = (text, onPress, name) => ({
  headerRight: () => (
    <IconComponent
      text={text}
      name={name}
      color={"#000000"}
      onPress={onPress}
      size={26}
    />
  ),
});

const StackNavigator = () => {
  //const [isLogin, setIsLogin] = useState(false);
  return (
    <Stack.Navigator initialRouteName="WellcomScreen">
      <Stack.Screen
        name="WellcomScreen"
        component={WellcomScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SplashScreenComponent"
        component={SplashScreenComponent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerificationCodeScreen"
        component={VerificationCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IndexTab"
        component={IndexTab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="BackgroundScreen"
        component={BackgroundScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InfomationScreen"
        component={InfomationScreen}
        options={() => IconBack("Thông Tin Cá Nhân")}
      />
      <Stack.Screen
        name="AchievementsScreen"
        component={AchievementsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NickNameScreen"
        component={NickNameScreen}
        options={() => IconBack("Danh Hiệu")}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={() => IconBack("Thiết Lập")}
      />
      <Stack.Screen
        name="UserManagementScreen"
        component={UserManagementScreen}
        options={() => IconBack("Quản Lý Người Dùng")}
      />
      <Stack.Screen
        name="AccountDetailsScreen"
        component={AccountDetailsScreen}
        options={({ navigation }) => ({
          // Kết hợp các cấu hình từ cả hai hàm
          ...IconBack("Chi Tiết Tài Khoản"),
          ...IconHeaderRight(
            "",
            () => navigation.navigate("AccountDetailsScreen"),
            "alert-circle"
          ),
        })}
      />
      <Stack.Screen
        name="EventManagementScreen"
        component={EventManagementScreen}
        options={({ navigation }) => ({
          // Kết hợp các cấu hình từ cả hai hàm
          ...IconBack("Quản Lý Sự Kiện"),
          ...IconHeaderRight(
            "",
            () => navigation.navigate("AddEditEventScreen"),
            "plus-circle"
          ),
        })}
      />
      <Stack.Screen
        name="AddEditEventScreen"
        component={AddEditEventScreen}
        options={() => IconBack("Chi Tiết Sự Kiện")}
      />
      <Stack.Screen
        name="HashtagManagerScreen"
        component={HashtagManagerScreen}
        options={() => IconBack("Quản Lý Hashtag")}
      />
      <Stack.Screen
        name="NotificationManagement"
        component={NotificationManagement}
        options={() => IconBack("Quản Lý Thông Báo")}
      />
      <Stack.Screen
        name="ManagePostsScreen"
        component={ManagePostsScreen}
        options={() => IconBack("Quản Lý Bài Viết")}
      />
      <Stack.Screen
        name="SetUpAccountScreen"
        component={SetUpAccountScreen}
        options={() => IconBack("Thiết Lập Tài Khoản")}
      />
      <Stack.Screen
        name="FollowerScreen"
        component={FollowerScreen}
        options={() => IconBack("Người Theo Dõi")}
      />
      <Stack.Screen
        name="FollowUp"
        component={FollowUp}
        options={() => IconBack("Theo Dõi")}
      />
      <Stack.Screen
        name="picture"
        component={PictureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailPost"
        component={DetailPostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonScreen"
        component={PersonScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NotiTabScreen"
        component={NotiTabScreen}
        options={{}}
      />
      <Stack.Screen
        name="EventScreen"
        component={EventScreen}
        options={() => IconBack("Sự Kiện")}
      />
      <Stack.Screen
        name="NewEventScreen"
        component={NewEventScreen}
        options={() => IconBack("Sự Kiện Mới")}
      />
      <Stack.Screen
        name="DetailEventScreen"
        component={DetailEventScreen}
        options={() => IconBack("Chi Tiết Sự Kiện")}
      />

      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={() => IconBack("Thông Báo")}
      />
      <Stack.Screen
        name="CommentScreen"
        component={CommentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestAdminScreen"
        component={RequestAdminScreen}
        options={() => IconBack("Yêu Cầu Quyền Quản Trị")}
      />
      <Stack.Screen
        name="ManageRequestScreen"
        component={ManageRequestScreen}
        options={() => IconBack("Yêu Cầu Quản Trị")}
      />

    </Stack.Navigator>
  );
};
export default StackNavigator;

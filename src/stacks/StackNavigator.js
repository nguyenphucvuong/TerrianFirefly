import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
    ArticleDetailsScreen,
} from '../views';
import IndexTab from '../tabs/indexTab';
//components
import { ButtonBackComponent, IconComponent } from '../component';
const Stack = createStackNavigator();

const IconBack = (title) => ({
    headerShown: true,
    title: title,
    headerTitleAlign: 'center',  // Đưa tiêu đề vào giữa
    headerLeft: () => (
        <ButtonBackComponent
            color="#000000"
        />
    ),
});

const IconHeaderRight = (text, onPress, name) => ({
    headerRight: () => (
        <IconComponent text={text} name={name} color={'#000000'} onPress={onPress} size={26} />
    ),
});

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='IndexTab'>
            <Stack.Screen name='IndexTab' component={IndexTab} options={{ headerShown: false }} />
            <Stack.Screen name='BackgroundScreen' component={BackgroundScreen} options={{ headerShown: false }} />
            <Stack.Screen name='InfomationScreen' component={InfomationScreen}
                options={() => IconBack("Thông Tin Cá Nhân")} />
            <Stack.Screen name='AchievementsScreen' component={AchievementsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='NickNameScreen' component={NickNameScreen}
                options={() => IconBack("Danh Hiệu")} />
            <Stack.Screen name='SettingScreen' component={SettingScreen}
                options={() => IconBack("Thiết Lập")} />
            <Stack.Screen name='UserManagementScreen' component={UserManagementScreen}
                options={() => IconBack("Quản Lý Người Dùng")} />
            <Stack.Screen name='AccountDetailsScreen' component={AccountDetailsScreen}
                options={({ navigation }) => ({
                    // Kết hợp các cấu hình từ cả hai hàm
                    ...IconBack("Chi Tiết Tài Khoản"),
                    ...IconHeaderRight("", () => navigation.navigate('AccountDetailsScreen'), 'alert-circle'),
                })}
            />
            <Stack.Screen name='NotificationManagement' component={NotificationManagement}
                options={() => IconBack("Quản Lý Thông Báo")} />
            <Stack.Screen name='ManagePostsScreen' component={ManagePostsScreen}
                options={() => IconBack("Quản Lý Bài Viết")} />
            <Stack.Screen name='ArticleDetailsScreen' component={ArticleDetailsScreen}
                options={() => IconBack("Chi Tiết Bài Viết")} />
        </Stack.Navigator>
    )
}
export default StackNavigator;
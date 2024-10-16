import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
//Screens
import { BackgroundScreen, InfomationScreen, AchievementsScreen, NickNameScreen } from '../views';
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

const IconHeaderRight = (text, onPress) => ({
    headerRight: () => (
        <IconComponent text={text} color={'#000000'} onPress={onPress} />
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
                options={({ navigation }) => ({
                    // Kết hợp các cấu hình từ cả hai hàm
                    ...IconBack("Danh Hiệu"),
                    ...IconHeaderRight( "Lưu",
                        () => navigation.navigate('NickNameScreen')),
                })}
            />
        </Stack.Navigator>
    )
}
export default StackNavigator;
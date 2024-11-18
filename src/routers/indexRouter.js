import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    PictureScreen, DetailPostScreen, BackgroundScreen, InfomationScreen, AchievementsScreen, NickNameScreen,
    SettingScreen, UserManagementScreen, AccountDetailsScreen, EventManagementScreen, AddEditEventScreen,
    HashtagManagerScreen, NotificationManagement, ManagePostsScreen, SetUpAccountScreen, FollowerScreen,
    PersonScreen, CommentScreen
} from "../views"
import HomeTab from '../tabs/homeTab';
import { ButtonBackComponent, IconComponent } from "../component";

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

const IndexRouter = () => {

    return (
        <Stack.Navigator screenOptions={({ route }) => ({
            headerShown: false, tabBarStyle: {
                display: route.name === 'picture' ? 'none' : 'flex',
            },
        })}>
            <Stack.Screen name="HomeTab" component={HomeTab} />
            <Stack.Screen name='picture' component={PictureScreen} />
            <Stack.Screen name='DetailPost' component={DetailPostScreen} />
            <Stack.Screen name='PersonScreen' component={PersonScreen} />
            <Stack.Screen name='BackgroundScreen' component={BackgroundScreen} options={{ headerShown: false }} />
            <Stack.Screen name='CommentScreen' component={CommentScreen} options={{ headerShown: false }} />
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
            <Stack.Screen name='EventManagementScreen' component={EventManagementScreen}
                options={({ navigation }) => ({
                    // Kết hợp các cấu hình từ cả hai hàm
                    ...IconBack("Quản Lý Sự Kiện"),
                    ...IconHeaderRight("", () => navigation.navigate('AddEditEventScreen'), 'plus-circle'),
                })}
            />
            <Stack.Screen name='AddEditEventScreen' component={AddEditEventScreen}
                options={() => IconBack("Chi Tiết Sự Kiện")} />
            <Stack.Screen name='HashtagManagerScreen' component={HashtagManagerScreen}
                options={() => IconBack("Quản Lý Hashtag")} />
            <Stack.Screen name='NotificationManagement' component={NotificationManagement}
                options={() => IconBack("Quản Lý Thông Báo")} />
            <Stack.Screen name='ManagePostsScreen' component={ManagePostsScreen}
                options={() => IconBack("Quản Lý Bài Viết")} />
            <Stack.Screen name='SetUpAccountScreen' component={SetUpAccountScreen}
                options={() => IconBack("Thiết Lập Tài Khoản")} />
            <Stack.Screen name='FollowerScreen' component={FollowerScreen}
                options={() => IconBack("Người Theo Dõi")} />
        </Stack.Navigator>
    );
};



export { IndexRouter };

import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../firebase/FirebaseConfig';
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";

//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { IconComponent, ButtonFunctionComponent } from '../component'
const SettingScreen = () => {
    const authUser = auth.currentUser;
    const navigation = useNavigation(); // Sử dụng hook navigation
    //FireBase
    const user = useSelector((state) => state.user.user);
    // console.log('user.roleid',user[0].roleid);
    //thoát đăng nhập
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Có thể điều hướng người dùng trở lại màn hình đăng nhập
            navigation.navigate("LoginScreen");
        } catch (error) {
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi thoát đăng nhập. Vui lòng thử lại.");
        }
    };
    return (
        <View style={StyleGlobal.container}>
            {/* Gạch ngang User */}
            <View style={{ marginTop: appInfo.heightWindows * 0.01, fontSize: 16 }}>
                <Text>Người Dùng</Text>
                <View style={styles.separator} />
            </View>
            {/* Tài Khoản */}
            <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('SetUpAccountScreen')}>
                <Text style={styles.buttonText}>Quản Lý Tài Khoản</Text>
                <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
            </TouchableOpacity>
            {/* Thông Báo */}
            <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('NotificationManagement')}>
                <Text style={styles.buttonText}>Quản Lý Thông Báo</Text>
                <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
            </TouchableOpacity>
            {
                user.roleid != 0 ? (
                    <View>
                        {/* Gạch ngang Admin */}
                        <View style={{ marginTop: appInfo.heightWindows * 0.02, fontSize: 16 }}>
                            <Text>Admin</Text>
                            <View style={styles.separator} />
                        </View>
                        {/* Người Dùng */}{/* role_id 1 */}
                        <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('UserManagementScreen')}>
                            <Text style={styles.buttonText}>Quản Lý Người Dùng</Text>
                            <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                        {/* Bài Viết */}{/* role_id 2 */}
                        <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('ManagePostsScreen')}>
                            <Text style={styles.buttonText}>Quản Lý Bài Viết</Text>
                            <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                        {/* Sự Kiện */}{/* role_id 2 */}
                        <TouchableOpacity style={styles.buttonRow}
                            onPress={() => navigation.navigate('EventManagementScreen')}
                        >
                            <Text style={styles.buttonText}>Quản Lý Sự Kiện</Text>
                            <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                        {/* Hashtag */}{/* role_id 1 */}
                        <TouchableOpacity style={styles.buttonRow}
                            onPress={() => navigation.navigate('HashtagManagerScreen')}
                        >
                            <Text style={styles.buttonText}>Quản Lý Hashtag</Text>
                            <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                        {/* Các Yêu Cầu Quản Trị */}{/* role_id 1 */}
                        <TouchableOpacity style={styles.buttonRow}
                            onPress={() => navigation.navigate('ManageRequestScreen')}
                        >
                            <Text style={styles.buttonText}>Các Yêu Cầu Quản Trị</Text>
                            <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                ) : null
            }
            <ButtonFunctionComponent
                name={'Thoát Đăng Nhập'}
                backgroundColor={'red'}
                colorText={'#FFFFFF'}
                style={styles.button2}
                onPress={handleLogout}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    buttonText: {
        color: '#000000',
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: appInfo.heightWindows * 0.02
    },
    iconStyle: {
        marginLeft: 'auto',
    },
    separator: {
        width: '100%',  // Or you can use a fixed width, like 50 or 100
        height: 1,
        backgroundColor: '#B6B3B3',
        marginVertical: 5,
    },
    button2: {
        width: '100%',
        height: appInfo.heightWindows * 0.055,
        marginTop: 'auto',
    },
})
export default SettingScreen;

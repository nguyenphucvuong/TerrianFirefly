import { View, StyleSheet, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//components
import { UserAvatarComponent, ButtonFunctionComponent, InputComponents, IconComponent } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
const InfomationScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleGlobal.container} >
                <UserAvatarComponent style={styles.avatar} />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <ButtonFunctionComponent
                        style={styles.button}
                        backgroundColor={'#D9D9D9'}
                        name={'Chọn Ảnh Đại Diện'}
                        colorText={'#000000'} />
                    <ButtonFunctionComponent
                        style={styles.button}
                        onPress={() => navigation.navigate('AchievementsScreen')}
                        backgroundColor={'#D9D9D9'}
                        name={'Chọn Thành Tựu'}
                        colorText={'#000000'} />
                </View>
                <View style={{marginTop: '3%'}}>
                    <Text style={StyleGlobal.textTitleContent}>Tên</Text>
                    <InputComponents iconName={'user'} value={'Zenot'} />
                </View>
                <View style={{marginTop: '3%'}}>
                    <Text style={StyleGlobal.textTitleContent}>Giới Tính</Text>
                    <TouchableOpacity style={styles.buttonRow}>
                        <Text style={styles.buttonText}>Chọn Giới Tính</Text>
                        <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
                    </TouchableOpacity>
                </View>
                <ButtonFunctionComponent name={'Lưu'} backgroundColor={'#8B84E9'} colorText={'#FFFFFF'} style={styles.button2} />
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    avatar: {
        top: appInfo.heightWindows * 0.01,
    },
    button: {
        marginTop: appInfo.heightWindows * 0.03,
        margin: appInfo.heightWindows * 0.004,
        padding: 10,
        width: appInfo.widthWindows * 0.45,
    },
    button2: {
        width: '100%',
        height: appInfo.heightWindows * 0.055,
        marginTop: 'auto',
    },
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
        marginTop: appInfo.heightWindows * 0.01,
    },
    iconStyle: {
        marginLeft: 'auto',
    },
})
export default InfomationScreen;
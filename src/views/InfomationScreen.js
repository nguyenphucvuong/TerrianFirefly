import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//components
import { UserAvatarComponent, ButtonFunctionComponent, InputComponents } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
const InfomationScreen = () => {
    return (
        <View style={StyleGlobal.container} >
            <UserAvatarComponent style={styles.avatar} name={'Zenot'} />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <ButtonFunctionComponent
                    style={styles.button}
                    backgroundColor={'#D9D9D9'}
                    name={'Chọn Ảnh Đại Diện'}
                    colorText={'#000000'} />
                <ButtonFunctionComponent
                    style={styles.button}
                    backgroundColor={'#D9D9D9'}
                    name={'Chọn Thành Tựu'}
                    colorText={'#000000'} />
            </View>
            <InputComponents title={'Tên'} value={'Zenot'} />
            <TouchableOpacity >
                <InputComponents title={'Giới tính'} placeholder={'Chọn giới tính'} iconNameRight={'chevron-right'} editable={false} />
            </TouchableOpacity>

            <ButtonFunctionComponent name={'Dùng'} backgroundColor={'#8B84E9'} colorText={'#FFFFFF'} style={styles.button2} />
        </View>
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
})
export default InfomationScreen;
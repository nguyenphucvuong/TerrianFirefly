import { View, StyleSheet, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//components 
import { UserAvatarComponent, ButtonFunctionComponent, InputComponents, IconComponent } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
const InfomationScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    const snapPoints = useMemo(() => [appInfo.heightWindows * 0.25], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = () => {
        bottomSheetModalRef.current?.present();
    };
    // Choose image
    const [avatarImage, setAvatarImage] = useState([]);
    const handleImagePickerPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,  
            aspect: [1, 1],
            quality: 1,
        })
        // console.log('result',result);
        
        if (!result.canceled) {
            setAvatarImage(prevState => [...prevState, result.assets.uri]);
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleGlobal.container} >
                <BottomSheetModalProvider>
                    <UserAvatarComponent style={styles.avatar} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        {/* Chọn ảnh đại diện */}
                        <ButtonFunctionComponent
                            style={styles.button}
                            backgroundColor={'#D9D9D9'}
                            name={'Chọn Ảnh Đại Diện'}
                            onPress={() => handleImagePickerPress()}
                            colorText={'#000000'} />
                        {/* Chọn Thành Tựu */}
                        <ButtonFunctionComponent
                            style={styles.button}
                            onPress={() => navigation.navigate('AchievementsScreen')}
                            backgroundColor={'#D9D9D9'}
                            name={'Chọn Thành Tựu'}
                            colorText={'#000000'} />
                    </View>
                    <View style={{ marginTop: '3%' }}>
                        <Text style={StyleGlobal.textTitleContent}>Tên</Text>
                        <InputComponents iconName={'user'} value={'Zenot'} />
                    </View>
                    <View style={{ marginTop: '3%' }}>
                        <Text style={StyleGlobal.textTitleContent}>Giới Tính</Text>
                        <TouchableOpacity style={styles.buttonRow} onPress={() => handldeOpenPress()}>
                            <Text style={styles.buttonText}>Chọn Giới Tính</Text>
                            <IconComponent name={'chevron-right'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                    <ButtonFunctionComponent name={'Lưu'} backgroundColor={'#8B84E9'} colorText={'#FFFFFF'} style={styles.button2} />
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={snapPoints}>
                        <BottomSheetView style={styles.contentContainer}>
                            <TouchableOpacity style={styles.buttonRow}>
                                <Text style={styles.buttonText}>Nam</Text>
                                <IconComponent name={'check'} size={24} color={'gray'} style={styles.iconStyle} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonRow]}>
                                <Text style={[styles.buttonText]}>Nữ</Text>
                                <IconComponent name={'check'} size={24} color={'gray'} style={styles.iconStyle} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonRow]}>
                                <Text style={[styles.buttonText]}>Khác</Text>
                                <IconComponent name={'check'} size={24} color={'gray'} style={styles.iconStyle} />
                            </TouchableOpacity>
                        </BottomSheetView>
                    </BottomSheetModal>
                </BottomSheetModalProvider>
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
    contentContainer: {
        margin: 10,
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
        width: '100%',
        height: appInfo.heightWindows * 0.055,
    },
    iconStyle: {
        marginLeft: 'auto',
    },

})
export default InfomationScreen;
import { View, StyleSheet, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from "react-redux";
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//components 
import { AvatarEx, ButtonFunctionComponent, InputComponents, IconComponent } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
//redux
import { getUser } from '../redux/slices/UserSlices';
const InfomationScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    const [userName, setUserName] = useState('');
    const [gender, setGender] = useState('');

    //bottomSheet
    const snapPoints = useMemo(() => [appInfo.heightWindows * 0.25]);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = () => {
        bottomSheetModalRef.current?.present();
    };
    //firebase
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    // Choose image
    const [avatarImage, setAvatarImage] = useState('');
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
    //save
    const handleSaveInfomation = () => {

    }
    useEffect(() => {
        //đọc dữ liệu   
        dispatch(getUser(user[0].email));
        hanndleDisPlay();
    }, []);
    // console.log('user1232',user[0].email);
    const hanndleDisPlay = () => {
        setUserName(user[0].username);
        setGender(user[0].gender);
    }
    //Gender
    const hanldeGender = (gender) => {
        switch (gender) {
            case 'Nam':
                setGender('Nam');
                bottomSheetModalRef.current?.dismiss();
                break;
            case 'Nữ':
                setGender('Nữ');
                bottomSheetModalRef.current?.dismiss();
                break;
            case 'Khác':
                setGender('Khác');
                bottomSheetModalRef.current?.dismiss();
                break;
            default:
                return null;
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleGlobal.container} >
                <BottomSheetModalProvider>
                    <AvatarEx
                        url={user[0].imgUser}
                        size={appInfo.widthWindows * 0.22}
                        round={20}
                        frame={user[0].frame_user}
                    />
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
                        <InputComponents iconName={'user'} value={userName} onChangeText={(text) => setUserName(text)} />
                    </View>
                    <View style={{ marginTop: '3%' }}>
                        <Text style={StyleGlobal.textTitleContent}>Giới Tính</Text>
                        <TouchableOpacity style={styles.buttonRow} onPress={() => handldeOpenPress()}>
                            <Text style={styles.buttonText}>{gender}</Text>
                            <IconComponent name={'chevron-right'} size={appInfo.heightWindows * 0.024} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                    <ButtonFunctionComponent
                        name={'Lưu'}
                        backgroundColor={'#8B84E9'}
                        colorText={'#FFFFFF'}
                        style={styles.button2}
                        onPress={() => handleSaveInfomation()}
                    />
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={snapPoints}>
                        <BottomSheetView style={styles.contentContainer}>
                            <TouchableOpacity style={styles.buttonRow} onPress={() => hanldeGender('Nam')}>
                                <Text style={styles.buttonText}>Nam</Text>

                                {gender == 'Nam' ? (
                                    <IconComponent name={'check'} size={24} color={'#0286FF'} style={styles.iconStyle} />
                                ) : null}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonRow]} onPress={() => hanldeGender('Nữ')}>
                                <Text style={[styles.buttonText]}>Nữ</Text>
                                {gender == 'Nữ' ? (
                                    <IconComponent name={'check'} size={24} color={'#0286FF'} style={styles.iconStyle} />
                                ) : null}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonRow]} onPress={() => hanldeGender('Khác')}>
                                <Text style={[styles.buttonText]}>Khác</Text>
                                {gender == 'Khác' ? (
                                    <IconComponent name={'check'} size={24} color={'#0286FF'} style={styles.iconStyle} />
                                ) : null}
                            </TouchableOpacity>
                        </BottomSheetView>
                    </BottomSheetModal>
                </BottomSheetModalProvider>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
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
        height: appInfo.heightWindows * 0.25,
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
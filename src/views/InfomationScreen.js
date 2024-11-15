import { View, StyleSheet, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from "react-redux";
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//components 
import { AvatarEx, ButtonFunctionComponent, InputComponents, IconComponent } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
//redux
import { updateUser, uploadImage } from '../redux/slices/UserSlices';
const InfomationScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [avatarImage, setAvatarImage] = useState('');
    //uploadImage
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false); // Modal visibility
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
    const handleImagePickerPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })
        // console.log('result',result);

        if (!result.canceled) {
            // Lưu URI của ảnh vào avatarImage
            setAvatarImage(result.assets[0].uri);
        }
    }
    //save
    const handleSaveInfomation = async () => {
        setModalVisible(true);
        try {
            let imgUser = user.imgUser; // Gán ảnh hiện tại của người dùng vào imgUse
            if (avatarImage !== user.imgUser) {
                imgUser = await dispatch(uploadImage({
                    imgUser: avatarImage,
                    setUploadProgress
                })).unwrap();
                //console.log('imgUser', imgUser);
            }
            //update newData
            const newData = {
                username: userName,
                numberPhone: phone,
                gender: gender,
                imgUser: imgUser,
            }
            // console.log('imgUser', imgUser);
            //console.log('newData', newData);
            dispatch(updateUser({ user_id: user.user_id, newData: newData }))
            setModalVisible(false);
            Alert.alert("Thông Báo", "Cập Nhật Thành Công");
        } catch (error) {
            console.error("Upload failed:", error);
        }
    }
    //cập nhật lại dữ liệu 
    useEffect(() => {
        hanndleDisPlay();
        console.log('aaaaaaaa');
        
        //dispatch(getUser(user.email));
        // const unsubscribe = dispatch(listenToUserRealtime(user.email));
        // return () => unsubscribe();
    }, [user]);


    // console.log('user1232',user[0].email);
    const hanndleDisPlay = () => {
        setUserName(user.username);
        setPhone(user.numberPhone)
        setGender(user.gender);
        setAvatarImage(user.imgUser);
    }
    // const handleSetPhone = (text) => {
    //     setPhone(text);
    //     setIsEditing(true);
    // }
    // const handleBlur = () => {
    //     setIsEditing(false); // Đánh dấu kết thúc chỉnh sửa khi người dùng dừng nhập
    //     // Gửi dữ liệu mới lên Firebase (nếu muốn)
    // };

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
    //console.log('avatarImage',avatarImage);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={StyleGlobal.container} >
                <BottomSheetModalProvider>
                    <AvatarEx
                        url={avatarImage}
                        size={appInfo.widthWindows * 0.22}
                        round={20}
                        frame={user.frame_user}
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
                        <InputComponents iconName={'user'} value={userName} onChangeText={(text) => setUserName(text)} maxLength={30} />
                    </View>  
                    {user.numberPhone &&
                        <View style={{ marginTop: '3%' }}>
                            <Text style={StyleGlobal.textTitleContent}>SĐT</Text>
                            <InputComponents iconName={'phone'} value={phone} onChangeText={(text) => setPhone(text)} keyboardType={'numeric'} maxLength={10} />
                        </View>
                    }

                    <View style={{ marginTop: '3%' }}>
                        <Text style={StyleGlobal.textTitleContent}>Giới Tính</Text>
                        <TouchableOpacity style={styles.buttonRow} onPress={() => handldeOpenPress()}>
                            <Text style={styles.buttonText}>{gender}</Text>
                            <IconComponent name={'chevron-right'} size={appInfo.heightWindows * 0.024} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </View>
                    {/* Modal */}
                    <Modal isVisible={isModalVisible}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                            <Text style={{ alignSelf: 'center' }}>Cập Nhật</Text>
                            <View style={{ marginTop: appInfo.heightWindows * 0.01, marginBottom: appInfo.heightWindows * 0.01 }}>
                                <View style={styles.separator} />
                            </View>
                            <Text>Đang tải... {uploadProgress}%</Text>
                        </View>
                    </Modal>
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
    separator: {
        width: '100%',  // Or you can use a fixed width, like 50 or 100
        height: 1,
        backgroundColor: '#B6B3B3',
        marginVertical: 5,
    },

})
export default InfomationScreen;
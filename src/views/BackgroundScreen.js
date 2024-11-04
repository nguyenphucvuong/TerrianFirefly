import { View, ImageBackground, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import React, { useMemo, useRef, useEffect, useState } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from "react-redux";
//components
import { IconComponent, ButtonBackComponent, AvatarEx, ButtonFunctionComponent } from '../component';
//style
import { StyleGlobal } from '../styles/StyleGlobal';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//Redux
import { getBackground } from '../redux/slices/BackgroundSlice';
const BackgroundScreen = () => {
    //FireBase
    const arrBackground = useSelector((state) => state.background.background);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    //
    const [selectedId, setSelectedId] = useState(user.backgroundUser);
    //BottomSheet
    const snapPoints = useMemo(() => ['15%'], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = (url) => {
        bottomSheetModalRef.current?.present();
        setBackground(url);
        setSelectedId(url);
    };
    //set data
    const [background, setBackground] = useState(user.backgroundUser);
    //cập nhật lại dữ liệu     
    useEffect(() => {
        //đọc dữ liệu   
        dispatch(getBackground());
        //dispatch(getUser(user.email));
    }, []);
    //console.log('background',background);

    return (
        <View style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <ImageBackground style={{ width: '100%', height: appInfo.heightWindows * 0.2, }}
                    source={{ url: background }}>
                    <View style={{ top: appInfo.heightWindows * 0.05 }}>
                        <ButtonBackComponent color={'white'} />
                    </View>
                    <View style={styles.background}>
                        <View style={{ marginRight: 'auto', marginLeft: '5%', bottom: appInfo.heightWindows * 0.04 }}>
                            <AvatarEx
                                url={user.imgUser}
                                size={appInfo.widthWindows * 0.22}
                                round={20}
                                frame={user.frame_user}
                            />
                        </View>
                    </View>
                </ImageBackground>
                <FlatList
                    style={{ margin: '2%', marginTop: '20%' }}
                    numColumns={2}
                    data={arrBackground}
                    renderItem={({ item }) => {
                        const isSelected = selectedId === item.nameBackground;
                        return (
                            <TouchableOpacity style={{ flex: 1, margin: 5 }} 
                            onPress={() => handldeOpenPress(item.nameBackground)} >
                                <Image
                                    style={[styles.image, { borderColor: isSelected ? '#90CAF9' : 'white', borderWidth: 3, }]}
                                    source={{ url: item.nameBackground }}
                                />
                                {user.backgroundUser == item.nameBackground
                                    ? <IconComponent
                                    name={'check'}
                                    size={appInfo.heightWindows * 0.02}
                                    color={'#FFFFFF'}
                                    style={[styles.iconComponent, { bottom: 5, backgroundColor: '#0286FF' }]}
                                />
                                    : null}
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item) => item.background_id.toString()}
                />
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}>
                    <BottomSheetView style={styles.contentContainer}>
                        <Text style={StyleGlobal.textName}> Cấp độ: Người nổi tiếng 🎉</Text>
                        <ButtonFunctionComponent name={'Dùng'} backgroundColor={'#8B84E9'} colorText={'#FFFFFF'} style={styles.button} />
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: '100%', // Chiều rộng chiếm 100% của container
        height: 100,
        borderRadius: 20,
    },
    background: {
        width: '90%',
        height: appInfo.heightWindows * 0.11,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        position: 'absolute',
        borderRadius: 20,
        top: appInfo.heightWindows * 0.17,
    },
    button: {
        width: '90%',
        height: appInfo.heightWindows * 0.05,
        marginTop: 'auto',
        marginBottom: '10%',
    },
    contentContainer: {
        margin: 10,
        alignItems: 'center',
        height: appInfo.heightWindows * 0.15,
    },
    img: {
        width: '100%',
        height: appInfo.heightWindows * 0.1,
        borderRadius: 20,
    },
    iconComponent: {
        position: "absolute",
        right: 6,
        width: appInfo.heightWindows * 0.02,
        backgroundColor: '#0286FF',
        borderRadius: 20,
    },
});
export default BackgroundScreen;
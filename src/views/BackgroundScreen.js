import { View, ImageBackground, FlatList, StyleSheet, Text } from 'react-native'
import React, { useMemo, useRef, useEffect } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from "react-redux";
//components
import { SelectImageComponent, ButtonBackComponent, UserAvatarComponent, ButtonFunctionComponent } from '../component';
//style
import { StyleGlobal } from '../styles/StyleGlobal';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//Redux
import { getBackground } from '../redux/slices/BackgroundSlice';
const BackgroundScreen = () => {
    const snapPoints = useMemo(() => ['15%'], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = () => {
        bottomSheetModalRef.current?.present();
    };
    const background = useSelector((state) => state.background.background);
    const dispatch = useDispatch();
    //cập nhật lại dữ liệu     
    useEffect(() => {  
        //đọc dữ liệu   
        dispatch(getBackground());
    }, []);
    //console.log('background',background);
    
    return (
        <View style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <ImageBackground style={{ width: '100%', height: appInfo.heightWindows * 0.2, }}
                    source={{ uri: 'https://images4.alphacoders.com/973/973967.jpg' }}>
                    <View style={{top: appInfo.heightWindows * 0.05 }}>
                        <ButtonBackComponent color={'white'} />
                    </View>
                    <View style={styles.background}>
                        <View style={{ marginRight: 'auto', marginLeft: '5%', bottom: appInfo.heightWindows * 0.04 }}>
                            <UserAvatarComponent />
                        </View>
                    </View>
                </ImageBackground>
                <FlatList
                    style={{ margin: '2%', marginTop: '20%' }}
                    numColumns={2}
                    data={background}
                    renderItem={({ item }) => {
                        return (
                            <SelectImageComponent uri={item.nameBackground}
                                width={'100%'}
                                height={appInfo.heightWindows * 0.1}
                                onPress={() => handldeOpenPress()}
                            />
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
    },
    contentContainer: {
        margin: 10,
        alignItems: 'center',
        flex: 1,
    },
});
export default BackgroundScreen;
import { View, ImageBackground, FlatList, StyleSheet, Text } from 'react-native'
import React, { useMemo, useRef } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
//components
import { SelectImageComponent, ButtonBackComponent, UserAvatarComponent, ButtonFunctionComponent } from '../component';
//style
import { StyleGlobal } from '../styles/StyleGlobal';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
const BackgroundScreen = () => {
    const data = [
        { id: 1, image: 'https://i.pinimg.com/736x/81/31/20/8131208cdb98026d71d3f89b8097c522.jpg' },
        { id: 2, image: 'https://mega.com.vn/media/news/2605_hinh-nen-anime-may-tinh41.jpg' },
        { id: 3, image: 'https://gstatic.gvn360.com/2021/06/Mot-vu-tru-moi_-11-scaled.jpg' },
        { id: 4, image: 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/12/hinh-nen-vu-tru-72.jpg' },
    ];
    const snapPoints = useMemo(() => ['15%'], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = () => {
        bottomSheetModalRef.current?.present();
    };
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
                    data={data}
                    renderItem={({ item }) => {
                        return (
                            <SelectImageComponent uri={item.image}
                                width={'100%'}
                                height={appInfo.heightWindows * 0.1}
                                onPress={() => handldeOpenPress()}
                            />
                        )
                    }}
                    keyExtractor={(item) => item.id.toString()}
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
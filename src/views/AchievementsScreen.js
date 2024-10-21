import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
//components
import { UserAvatarComponent, SelectImageComponent, ButtonBackComponent, ButtonFunctionComponent } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
const AchievementsScreen = () => {
    const data = [
        { id: 1, image: 'https://i.pinimg.com/736x/81/31/20/8131208cdb98026d71d3f89b8097c522.jpg' },
        { id: 2, image: 'https://mega.com.vn/media/news/2605_hinh-nen-anime-may-tinh41.jpg' },
        { id: 3, image: 'https://gstatic.gvn360.com/2021/06/Mot-vu-tru-moi_-11-scaled.jpg' },
        { id: 4, image: 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/12/hinh-nen-vu-tru-72.jpg' },
        { id: 1, image: 'https://i.pinimg.com/736x/81/31/20/8131208cdb98026d71d3f89b8097c522.jpg' },
        { id: 2, image: 'https://mega.com.vn/media/news/2605_hinh-nen-anime-may-tinh41.jpg' },
    ];

    // variables
    const snapPoints = useMemo(() => ['15%'], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = () => {
        bottomSheetModalRef.current?.present();
    };
    return (
        <BottomSheetModalProvider>
            <View style={{ backgroundColor: '#7982FB', height: appInfo.heightWindows * 0.2, justifyContent: 'center', borderRadius: 20 }}>
                <View style={{ top: appInfo.heightWindows * 0.03 }}>
                    <ButtonBackComponent color={'white'} />
                </View>
                <UserAvatarComponent style={styles.avatar} />
            </View>
            <FlatList
                style={{ margin: '2%', marginTop: '5%' }}
                numColumns={3}
                data={data}
                renderItem={({ item }) => {
                    return (
                        <SelectImageComponent
                            uri={item.image} width={'100%'}
                            height={appInfo.heightWindows * 0.13}
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
                    <ButtonFunctionComponent name={'Dùng'} backgroundColor={'#8B84E9'} colorText={'#FFFFFF'} style={styles.button2} />
                </BottomSheetView>
            </BottomSheetModal>

        </BottomSheetModalProvider>
    )
}
const styles = StyleSheet.create({
    contentContainer: {
        margin: 10,
        alignItems: 'center',
        flex: 1,
    },
    button2: {
        width: '90%',
        height: appInfo.heightWindows * 0.05,
        marginTop: 'auto',
    },
    avatar: {
        top: appInfo.heightWindows * 0.03,
    },
});
export default AchievementsScreen;
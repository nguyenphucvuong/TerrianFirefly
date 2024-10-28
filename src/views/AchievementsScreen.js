import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef, useEffect } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from "react-redux";
//components
import { AvatarEx, SelectImageComponent, ButtonBackComponent, ButtonFunctionComponent } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//redux
import { getAchievement } from '../redux/slices/AchievementSlice';
import { getUser } from '../redux/slices/UserSlices';
const AchievementsScreen = () => {

    // bottomSheetModal
    const snapPoints = useMemo(() => [appInfo.heightWindows * 0.15], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = () => {
        bottomSheetModalRef.current?.present();
    };
    const achievement = useSelector((state) => state.achievement.achievement);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    //cập nhật lại dữ liệu     
    useEffect(() => {
        //đọc dữ liệu   
        dispatch(getAchievement());
        dispatch(getUser(user[0].email));
    }, []);
    console.log('achievement',achievement);
    return (
        <BottomSheetModalProvider>
            <View style={{ backgroundColor: '#7982FB', height: appInfo.heightWindows * 0.2, justifyContent: 'center', borderRadius: 20 }}>
                <View style={{ top: appInfo.heightWindows * 0.03 }}>
                    <ButtonBackComponent color={'white'} />
                </View>
                <AvatarEx
                    url={user[0].imgUser}
                    size={appInfo.widthWindows * 0.22}
                    round={20}
                    frame={user[0].frame_user}
                />
            </View>
            <FlatList
                style={{ margin: '2%', marginTop: '5%' }}
                numColumns={3}
                data={achievement}
                renderItem={({ item }) => {
                    return (
                        <SelectImageComponent
                            uri={item.nameAchie} width={'100%'}
                            height={appInfo.heightWindows * 0.13}
                            onPress={() => handldeOpenPress()}
                        />
                    )
                }}
                keyExtractor={(item) => item.achie_id.toString()}
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
});
export default AchievementsScreen;
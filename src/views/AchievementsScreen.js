import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useMemo, useRef, useEffect, useState } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from "react-redux";
//components
import { AvatarEx, IconComponent, ButtonBackComponent, ButtonFunctionComponent, SkeletonComponent } from '../component';
//styles
import { StyleGlobal } from '../styles/StyleGlobal';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//redux
import { getAchievement } from '../redux/slices/AchievementSlice';
import { getUser, updateUser, listenToUserRealtime} from '../redux/slices/UserSlices';
const AchievementsScreen = () => {
    //Firebase
    const achievement = useSelector((state) => state.achievement.achievement);
    const user = useSelector((state) => state.user.user);
    // const achievement = "";
    // const user = "";
    const dispatch = useDispatch();
    //
    const [selectedId, setSelectedId] = useState(user.frame_user);
    const [frame, setFrame] = useState(user.frame_user);
    const [level, setLevel] = useState('');
    // bottomSheetModal
    const snapPoints = useMemo(() => ['15%'], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = (item) => {
        bottomSheetModalRef.current?.present();
        setSelectedId(item.nameAchie);
        setFrame(item.nameAchie);
        setLevel(item.level);

    };
    const hanldeFrame = () => {
        try {
            const newData = {
                frame_user: frame,
            }
            //console.log('newData', newData);
            dispatch(updateUser({ user_id: user.user_id, newData: newData }));
            Alert.alert("Thông Báo", "Cập Nhật Thành Công");
        } catch (error) {
            console.error("Update failed:", error);
        }
    }
    //cập nhật lại dữ liệu 
    useEffect(() => {
        dispatch(getAchievement());
        const unsubscribe = dispatch(listenToUserRealtime(user.email));
        return () => unsubscribe();
    }, [dispatch, user.email]);
    //console.log('achievement', achievement);
    // console.log('selectedId', selectedId);
    return (
        <View style={{ flex: 1 }}>
            {
                !user || !achievement ?
                    (
                        <View>
                            <SkeletonComponent
                                isAvatar
                                Data={""}
                                style={{ width: 80, height: 80, margin: '10%', alignSelf: 'center' }}
                            />
                            <SkeletonComponent
                                Data={""}
                                style={{ width: '100%', height: appInfo.heightWindows * 0.05 }}
                            />
                            <SkeletonComponent
                                Data={""}
                                style={{ width: '100%', height: appInfo.heightWindows * 0.05 }}
                            />
                            <SkeletonComponent
                                Data={""}
                                style={{ width: '100%', height: appInfo.heightWindows * 0.05 }}
                            />
                        </View>
                    ) : (
                        <BottomSheetModalProvider>
                            <View style={{ backgroundColor: '#7982FB', height: appInfo.heightWindows * 0.2, justifyContent: 'center', borderRadius: 20 }}>
                                <View style={{ top: appInfo.heightWindows * 0.03, zIndex: 1 }}>
                                    <ButtonBackComponent color={'white'} />
                                </View>
                                <AvatarEx
                                    url={user.imgUser}
                                    size={appInfo.widthWindows * 0.22}
                                    round={20}
                                    frame={frame}
                                />
                            </View>
                            <FlatList
                                style={{ margin: '2%', marginTop: '5%' }}
                                numColumns={3}
                                data={achievement}
                                renderItem={({ item }) => {
                                    const isSelected = selectedId === item.nameAchie;
                                    const isLocked = item.level > user.total_interact_id; //kiểm tra level > hơn total_interact_id sẽ không click
                                    return (
                                        <TouchableOpacity style={[styles.touchableContainer, { backgroundColor: isSelected ? '#90CAF9' : '#EEEEEE' }]}
                                            onPress={() => !isLocked && handldeOpenPress(item)} >
                                            {isLocked ? (
                                                <IconComponent
                                                    name={'lock'}
                                                    size={appInfo.heightWindows * 0.02}
                                                    color={'#FFFFFF'}
                                                    style={[
                                                        styles.iconComponent,
                                                        { bottom: 5, left: 5, backgroundColor: '#BFBFBF', zIndex: 1 },
                                                    ]}
                                                />
                                            ) : null}

                                            <Image
                                                style={{ width: '100%', height: appInfo.heightWindows * 0.13 }}
                                                source={{ url: item.nameAchie }}
                                            />
                                            {user.frame_user == item.nameAchie
                                                ? <IconComponent
                                                    name={'check'}
                                                    size={appInfo.heightWindows * 0.02}
                                                    color={'#FFFFFF'}
                                                    style={[styles.iconComponent, { bottom: 4, right: 5, backgroundColor: '#0286FF' }]}
                                                />
                                                : null}
                                        </TouchableOpacity>
                                    )
                                }}
                                keyExtractor={(item) => item.achie_id.toString()}
                            />
                            <BottomSheetModal
                                ref={bottomSheetModalRef}
                                index={0}
                                snapPoints={snapPoints}>
                                <BottomSheetView style={styles.contentContainer}>
                                    <Text style={StyleGlobal.textName}> Cấp độ: {level}🎉</Text>

                                    <ButtonFunctionComponent
                                        name={'Dùng'}
                                        backgroundColor={'#8B84E9'}
                                        colorText={'#FFFFFF'}
                                        onPress={() => hanldeFrame()}
                                        style={styles.button} />
                                </BottomSheetView>
                            </BottomSheetModal>

                        </BottomSheetModalProvider>
                    )
            }
        </View>
    )
}
const styles = StyleSheet.create({
    contentContainer: {
        margin: 10,
        alignItems: 'center',
        height: appInfo.heightWindows * 0.15,
    },
    touchableContainer: {
        flex: 1,
        margin: 5,
        borderRadius: 20,
    },
    button: {
        width: '90%',
        height: appInfo.heightWindows * 0.05,
        marginTop: 'auto',
        marginBottom: '10%',
    },
    iconComponent: {
        position: "absolute",
        width: appInfo.heightWindows * 0.02,
        backgroundColor: '#0286FF',
        borderRadius: 20,
    },
});
export default AchievementsScreen;
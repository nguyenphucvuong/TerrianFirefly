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
import { getAchievement} from '../redux/slices/AchievementSlice';
import { getUser, updateUser, listenToUserRealtime } from '../redux/slices/UserSlices';
const AchievementsScreen = () => {
    //Firebase
    const achievement = useSelector((state) => state.achievement.achievement);
    const user = useSelector((state) => state.user.user);
    // const achievement = "";
    // const user = "";
    const dispatch = useDispatch();
    //tìm achie_id
    const findAchievement = achievement.find(item => item.achie_id === user.achie_id);
    //console.log('findAchievement',findAchievement);
    
    const [isNickname, setNickname] = useState(findAchievement.nickname);
    //Xử lý chọn nickname
    const hanldeSelectAchievement = (item) => {
        try {
            setNickname(item.nickname);
            const newData = {
                achie_id: item.achie_id,
            }
            console.log('newData', newData);
            dispatch(updateUser({ user_id: user.user_id, newData: newData }));
            Alert.alert("Thông Báo", "Cập Nhật Thành Công");
        } catch (error) {
            console.error("Update failed:", error);
        }
    }
    //cập nhật lại dữ liệu 
    useEffect(() => {
        dispatch(getAchievement());
    
    },[]);
    console.log('achievement', achievement);
    console.log('isNickname', isNickname);
    return (
        <View style={StyleGlobal.container}>
            {
                !user || !achievement ?
                    (
                        <View>
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
                        <FlatList
                            data={achievement}
                            renderItem={({ item }) => {
                                const isLocked = item.level > user.total_interact_id; //kiểm tra level > hơn total_interact_id sẽ không click
                                return (
                                    <TouchableOpacity style={[styles.buttonRow, { borderColor: isNickname === item.nickname ? '#90CAF9' : 'gray' }]}
                                        onPress={() => !isLocked && hanldeSelectAchievement(item)}>
                                        <Text style={styles.buttonText}>{item.nickname}</Text>
                                        {isNickname === item.nickname ?
                                            <IconComponent name={'check'} size={appInfo.heightWindows * 0.025} color={'#90CAF9'} style={styles.iconStyle} />
                                            : null
                                        }
                                        {isLocked ?
                                            <IconComponent name={'lock'} size={appInfo.heightWindows * 0.025} color={'#BFBFBF'} style={styles.iconStyle} />
                                            : null
                                        }
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item) => item.achie_id.toString()}
                        />
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
        marginBottom: appInfo.heightWindows * 0.015,

    },
    iconStyle: {
        marginLeft: 'auto',
        zIndex: 1,
    },
    separator: {
        width: '100%',  // Or you can use a fixed width, like 50 or 100
        height: 1,
        backgroundColor: '#B6B3B3',
        marginVertical: 5,
    },
    button2: {
        width: '100%',
        height: appInfo.heightWindows * 0.055,
        marginTop: 'auto',
    },
});
export default AchievementsScreen;
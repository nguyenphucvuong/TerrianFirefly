import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from '@react-navigation/native';
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { IconComponent, SkeletonComponent } from '../component'
//redux
import { getNickname } from '../redux/slices/NicknameSlice';
import { getUserByField, updateUser, listenToUserRealtime } from '../redux/slices/UserSlices';
const NickNameScreen = () => {
    //FireBase
    const nickname = useSelector((state) => state.nickname.nickname);
    const user = useSelector((state) => state.user.user);
    const [isNickname, setNickname] = useState(user.nickname);
    const dispatch = useDispatch();
    //Xử lý chọn nickname
    const hanldeSelectNickName = (item) => {
        try {
            setNickname(item.nickname);
            const newData = {
                nickname: item.nickname,
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
        dispatch(getNickname());
        const unsubscribe = dispatch(listenToUserRealtime(user.email));
        return () => unsubscribe();
    }, [dispatch, user.email]);
    //console.log('nickname', nickname);
    return (
        <View style={StyleGlobal.container}>
            {
                !user || !nickname ?
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
                            data={nickname}
                            renderItem={({ item }) => {
                                const isLocked = item.level > user.total_interact_id; //kiểm tra level > hơn total_interact_id sẽ không click
                                return (
                                    <TouchableOpacity style={[styles.buttonRow, { borderColor: isNickname === item.nickname ? '#90CAF9' : 'gray' }]}
                                        onPress={() => !isLocked && hanldeSelectNickName(item)}>
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
                            keyExtractor={(item) => item.nickname.toString()}
                        />
                    )
            }
        </View>
    )
}
const styles = StyleSheet.create({
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
})
export default NickNameScreen;
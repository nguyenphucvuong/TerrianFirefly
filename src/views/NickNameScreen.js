import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { IconComponent } from '../component'
//redux
import { getNickname } from '../redux/slices/NicknameSlice';
const NickNameScreen = () => {
    const nickname = useSelector((state) => state.nickname.nickname);
    const dispatch = useDispatch();
    //cập nhật lại dữ liệu     
    useEffect(() => {
        //đọc dữ liệu   
        dispatch(getNickname());
    }, []);
    //console.log('nickname', nickname);

    return (
        <View style={StyleGlobal.container}>
            <FlatList
                data={nickname}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.buttonRow}>
                            <Text style={styles.buttonText}>{item.nickname}</Text>
                            <IconComponent name={'check'} size={appInfo.heightWindows * 0.025} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                    )

                }}
                keyExtractor={(item) => item.id.toString()}
            />

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
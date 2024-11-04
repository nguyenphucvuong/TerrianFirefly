import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { InputComponents, IconComponent, ButtonFunctionComponent } from '../component'
const DATA = [
    { id: 1 },
    { id: 2 },
];
const EventManagementDetailsScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation\
    return (
        <View style={StyleGlobal.container}>
            <View style={{ marginTop: '3%' }}>
                <Text style={StyleGlobal.textTitleContent}>Tiêu Đề</Text>
                <InputComponents />
            </View>
            <View style={{ marginTop: '3%' }}>
                <Text style={StyleGlobal.textTitleContent}>Giới Tính</Text>
                <TouchableOpacity style={styles.buttonRow} >
                    <Text style={styles.buttonText}>Time</Text>
                    <IconComponent name={'chevron-right'} size={appInfo.heightWindows * 0.024} color={'gray'} style={styles.iconStyle} />
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: '3%' }}>
                <Text style={StyleGlobal.textTitleContent}>Hashtag</Text>
                <TouchableOpacity style={styles.buttonRow} >
                    <Text style={styles.buttonText}>Hashtag</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: '3%' }}>
                <Text style={StyleGlobal.textTitleContent}>Hình Ảnh</Text>
                <TouchableOpacity style={styles.buttonRow} >
                    <Text style={styles.buttonText}>Hashtag</Text>
                </TouchableOpacity>
            </View>
            <ButtonFunctionComponent
                name={'Dùng'}
                backgroundColor={'#8B84E9'}
                colorText={'#FFFFFF'}
                style={styles.button} />
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
        width: '100%',
        height: appInfo.heightWindows * 0.055,
    },
    iconStyle: {
        marginLeft: 'auto',
    },
    button: {
        width: '100%',
        height: appInfo.heightWindows * 0.05,
        marginTop: 'auto',
    },
});
export default EventManagementDetailsScreen;
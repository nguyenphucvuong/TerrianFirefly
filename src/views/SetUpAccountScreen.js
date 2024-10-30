import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { IconComponent, ButtonsComponent, ButtonFunctionComponent } from '../component'

const SetUpAccountScreen = () => {
    return (
        <View style={StyleGlobal.container}>
            <Text style={styles.sizeTitle}>Thiết lập an toàn tài khoản</Text>
            <View style={{ flexDirection: 'row', marginTop: appInfo.heightWindows * 0.025, marginBottom: appInfo.heightWindows * 0.02, alignItems: 'center' }}>
                <IconComponent name={'mail'} color={'#FFFFFF'} size={appInfo.heightWindows * 0.03} style={styles.backgroundIcon} />
                <View style={{ marginLeft: 10 }}>
                    <Text>Email</Text>
                    <Text>adad@gmail.com</Text>
                </View>
                <TouchableOpacity style={styles.button} >
                    <Text>Đã Liên Kết</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', marginTop: appInfo.heightWindows * 0.025, marginBottom: appInfo.heightWindows * 0.02, alignItems: 'center' }}>
                <IconComponent name={'mail'} color={'#FFFFFF'} size={appInfo.heightWindows * 0.03} style={styles.backgroundIcon} />
                <View style={{ marginLeft: 10 }}>
                    <Text>Email</Text>
                    <Text>adad@gmail.com</Text>
                </View>
                <TouchableOpacity style={styles.button} >
                    <Text style={{color: '#0286FF'}}>Liên Kết</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', marginTop: appInfo.heightWindows * 0.025, marginBottom: appInfo.heightWindows * 0.02, alignItems: 'center' }}>
                <IconComponent name={'mail'} color={'#FFFFFF'} size={appInfo.heightWindows * 0.03} style={styles.backgroundIcon} />
                <View style={{ marginLeft: 10 }}>
                    <Text>Email</Text>
                    <Text>adad@gmail.com</Text>
                </View>
                <TouchableOpacity style={styles.button} >
                    <Text style={{color: '#0286FF'}}>Đổi</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', marginTop: appInfo.heightWindows * 0.025, marginBottom: appInfo.heightWindows * 0.02, alignItems: 'center' }}>

                    <Text style={styles.sizeTitle}>Khóa Tài Khoản</Text>

                <TouchableOpacity style={styles.button} >
                    <Text style={{color: '#0286FF'}}>Yêu Cầu Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    sizeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    backgroundIcon: {
        backgroundColor: '#0286FF',
        borderRadius: 20,
        padding: 10,
        width: appInfo.widthWindows * 0.11,
        height: appInfo.widthWindows * 0.11, // Make it a square
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    button: {
        width: appInfo.widthWindows * 0.25,
        height: appInfo.widthWindows * 0.08,
        borderWidth: 1,
        borderColor: '#B6B3B3',
        alignItems: 'center',
        padding: 7,
        marginLeft: 'auto',
    },
    separator: {
        width: '100%',  // Or you can use a fixed width, like 50 or 100
        height: 1,
        backgroundColor: '#B6B3B3',
        marginVertical: 5,
    },
});
export default SetUpAccountScreen;
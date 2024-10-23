import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { InputComponents, IconComponent } from '../component'
const AccountDetailsScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    const snapPoints = useMemo(() => [appInfo.heightWindows * 0.25], []);
    const bottomSheetModalRef = useRef(null);
    const handldeOpenPress = () => {
        bottomSheetModalRef.current?.present();
    };
    return (
        <View style={StyleGlobal.container}>
            <BottomSheetModalProvider>
                <TouchableOpacity style={styles.status} onPress={() => handldeOpenPress()}>
                    <Text style={StyleGlobal.textTitleContent}>Trạng Thái: Tạm Khóa</Text>
                </TouchableOpacity>
                <View style={{ marginTop: '3%' }}>
                    <Text style={StyleGlobal.textTitleContent}>Tên</Text>
                    <InputComponents iconName={'user'} value={'Zenot'} editable={false} />
                </View>
                <View style={{ marginTop: '3%' }}>
                    <Text style={StyleGlobal.textTitleContent}>Email</Text>
                    <InputComponents iconName={'mail'} value={'A'} editable={false} />
                </View>
                <View style={{ marginTop: '3%' }}>
                    <Text style={StyleGlobal.textTitleContent}>Mật Khẩu</Text>
                    <InputComponents iconName={'lock'} value={'B'} editable={false} />
                </View>
                <View style={{ marginTop: '3%' }}>
                    <Text style={StyleGlobal.textTitleContent}>Giới Tính</Text>
                    <InputComponents iconName={'meh'} value={'C'} editable={false} />
                </View>
                <View style={{ marginTop: '3%' }}>
                    <Text style={StyleGlobal.textTitleContent}>SDT</Text>
                    <InputComponents iconName={'phone'} value={'D'} editable={false} />
                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}>
                    <BottomSheetView style={styles.contentContainer}>
                        <TouchableOpacity style={styles.buttonRow}>
                            <Text style={styles.buttonText}>Bình Thường</Text>
                            <IconComponent name={'check'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttonRow,{backgroundColor: '#F7CE45'}]}>
                            <Text style={[styles.buttonText,{color: '#222222'}]}>Tạm Khóa</Text>
                            <IconComponent name={'check'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttonRow,{backgroundColor: '#FF0000'}]}>
                            <Text style={[styles.buttonText,{color: '#FFFFFF'}]}>Xóa Tài Khoản</Text>
                            <IconComponent name={'check'} size={24} color={'gray'} style={styles.iconStyle} />
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </View>
    )
}
const styles = StyleSheet.create({
    status: {
        alignItems: 'center',
    },
    contentContainer: {
        margin: 10,
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
        width: '100%',
        height: appInfo.heightWindows * 0.055,
        
    },
    iconStyle: {
        marginLeft: 'auto',
    },
})
export default AccountDetailsScreen;
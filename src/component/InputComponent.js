import { StyleSheet, TouchableOpacity, Text, TextInput, View } from "react-native";
import React from "react";
import Feather from 'react-native-vector-icons/Feather';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
//styles
import { StyleGlobal } from "../styles/StyleGlobal";
const InputComponents = ({ title,iconNameLeft, iconNameRight, value, keyboardType, onChangeText, placeholder, editable }) => {
    return (
        <View style={{marginTop: '3%'}}>
            <Text style={StyleGlobal.textTitleContent}>{title}</Text>
            <View style={styles.textInput}>
                <Feather name={iconNameLeft} size={24} color={'#858585'} />
                <TextInput
                    value={value}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    editable={editable}
                />
                <Feather style={styles.iconRight} name={iconNameRight} size={24} color={'#858585'} />
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    textInput: {
        marginTop: '2%',
        width: '100%',
        height: appInfo.heightWindows * 0.055,
        borderColor: 'C4C4C4',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Nền trắng cho ô nhập liệu
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        shadowColor: '#C4C4C4', // Màu bóng của ô nhập liệu
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    iconRight: {
        marginLeft: 'auto',
    },
});
export default InputComponents;
import { Text, TouchableOpacity, StyleSheet, View, Image, ActivityIndicator } from "react-native";
import React from "react";
import { appInfo } from '../constains/appInfo';
const ButtonFunctionComponent = ({ check = false, onPress, name, backgroundColor, colorText , url, style}) => {
    return (
        <TouchableOpacity disabled={isLoading} onPress={onPress} style={[styles.button, { backgroundColor: backgroundColor ? backgroundColor : isLoading ? Colors.gray : Colors.blue}, style]}>
            {
                isLoading ? <ActivityIndicator/> : (
                    <View style={{flexDirection: 'row'}}>
                    {check && <Image style= {{width : 25, height: 25}} source={url} />}
                    <Text style={[styles.buttonText, { color: colorText }]}>{name}</Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({ 

    button: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 80,
        elevation: 2, // Thêm độ bóng cho Android
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },

});
export default ButtonFunctionComponent;
import { Text, TouchableOpacity, Pressable, StyleSheet, View, Image, ActivityIndicator } from "react-native";
import React from "react";
import { appInfo } from '../constains/appInfo';
const ButtonFunctionComponent = ({ 
    isLoading = false,
    check = false, 
    onPress, 
    name, 
    backgroundColor, 
    colorText , 
    url
    }) => {
    
    return (
        <TouchableOpacity disabled={isLoading} onPress={onPress} style={[styles.button, { backgroundColor: backgroundColor ? backgroundColor : isLoading ? Colors.gray : Colors.blue}]}>
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
        width: appInfo.heightWindows * 0.45,
        height: appInfo.heightWindows * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        elevation: 2, // Thêm độ bóng cho Android
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

});
export default ButtonFunctionComponent;
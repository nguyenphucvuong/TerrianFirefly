import { Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Feather from 'react-native-vector-icons/Feather';
//constains
import { appInfo } from "../constains/appInfo";
const SelectImageComponent = ({ uri, onPress, style }) => {
    return (
        <TouchableOpacity style={{ flex: 1, margin: 5 }} onPress={onPress}>

            <Image
                style={style && style}
                source={{ uri: uri }}
            />
            {
                
            }
            <Feather name={'check-circle'}
                size={appInfo.heightWindows * 0.024}
                color={'#0286FF'}
                style={{ position: "absolute", bottom: 0, right: 4, width: 24, height: 24 }} />

        </TouchableOpacity>
    )
}
export default SelectImageComponent;
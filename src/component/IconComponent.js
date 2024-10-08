import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Feather from 'react-native-vector-icons/Feather';
//style
import { StyleGlobal } from '../styles/StyleGlobal'
const IconComponent = ({ name, size, color, onPress, text, borderColor, borderWidth, borderRadius, padding}) => {
    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', borderColor: borderColor, borderWidth: borderWidth, borderRadius: borderRadius, padding: padding}} 
        onPress={onPress}> 
            <Feather name={name} size={size} color={color} />
            <Text style={[StyleGlobal.textName,{marginLeft: 7}]}>{text}</Text>
        </TouchableOpacity>
    )
}
export default IconComponent;
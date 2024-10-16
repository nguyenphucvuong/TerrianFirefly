import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Feather from 'react-native-vector-icons/Feather';
//style
import { StyleGlobal } from '../styles/StyleGlobal'
const IconComponent = ({ name, size, color, onPress, text, textColor, style}) => {
    return (
        <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center'}, style]} 
        onPress={onPress}> 
            <Feather name={name} size={size} color={color} />
            <Text style={[StyleGlobal.text,{marginLeft: 7, color: textColor}]}>{text}</Text>
        </TouchableOpacity>
    )
}
export default IconComponent;
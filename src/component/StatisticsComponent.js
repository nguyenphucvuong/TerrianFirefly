import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Feather from 'react-native-vector-icons/Feather';
//style
import { StyleGlobal } from '../styles/StyleGlobal'
const StatisticsComponent = ({ quantity, name, onPress}) => {
    return (
        <TouchableOpacity style={{ alignItems: 'center'}} onPress={onPress}>
            <Text>{quantity}</Text>
            <Text style={StyleGlobal.textName} >{name}</Text>
        </TouchableOpacity>
    )
}
export default StatisticsComponent;
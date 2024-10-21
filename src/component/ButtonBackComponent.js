import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation} from '@react-navigation/native';

const ButtonBackComponent = ({color }) => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    return (
        <TouchableOpacity  onPress={() => navigation.goBack()}>
            <Feather name={'chevron-left'} size={32} color={color} />
        </TouchableOpacity>
    )
}
export default ButtonBackComponent;
import { Text, TouchableOpacity, Image } from "react-native";
import React from "react";
const SelectImageComponent = ({ uri, onPress, width, height, check }) => {
    return (
        <TouchableOpacity style={{ flex: 1, margin: 5 }} onPress={onPress}>
            <Image
                style={{ width: width, height: height, borderRadius: 20 }}
                source={{ uri: uri }}
            />
            {check && <Image style={{ position: "absolute", bottom: 0, right: 4, width: 24, height: 24 }}
                source={require('../../assets/check-circle.png')}
            />}

        </TouchableOpacity>
    )
}
export default SelectImageComponent;
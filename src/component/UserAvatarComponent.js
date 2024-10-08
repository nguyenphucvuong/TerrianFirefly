import { Text, TouchableOpacity, Image } from "react-native";
import React from "react";
//style
import { StyleGlobal } from '../styles/StyleGlobal';
//components
import  AvatarEx  from "./AvatarComponent";
const UserAvatarComponent = ({onPress, style, name}) => {
    return (
        <TouchableOpacity style={[{alignItems: 'center'}, style]} onPress={onPress}>
            <AvatarEx size={80} round={80} url={'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'} />
            <Image
                source={require('../../assets/frame_background.png')}
                style={{
                    height: 80,
                    width: 110,
                    position: 'absolute', // Chồng lên Avatar
                    borderRadius: 80,
                }}
            />
            <Text style={[StyleGlobal.textTitleContent, { top: '5%' }]}>{name}</Text>
        </TouchableOpacity>
    )
}
export default UserAvatarComponent;
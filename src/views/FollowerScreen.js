import { FlatList, View, TouchableOpacity, StyleSheet, Text} from "react-native";
import React from "react";

//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import {AvatarEx, ButtonFunctionComponent } from '../component'
const DATA = [
    { id: 1 },
    { id: 2 },
];
const FollowerScreen = () => {
    return (
        <View style={StyleGlobal.container}>
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity>
                            <View style={[styles.viewFlatList]}>
                                <AvatarEx
                                    size={50}
                                    round={20}
                                    url={'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'}
                                />
                                <View style={{ justifyContent: 'center', marginLeft: '3%' }}>
                                    <Text style={StyleGlobal.textName}>Email</Text>
                                    <Text style={StyleGlobal.text}>Tên</Text>
                                </View>
                                <ButtonFunctionComponent name2={'Theo Dõi Lại'} backgroundColor={'#FFFFFF'} colorText={'#0286FF'} style={styles.button} />
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>

    )
}
const styles = StyleSheet.create({
    viewFlatList: {
        flexDirection: 'row',
        borderColor: '#D9D9D9',
        padding: 5,
        marginBottom: appInfo.heightWindows * 0.015,
    },
    button: {
        marginLeft: 'auto',
        padding: 8,
        width: '30%',
        borderWidth: 1,
        borderColor: '#0286FF',
    },
})

export default FollowerScreen
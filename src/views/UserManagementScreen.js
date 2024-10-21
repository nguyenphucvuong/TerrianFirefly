import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { IconComponent, AvatarEx } from '../component'
const DATA = [
    { id: 1 },
    { id: 2 },
];
const UserManagementScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation\
    return (
        <View style={StyleGlobal.container}>
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('AccountDetailsScreen')}>
                                <View style={[styles.viewFlatList,{backgroundColor: ''}]}>
                                    <AvatarEx
                                        size={50}
                                        round={20}
                                        url={'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'}
                                    />
                                    <View style={{justifyContent: 'center', marginLeft: '3%'}}>
                                        <Text>Tên:</Text>
                                        <Text>Email:</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    viewFlatList: {
        flexDirection: 'row', 
        borderColor: '#D9D9D9', 
        borderWidth: 1, borderRadius: 10, 
        padding: 5, 
        marginBottom: appInfo.heightWindows * 0.015,
    },
})
export default UserManagementScreen;

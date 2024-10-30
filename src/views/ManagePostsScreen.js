import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
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
const ManagePostsScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation\
    return (
        <View style={StyleGlobal.container}>
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('ArticleDetailsScreen')}>
                                <View style={styles.viewFlatList}>
                                    <Image width={appInfo.widthWindows * 0.17} height={appInfo.heightWindows * 0.08} source={{url:'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'}}  />
                                    <View style={{ marginLeft: 10 }}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 5 }}>
                                            <AvatarEx
                                                size={40}
                                                round={20}
                                                url={'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'}
                                            />
                                            <View style={{ justifyContent: 'center', marginLeft: '3%' }}>
                                                <Text>Tên:</Text>
                                                <Text>Nội dung:</Text>
                                            </View>
                                        </View>

                                        <Text>12/10/2024</Text>

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
        alignItems: 'center',
    },
});
export default ManagePostsScreen;
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
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
const EventManagementScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation\
    const rightSwipe = () => {
        return (
            <TouchableOpacity style={{ alignSelf: 'center' }}>
                <Entypo name='circle-with-cross' size={appInfo.heightWindows * 0.05} color={'red'} />
            </TouchableOpacity>

        )

    }
    return (
        <View style={StyleGlobal.container}>
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return (
                        <Swipeable renderRightActions={rightSwipe}>
                            <TouchableOpacity onPress={() => navigation.navigate('EventManagementDetailsScreen')} >
                                <View style={styles.viewFlatList}>
                                    <Image width={appInfo.widthWindows * 0.17} height={appInfo.heightWindows * 0.08}
                                        source={{ url: 'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg' }} />

                                    <View style={{ justifyContent: 'center', marginLeft: '3%' }}>
                                        <Text>Chủ Đề:</Text>
                                        <Text>Nội dung:</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Entypo name='thumbs-up' size={appInfo.heightWindows * 0.024} color={'#D9D9D9'} />
                                            <Text style={styles.icon}>0</Text>
                                            <Entypo name='chat' size={appInfo.heightWindows * 0.024} color={'#D9D9D9'} />
                                            <Text style={styles.icon}>0</Text>
                                            <Feather name='eye' size={appInfo.heightWindows * 0.024} color={'#D9D9D9'} />
                                            <Text style={styles.icon}>0</Text>
                                            <Entypo name='link' size={appInfo.heightWindows * 0.024} color={'#D9D9D9'} />
                                            <Text style={styles.icon}>0</Text>


                                        </View>

                                    </View>

                                    <View style={{ justifyContent: 'center', marginLeft: '3%', marginLeft: 'auto' }}>
                                        <Text>Time Start</Text>
                                        <Text>Time End</Text>
                                        <IconComponent
                                            name={'hash'}
                                            size={appInfo.widthWindows * 0.040}
                                            color={'#021BFF'}
                                            text={'Hashtag'}
                                        />
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </Swipeable>
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
    icon: {
        marginLeft: '2%', 
        marginRight: '3%',
    },
});
export default EventManagementScreen;
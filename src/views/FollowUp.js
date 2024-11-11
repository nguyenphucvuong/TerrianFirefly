import { FlatList, View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from '@react-navigation/native';
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { AvatarEx, ButtonFunctionComponent } from '../component';
const TrackingScreen = () => {
    const [isClick, setIsClick] = useState({}); // Lưu trạng thái cho từng item bằng id
    //route
    const route = useRoute();
    const followUp = route.params?.followUp ?? [];
    //su ly follow
    const handleFollow = (item) => {
        // Thay đổi trạng thái dựa trên id của item
        setIsClick((prev) => ({
            ...prev,
            [item.id]: prev[item.id] === 'Followed' ? 'FollowBack' : 'Followed'
        }));
    };
    //console.log('user1234', user);
    //console.log('followUp', followUp);
    return (
        <View style={StyleGlobal.container}>
            {followUp.length !== 0 ?
                (
                    <FlatList
                        data={followUp}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isFollowing = isClick[item.id] === 'Followed';
                            return (
                                <TouchableOpacity >
                                    <View style={[styles.viewFlatList]}>
                                        <AvatarEx
                                            size={50}
                                            round={20}
                                            url={item.imgUser}
                                        />
                                        <View style={{ justifyContent: 'center', marginLeft: '3%' }}>
                                            <Text style={StyleGlobal.textName}>{item.email}</Text>
                                            <Text style={StyleGlobal.text}>{item.username}</Text>
                                        </View>
                                        <ButtonFunctionComponent
                                            name2={isFollowing ? 'Đã Theo Dõi' : 'Theo Dõi Lại'}
                                            backgroundColor={isFollowing ? '#D9D9D9' : '#FFFFFF'}
                                            colorText={isFollowing ? '#000' : '#0286FF'}
                                            style={isFollowing ? styles.button : styles.button2}
                                            onPress={() => handleFollow(item)}
                                        />

                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                ) : (
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            style={{
                                width: '70%',
                                resizeMode: 'contain'
                            }}
                            source={require('../../assets/new_empty_dark.03ebcaa.png')}
                        />
                        <Text style={{ fontSize: 16, color: '#333' }}>
                            Bạn chưa theo dõi người dùng nào!
                        </Text>
                    </View>

                )}
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
    },
    button2: {
        marginLeft: 'auto',
        padding: 8,
        width: '30%',
        borderWidth: 1,
        borderColor: '#0286FF',
    },
})

export default TrackingScreen;
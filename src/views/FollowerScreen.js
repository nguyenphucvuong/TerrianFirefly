import { FlatList, View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { AvatarEx, ButtonFunctionComponent } from '../component'
//redux
import { createFollow, deleteFollow } from "../redux/slices/FollowerSlice";

const FollowerScreen = () => {
    const followingUsers = useSelector((state) => state.follower.following);
    const followUp = useSelector((state) => state.follower.follower);
    const userID = useSelector((state) => state.user.user.user_id);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // Kiểm tra trạng thái đã theo dõi
    const followUpSet = new Set(followUp.map(f => f.user_id));

    const checkIfFollowingBack = (user) => followUpSet.has(user.user_id);
    //su ly follower
    const handleFollower = (user, isFollowingBack) => {

        // Xử lý logic cập nhật theo dõi (có thể gọi API)
        if (!isFollowingBack) {
            console.log(`Đã theo dõi: ${user.username}`);
            //theo dõi
            dispatch(createFollow({ follower_user_id: userID, user_id: user.user_id }));

        } else {
            console.log(`Đã hủy theo dõi: ${user.username}`);
            // Hủy theo dõi
            dispatch(deleteFollow({ follower_user_id: userID, user_id: user.user_id }));
        }
    };
    //console.log('followingUsers', followingUsers);
    //console.log('user', userID);


    return (
        <View style={StyleGlobal.container}>
            {followingUsers.length !== 0 ?
                (
                    <FlatList
                        data={followingUsers}
                        keyExtractor={(item) => item.user_id}
                        renderItem={({ item }) => {
                            const isFollowingBack = checkIfFollowingBack(item);
                            //console.log('isFollowingBack', isFollowingBack);
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate("PersonScreen", { userPost: item, isFromAvatar: true })} >
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
                                            name2={isFollowingBack ? 'Hủy Theo Dõi' : 'Theo Dõi Lại'}
                                            backgroundColor={isFollowingBack ? '#D9D9D9' : '#FFFFFF'}
                                            colorText={isFollowingBack ? '#000' : '#0286FF'}
                                            style={isFollowingBack ? styles.button : styles.button2}
                                            onPress={() => handleFollower(item, isFollowingBack)}
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
                            Chưa người dùng nào theo dõi!
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

export default FollowerScreen
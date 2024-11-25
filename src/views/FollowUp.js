import { FlatList, View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from '@react-navigation/native';
//styles
import { StyleGlobal } from '../styles/StyleGlobal'
//constains
import { appInfo } from '../constains/appInfo'
//components
import { AvatarEx, ButtonFunctionComponent } from '../component';
//redux
import { createFollow, deleteFollow } from "../redux/slices/FollowerSlice";
const FollowUp = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const followUp = route.params?.followUp ?? [];
    const followUp = useSelector((state) => state.follower.follower);
    const userID = useSelector((state) => state.user.user.user_id);

    //su ly unfollow
    const handleUnFollow = (user) => {
        console.log(`Đã hủy theo dõi: ${user.username}`);
        // Hủy theo dõi
        dispatch(deleteFollow({ follower_user_id: userID, user_id: user.user_id }));

    };


    //console.log('user1234', user);
    //console.log('followUp', followUp);
    return (
        <View style={StyleGlobal.container}>
            {followUp.length !== 0 ?
                (
                    <FlatList
                        data={followUp}
                        keyExtractor={(item) => item.user_id}
                        renderItem={({ item }) => {
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
                                            name2={'Đã Theo Dõi'}
                                            backgroundColor={'#D9D9D9'}
                                            colorText={'#000'}
                                            style={styles.button}
                                            onPress={() => handleUnFollow(item)}
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
                            Chưa theo dõi người dùng nào!
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

export default FollowUp;
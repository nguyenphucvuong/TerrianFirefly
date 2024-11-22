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
import { getUserFromFollowingUsers } from "../redux/slices/UserSlices";
import { createFollow } from "../redux/slices/FollowerSlice";

const FollowerScreen = () => {
    const [isClick, setIsClick] = useState(false); // Lưu trạng thái cho từng item bằng id
    const followingUsers = useSelector((state) => state.follower.following);
    const userID = useSelector((state) => state.user.user.user_id);
    const dispatch = useDispatch();
    //su ly follower
    const handleFollower = (user) => {
        // Đổi trạng thái
        setIsClick((prev) => !prev);
        //console.log('item',item);
        
        // Xử lý logic cập nhật theo dõi (có thể gọi API)
        if (!isClick) {
            console.log(`Đã theo dõi: ${isClick}`);
            // Gọi API để thêm vào danh sách theo dõi
            // const handleFollowUser = async () => {
            //     await dispatch(createFollow({ follower_user_id: userID, user_id: user.user_id }));
            //     // await dispatch(startListeningFollowers({ follower_user_id: user.user_id }));
            // }
            // handleFollowUser();
        } else {
            console.log(`Đã hủy theo dõi: ${isClick}`);
            // Gọi API để xóa khỏi danh sách theo dõi
        }
    };
    const handleFollowButton = useCallback(() => {
        const handleFollowUser = async () => {
            await dispatch(createFollow({ follower_user_id: user.user_id, user_id: userId }));
            // await dispatch(startListeningFollowers({ follower_user_id: user.user_id }));
        }
        handleFollowUser();
    });
    //console.log('followingUsers', followingUsers);
    //console.log('isClick',isClick);
    console.log('user',userID);
    

    return (
        <View style={StyleGlobal.container}>
            {followingUsers.length !== 0 ?
                (
                    <FlatList
                        data={followingUsers}
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
                                            name2={isFollowing ? 'Hủy Theo Dõi' : 'Theo Dõi Lại'}
                                            backgroundColor={isFollowing ? '#D9D9D9' : '#FFFFFF'}
                                            colorText={isFollowing ? '#000' : '#0286FF'}
                                            style={isFollowing ? styles.button : styles.button2}
                                            onPress={() => handleFollower(item)}
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
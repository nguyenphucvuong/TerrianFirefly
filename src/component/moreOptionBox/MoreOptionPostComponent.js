/* eslint-disable no-undef */

import { Animated, ScrollView, StyleSheet, Text, Easing, View } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'

import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { deleteFollow, startListeningFollowers, getFollower } from '../../redux/slices/FollowerSlice';
import { deleteFavorite, createFavorite, startListeningFavorites } from '../../redux/slices/FavoriteSlice';
import { updatePostsByField } from '../../redux/slices/PostSlice';
import { updateUser } from '../../redux/slices/UserSlices';


import { appInfo } from '../../constains/appInfo';
import { ModalPop } from '../../modals';
import {
    ButtonsComponent,
} from '..';
import Feather from 'react-native-vector-icons/Feather';
import RowComponent from "../RowComponent";
import MoreOptionItemComponent from './MoreOptionItemComponent';


// const MoreOptionPostComponent = ({ style, post_id, isFollow, user_id, post_user_id }) => {
const MoreOptionPostComponent = ({ style, post_id, user_id, post_user_id }) => {
    const [isVisible, setIsVisible] = useState(false);
    const translateY = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen
    // const translateY = useRef(new Animated.Value(0)).current; // Start offscreen

    const follower = useSelector((state) => state.follower.follower);
    const isFollow = follower.some(f => f.user_id === post_user_id);

    const favorite = useSelector(state => state.favorite.currentFavorite);
    // const [isFavorite, setIsFavorite] = useState(false);
    const isFavorite = favorite.some(f => f.post_id === post_id);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     const getFavorite = async () => {
    //         await dispatch(startListeningFavorites({ user_id: user_id }));
    //     }
    //     getFavorite();
    // }, [])


    // useEffect(() => {
    //     // console.log("object", favorite.length > 0);
    //     // console.log("favorite data", favorite);
    //     // console.log("favorite bool", favorite.length == 0);
    //     // setIsFavorite(false);
    //     if (favorite.length == 0) {
    //         // console.log("object")
    //         // setIsFavorite(false); return;
    //     }
    //     // console.log("aaa")
    //     favorite.map((item) => {
    //         if (item.user_id === user_id && item.post_id === post_id) {
    //             // setIsFavorite(true);
    //             return;
    //         }
    //     })
    // }, [favorite])


    const handleDeleteFollow = useCallback(() => {
        dispatch(deleteFollow({ follower_user_id: user_id, user_id: post_user_id }));
        // dispatch(startListeningFollowers({ follower_user_id: user_id }));
        handleHideInput();
        return;
    })

    const handleFavorite = useCallback(() => {
        if (isFavorite) {
            dispatch(deleteFavorite({ post_id: post_id, user_id: user_id }));
            // dispatch(startListeningFavorites({ post_id: post_id, user_id: user_id }));
            handleHideInput();
        } else {
            dispatch(createFavorite({ post_id: post_id, user_id: user_id }));
            // dispatch(startListeningFavorites({ post_id: post_id, user_id: user_id }));
            handleHideInput();
        }
    })

    const handleReport = useCallback(() => {
        dispatch(updatePostsByField({ post_id: post_id, field: "status_post_id", value: 1 }));
        dispatch(updateUser({ user_id: post_user_id, field: "status_user_id", value: 1 }));
        handleHideInput();
    })

    const userFollowCheck = () => {
        if (user_id === post_user_id) {
            return false;
        } else if (isFollow) {

            return isFollow;
        }
        return false;
    }

    const userFavoriteCheck = () => {
        if (user_id === post_user_id) {
            return false;
        }
        return true;
    }

    const handleShowInput = () => {

        // isVisible = !isVisible;
        Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(setIsVisible(true));
    };

    const handleHideInput = () => {
        // isVisible = !isVisible
        Animated.timing(translateY, {
            toValue: appInfo.heightWindows,
            duration: 400,
            useNativeDriver: true,
        }).start(() => setIsVisible(false));
    };

    const ModalShow = () => {
        return (
            <ModalPop
                visible={isVisible}
                transparent={true}
                onRequestClose={handleHideInput}>
                <Animated.View style={[styles.animatedContainer, { transform: [{ translateY }] }]}>
                    <RowComponent width={"100%"} height={"auto"} style={{
                        // backgroundColor: "pink",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <ButtonsComponent isButton onPress={handleHideInput}>
                            <Image
                                // eslint-disable-next-line no-undef
                                source={require('../../../assets/appIcons/close_icon.png')}
                                style={{
                                    height: 30,
                                    width: 30,
                                }}
                            />
                        </ButtonsComponent>
                        <Text style={{
                            flex: 1,
                            color: "gray",
                            textAlign: "center",
                            paddingRight: 30,
                            // backgroundColor: 'pink',
                            fontSize: 17,
                            fontWeight: "bold",
                        }}>
                            Lựa Chọn
                        </Text>
                    </RowComponent>


                    <RowComponent width={"100%"} height={"auto"}
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: "rgba(0,0,0,0.1)",
                        }}>
                        <ScrollView
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            style={{
                            }}>

                            {/* Hủy theo dõi */}
                            {userFollowCheck() ?
                                <MoreOptionItemComponent
                                    isRow
                                    url={require('../../../assets/appIcons/sad-unfollow.png')}
                                    text={"Hủy theo dõi"}
                                    onPress={handleDeleteFollow} /> : <></>}
                            {/* Yêu thích */}
                            {userFavoriteCheck() ?
                                !isFavorite ?
                                    <MoreOptionItemComponent
                                        isRow
                                        url={require('../../../assets/appIcons/favorite.png')}
                                        text={"Yêu thích"}
                                        onPress={handleFavorite} />
                                    :
                                    <MoreOptionItemComponent
                                        isRow
                                        url={require('../../../assets/appIcons/unfavorite.png')}
                                        text={"Hủy yêu thích"}
                                        onPress={handleFavorite} />
                                : <></>}
                            {/* Báo cáo */}
                            <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/report-flag.png')}
                                text={"Báo cáo"}
                                onPress={handleReport} />
                            {/* Xoá bài viết */}
                            {/* {!userPostCheck() ? <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/favorite.png')}
                                text={"Xoá bài viết"}
                                onPress={() => console.log("Twitter")} /> : <></>} */}
                        </ScrollView>
                    </RowComponent>
                </Animated.View>
            </ModalPop>
        )
    }

    // useEffect(() => {
    //     modalShow();
    // }, [isVisible])

    return (
        <>
            <ButtonsComponent isButton onPress={handleShowInput}
                style={[{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "30%",
                    height: "auto",
                    // backgroundColor: "pink",
                }, style && style]}>
                <Image
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    source={require('../../../assets/appIcons/dots_vertical-512.jpg')}
                    contentFit="cover" />


            </ButtonsComponent>
            <ModalShow />
        </>
    )
}

export default MoreOptionPostComponent

const styles = StyleSheet.create({
    animatedContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,

    },


})
/* eslint-disable no-undef */

import { Animated, ScrollView, StyleSheet, Text, Easing, View } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'

import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { deleteFollow } from '../../redux/slices/FollowerSlice';
import { deleteFavorite, createFavorite, startListeningFavorites } from '../../redux/slices/FavoriteSlice';
import { updatePostsByField } from '../../redux/slices/PostSlice';
import { updateUserState } from '../../redux/slices/UserSlices';


import { appInfo } from '../../constains/appInfo';
import { ModalPop } from '../../modals';
import {
    ButtonsComponent,
} from '..';
import Feather from 'react-native-vector-icons/Feather';
import RowComponent from "../RowComponent";
import MoreOptionItemComponent from './MoreOptionItemComponent';
import { updateCommentByField } from '../../redux/slices/CommentSlice';
import { updateSubCommentByField } from '../../redux/slices/SubCommentSlice';
import { createReport } from '../../redux/slices/ReportSilce';
import { createNoti } from '../../redux/slices/NotiSlice';


// const MoreOptionPostComponent = ({ style, post_id, isFollow, user_id, post_user_id }) => {
const MoreOptionPostComponent = ({ style, post_id, comment_id, sub_comment_id, user_id, post_user_id, comment_user_id, sub_comment_user_id, isWhiteDot, size, isComment, isSubCmt }) => {
    const [isVisible, setIsVisible] = useState(false);
    const translateY = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen
    // const translateY = useRef(new Animated.Value(0)).current; // Start offscreen

    const follower = useSelector((state) => state.follower.follower);
    const isFollow = follower.some(f => f.user_id === post_user_id);
    const favorite = useSelector(state => state.favorite.currentFavorite);
    // const [isFavorite, setIsFavorite] = useState(false);
    const isFavorite = favorite.some(f => f.post_id === post_id);

    const currentUser = useSelector((state) => state.user.user);



    // useEffect(() => {
    //     console.log("user_id", user_id);
    //     console.log("comment_user_id", comment_user_id);
    //     console.log("sub_comment_user_id", sub_comment_user_id);
    // }, [comment_user_id, user_id, sub_comment_user_id])

    const dispatch = useDispatch();


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

    const dataReport = {
        report_id: "",
        item_id: isComment ? comment_id : isSubCmt ? sub_comment_id : post_id,
        item_type: isComment ? "comment" : isSubCmt ? "sub_comment" : "post",
        status: 0,
        reported_at: Date.now(),
        status_changed_at: null,
        user_id_reported: isComment ? comment_user_id : isSubCmt ? sub_comment_user_id : post_user_id,
        user_id_reporter: user_id,
    }


    const handleReport = useCallback(() => {
        if (isComment) {
            console.log("Báo cáo bình luận");
            // dispatch(updateUserState({ user_id: comment_user_id, field: "status_user_id", value: 1 }));
            dispatch(updateCommentByField({ comment_id: comment_id, field: "comment_status_id", value: 1 }));
            
            dispatch(createReport(dataReport));
            
        } else if (isSubCmt) {
            console.log("Báo cáo bình luận phụ");
            // dispatch(updateUserState({ user_id: sub_comment_user_id, field: "status_user_id", value: 1 }));
            dispatch(updateSubCommentByField({ sub_comment_id: sub_comment_id, field: "sub_comment_status_id", value: 1 }));
            dispatch(createReport(dataReport));
        } else {
            console.log("Báo cáo bài viết");
            // console.log(comment_user_id, sub_comment_user_id, post_user_id);
            // dispatch(updateUserState({ user_id: post_user_id, field: "status_user_id", value: 1 }));
            dispatch(updatePostsByField({ post_id: post_id, field: "status_post_id", value: 1 }));
            dispatch(createReport(dataReport)); 

            dispatch(
                createNoti({
                  post_id: post_id,
                  user_id: user_id,
                  targetUser_id: isComment ? comment_user_id : isSubCmt ? sub_comment_user_id : post_user_id,
                  check_touch: false,
                  checked: false,
                  content: `${currentUser.username} đã báo cáo bài viết của bạn`,
                  created_at: Date.now(),
                  imgUser: currentUser.imgUser,
                  role_noti: 2,
                  noti_id: "temp",
                })
              );
        }
        handleHideInput();
    })

    const handleDeletePost = useCallback(() => {
        dispatch(updatePostsByField({ post_id: post_id, field: "status_post_id", value: 2 }));
    })
    const handleDeleteComment = useCallback(() => {
        dispatch(updateCommentByField({ comment_id: comment_id, field: "comment_status_id", value: 2 }));
    })
    const handleDeleteSubComment = useCallback(() => {
        dispatch(updateCommentByField({ comment_id: comment_id, field: "sub_comment_status_id", value: 2 }));
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

                            {/* Ẩn bài viết */}
                            {currentUser.status_user_id == 2 ? null :
                                !isComment && !isSubCmt ?
                                    user_id === post_user_id ?
                                        <MoreOptionItemComponent
                                            isRow
                                            styleImg={{ width: 30, height: 30 }}
                                            url={require('../../../assets/appIcons/hide-eye.png')}
                                            text={"Xóa bài viết"}
                                            onPress={handleDeletePost} /> : null : null
                            }

                            {/* Ẩn bình luận */}
                            {currentUser.status_user_id == 2 ? null :
                                isComment ?
                                    user_id === comment_user_id ?
                                        <MoreOptionItemComponent
                                            isRow
                                            styleImg={{ width: 30, height: 30 }}
                                            url={require('../../../assets/appIcons/hide-eye.png')}
                                            text={"Xóa bình luận"}
                                            onPress={handleDeleteComment} /> : <></> : <></>}

                            {/* Ẩn bình luận phụ */}
                            {currentUser.status_user_id == 2 ? null :
                                isSubCmt ?
                                    user_id === sub_comment_user_id ?
                                        <MoreOptionItemComponent
                                            isRow
                                            styleImg={{ width: 30, height: 30 }}
                                            url={require('../../../assets/appIcons/hide-eye.png')}
                                            text={"Xóa bình luận phụ"}
                                            onPress={handleDeleteSubComment} /> : <></> : <></>}

                            {/* Hủy theo dõi */}
                            {currentUser.status_user_id == 2 ? null :
                                isComment || isSubCmt ? <></> :
                                    userFollowCheck() ?
                                        <MoreOptionItemComponent
                                            isRow
                                            url={require('../../../assets/appIcons/sad-unfollow.png')}
                                            text={"Hủy theo dõi"}
                                            onPress={handleDeleteFollow} /> : <></>}
                            {/* Yêu thích */}
                            {/* {userFavoriteCheck() ? */}
                            {currentUser.status_user_id == 2 ? null :
                                isComment || isSubCmt ? null :
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
                            }
                            {/* : <></>} */}
                            {/* Báo cáo */}
                            {currentUser.status_user_id == 2 ? null :
                                <MoreOptionItemComponent
                                    isRow
                                    url={require('../../../assets/appIcons/report-flag.png')}
                                    text={"Báo cáo"}
                                    onPress={handleReport} />}
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
                    alignItems: isWhiteDot ? "flex-end" : "center",
                    width: isWhiteDot ? "100%" : "100%",
                    height: "auto",
                    // backgroundColor: "pink",
                }, style && style]}>
                <Feather name='more-vertical' color={isWhiteDot ? "white" : "black"} size={size ? size : 24} />


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
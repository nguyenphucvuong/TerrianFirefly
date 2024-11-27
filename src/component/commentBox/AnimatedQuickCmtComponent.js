/* eslint-disable no-undef */
import React, { useRef, useState, useEffect, useContext } from 'react';
import { TextInput, Animated, Pressable, Easing, View, StyleSheet, Text, TouchableOpacity, ToastAndroid, Platform } from 'react-native';


import { Image } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";


import { appInfo } from '../../constains/appInfo';


import RowComponent from '../RowComponent';
import {
    AvatarEx,
} from '..';
import { ModalPop } from '../../modals'
import CmtBoxComponent from './CmtBoxComponent';
import { ButtonsComponent } from '../';
import PostButton from './PostButton';
import { count } from 'firebase/firestore';
import { ImageCheckContext } from '../../context/ImageProvider';




const AnimatedQuickCmtComponent = ({ isNomal, isImgIn, post, userPost, style, handleNagigateDetailPost, isSubCmt, user, comment_id }) => {
    // const [expanded, setExpanded] = useState(false);
    // const [isNomal] = [info.isNomal];
    var expanded = false;
    const animation = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();

    // const currentAchievementUser = useSelector((state) => state.achievement[user.achie_id]);
    const currentAchievementUser = useSelector((state) => state.achievement[user?.achie_id]) || null;





    const toggleExpand = (() => {
        // setExpanded(!expanded);
        expanded = !expanded;
        Animated.timing(animation, {
            toValue: expanded ? 1 : 0,
            duration: 400,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.ease),

        }).start();
    });

    const height = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 50], // Adjust the outputRange values as per your requirement
    });

    const HandleIsEmpty = (data) => {
        const view = data.view;
        const length = data.length;
        return length === 0 ? <></> : view;
    }
    const [isVisible, setIsVisible] = useState(false);
    // const [isShowEmojiBox, setIsShowEmojiBox] = useState(false);
    const translateY = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen
    // const translateYEmoji = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen

    const handleShowPop = () => {
        setIsVisible(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    // const handleShowPopEmoji = () => {
    //     setIsShowEmojiBox(true);
    //     Animated.timing(translateYEmoji, {
    //         toValue: 0,
    //         duration: 300,
    //         useNativeDriver: true,
    //     }).start();
    // };

    const setFalse = () => {
        setIsVisible(false);
        // setIsShowEmojiBox(false);
    }




    const handleHidePop = () => {
        Animated.timing(translateY, {
            toValue: appInfo.heightWindows,
            duration: 300,
            useNativeDriver: true,
        }).start(setFalse());
        // Animated.timing(translateYEmoji, {
        //     toValue: appInfo.heightWindows,
        //     duration: 300,
        //     useNativeDriver: true,
        // }).start(setFalse());
    };
    const handleLikePressed = () => {
        handleShowPop();
    }
    const user_id = user?.user_id;
    // console.log("user_id", post.post_id, user_id, content);



    // const ModalPopCmt = () => {
    //     return()
    // }

    return !isNomal ? (
        <>
            {/* Quick Comment */}
            <Animated.View style={{ height, overflow: 'hidden', marginTop: 10 }}>
                {/* <Animated.View style={{ overflow: 'hidden', marginTop: 10 }}> */}
                <RowComponent
                    height={40}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                    }}>
                    <AvatarEx size={40} round={30} url={user.imgUser} style={{ marginRight: "3%" }} frame={currentAchievementUser?.nameAchie} />
                    <Pressable
                        onPress={handleLikePressed}
                        style={{
                            width: "100%",
                            height: 30,
                            flex: 1,
                            borderRadius: 30,
                            borderColor: "gray",
                            borderWidth: 1,
                            paddingLeft: 10,
                            paddingRight: 10,
                        }}>
                        <TextInput
                            placeholder="Viết bình luận..."
                            editable={false}
                        />
                    </Pressable>

                </RowComponent>
            </Animated.View>


            {/* Quick Comment Box */}
            <ModalPop
                visible={isVisible}
                transparent={true}
                onRequestClose={handleHidePop}
            >
                <CmtBoxComponent translateY={translateY} handleHidePop={handleHidePop} post={post} user_id={user_id} />
            </ModalPop>



            {/* Like, Comment, View */}
            < HandleIsEmpty
                length={post.post_id.length}
                view={
                    // <PostButton toggleExpand={toggleExpand} handleShowPopEmoji={handleShowPopEmoji} data={data} />
                    < PostButton toggleExpand={toggleExpand} post={post} user={user} user_post={userPost} handleShowPop={handleShowPop} handleNagigateDetailPost={handleNagigateDetailPost} />
                }
            />
        </>
    ) : (
        <>

            <RowComponent
                height={"100%"}

                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    paddingHorizontal: "3%",
                    width: "100%"
                }}>
                {isImgIn ? <AvatarEx size={33} round={30} url={user.imgUser} frame={currentAchievementUser?.nameAchie} style={{ position: "relative", marginRight: "3%" }} /> : <></>}

                <Pressable onPress={handleShowPop} style={{
                    with: "100%",
                    height: !isImgIn ? "80%" : "65%",
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    borderRadius: 30,
                    borderWidth: !isImgIn ? 0 : 1,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: !isImgIn ? "#D8D8D833" : "",
                    borderColor: !isImgIn ? "" : "#ABABAB",
                }}
                >
                    {!isImgIn ? <AvatarEx size={30} round={30} url={user.imgUser} frame={currentAchievementUser?.nameAchie} style={{ position: "relative", }} /> : <></>}
                    <View style={{ width: 10 }} />
                    <TextInput
                        placeholderTextColor={!isImgIn ? "white" : "#ABABAB"}
                        placeholder={!isImgIn ? "Viết bình luận..." : "Tôi có lời muốn nói..."}
                        editable={false}
                    />
                </Pressable>
                {/* Quick Comment Box */}
                <ModalPop
                    visible={isVisible}
                    transparent={true}
                    onRequestClose={handleHidePop}
                >
                    {!isSubCmt ? <CmtBoxComponent translateY={translateY} handleHidePop={handleHidePop} post={post} user_id={user_id} />
                        : <CmtBoxComponent translateY={translateY} handleHidePop={handleHidePop} user_id={user_id} comment_id={comment_id} isSubCmt />}
                </ModalPop>

            </RowComponent>

        </>
    )




};

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
    inputQuickCmt: {
        paddingVertical: 10,
        marginVertical: 10,
        height: 100,
        textAlignVertical: 'top',
        // backgroundColor: '#f0f0f0',
    },

})

export default React.memo(AnimatedQuickCmtComponent);

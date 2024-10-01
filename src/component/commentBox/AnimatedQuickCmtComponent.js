/* eslint-disable no-undef */
import React, { useRef, useState } from 'react';
import { TextInput, Animated, Pressable, Easing, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { appInfo } from '../../constains/appInfo';
import RowComponent from '../RowComponent';
import {
    AvatarEx,
} from '..';
import { ModalPop } from '../../modals'
import CmtBoxComponent from './CmtBoxComponent';

import { data } from '../../constains/data'
import PostButton from './PostButton';
import { Image } from 'expo-image';



const AnimatedQuickCmtComponent = (info) => {
    // const [expanded, setExpanded] = useState(false);
    const [isNomal] = [info.isNomal];
    var expanded = false;
    const animation = useRef(new Animated.Value(0)).current;


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

    const handleLikePressed = () => {
        handleShowPop();
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
                    <AvatarEx size={40} round={30} url={data.user.avatar} style={{ marginRight: "3%" }} />
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
                <CmtBoxComponent translateY={translateY} handleHideInput={handleHidePop} />
            </ModalPop>

            {/* Emoji Box */}
            {/* <ModalPop
                visible={isShowEmojiBox}
                transparent={true}
                onRequestClose={handleHidePop}
            >
                <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: translateYEmoji }], flexDirection: "column" }]}>
                    <Text style={{
                        color: "gray",
                        fontSize: 15,
                        fontWeight: "semibold",
                        textAlign: "center",
                        paddingBottom: 20,
                    }}>Chọn biểu cảm</Text>
                    <RowComponent width={"100%"} height={"auto"} style={{
                        // backgroundColor: "pink",
                    }}>
                        <TouchableOpacity onPress={handleHidePop} style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/like-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleHidePop} style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/heart-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleHidePop} style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/laugh-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleHidePop} style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/sad-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>


                    </RowComponent>
                </Animated.View >

            </ModalPop> */}

            {/* Like, Comment, View */}
            <HandleIsEmpty
                length={data.post.idPost.length}
                view={
                    // <PostButton toggleExpand={toggleExpand} handleShowPopEmoji={handleShowPopEmoji} data={data} />
                    <PostButton toggleExpand={toggleExpand} data={data} handleShowPop={handleShowPop} />
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

                }}>
                <Pressable onPress={handleShowPop} style={{
                    with: "100%",
                    height: "80%",
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    borderRadius: 30,
                    borderWidth: 1,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: "#D8D8D833",
                }}
                >
                    <AvatarEx size={30} round={30} url={data.user.avatar} style={{ position: "relative", }} />
                    <View style={{ width: 10 }} />
                    <TextInput
                        placeholderTextColor={"white"}
                        placeholder="Viết bình luận..."
                        editable={false}
                    />
                </Pressable>
                {/* Quick Comment Box */}
                <ModalPop
                    visible={isVisible}
                    transparent={true}
                    onRequestClose={handleHidePop}
                >
                    <CmtBoxComponent translateY={translateY} handleHideInput={handleHidePop} />
                </ModalPop>

            </RowComponent>
        </>
    );
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

})

export default AnimatedQuickCmtComponent;

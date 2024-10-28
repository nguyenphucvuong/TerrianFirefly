/* eslint-disable no-undef */
import React, { useRef, useState, useEffect, useContext } from 'react';
import { TextInput, Animated, Pressable, Easing, View, StyleSheet, Text, TouchableOpacity } from 'react-native';


import { Image } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";


import { appInfo } from '../../constains/appInfo';
import RowComponent from '../RowComponent';
import {
    AvatarEx,
} from '..';
import { ModalPop } from '../../modals'
import CmtBoxComponent from './CmtBoxComponent';
import { ButtonsComponent } from '../';

// import { data } from '../../constains/data'
import PostButton from './PostButton';
import { count } from 'firebase/firestore';
import { useSelector, useDispatch } from "react-redux";
import { createComment, getComment } from '../../redux/slices/CommentSlice';
import { ImageCheckContext } from '../../context/ImageProvider';




const AnimatedQuickCmtComponent = ({ isNomal, isImgIn, post, userPost, emoji, style, handleNagigateDetailPost, isSubCmt }) => {
    // const [expanded, setExpanded] = useState(false);
    // const [isNomal] = [info.isNomal];
    var expanded = false;
    const animation = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();

    const image = useContext(ImageCheckContext).image
    const setImage = useContext(ImageCheckContext).setImage
    const predictions = useContext(ImageCheckContext).predictions
    const selectImage = useContext(ImageCheckContext).selectImage
    const modelReady = useContext(ImageCheckContext).modelReady




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

    const [content, setContent] = useState("")

    const dataCmt = !isImgIn ? {
        comment_id: "",
        post_id: post.post_id,
        user_id: "truongthien1410@gmail.com",
        content: content,
        count_like: 0,
        count_comment: 0,
        created_at: Date.now(),
        img_id: "",
    } : {
        sub_comment_id: "",
        comment_id: "",
        user_id: "truongthien1410@gmail.com",
        content: content,
        count_like: 0,
        created_at: Date.now(),
        img_id: "",
    }

    const btnDangComment = () => {
        dispatch(createComment(dataCmt))
        handleHidePop();
    }

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
                    <AvatarEx size={40} round={30} url={userPost.avatar} style={{ marginRight: "3%" }} />
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
                <Animated.View style={[styles.animatedContainer, { transform: [{ translateY }] }]}>
                    <RowComponent width={"100%"} height={"auto"} style={{
                        // backgroundColor: "pink",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Text style={{
                            flex: 1,
                            color: "gray",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            Đăng bình luận
                        </Text>
                        <ButtonsComponent isButton onPress={handleHidePop}>
                            <Image

                                source={require('../../../assets/appIcons/close_icon.png')}
                                style={{
                                    height: 30,
                                    width: 30,
                                }}
                            />
                        </ButtonsComponent>

                    </RowComponent>
                    <TextInput
                        placeholder="Tôi có lời muốn nói..."
                        placeholderTextColor={"rgba(0,0,0,0.3)"}
                        style={[styles.inputQuickCmt, {
                            height: "auto",
                        }]}
                        autoFocus={true}
                        multiline
                        onChangeText={(text) => setContent(text)}
                    />

                    <View style={{
                        borderBottomWidth: 1,
                        borderColor: "rgba(0,0,0,0.1)",
                        width: appInfo.widthWindows,
                        left: -20,
                    }}>
                        {/* Image */}
                        {image && <View
                            style={{
                                width: 200,
                                height: 200,
                                backgroundColor: "red",
                            }}>
                            {<>
                                <TouchableOpacity
                                    style={{
                                        width: 25,
                                        height: 25,
                                        backgroundColor: "green",
                                        position: "absolute",
                                        zIndex: 1,
                                        top: 0,
                                        right: 0,
                                    }} >
                                    <Image source={require('../../../assets/appIcons/close_icon.png')}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            contentFit: "cover",
                                        }} />
                                </TouchableOpacity>
                                {image && <Image source={image}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        contentFit: "cover",
                                    }} />}
                            </>}
                        </View>}

                    </View>
                    <View style={{
                        flex: 1,
                        // backgroundColor: "pink",
                        width: "100%",
                        height: 35,
                        flexDirection: "row",
                        marginTop: 10,
                    }}>
                        {/* Choose Image */}
                        <ButtonsComponent
                            isButton
                            onPress={modelReady ? selectImage : undefined}
                            style={{
                                // backgroundColor: "red",
                                marginRight: 10,
                                justifyContent: "center",
                                width: "70%"
                            }}>

                            <Image
                                style={{
                                    width: 28,
                                    height: 28,
                                }}
                                source={require('../../../assets/appIcons/image-choose.png')} />
                        </ButtonsComponent>

                        <LinearGradient
                            start={{ x: 0, y: 0 }} end={{ x: 0.1999, y: 0 }}
                            colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}

                            style={{
                                paddingLeft: "8.5%",
                                width: "auto",
                                height: "100%",
                            }}
                        >
                            <ButtonsComponent
                                isButton
                                onPress={btnDangComment}
                                style={{
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: 65,
                                    height: "100%",
                                    paddingHorizontal: "2%",
                                    backgroundColor: "rgba(101,128,255,1)",

                                }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 12,
                                    }} >Đăng</Text>
                            </ButtonsComponent>
                        </LinearGradient>

                    </View>
                </Animated.View >
            </ModalPop >



            {/* Like, Comment, View */}
            < HandleIsEmpty
                length={post.post_id.length}
                view={
                    // <PostButton toggleExpand={toggleExpand} handleShowPopEmoji={handleShowPopEmoji} data={data} />
                    < PostButton toggleExpand={toggleExpand} post={post} user={userPost} emoji={emoji} handleShowPop={handleShowPop} handleNagigateDetailPost={handleNagigateDetailPost} />
                }
            />
        </>
    ) : (
        <>
            {!isImgIn ?
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
                        <AvatarEx size={30} round={30} url={userPost.avatar} style={{ position: "relative", }} />
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
                :
                <RowComponent
                    height={"100%"}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                        paddingHorizontal: "3%",

                    }}>
                    <AvatarEx size={33} round={30} url={userPost.avatar} style={{ position: "relative", marginRight: "3%" }} />

                    <Pressable onPress={handleShowPop} style={{
                        with: "100%",
                        height: "65%",
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                        borderRadius: 30,
                        borderWidth: 1,
                        paddingLeft: 10,
                        paddingRight: 10,
                        // backgroundColor: "#D8D8D833",
                        borderColor: "#ABABAB",
                    }}
                    >
                        <View style={{ width: 10 }} />
                        <TextInput
                            placeholderTextColor={"#ABABAB"}
                            placeholder="Tôi có lời muốn nói..."
                            editable={false}
                        />
                    </Pressable>
                    {/* Quick Comment Box */}
                    <ModalPop
                        visible={isVisible}
                        transparent={true}
                        onRequestClose={handleHidePop}
                    >
                        <Animated.View style={[styles.animatedContainer, { transform: [{ translateY }] }]}>
                            <RowComponent width={"100%"} height={"auto"} style={{
                                // backgroundColor: "pink",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Text style={{
                                    flex: 1,
                                    color: "gray",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    Đăng bình luận
                                </Text>
                                <ButtonsComponent isButton onPress={handleHidePop}>
                                    <Image

                                        source={require('../../../assets/appIcons/close_icon.png')}
                                        style={{
                                            height: 30,
                                            width: 30,
                                        }}
                                    />
                                </ButtonsComponent>

                            </RowComponent>
                            <TextInput
                                placeholder="Tôi có lời muốn nói..."
                                placeholderTextColor={"rgba(0,0,0,0.3)"}
                                style={[styles.inputQuickCmt, {
                                    height: "auto",

                                }]}
                                autoFocus={true}
                                multiline
                                onChangeText={(text) => setContent(text)}
                            />

                            <View style={{
                                borderBottomWidth: 1,
                                borderColor: "rgba(0,0,0,0.1)",
                                width: appInfo.widthWindows,
                                left: -20,
                            }}>

                                {/* Image */}
                                <View
                                    style={{
                                        width: 200,
                                        height: 200,
                                        // backgroundColor: "red",
                                    }}>
                                    <TouchableOpacity
                                        style={{
                                            width: 25,
                                            height: 25,
                                            // backgroundColor: "green",
                                            position: "absolute",
                                            zIndex: 1,
                                            top: 0,
                                            right: 0,
                                        }} >
                                        <Image source={require('../../../assets/appIcons/close_icon.png')}
                                            style={{
                                                width: 25,
                                                height: 25,
                                                contentFit: "cover",
                                            }} />
                                    </TouchableOpacity>
                                    <Image source={require('../../../assets/appIcons/image-choose.png')}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            contentFit: "cover",
                                        }} />
                                </View>

                            </View>
                            <View style={{
                                flex: 1,
                                // backgroundColor: "pink",
                                width: "100%",
                                height: 35,
                                flexDirection: "row",
                                marginTop: 10,
                            }}>
                                {/* Choose Image */}
                                {<ButtonsComponent
                                    isButton
                                    // onPress={aaaaa}
                                    style={{
                                        // backgroundColor: "red",
                                        marginRight: 10,
                                        justifyContent: "center",
                                        width: "70%"
                                    }}>
                                    <Image
                                        style={{
                                            width: 28,
                                            height: 28,
                                        }}
                                        source={require('../../../assets/appIcons/image-choose.png')} />
                                </ButtonsComponent>}

                                <LinearGradient
                                    start={{ x: 0, y: 0 }} end={{ x: 0.1999, y: 0 }}
                                    colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}

                                    style={{
                                        paddingLeft: "8.5%",
                                        width: "auto",
                                        height: "100%",
                                    }}
                                >
                                    <ButtonsComponent
                                        isButton
                                        // onPress={touchss}
                                        style={{
                                            borderRadius: 30,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 65,
                                            height: "100%",
                                            paddingHorizontal: "2%",
                                            backgroundColor: "rgba(101,128,255,1)",

                                        }}>
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 12,
                                            }} >Đăng</Text>
                                    </ButtonsComponent>
                                </LinearGradient>

                            </View>
                        </Animated.View >
                    </ModalPop >

                </RowComponent>}
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
    inputQuickCmt: {
        paddingVertical: 10,
        marginVertical: 10,
        height: 100,
        textAlignVertical: 'top',
        // backgroundColor: '#f0f0f0',
    },

})

export default AnimatedQuickCmtComponent;

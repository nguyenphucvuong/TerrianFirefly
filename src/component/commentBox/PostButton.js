/* eslint-disable no-undef */
import { Text, View, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Image } from 'expo-image'
import { useDispatch, useSelector } from 'react-redux'
import { createEmoji, deleteEmoji, startListeningEmoji } from '../../redux/slices/EmojiSlice'


import RowComponent from '../RowComponent'
import ButtonsComponent from '../ButtonsComponent'
import { StyleGlobal } from '../../styles/StyleGlobal'
// import { data } from '../../constains/data'
import { ModalPop } from '../../modals'
import { appInfo } from '../../constains/appInfo'


const formatNumber = (num) => {
    // console.log(num)
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B'; // tỷ
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M'; // triệu
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K'; // nghìn
    } else {
        return num.toString(); // số bình thường
    }
};
const PostButton = ({ toggleExpand, handleShowPop, post, user, handleNagigateDetailPost }) => {


    const dataPostView = formatNumber(post.count_view);
    const dataPostCmt = null; // chưa có dữ liệu tạm thời để trống
    const dataPostEmoji = formatNumber(post.count_emoji);
    const [isShowEmojiBox, setIsShowEmojiBox] = useState(false);

    const translateYEmoji = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen

    const [isPressLike, setIsPressLike] = useState(false);

    const dispatch = useDispatch();

    const [iconEmoji, setIconEmoji] = useState("../../../assets/emojiIcons/like-out-emoji.png");
    const emoji = useSelector(state => state.emoji.currentEmoji);


    useEffect(() => {
        const getEmoji = async () => {
            // await dispatch(startListeningEmoji({ post_id: post.id, user_id: user.user_id }));
            if (emoji.count_like > 0) {
                setIconEmoji("like");
            } else if (emoji.count_heart > 0) {
                setIconEmoji("heart");
            } else if (emoji.count_laugh > 0) {
                setIconEmoji("laugh");
            } else if (emoji.count_sad > 0) {
                setIconEmoji("sad");
            } else {
                setIconEmoji("default");
            }
        };
        getEmoji();
    }, []);

    const handleDeleteEmoji = async () => {
        await dispatch(deleteEmoji({ post_id: post.post_id, user_id: user.user_id }));
        setIconEmoji("default");
    }
    const handleBtnEmoji = async (emoji) => {
        if (emoji === "like") {
            if (emoji.count_heart > 0) {
                handleDeleteEmoji();
                return;
            }
            dispatch(createEmoji({
                emoji_id: "",
                post_id: post.post_id,
                user_id: user.user_id,
                isComment: false,
                comment_id: "",
                count_like: 1,
                count_heart: 0,
                count_laugh: 0,
                count_sad: 0,
            }));
            setIconEmoji("like");
        } else if (emoji === "heart") {
            if (emoji.count_heart > 0) {
                handleDeleteEmoji();
                return;
            }
            dispatch(createEmoji({
                emoji_id: "",
                post_id: post.post_id,
                user_id: user.user_id,
                isComment: false,
                comment_id: "",
                count_like: 0,
                count_heart: 1,
                count_laugh: 0,
                count_sad: 0,
            }));
            setIconEmoji("heart");
        } else if (emoji === "laugh") {
            if (emoji.count_laugh > 0) {
                handleDeleteEmoji();
                return;
            }
            dispatch(createEmoji({
                emoji_id: "",
                post_id: post.post_id,
                user_id: user.user_id,
                isComment: false,
                comment_id: "",
                count_like: 0,
                count_heart: 0,
                count_laugh: 1,
                count_sad: 0,
            }));
            setIconEmoji("../../../assets/emojiIcons/laugh-emoji.png");
        } else if (emoji === "sad") {
            if (emoji.count_sad > 0) {
                handleDeleteEmoji();
                return;
            }
            dispatch(createEmoji({
                emoji_id: "",
                post_id: post.post_id,
                user_id: user.user_id,
                isComment: false,
                comment_id: "",
                count_like: 0,
                count_heart: 0,
                count_laugh: 0,
                count_sad: 1,
            }));
            setIconEmoji("sad");
        }
        await dispatch(startListeningEmoji({ post_id: post.id, user_id: user.user_id }));
        handleHidePop();
    }

    const getIconImg = (emoji) => {
        switch (emoji) {
            case "like":
                return require("../../../assets/emojiIcons/like-emoji.png");
            case "heart":
                return require("../../../assets/emojiIcons/heart-emoji.png");
            case "laugh":
                return require("../../../assets/emojiIcons/laugh-emoji.png");
            case "sad":
                return require("../../../assets/emojiIcons/sad-emoji.png");
            case "default":
                return require("../../../assets/appIcons/like-out-post.png");
            default:
                return require("../../../assets/appIcons/like-out-post.png");
        }
    }

    // const dataEmoji = {
    //     emoji_id: "",
    //     post_id: post.post_id,
    //     user_id: user.user_id,
    //     isComment: false,
    //     comment_id: "",
    //     count_like: count_like,
    //     count_heart: count_heart,
    //     count_laugh: count_laugh,
    //     count_sad: count_sad,
    // }



    const setFalse = () => {
        // setIsVisible(false);
        setIsShowEmojiBox(false);
        setIsPressLike(false);
    }
    const handlePressLike = () => {
        setIsPressLike(!isPressLike);
        toggleExpand();
    }

    const handleShowPopEmoji = () => {
        setIsShowEmojiBox(true);
        Animated.timing(translateYEmoji, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    const handleHidePop = () => {

        Animated.timing(translateYEmoji, {
            toValue: appInfo.heightWindows,
            duration: 300,
            useNativeDriver: true,
        }).start(setFalse());
    };

    return (
        <RowComponent
            height={40}
            style={{
                flexDirection: "row",
            }}>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    flex: 2,
                    flexDirection: "row",
                }}
            >
                <ButtonsComponent isButton
                    style={{
                        marginRight: "2%",
                    }}>
                    <Image
                        style={{
                            width: 20,
                            height: 20,
                        }}
                        source={require('../../../assets/appIcons/view-out-post.png')}
                        contentFit="cover"
                    />
                </ButtonsComponent>
                <Text
                    style={[StyleGlobal.text, {

                        color: "gray",
                    }]}> {dataPostView}</Text>
            </View>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    flexDirection: "row",
                    right: "5%",
                }}
            >
                <View
                    style={{
                        width: "auto",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                    }}>
                    <ButtonsComponent isButton
                        onPress={handleNagigateDetailPost} //
                        style={{ marginHorizontal: "10%" }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={require('../../../assets/appIcons/comment-out-post.png')}
                            contentFit="cover"
                        />
                    </ButtonsComponent>
                    <Text
                        style={[StyleGlobal.text, {

                            color: "gray",
                        }]}>{dataPostCmt + 1000}</Text>
                </View>

                <View
                    style={{
                        width: "auto",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",

                    }}>
                    <ButtonsComponent
                        onPress={handlePressLike}
                        onLongPress={handleShowPopEmoji}
                        isButton
                        style={{ marginHorizontal: "10%" }}
                    ><Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={getIconImg(iconEmoji)}
                            contentFit="cover"
                        /></ButtonsComponent>
                    <Text
                        style={[StyleGlobal.text, {

                            color: "gray",
                        }]}>{dataPostEmoji}</Text>
                </View>
            </View>

            {/* Emoji Box */}
            <ModalPop
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
                        <TouchableOpacity onPress={() => handleBtnEmoji("like")}
                            style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/like-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBtnEmoji("heart")}
                            style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/heart-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBtnEmoji("laugh")}
                            style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/laugh-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBtnEmoji("sad")}
                            style={{ paddingHorizontal: 10 }}>
                            <Image source={require("../../../assets/emojiIcons/sad-emoji.png")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }} />
                        </TouchableOpacity>


                    </RowComponent>
                </Animated.View >

            </ModalPop>

        </RowComponent>
    )
}
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

export default PostButton

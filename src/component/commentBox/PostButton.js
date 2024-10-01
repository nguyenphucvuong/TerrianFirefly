/* eslint-disable no-undef */
import { Text, View, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Image } from 'expo-image'
import RowComponent from '../RowComponent'
import ButtonsComponent from '../ButtonsComponent'
import { StyleGlobal } from '../../styles/StyleGlobal'
import { data } from '../../constains/data'
import { ModalPop } from '../../modals'
import { appInfo } from '../../constains/appInfo'
import { clearLogEntriesAsync } from 'expo-updates'


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
const PostButton = (infoBtn) => {
    // const [toggleExpand, handleShowPopEmoji] = [infoBtn.toggleExpand, infoBtn.handleShowPopEmoji];
    const [toggleExpand, handleShowPop] = [infoBtn.toggleExpand, infoBtn.handleShowPop];


    const dataPostView = formatNumber(data.post.view);
    const dataPostCmt = null; // chưa có dữ liệu tạm thời để trống
    const dataPostEmoji = formatNumber(Number(data.post.emoji.like) + Number(data.post.emoji.heart) + Number(data.post.emoji.laugh) + Number(data.post.emoji.sad));
    const [isShowEmojiBox, setIsShowEmojiBox] = useState(false);

    const translateYEmoji = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen

    const [isPressLike, setIsPressLike] = useState(false);
    const checkUserLike = () => {
        if (data.emoji.idPost == data.post.idPost && data.emoji.userId == data.user.idUser && data.emoji.idPost != null && data.emoji.userId != null) {
            if ((Number(data.emoji.like) + Number(data.emoji.heart) + Number(data.emoji.laugh) + Number(data.emoji.sad)) > 0) {
                setIsPressLike(true);
            } else {
                setIsPressLike(false);
            }
        }
        else {
            console.log("asdasdasdsadasd");
            setIsPressLike(false);
        }
    }
    useEffect(() => {
        checkUserLike();

    }, []);



    const handlePressLike = () => {
        if (isPressLike) {
            console.log("false");
            if (data.emoji.heart === 1) {
                data.emoji.heart = 0;
                data.post.emoji.heart--;
                console.log("heart", data.emoji.heart);
            }
            else if (data.emoji.like === 1) {
                data.emoji.like = 0;
                data.post.emoji.like--;
                console.log("like", data.emoji.like);
            }
            else if (data.emoji.sad === 1) {
                data.emoji.sad = 0;
                data.post.emoji.sad;
                console.log("sad", data.emoji.sad);
            }
            else if (data.emoji.laugh === 1) {
                data.emoji.laugh = 0;
                data.post.emoji.laugh--;
                console.log("laugh", data.emoji.laugh);
            }
            setIsPressLike(false);
        } else {
            console.log("true");
            data.emoji.like = 1;
            data.post.emoji.like++;
            console.log("like", data.emoji.like);
            setIsPressLike(true);
        }
        toggleExpand();
    }

    const setFalse = () => {
        // setIsVisible(false);
        setIsShowEmojiBox(false);
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
                        onPress={handleShowPop}
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
                            source={isPressLike ? require('../../../assets/emojiIcons/like-emoji.png') : require('../../../assets/appIcons/like-out-post.png')}
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

import { ScrollView, StyleSheet, Animated, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Image } from 'expo-image'

import ButtonsComponent from '../ButtonsComponent'
import RowComponent from '../RowComponent'
import { appcolor } from '../../constains/appcolor'

const EmojiBoxComponent = ({ translateYEmoji, handleBtnEmoji, emoji, user, post, iconEmoji, setIconEmoji }) => {


    useEffect(() => {
        const getEmoji = async () => {
            let foundEmojiType = "default";
            for (let i = 0; i < emoji.length; i++) {
                if (emoji[i].user_id !== user.user_id || emoji[i].post_id !== post.post_id) {
                    continue;
                }
                if (emoji[i].count_like > 0) {
                    foundEmojiType = "like";
                    break;
                } else if (emoji[i].count_heart > 0) {
                    foundEmojiType = "heart";
                    break;
                } else if (emoji[i].count_laugh > 0) {
                    foundEmojiType = "laugh";
                    break;
                } else if (emoji[i].count_sad > 0) {
                    foundEmojiType = "sad";
                    break;
                }
            }
            setIconEmoji(foundEmojiType);
        };
        getEmoji();
    }, [emoji]);
    return (
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
                    style={{
                        paddingHorizontal: 10,
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: iconEmoji === "like" ? appcolor.primary : "",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Image source={require("../../../assets/emojiIcons/like-emoji.png")}
                        style={{
                            width: 30,
                            height: 30,

                        }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleBtnEmoji("heart")}
                    style={{
                        paddingHorizontal: 10,
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: iconEmoji === "heart" ? appcolor.primary : "",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Image source={require("../../../assets/emojiIcons/heart-emoji.png")}
                        style={{
                            width: 30,
                            height: 30,
                        }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleBtnEmoji("laugh")}
                    style={{
                        paddingHorizontal: 10,
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: iconEmoji === "laugh" ? appcolor.primary : "",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Image source={require("../../../assets/emojiIcons/laugh-emoji.png")}
                        style={{
                            width: 30,
                            height: 30,
                        }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleBtnEmoji("sad")}
                    style={{
                        paddingHorizontal: 10,
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: iconEmoji === "sad" ? appcolor.primary : "",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Image source={require("../../../assets/emojiIcons/sad-emoji.png")}
                        style={{
                            width: 30,
                            height: 30,
                        }} />
                </TouchableOpacity>


            </RowComponent>
        </Animated.View >
    )
}

export default React.memo(EmojiBoxComponent)

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
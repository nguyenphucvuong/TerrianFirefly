/* eslint-disable no-undef */
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';

import { createComment, getComment } from '../../redux/slices/CommentSlice';

import { ImageCheckContext } from '../../context/ImageProvider';
import RowComponent from '../RowComponent';
import {
    ButtonsComponent,
    IconsOptionComponent,
} from '../';
import { appInfo } from '../../constains/appInfo';
// import ButtonsComponent from '../ButtonsComponent';
// import IconsOptionComponent from './IconsOptionComponent';
const convertToPercentage = (value) => (value * 100).toFixed(2) + "%";

const CmtBoxComponent = ({ translateY, handleHidePop, post, user_id }) => {

    const { image, setImage, selectImage, modelReady, predictions, setPredictions } = useContext(ImageCheckContext);
    const [content, setContent] = useState("");


    const dispatch = useDispatch();


    const dataCmt = {
        comment_id: "",
        post_id: post.post_id,
        user_id: user_id,
        content: content,
        count_like: 0,
        count_comment: 0,
        created_at: Date.now(),
        imgPost: image,
    }


    const btnDangComment = () => {
        // console.log("dang comment");
        if (content || image) {
            handleHidePop();

            if (image) {
                // Show a loading indicator if needed
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Đang xử lý...', ToastAndroid.SHORT);
                } else {
                    alert('Đang xử lý...');
                }

                // Wait for predictions to be ready
                const waitForPredictions = new Promise((resolve) => {
                    const checkPredictions = setInterval(() => {
                        if (predictions && predictions.length > 0) {
                            clearInterval(checkPredictions);
                            resolve();
                        }
                    }, 100); // Check every 100ms
                });

                waitForPredictions;

                // Perform actions after predictions are ready
                console.log("Neutral", predictions[0].probability);
                console.log("Drawing", predictions[1].probability);
                console.log("Hentai", predictions[2].probability);
                console.log("Porn", predictions[3].probability);
                console.log("Sexy", predictions[4].probability);
                console.log("Neutral", convertToPercentage(predictions[0].probability));
                console.log("Drawing", convertToPercentage(predictions[1].probability));
                console.log("Hentai", convertToPercentage(predictions[2].probability));
                console.log("Porn", convertToPercentage(predictions[3].probability));
                console.log("Sexy", convertToPercentage(predictions[4].probability));

                if (predictions[3].probability > 0.05 || predictions[2].probability > 0.05 || predictions[4].probability > 0.05) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Hình ảnh không phù hợp!', ToastAndroid.SHORT);
                    } else {
                        alert('Hình ảnh không phù hợp');
                    }
                    setImage(null);
                    setPredictions(null);
                    return;
                }
            }

            setImage(null);
            setPredictions(null);

            // Dispatch the comment action only after predictions are ready
            dispatch(createComment(dataCmt));

            if (Platform.OS === 'android') {
                ToastAndroid.show('Đang đăng bình luận!', ToastAndroid.SHORT);
            } else {
                alert('Đang đăng bình luận');
            }
        } else {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Bình luận hoặc hình không được để trống!', ToastAndroid.SHORT);
            } else {
                alert('Bình luận không được để trống');
            }
            handleHidePop();
        }
    };

    return (
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
                            }}
                            onPress={() => { console.log("Clearing image"); setImage(null); setPredictions(null); }}
                        >
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
                    <TouchableOpacity
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
                    </TouchableOpacity>
                </LinearGradient>

            </View>
        </Animated.View >
    )
}

export default CmtBoxComponent

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
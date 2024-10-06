/* eslint-disable no-undef */

import { Animated, ScrollView, StyleSheet, Text, Easing, View } from 'react-native'
import React, { useState, useEffect } from 'react'

import { Image } from "expo-image";
import { appInfo } from '../../constains/appInfo';
import { ModalPop } from '../../modals';
import {
    ButtonsComponent,
} from '..';
import Feather from 'react-native-vector-icons/Feather';
import RowComponent from "../RowComponent";
import MoreOptionItemComponent from './MoreOptionItemComponent';


const MoreOptionPostComponent = (info) => {
    const [style] = [info.style];
    const [isVisible, setIsVisible] = useState(false);
    // let isVisible = false;
    const translateY = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen
    // const translateY = useRef(new Animated.Value(0)).current; // Start offscreen


    const handleShowInput = () => {

        // isVisible = !isVisible;
        Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(setIsVisible(true));
    };

    const handleHideInput = () => {
        ;
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
                            Chia Sẻ Đến
                        </Text>
                    </RowComponent>

                    <RowComponent width={"100%"} height={"auto"}
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: "rgba(0,0,0,0.1)",
                            paddingVertical: 10,
                        }}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={true}
                            style={{
                            }}>
                            {/* Discord */}
                            <MoreOptionItemComponent
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Discord"}
                                onPress={() => console.log("Discord")} />
                            {/* Facebook */}
                            <MoreOptionItemComponent
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Facebook"}
                                onPress={() => console.log("Facebook")} />
                            {/* Twitter */}
                            <MoreOptionItemComponent
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Twitter"}
                                onPress={() => console.log("Twitter")} />
                            {/* Reddit */}
                            <MoreOptionItemComponent
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Reddit"}
                                onPress={() => console.log("Reddit")} />
                        </ScrollView>
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
                            {/* Discord */}
                            <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Discord"}
                                onPress={() => console.log("Discord")} />
                            {/* Facebook */}
                            <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Facebook"}
                                onPress={() => console.log("Facebook")} />
                            {/* Twitter */}
                            <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Twitter"}
                                onPress={() => console.log("Twitter")} />
                            {/* Reddit */}
                            <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Reddit"}
                                onPress={() => console.log("Reddit")} />
                            <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Twitter"}
                                onPress={() => console.log("Twitter")} />
                            {/* Reddit */}
                            <MoreOptionItemComponent
                                isRow
                                url={require('../../../assets/appIcons/discord_icon.png')}
                                text={"Reddit"}
                                onPress={() => console.log("Reddit")} />
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
/* eslint-disable no-undef */
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';



import RowComponent from '../RowComponent';
import {
    ButtonsComponent,
    IconsOptionComponent,
} from '../';
import { appInfo } from '../../constains/appInfo';
// import ButtonsComponent from '../ButtonsComponent';
// import IconsOptionComponent from './IconsOptionComponent';

const CmtBoxComponent = (infoCmt) => {
    const [translateY, handleHideInput] = [infoCmt.translateY, infoCmt.handleHideInput];

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
                <ButtonsComponent isButton onPress={handleHideInput}>
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
                        backgroundColor: "red",
                    }}>
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
                                resizeMode: "contain",
                            }} />
                    </TouchableOpacity>
                    <Image source={require('../../../assets/appIcons/image-choose.png')}
                        style={{
                            width: 200,
                            height: 200,
                            resizeMode: "contain",
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
                <ButtonsComponent
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
                        onPress={handleHideInput}
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
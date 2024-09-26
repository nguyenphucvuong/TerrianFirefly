import { StyleSheet, Text, View, } from "react-native";
import React from "react";


import { appInfo } from "../constains/appInfo";
import { data } from "../constains/data";

import { StyleGlobal } from "../styles/StyleGlobal";
import {
    AvatarEx,
    ButtonsComponent,
    SkeletonComponent,
    ImagesPostComponent,
} from "./";

import RowComponent from "../component/RowComponent";
import AnimatedQuickCmtComponent from "./commentBox/AnimatedQuickCmtComponent";
import MoreOptionPostComponent from "./MoreOptionPostComponent";



const PostViewComponent = () => {


    const HandleIsEmpty = (data) => {
        const view = data.view;
        const length = data.length;
        return length === 0 ? <></> : view;
    }
    const handleAd = () => {
        console.log("toi day");
    };




    return (
        <View style={{
            ...styles.box,
            // backgroundColor: "pink",
        }}>

            <View style={{ ...styles.content }}>
                {/* Avatar */}
                <RowComponent
                    height={appInfo.widthWindows / 5.7}
                    style={{ alignItems: "center" }}
                >
                    <SkeletonComponent isAvatar Data={data.state.avatar}>
                        <AvatarEx size={40} round={30} url={data.state.avatar} />
                    </SkeletonComponent>

                    <View
                        style={{
                            height: "80%",
                            width: "55%",
                            justifyContent: "center",
                            paddingLeft: "3%",
                        }}
                    >
                        <SkeletonComponent Data={data.state.userId}>
                            <Text style={StyleGlobal.textName}>Tai tồ</Text>
                            <Text style={StyleGlobal.textInfo}>1 giờ trước • Honkai</Text>
                        </SkeletonComponent>
                    </View>

                    <SkeletonComponent Data={data.state.userId} isButton>
                        <ButtonsComponent isButton onPress={handleAd}
                            style={{
                                borderColor: "rgba(121,141,218,1)",
                                borderRadius: 100,
                                borderWidth: 2,
                                justifyContent: "center",
                                alignItems: "center",
                                width: "22%",
                                height: "50%",
                                paddingHorizontal: "2%",
                            }}
                        >
                            <Text style={{ ...StyleGlobal.text, color: "rgba(101,128,255,1)" }}>Theo dõi</Text>

                        </ButtonsComponent>
                    </SkeletonComponent>

                    <SkeletonComponent Data={data.state.userId} isButton>
                        <View
                            style={{
                                flex: 1,
                                width: "100%",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {/* <ButtonsComponent isButton onPress={handleAd}
                                style={{
                                    borderRadius: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "30%",
                                    height: "30%",
                                }}>
                                <Image
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    source={require('../../assets/dots_vertical-512.jpg')}
                                    contentFit="cover" />
                            </ButtonsComponent> */}
                            <MoreOptionPostComponent />

                        </View>
                    </SkeletonComponent>


                </RowComponent>

                {/* Content Title */}
                <RowComponent
                    minHeight={20}
                    maxHeight={40}
                    style={{
                        flexDirection: "column",

                    }}>

                    <SkeletonComponent Data={data.text}>
                        <Text style={StyleGlobal.textTitleContent}>{data.text}</Text>
                    </SkeletonComponent>
                </RowComponent>

                {/* Content */}
                <RowComponent
                    minHeight={data.texts ? 20 : 0}
                    maxHeight={data.texts ? 35 : 0}
                    style={{
                        flexDirection: "column",

                    }}>
                    <HandleIsEmpty length={data.texts.length} view={<Text style={StyleGlobal.textContent}>{data.texts}</Text>} />

                </RowComponent>

                {/* Image Content */}
                <HandleIsEmpty
                    length={data.state.images.length}
                    view={
                        <RowComponent
                            minHeight={appInfo.widthWindows * 0.45}
                            height={"auto"}
                            maxHeight={250}
                            // backgroundColor={"red"}
                            style={{
                                marginTop: "2%",
                            }}>
                            <ImagesPostComponent Data={data.state.images} />
                        </RowComponent>}
                />

                {/* Hashtag */}
                <RowComponent
                    height={data.state.hashtag.length === 0 ? 0 : 45}
                    width={appInfo.widthWindows - (appInfo.widthWindows / 100 * 5)}
                >
                    <ButtonsComponent color="green" isHashtag onPress={handleAd} hashtag={data.state.hashtag} />
                </RowComponent >

                <AnimatedQuickCmtComponent />

            </View>
        </View >
    )
}

export default React.memo(PostViewComponent)

const styles = StyleSheet.create({
    box: {
        width: "auto",
        height: "auto",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",

    },
    content: {
        width: appInfo.widthWindows,
        height: "auto",
        minHeight: "100%",
        maxHeight: appInfo.widthWindows * 1.4,
        paddingHorizontal: "5%",

    },
})
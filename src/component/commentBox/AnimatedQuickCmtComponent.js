/* eslint-disable no-undef */
import React, { useRef, useState } from 'react';
import { TextInput, Animated, Pressable, Easing, View } from 'react-native';
import { appInfo } from '../../constains/appInfo';
import RowComponent from '../RowComponent';
import {
    AvatarEx,
} from '..';
import { ModalPop } from '../../modals'
import CmtBoxComponent from './CmtBoxComponent';

import { data } from '../../constains/data'
import PostButton from './PostButton';



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
    const translateY = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen

    const handleShowInput = () => {
        setIsVisible(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleHideInput = () => {
        Animated.timing(translateY, {
            toValue: appInfo.heightWindows,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsVisible(false));
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
                    <AvatarEx size={40} round={30} url={data.state.avatar} style={{ marginRight: "3%" }} />
                    <Pressable onPress={handleShowInput} style={{
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
                onRequestClose={handleHideInput}
            >
                <CmtBoxComponent translateY={translateY} handleHideInput={handleHideInput} />
            </ModalPop>

            {/* Like, Comment, View */}
            <HandleIsEmpty
                length={data.state.id.length}
                view={
                    <PostButton toggleExpand={toggleExpand} />

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
                <Pressable onPress={handleShowInput} style={{
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
                    <AvatarEx size={30} round={30} url={data.state.avatar} style={{ position: "relative", }} />
                    <View style={{ width: 10 }} />
                    <TextInput
                        placeholderTextColor={"white"}
                        placeholder="Viết bình luận..."
                        editable={false}
                    />
                </Pressable>

            </RowComponent>
        </>
    );
};



export default AnimatedQuickCmtComponent;

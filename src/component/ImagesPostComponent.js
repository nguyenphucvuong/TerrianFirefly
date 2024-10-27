
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image';
import { appInfo } from '../constains/appInfo'
import RowComponent from './RowComponent';
import { useNavigation } from '@react-navigation/native';
import sizeImage from '../utils/sizeImage';
import { Text, TouchableOpacity, View } from 'react-native';

// const ImagesPostComponent = (imagesInfo) => {
const ImagesPostComponent = ({ post, user, emoji }) => {
    const User = user;
    const Data = post.imgPost;
    const navigation = useNavigation();


    // const [Data] = [imagesInfo.Data];
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);

    const handleImage = async (url) => {
        const { width, height } = await new sizeImage(url).sizeImage();
        setImageWidth(width);
        setImageHeight(height);
    }


    useEffect(() => {
        Data.forEach(element => {
            handleImage(element);
        });

    }, [Data]);


    const OneImageContent = () => {

        const CheckHeightReturnStyle = imageWidth > imageHeight ? {
            width: "100%",
            height: "100%",
            borderRadius: 10,
        } : {
            width: imageWidth > appInfo.widthWindows * 0.45 ? appInfo.widthWindows * 0.45 : "100%",
            // height: imageHeight > 250 ? 250 : imageHeight,
            height: 250,
            minWidth: appInfo.widthWindows * 0.4,
            maxWidth: appInfo.widthWindows * 0.5,
            minHeight: 200,
            // maxHeight: 250,
            borderRadius: 10,
        }



        return <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("picture", { Data: post, Select: 0, User: User, emoji: emoji })}
            style={CheckHeightReturnStyle}>
            <Image
                source={{ uri: Data[0] }}
                style={CheckHeightReturnStyle}
            />
        </TouchableOpacity>
    }

    const TwoOrThreeImageContent = () => {
        const TwoImageContent = () => {
            return (

                <RowComponent
                    maxHeight={appInfo.widthWindows * 0.55}
                    minHeight={imageHeight > 150 ? 150 : appInfo.widthWindows * 0.35}
                    style={{
                        justifyContent: "space-between",
                        overflow: "hidden",
                        borderRadius: 10,
                        height: imageHeight > 150 ? 150 : imageHeight,
                    }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("picture", { Data: post, Select: 0, User: User, emoji: emoji })}
                        style={{
                            width: "49%",
                            height: "100%",
                        }}>
                        <Image
                            source={{ uri: Data[0] }}
                            style={{
                                width: "100%",
                                height: "100%",
                            }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("picture", { Data: post, Select: 1, User: User, emoji: emoji })}
                        style={{
                            width: "49%",
                            height: "100%",
                        }}>
                        <Image
                            source={{ uri: Data[1] }}
                            style={{
                                width: "100%",
                                height: "100%",
                            }} />
                    </TouchableOpacity>

                </RowComponent>
            );
        }

        const ThreeImageContent = () => {
            return (
                <RowComponent
                    maxHeight={appInfo.widthWindows * 0.6}
                    minHeight={imageHeight > 150 ? 150 : appInfo.widthWindows * 0.3}
                    style={{
                        justifyContent: "space-between",
                        overflow: "hidden",
                        borderRadius: 10,
                        height: imageHeight > 150 ? 150 : imageHeight,
                    }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("picture", { Data: post, Select: 0, User: User, emoji: emoji })}
                        style={{
                            width: "33%",
                            height: "100%",
                        }}>
                        <Image
                            source={{ uri: Data[0] }}
                            style={{
                                width: "100%",
                                height: "100%",
                            }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("picture", { Data: post, Select: 1, User: User, emoji: emoji })}
                        style={{
                            width: "32%",
                            height: "100%",
                        }}>
                        <Image
                            source={{ uri: Data[1] }}
                            style={{
                                width: "100%",
                                height: "100%",
                            }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate("picture", { Data: post, Select: 2, User: User, emoji: emoji })}
                        style={{
                            width: "33%",
                            height: "100%",
                        }}>
                        <Image
                            source={{ uri: Data[2] }}
                            style={{
                                width: "100%",
                                height: "100%",
                            }} />
                    </TouchableOpacity>

                </RowComponent>
            );
        }
        return Data.length > 1 && Data.length < 3 ? <TwoImageContent /> : <ThreeImageContent />

    }

    const FourOrMoreImageContent = () => {
        const MiniImgCount = () => {
            return (
                <RowComponent style={{
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    width: "auto",
                    height: 15,
                    right: 10,
                    bottom: 10,
                    borderRadius: 10,
                    paddingHorizontal: "2%",
                }}>
                    <Image
                        source={require("../../assets/bottomtabicons/mutiple-img-bursts.png")}
                        onTouchEndCapture={() => navigation.navigate("picture", { Data: post, Select: 2 })}
                        style={{
                            width: 13,
                            height: 13,
                        }} />

                    <Text style={{ marginLeft: 5, fontSize: 10, color: "white" }}>
                        + {Data.length - 3}
                    </Text>
                </RowComponent>
            )
        }
        return (
            <RowComponent
                maxHeight={appInfo.widthWindows * 0.6}
                minHeight={imageHeight > 150 ? 150 : appInfo.widthWindows * 0.3}
                style={{
                    justifyContent: "space-between",
                    overflow: "hidden",
                    borderRadius: 10,
                    height: imageHeight > 150 ? 150 : imageHeight,
                }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("picture", { Data: post, Select: 0, User: User, emoji: emoji })}
                    style={{
                        width: "32%",
                        height: "100%",
                    }}>
                    <Image
                        source={{ uri: Data[0] }}
                        style={{
                            width: "100%",
                            height: "100%",
                        }} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("picture", { Data: post, Select: 1, User: User, emoji: emoji })}
                    style={{
                        width: "33%",
                        height: "100%",
                    }}>
                    <Image
                        source={{ uri: Data[1] }}
                        style={{
                            width: "100%",
                            height: "100%",
                        }} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("picture", { Data: post, Select: 2, User: User, emoji: emoji })}
                    style={{
                        width: "32%",
                        height: "100%",
                    }}>
                    <Image
                        source={{ uri: Data[2] }}
                        style={{
                            width: "100%",
                            height: "100%",
                        }} />
                </TouchableOpacity>
                {Data.length > 3 ? <MiniImgCount /> : <></>}

            </RowComponent>
        );
    }

    if (Data.length === 0) {
        return <></>
    } else if (Data.length === 1) {
        return <OneImageContent />
    } else if (Data.length === 2 || Data.length === 3) {
        return <TwoOrThreeImageContent />
    } else {
        return <FourOrMoreImageContent />
    }

}

export default React.memo(ImagesPostComponent);

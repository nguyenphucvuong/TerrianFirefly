
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image';
import { appInfo } from '../constains/appInfo'
import RowComponent from './RowComponent';
import { useNavigation } from '@react-navigation/native';
import sizeImage from '../utils/sizeImage';
import { Text, View } from 'react-native';

const ImagesPostComponent = (imagesInfo) => {
    const navigation = useNavigation();

    const [Data] = [imagesInfo.Data];
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
            width: imageWidth > appInfo.widthWindows * 0.5 ? appInfo.widthWindows * 0.5 : "100%",
            // height: imageHeight > 250 ? 250 : imageHeight,
            height: 250,
            minWidth: appInfo.widthWindows * 0.4,
            maxWidth: appInfo.widthWindows * 0.5,
            minHeight: 200,
            // maxHeight: 250,
            borderRadius: 10,
        }



        return <Image onTouchEndCapture={() => navigation.navigate("picture", { Data: [Data[0]] })}
            source={{ uri: Data[0] }}
            style={CheckHeightReturnStyle}
        />
    }

    const TwoOrThreeImageContent = () => {
        const TwoImageContent = () => {
            return (
                <RowComponent maxHeight={appInfo.widthWindows * 0.7}
                    style={{
                        justifyContent: "space-between",
                        overflow: "hidden",
                        borderRadius: 10,
                    }}>
                    <Image
                        source={{ uri: Data[0] }}
                        onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 0 })}
                        style={{
                            width: "49%",
                            height: "100%",
                        }} />
                    <Image
                        source={{ uri: Data[1] }}
                        onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 1 })}
                        style={{
                            width: "49%",
                            height: "100%",
                        }} />
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
                    <Image
                        source={{ uri: Data[0] }}
                        onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 0 })}
                        style={{
                            width: "32%",
                            height: "100%",
                        }} />
                    <Image
                        source={{ uri: Data[1] }}
                        onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 1 })}
                        style={{
                            width: "33%",
                            height: "100%",
                        }} />
                    <Image
                        source={{ uri: Data[2] }}
                        onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 2 })}
                        style={{
                            width: "32%",
                            height: "100%",
                        }} />
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
                        onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 2 })}
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
                <Image
                    source={{ uri: Data[0] }}
                    onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 0 })}
                    style={{
                        width: "32%",
                        height: "100%",
                    }} />
                <Image
                    source={{ uri: Data[1] }}
                    onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 1 })}
                    style={{
                        width: "33%",
                        height: "100%",
                    }} />
                <Image
                    source={{ uri: Data[2] }}
                    onTouchEndCapture={() => navigation.navigate("picture", { Data: Data, Select: 2 })}
                    style={{
                        width: "32%",
                        height: "100%",
                    }} />
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

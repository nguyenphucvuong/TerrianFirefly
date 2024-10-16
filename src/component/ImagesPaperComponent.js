import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import PagerView from 'react-native-pager-view'
import { Image } from 'expo-image';
import { appInfo } from '../constains/appInfo';


const ImagesPagerComponent = ({ post }) => {
    const [index, setIndex] = useState(0);
    const handleIndex = num => {
        setIndex(num.nativeEvent.position + 1);
    }
    return (
        <PagerView
            onTouchEndCapture={handleIndex}
            style={{
                height: 300,
                width: "auto",
                backgroundColor: "red",
            }}
            initialPage={index}
            onPageSelected={handleIndex}>
            {post.images.map((item, index) => (
                <Image
                    key={index}
                    source={{ uri: item }}
                    contentFit='contain'
                    style={{
                        width: appInfo.widthWindows,
                    }}
                />
            ))}
        </PagerView>
    )
}

export default React.memo(ImagesPagerComponent)

const styles = StyleSheet.create({})
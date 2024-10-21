import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import PagerView from 'react-native-pager-view'
import { Image } from 'expo-image';
import { appInfo } from '../constains/appInfo';
import { useNavigation } from '@react-navigation/native';


const ImagesPagerComponent = ({ post, user, emoji }) => {
    const [index, setIndex] = useState(0);
    const [scrollState, setScrollState] = useState('idle');

    const navigation = useNavigation();


    const handleIndex = num => {
        setIndex(num.nativeEvent.position);
    }
    const handleChangeScreen = () => {
        if (scrollState === 'idle') {
            navigation.navigate("picture", { Data: post, Select: index, User: user, emoji: emoji });
        }
    }
    const handlePageScrollStateChanged = (event) => {
        setScrollState(event.nativeEvent.pageScrollState);
    }
    return (
        <PagerView
            // onTouchEndCapture={() => navigation.navigate("picture", { Data: post, Select: index, User: user, emoji: emoji })}
            style={{
                height: 175,
                width: "100%",

            }}
            initialPage={index}
            onPageSelected={handleIndex}
            onPageScrollStateChanged={handlePageScrollStateChanged}
        >
            {post.images.map((item, index) => (
                <Image
                    onTouchEndCapture={handleChangeScreen}
                    key={index}
                    source={{ uri: item }}
                    contentFit='contain'
                    style={{
                        width: appInfo.widthWindows * 0.935,
                        height: "100%",
                        borderRadius: 30,
                        backgroundColor: "black",
                    }}
                />
            ))}
        </PagerView>
    )
}

export default React.memo(ImagesPagerComponent)

const styles = StyleSheet.create({})
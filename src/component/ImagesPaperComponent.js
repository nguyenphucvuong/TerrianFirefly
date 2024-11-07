import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import PagerView from 'react-native-pager-view'
import { Image } from 'expo-image';
import { appInfo } from '../constains/appInfo';
import { useNavigation } from '@react-navigation/native';


const ImagesPagerComponent = ({ post, user, userPost }) => {

    const [index, setIndex] = useState(0);

    const navigation = useNavigation();


    const [scrollState, setScrollState] = useState('idle');
    const handlePageScrollStateChanged = (event) => {
        setScrollState(event.nativeEvent.pageScrollState);
    }
    const handleChangeScreen = () => {
        if (scrollState === 'idle') {
            navigation.navigate("picture", { Data: post, Select: index, user: user, userPost: userPost });
            // navigation.navigate("picture", { Data: post, Select: 0, user: User, userPost: userPost })
        }
    }

    const handleIndex = num => {
        setIndex(num.nativeEvent.position);
    }


    // useEffect(() => {
    //     const handleGetUserPost = async () => {
    //         const userResponse = await dispatch(getUserByField({ user_id: userId }));
    //         const userData = userResponse.payload;
    //         setUserPost(userData);

    //     }
    //     handleGetUserPost();
    // }, [userId]);


    return (
        <View style={{
            width: "100%",
            height: 175,
            justifyContent: "center",
            alignItems: "center",
        }}>
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
                {
                    post.imgPost.map((item, index) => (
                        <Image
                            onTouchEndCapture={handleChangeScreen}
                            key={index}
                            source={{ uri: item }}
                            contentFit='cover'
                            style={{
                                width: appInfo.widthWindows * 0.935,
                                height: "100%",
                                borderRadius: 30,
                            }}
                        />
                    ))
                }
            </PagerView >
            <View style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "absolute",
                zIndex: 1,
                borderRadius: 25,
                height: 20,
                width: 35,
                justifyContent: "center",
                alignItems: "center",
                right: 10,
                top: 10,
            }}>
                <Text style={{ color: "white", fontSize: 12 }}>{index + 1}/{post.imgPost.length}</Text>

            </View>
        </View>
    )
}

export default React.memo(ImagesPagerComponent)

const styles = StyleSheet.create({})
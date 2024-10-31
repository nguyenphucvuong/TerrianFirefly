import { Animated, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ToastAndroid, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';
import PagerView from 'react-native-pager-view'
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { appInfo } from '../constains/appInfo'
import { handleTime } from "../utils/converDate";


import MoreOptionPostComponent from '../component/moreOptionBox/MoreOptionPostComponent';
import RowComponent from '../component/RowComponent';
import AvatarComponent from '../component/AvatarComponent';
import { AvatarEx, ButtonsComponent } from '../component';
import { StyleGlobal } from '../styles/StyleGlobal';
import AnimatedQuickCmtComponent from '../component/commentBox/AnimatedQuickCmtComponent';
import ImagesPaperComponent from '../component/ImagesPaperComponent';
import YoutubePlayerComponent from '../component/YoutubePlayerComponent';

const DetailPostScreen = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute().params;

    const { post, user, emoji, userPost } = route;


    {/* Lấy tọa độ của component để sử dụng kích hoạt animated khi lướt đến */ }
    const [componentPosition, setComponentPosition] = useState(0); // Để lưu tọa độ component
    const handleLayout = (event) => {
        const { y } = event.nativeEvent.layout; // lấy tọa độ Y của component
        setComponentPosition(y);
    };

    const animation = useRef(new Animated.Value(0)).current;

    const opacityNavigaion = {
        opacity: animation.interpolate({
            inputRange: [componentPosition + 70, componentPosition + 250],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        })
    }

    const [copiedText, setCopiedText] = useState('');
    const copyToClipboard = async (content) => {
        await Clipboard.setStringAsync(content);
    };

    const fetchCopiedText = async (content) => {
        copyToClipboard(content);
        const text = await Clipboard.getStringAsync();
        // setCopiedText(text);
        console.log(text)
        if (Platform.OS === 'android') {
            ToastAndroid.show('Đã sao chép!', ToastAndroid.SHORT);
        } else {
            // Thêm code xử lý cho iOS nếu cần (iOS không hỗ trợ ToastAndroid)
            alert('Đã sao chép vào clipboard (iOS không hỗ trợ Toast)');
        }
    };


    const handleAd = () => {
        console.log("toi day");
        console.log(componentPosition);
    };
    return (
        <View style={{ flex: 1, backgroundColor: "green" }}>

            <StatusBar barStyle={'dark-content'} backgroundColor={"white"} />
            {/* Navigate bar */}
            <RowComponent style={{
                width: "100%",
                position: 'absolute',
                zIndex: 999,
                top: inset.top,
                paddingVertical: "4%",
                alignItems: "center",
                backgroundColor: "white",
                paddingHorizontal: "3.5%",
            }}>
                <Ionicons name='chevron-back-outline' color={'black'} size={30}
                    onPress={() => navigation.goBack()} />

                <View
                    style={{
                        width: "5%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                </View>
                <View style={{
                    width: "75%",
                    height: "100%",
                    alignItems: "flex-start",
                }}>
                    <Animated.View
                        style={[{
                            flexDirection: "row",
                            width: "100%",
                            height: "100%",
                        }, opacityNavigaion]}>
                        <TouchableOpacity onPress={handleAd}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: "65%",
                            }}>
                            <AvatarEx size={30} round={10} url={user.imgUser} frame={user.frame_user} />
                            <Text style={{ fontSize: 15, fontWeight: "bold", paddingHorizontal: "3%" }}>{user.username}</Text>
                        </TouchableOpacity>

                        <ButtonsComponent isButton onPress={handleAd}
                            style={{
                                borderColor: "rgba(121,141,218,1)",
                                borderRadius: 100,
                                borderWidth: 2,
                                justifyContent: "center",
                                alignItems: "center",
                                width: 80,
                                height: "100%",
                            }}
                        >
                            <Text style={{ ...StyleGlobal.text, color: "rgba(101,128,255,1)" }}>Theo dõi</Text>
                        </ButtonsComponent>
                    </Animated.View>
                </View>

                <View
                    style={{
                        width: "10%",
                        height: "70%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <MoreOptionPostComponent />
                </View>
            </RowComponent>
            {/* Quick Comment */}
            <View style={{
                flex: 1, position: 'absolute', zIndex: 999, bottom: 0, right: 0, left: 0, height: 55,
                backgroundColor: "white",
                justifyContent: "flex-end",
            }}>
                <View style={{ height: "100%", }} >
                    {<AnimatedQuickCmtComponent isNomal isImgIn post={post} userPost={userPost} user={user} emoji={emoji} />}
                </View>
            </View>

            <ScrollView style={{
                flex: 1,
                paddingHorizontal: "3.5%",
                backgroundColor: "rgba(255, 255, 255, 1)",
                // backgroundColor: "blue",
                marginTop: 90,
                marginBottom: 55,
            }}
                onScroll={offSetY => {
                    animation.setValue(offSetY.nativeEvent.contentOffset.y);
                }}>
                {/* Content Detail Post */}
                <View style={{
                    flex: 1,
                    // backgroundColor: "yellow",
                    paddingBottom: "5%",
                }}>
                    <View style={{
                        marginTop: "3%",
                    }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "bold",
                        }}>{post.title}</Text>
                    </View>

                    <RowComponent style={{ height: 30, width: "100%", marginVertical: "3%" }}>
                        <AntDesign name='clockcircle' color={'#BFBFBF'} size={15} />
                        <Text style={{ color: "#BFBFBF", fontSize: 12, marginRight: "15%", marginLeft: "2%" }}>{post.created_at}</Text>
                        <AntDesign name='eye' color={'#BFBFBF'} size={20} style={{ bottom: ".5%" }} />
                        <Text style={{ color: "#BFBFBF", fontSize: 12, marginLeft: "2%" }}>{post.count_view}</Text>
                    </RowComponent>


                    {/* Info user post */}
                    <View
                        onLayout={handleLayout}
                        style={{
                            height: 100,
                            width: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            borderRadius: 10,
                            alignItems: "center",
                            flexDirection: "row",
                        }}>
                        <AvatarEx size={50} round={10} url={userPost.imgUser} frame={userPost.frame_user}
                            style={{
                                marginHorizontal: "3%",
                            }} />
                        <View style={{
                            flexDirection: "column",
                            width: "50%",
                            height: "100%",
                            justifyContent: "center",
                            // backgroundColor: "yellow",
                        }}>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: "bold",
                            }}>{userPost.username}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#BFBFBF",
                            }}>{handleTime({ post: post })}</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            paddingHorizontal: "2%",
                            // backgroundColor: "red",
                        }}>
                            <ButtonsComponent isButton onPress={handleAd}
                                style={{
                                    borderColor: "rgba(121,141,218,1)",
                                    borderRadius: 100,
                                    borderWidth: 2,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "30%",
                                }}
                            >
                                <Text style={{ ...StyleGlobal.text, color: "rgba(101,128,255,1)" }}>Theo dõi</Text>
                            </ButtonsComponent>
                        </View>

                    </View>

                    {/* Content Post */}
                    <View style={{
                        marginTop: "3%",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                    }}>
                        <Text style={{
                            fontSize: 15,
                        }}
                            onLongPress={() => fetchCopiedText(post.body)}
                        >{post.body}</Text>
                    </View>

                    {/* Image Post */}
                    {/* <PagerView style={{
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
                    </PagerView> */}
                    {!post.isYtb ?
                        post.imgPost.length > 0 ?
                            <ImagesPaperComponent post={post} user={user} emoji={emoji} />
                            :
                            <></>
                        :
                        < RowComponent
                            minHeight={appInfo.widthWindows * 0.53}
                            height={"auto"}
                            style={{
                                paddingTop: "2%",
                                marginBottom: "2%",
                            }}
                        >
                            <YoutubePlayerComponent url={post?.body} />
                        </ RowComponent>
                    }

                </View >

                {/* Hashtag */}
                {post.hashtag.length === 0 ? <></> :
                    <RowComponent
                        height={post.hashtag.length === 0 ? 0 : appInfo.heightWindows * 0.1}
                        width={appInfo.widthWindows - (appInfo.widthWindows / 100 * 5)}

                    >
                        <ButtonsComponent isHashtag onPress={handleAd} hashtag={post?.hashtag} isDetail />
                    </RowComponent >}


                <View style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "4%",
                }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Toàn bộ bình luận 20</Text>
                </View>


                {/* Comment */}
                <View

                    activeOpacity={1}
                    style={{
                        height: "auto",
                        width: "100%",
                        // backgroundColor: "pink",
                    }} >
                    {/* Avatar */}
                    <RowComponent
                        height={appInfo.widthWindows / 5.7}
                        style={{ alignItems: "center" }}
                    >
                        <AvatarEx size={30} round={30} url={user.imgUser} frame={user.frame_user} />
                        <View
                            style={{
                                height: "80%",
                                width: "80%",
                                justifyContent: "center",
                                paddingLeft: "3%",
                            }}
                        >
                            <Text style={[StyleGlobal.textName, { fontSize: 12 }]}>{user.username}</Text>
                            <Text style={[StyleGlobal.textInfo, { fontSize: 12 }]}>{handleTime({ post: post })}</Text>
                        </View>
                        <View
                            style={{
                                width: "10%",
                                height: "27%",
                                justifyContent: "center",
                            }}
                        >
                            <MoreOptionPostComponent />
                        </View>
                    </RowComponent>
                    {/* Content Comment */}
                    <View style={{
                        width: "100%",
                        height: "auto",
                    }}>
                        <Text
                            style={{ fontSize: 15 }}
                        // onLongPress={(text) => fetchCopiedText(text.)}
                        >askdhahsgdjahsgdjhaaa</Text>
                    </View>
                </View>
                {/* Comment Buttons */}
                <RowComponent
                    height={30}
                    style={{
                        // backgroundColor: "red",
                        justifyContent: "flex-end",
                    }}>
                    <ButtonsComponent onPress={handleAd}
                        onLongPress={handleAd}
                        isButton
                        style={{ flexDirection: "row", alignItems: 'center', }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={require('../../assets/appIcons/comment-out-post.png')}
                            contentFit="cover"
                        />
                        <Text style={{ fontSize: 13 }}>Phản hồi</Text>

                    </ButtonsComponent>

                    <ButtonsComponent onPress={handleAd}
                        onLongPress={handleAd}
                        isButton
                        style={{ marginLeft: "10%", flexDirection: "row", alignItems: 'center', }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={require('../../assets/appIcons/like-out-post.png')}
                            contentFit="cover"
                        />
                        <Text style={{ fontSize: 13 }}>Nhấn thích</Text>

                    </ButtonsComponent>
                </RowComponent>


            </ScrollView >
        </View >

    )
}

export default DetailPostScreen

const styles = StyleSheet.create({})

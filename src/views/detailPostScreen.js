import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';
import PagerView from 'react-native-pager-view'



import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { appInfo } from '../constains/appInfo'

import MoreOptionPostComponent from '../component/moreOptionBox/MoreOptionPostComponent';
import RowComponent from '../component/RowComponent';
import AvatarComponent from '../component/AvatarComponent';
import { ButtonsComponent } from '../component';
import { StyleGlobal } from '../styles/StyleGlobal';
import AnimatedQuickCmtComponent from '../component/commentBox/AnimatedQuickCmtComponent';
import { Image } from 'expo-image';
import ImagesPaperComponent from '../component/ImagesPaperComponent';
import YoutubePlayerComponent from '../component/YoutubePlayerComponent';

const DetailPostScreen = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute().params;

    const { post, user, emoji } = route;

    // const [index, setIndex] = useState(0);
    // const handleIndex = num => {
    //     setIndex(num.nativeEvent.position + 1);
    // }


    const handleAd = () => {
        console.log("toi day");
        // console.log(post, user, emoji);
        // console.log(post.hashtag)
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
                <Ionicons name='chevron-back-outline' color={'black'} size={25}
                    onPress={() => navigation.goBack()} />

                <View
                    style={{
                        width: "85%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
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
                flex: 1, position: 'absolute', zIndex: 999, bottom: 0, right: 0, left: 0, height: "7%",
                backgroundColor: "white",
                justifyContent: "flex-end",
            }}>
                <View style={{ height: "100%", }} >
                    {<AnimatedQuickCmtComponent isNomal isImgIn post={post} user={user} emoji={emoji} />}
                </View>
            </View>

            <ScrollView style={{
                flex: 1,
                paddingHorizontal: "3.5%",
                backgroundColor: "rgba(255, 255, 255, 1)",
            }}>
                {/* Content Detail Post */}
                <View style={{
                    flex: 1,
                    backgroundColor: "yellow",
                    top: "8.5%",
                    paddingBottom: "30%",
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
                        <Text style={{ color: "#BFBFBF", fontSize: 12, marginRight: "15%", marginLeft: "2%" }}>{post.createAt}</Text>
                        <AntDesign name='eye' color={'#BFBFBF'} size={20} style={{ bottom: ".5%" }} />
                        <Text style={{ color: "#BFBFBF", fontSize: 12, marginLeft: "2%" }}>{post.view}</Text>
                    </RowComponent>

                    {/* Info user post */}
                    <RowComponent style={{
                        height: 100,
                        width: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        borderRadius: 10,
                        alignItems: "center",
                    }}>
                        <AvatarComponent size={50} round={10} url={user.avatar}
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
                            }}>{user.userName}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#BFBFBF",
                            }}>{post.createAt}</Text>
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

                    </RowComponent>

                    {/* Content Post */}
                    <View style={{
                        marginTop: "3%",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                    }}>
                        <Text style={{
                            fontSize: 15,
                        }}>{post.content}</Text>
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
                    {!post.isYT ?
                        post.images.length > 0 ?

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
                            <YoutubePlayerComponent url={post?.content} />
                        </ RowComponent>
                    }

                </View >

                {/* Hashtag */}
                <RowComponent
                    height={post.hashtag.length === 0 ? 0 : appInfo.heightWindows * 0.}
                    width={appInfo.widthWindows - (appInfo.widthWindows / 100 * 5)}
                >
                    <ButtonsComponent color="green" isHashtag onPress={handleAd} hashtag={post?.hashtag} isDetail />
                </RowComponent >
                <View style={{ height: 60, backgroundColor: "red" }} />

            </ScrollView >
        </View>

    )
}

export default React.memo(DetailPostScreen)

const styles = StyleSheet.create({})
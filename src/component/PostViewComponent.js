import { Text, View, } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { getUserByField, startListeningUserByID } from "../redux/slices/UserSlices";
import { startListeningEmojiPost } from "../redux/slices/EmojiSlice";
import { createFollow } from "../redux/slices/FollowerSlice";
import { startListeningCommentByPostId } from "../redux/slices/CommentSlice";


import { appInfo } from "../constains/appInfo";
import { handleTime } from "../utils/converDate";

import { StyleGlobal } from "../styles/StyleGlobal";

import {
    AvatarEx,
    ButtonsComponent,
    SkeletonComponent,
    ImagesPostComponent,
} from "./";

import RowComponent from "../component/RowComponent";
import AnimatedQuickCmtComponent from "./commentBox/AnimatedQuickCmtComponent";
import MoreOptionPostComponent from "./moreOptionBox/MoreOptionPostComponent";
import YoutubePlayerComponent from "./YoutubePlayerComponent";
import { TouchableOpacity } from "react-native";
import { op } from "@tensorflow/tfjs";
import { appcolor } from "../constains/appcolor";

import { getUserAchievement, listenToUserAchievementRealtime, startListeningAchieByID } from '../redux/slices/AchievementSlice';


const PostViewComponent = ({ post, user }) => {
    if (!post) {

        return <></>;
    }
    // else if (post?.status_post_id == 2) {
    //     return <></>;
    // }


    const dispatch = useDispatch();
    const userId = post.user_id; // Lấy user_id từ post
    // const [userPost, setUserPost] = useState(null);
    const userPost = useSelector((state) => state.user[userId]);
    const userAchievement = useSelector((state) => userPost?.achie_id ? state.achievement[userPost.achie_id] : null);
    // const userAchievement = useSelector((state) => state.achievement[userPost.achie_id] || {});
    // console.log('userAchievement', userAchievement); 
    // console.log('userPost.achie_id', userPost.achie_id);

    // const [isFollow, setIsFollow] = useState(false);
    const follower = useSelector((state) => state.follower.follower);
    const isFollow = follower.some(f => f.user_id === post.user_id && f.follower_user_id === user.user_id);
    const comments = useSelector(state => state.comment[post.post_id])


    useEffect(() => {
        dispatch(startListeningEmojiPost({ post_id: post.post_id }));
        dispatch(startListeningCommentByPostId({ post_id: post.post_id }));
    }, []);



    // useEffect(() => {
    //     const handleGetUserPost = async () => {
    //         const userResponse = await dispatch(getUserByField({ user_id: userId }));
    //         const userData = userResponse.payload;
    //         setUserPost(userData);
    //         console.log("userData", userData);
    //     }
    //     handleGetUserPost();
    // }, [userId]);

    useEffect(() => {
        if (!userPost) {
            // dispatch(getUserByField({ user_id: userId }));
            dispatch(startListeningUserByID({ user_id: userId }));
        }
        if (userPost?.achie_id) {
            dispatch(startListeningAchieByID({ achie_id: userPost.achie_id }));
        }
    }, [userId, userPost?.achie_id, dispatch]);

    const userPostCheck = () => {
        if (userId === user.user_id) {
            return false;
        }
        return true;
    }

    const navigation = useNavigation();

    const title = post?.title.substring(0, 120);
    const content = post?.body.substring(0, 120);
    const handleAd = () => {
        console.log("toi day");

    };

    const handleFollowButton = useCallback(() => {
        const handleFollowUser = async () => {
            await dispatch(createFollow({ follower_user_id: user.user_id, user_id: userId }));
            // await dispatch(startListeningFollowers({ follower_user_id: user.user_id }));
        }
        handleFollowUser();
    });


    const handleNagigateDetailPost = () => {
        // navigation.navigate("DetailPost", { post: post, user: user, userPost: userPost, isFollow: isFollow, post_user_id: userId });
        navigation.navigate("DetailPost", { post: post, user: user, userPost: userPost, post_user_id: userId, comments: comments });
    }
    const handleNagigatePersonScreen = () => {
        navigation.navigate("PersonScreen", { userPost: userPost, isFromAvatar: true });
        console.log("toi day")
    }

    const IsYTView = () => {
        return post?.isYtb ? (
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
        ) : (
            <RowComponent
                minHeight={post?.imgPost.length == 0 ? 0 : appInfo.widthWindows * 0.45}
                height={"auto"}
                maxHeight={250}
                // backgroundColor={"red"}
                style={{
                    marginTop: "2%",
                    marginBottom: 15,
                }}>
                <ImagesPostComponent post={post} user={user} userPost={userPost} />
            </RowComponent>
        );
    }

    return (
        <>
            {userPost && post ?
                <View style={{
                    width: "auto",
                    height: "auto",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,0.1)",
                    // backgroundColor: "pink",
                }}>

                    <View style={{
                        width: appInfo.widthWindows,
                        height: "auto",
                        minHeight: "100%",
                        maxHeight: appInfo.widthWindows * 1.4,
                        paddingHorizontal: "5%",
                    }}>
                        {/* Avatar */}
                        <RowComponent
                            height={appInfo.widthWindows / 5.7}
                            style={{ alignItems: "center" }}
                        >
                            <TouchableOpacity onPress={handleNagigatePersonScreen}
                                activeOpacity={1}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}>

                                <AvatarEx size={40} round={30} url={userPost.imgUser} frame={userAchievement?.nameAchie} />
                                <View
                                    style={{
                                        height: "100%",
                                        width: "55%",
                                        paddingLeft: "4%",
                                        // backgroundColor: "red",
                                    }}
                                >
                                    <View style={{ width: "auto", flexDirection: "row" }}>
                                        <Text style={StyleGlobal.textName}>{userPost.username}</Text>
                                        {userPost.roleid != 0 ? <Image
                                            source={require("../../assets/appIcons/crown.png")}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                marginLeft: 10,
                                            }}
                                        /> : null}
                                        {userPost.status_user_id == 2 ? <Text style={{ color: "tomato", marginLeft: 10 }}>Vô hiệu hóa</Text> : null}
                                    </View>
                                    {/* <Text style={StyleGlobal.textName}>{userPost.username.length > 20 ? userPost.username.slice(0, 20) : userPost.username}</Text> */}
                                    <Text style={StyleGlobal.textInfo}>{handleTime({ timestamp: post.created_at })}</Text>

                                </View>

                            </TouchableOpacity>

                            {user.status_user_id == 2 ? <></> :
                                userPostCheck() ?
                                    <TouchableOpacity
                                        disabled={isFollow}
                                        activeOpacity={0.6}
                                        onPress={handleFollowButton}
                                        style={{
                                            borderColor: "rgba(121,141,218,1)",
                                            borderRadius: 100,
                                            borderWidth: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "22%",
                                            height: "50%",
                                            paddingHorizontal: "2%",
                                            opacity: isFollow ? 0 : 1,
                                        }}
                                    >
                                        <Text style={{ ...StyleGlobal.text, color: "rgba(101,128,255,1)", fontWeight: "bold" }}>Theo dõi</Text>
                                    </TouchableOpacity> : <></>}

                            <SkeletonComponent Data={userPost.userId} isButton>
                                <View
                                    style={{
                                        width: "10%",
                                        height: "100%",
                                        position: "absolute",
                                        right: 0,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <MoreOptionPostComponent post_id={post.post_id} user_id={user.user_id} post_user_id={userId} />
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

                            <SkeletonComponent Data={"title"}>
                                <Text style={StyleGlobal.textTitleContent} onPress={handleNagigateDetailPost}>{title}</Text>
                            </SkeletonComponent>
                        </RowComponent>

                        {/* Content */}
                        {!post?.isYtb ?
                            <RowComponent
                                minHeight={content != '' && post?.body != "" ? 20 : 0}
                                maxHeight={content != '' && post?.body != "" ? 35 : 0}
                                style={{
                                    flexDirection: "column",

                                }}>
                                <Text style={StyleGlobal.textContent} onPress={handleNagigateDetailPost}>{content}</Text>

                            </RowComponent>
                            :
                            <></>
                        }

                        <IsYTView />

                        {/* Emoji */}

                        {/* Hashtag */}
                        <RowComponent
                            height={post?.hashtag.length === 0 ? 0 : "auto"}
                            width={appInfo.widthWindows - (appInfo.widthWindows * 0.1)}
                        // style={{ marginTop: 5 }}
                        >
                            <ButtonsComponent color="green" isHashtag onPress={handleAd} hashtag={post?.hashtag} />
                        </RowComponent >

                        <AnimatedQuickCmtComponent post={post} userPost={userPost} user={user} handleNagigateDetailPost={handleNagigateDetailPost} />

                    </View>
                </View >
                :
                <></>

            }
        </>
    )
}

export default React.memo(PostViewComponent)
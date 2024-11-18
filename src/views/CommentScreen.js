import { StyleSheet, Text, View, StatusBar, Animated, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Ionicons from 'react-native-vector-icons/Ionicons'




import CmtBoxComponent from '../component/commentBox/CmtBoxComponent'
import ModalPop from '../modals/ModalPop'
import AnimatedQuickCmtComponent from '../component/commentBox/AnimatedQuickCmtComponent'
import RowComponent from '../component/RowComponent'
import MoreOptionPostComponent from '../component/moreOptionBox/MoreOptionPostComponent'
import { ButtonsComponent, AvatarEx } from '../component'
import { appInfo } from '../constains/appInfo'
import { handleTime, formatNumber, calculateEmojiCounts } from '../utils/index'
import { StyleGlobal } from '../styles/StyleGlobal'
import { startListeningEmojiSubCmt, createEmoji, deleteEmoji } from '../redux/slices/EmojiSlice'
import { getUserByField, startListeningUserByID } from '../redux/slices/UserSlices'
import { startListeningSubCommentByPostId } from '../redux/slices/SubCommentSlice'
import { countSubComments } from '../redux/slices/SubCommentSlice'
import { appcolor } from '../constains/appcolor'


const CommentScreen = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const { user, comment } = route.params;
    // const user = useSelector((state) => state.user[comment.user_id]);
    const subComments = useSelector((state) => state.subComment[comment.comment_id]);
    const [dataPostCmt, setDataPostCmt] = useState(0); // Sử dụng state để lưu kết quả 
    const emoji = useSelector(state => state.emoji[comment.comment_id]);
    const countEmoji = calculateEmojiCounts({ emojiList: emoji, comment_id: comment.comment_id, }).totalCount;
    const currentUser = useSelector((state) => state.user.user);





    useEffect(() => {
        const fetchCommentCount = async () => {
            const countCmt = await countSubComments({ comment_id: comment.comment_id });
            setDataPostCmt(formatNumber({ num: countCmt })); // Cập nhật state với kết quả
        };
        fetchCommentCount();
    }, []);

    const handleNagigatePersonScreen = (user) => {
        navigation.navigate("PersonScreen", { userPost: user, isFromAvatar: true });
    }
    const handleBtnEmoji = async () => {
        // console.log("comment", comment.comment_id);
        // console.log("emojiType", emoji ? emoji : "null");
        const existingEmoji = !emoji ? false : emoji.find(e => e.user_id === user.user_id && e.comment_id === comment.comment_id);
        // console.log("existingEmoji", existingEmoji);
        // if (existingEmoji) {
        //     console.log("existingEmoji", existingEmoji);
        //     console.log("existingEmoji[`count_like`]", existingEmoji[`count_like`]);
        //     console.log("existingEmoji[`count_heart`]", existingEmoji[`count_heart`]);
        //     console.log("existingEmoji[`count_laugh`]", existingEmoji[`count_laugh`]);
        //     console.log("existingEmoji[`count_sad`]", existingEmoji[`count_sad`]);
        // }

        if (existingEmoji) {
            console.log("deleteEmoji");
            // Nếu người dùng ấn lại đúng emoji mà họ đã tương tác trước đó -> DELETE
            await dispatch(deleteEmoji({ comment_id: comment.comment_id, user_id: user.user_id }));
        } else {
            console.log("createEmoji");
            // Nếu người dùng chưa tương tác -> CREATE
            await dispatch(createEmoji({
                emoji_id: "",
                post_id: "",
                comment_id: comment.comment_id,
                sub_comment_id: "",
                user_id: user.user_id,
                count_like: 1,
                count_heart: 0,
                count_laugh: 0,
                count_sad: 0,
            }));
        }
    };


    const [isVisible, setIsVisible] = useState(false);
    const translateY = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen
    const handleShowPop = () => {
        setIsVisible(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    const setFalse = () => {
        setIsVisible(false);
    }
    const handleHidePop = () => {
        Animated.timing(translateY, {
            toValue: appInfo.heightWindows,
            duration: 300,
            useNativeDriver: true,
        }).start(setFalse());
    };
    return (
        <>
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


                <View style={{
                    width: "80%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{user.username}</Text>
                </View>

                <View
                    style={{
                        width: "10%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <MoreOptionPostComponent size={30} user_id={user.user_id} isComment />
                </View>
            </RowComponent>
            {/* Quick Comment */}
            <View style={{
                flex: 1, position: 'absolute', zIndex: 999, bottom: 0, right: 0, left: 0, height: 55,
                backgroundColor: "white",
                justifyContent: "flex-end",
            }}>
                <View style={{ height: "100%", }} >
                    {/* {<AnimatedQuickCmtComponent isNomal isImgIn post={post} userPost={userPost} user={user} />} */}
                    {<AnimatedQuickCmtComponent isNomal isImgIn isSubCmt user={user} comment_id={comment.comment_id} />}
                </View>
            </View>
            <ScrollView
                scrollEnabled={true}
                style={{
                    flex: 1,
                    paddingHorizontal: "5%",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    bottom: -90,
                    marginBottom: 145,
                }} >
                {/* Comment */}
                <View
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
                            <Text style={[StyleGlobal.textInfo, { fontSize: 12 }]}>{handleTime({ timestamp: comment.created_at })}</Text>

                        </View>
                        <View
                            style={{
                                width: "10%",
                                height: "100%",
                                justifyContent: "center",
                            }}
                        >
                            <MoreOptionPostComponent size={20} user_id={user.user_id} isComment />
                        </View>
                    </RowComponent>
                    {/* Content Comment */}
                    <View style={{
                        width: "100%",
                        height: "auto",
                        flexDirection: 'column',
                    }}>
                        <Text
                            style={{ fontSize: 15 }}
                        // onLongPress={(text) => fetchCopiedText(text.)}
                        >{comment.content}</Text>

                        {comment.imgPost ?
                            <Image
                                style={{
                                    width: "90%",
                                    height: 150,
                                    marginTop: "3%",
                                    borderRadius: 10,
                                    backgroundColor: "black",
                                    alignSelf: "center",
                                }}
                                source={{ uri: comment.imgPost }}
                                contentFit="contain"
                            /> : <></>}
                    </View>
                </View>
                {/* Comment Buttons */}
                <RowComponent
                    height={30}
                    style={{
                        // backgroundColor: "red",
                        justifyContent: "flex-end",
                    }}>
                    <View style={{ width: "45%" }} />
                    <TouchableOpacity
                        onPress={() => handleShowPop()}
                        style={{ flexDirection: "row", alignItems: 'center', flex: 1, alignSelf: "center" }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5,
                            }}
                            source={require('../../assets/appIcons/comment-out-post.png')}
                            contentFit="cover"
                        />
                        <Text style={{ fontSize: 12, }}>{dataPostCmt == 0 ? "Trả lời " : dataPostCmt} </Text>

                    </TouchableOpacity>


                    <TouchableOpacity onPress={handleBtnEmoji}
                        style={{ flexDirection: "row", alignItems: 'center', flex: 1, alignSelf: "center" }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5,
                            }}
                            source={countEmoji != 0 ? require('../../assets/emojiIcons/like-emoji.png') : require('../../assets/appIcons/like-out-post.png')}
                            contentFit="cover"
                        />
                        <Text style={{ fontSize: 12, }}>{countEmoji != 0 ? countEmoji : "Nhấn thích"}</Text>

                    </TouchableOpacity>
                </RowComponent>
                <View style={{
                    borderBottomWidth: 1,
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    marginVertical: 10, // Khoảng cách trên dưới của đường kẻ
                }} />

                {/* SubComment List */}
                {!subComments ? null :
                    subComments.map((subComment, index) => {
                        return (
                            <CommentsPost key={index} subComment={subComment} comment={comment} />
                        )
                    })}



            </ScrollView >
            <ModalPop
                visible={isVisible}
                transparent={true}
                onRequestClose={handleHidePop}
            >
                <CmtBoxComponent translateY={translateY} handleHidePop={handleHidePop} user_id={currentUser.user_id} comment_id={comment.comment_id} tag_user_id={user.user_id} isSubCmt />
            </ModalPop>
        </>
    )
}

const CommentsPost = React.memo(({ subComment, comment }) => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user[subComment.user_id]);
    const dispatch = useDispatch();

    const [dataPostCmt, setDataPostCmt] = useState(0); // Sử dụng state để lưu kết quả   
    const emoji = useSelector(state => state.emoji[subComment.sub_comment_id]);
    const countEmoji = calculateEmojiCounts({ emojiList: emoji, sub_comment_id: subComment.sub_comment_id, }).totalCount;
    const currentUser = useSelector((state) => state.user.user);
    const userTag = useSelector((state) => state.user[subComment.tag_user_id]);


    useEffect(() => {
        if (!user) dispatch(startListeningUserByID({ user_id: subComment.user_id }));
        dispatch(startListeningEmojiSubCmt({ sub_comment_id: subComment.sub_comment_id }));
        console.log("subComment", subComment, subComment.tag_user_id);
        console.log("object", userTag);
        // dispatch(startListeningSubCommentByPostId({ comment_id: subComment.comment_id }));
    }, []);
    useEffect(() => {

        const fetchCommentCount = async () => {
            const countCmt = await countSubComments({ comment_id: subComment.comment_id });
            // console.log("countCmt", countCmt);
            // console.log("countCmt", countCmt != 0 ? "Trả lời " : "Teo");
            setDataPostCmt(formatNumber({ num: countCmt })); // Cập nhật state với kết quả
        };
        fetchCommentCount();
    }, [emoji]);


    const handleBtnEmoji = async () => {
        // console.log("comment", comment.comment_id);
        // console.log("emojiType", emoji ? emoji : "null");
        const existingEmoji = !emoji ? false : emoji.find(e => e.user_id === user.user_id && e.sub_comment_id === subComment.sub_comment_id);


        if (existingEmoji) {
            console.log("deleteEmoji");
            // Nếu người dùng ấn lại đúng emoji mà họ đã tương tác trước đó -> DELETE
            await dispatch(deleteEmoji({ sub_comment_id: subComment.sub_comment_id, user_id: user.user_id }));
        } else {
            console.log("createEmoji");
            // Nếu người dùng chưa tương tác -> CREATE
            await dispatch(createEmoji({
                emoji_id: "",
                post_id: "",
                comment_id: "",
                sub_comment_id: subComment.sub_comment_id,
                user_id: user.user_id,
                count_like: 1,
                count_heart: 0,
                count_laugh: 0,
                count_sad: 0,
            }));
        }
        dispatch(startListeningEmojiSubCmt({ sub_comment_id: subComment.sub_comment_id }));

    };


    const [isVisible, setIsVisible] = useState(false);
    const translateY = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen
    const handleShowPop = () => {
        setIsVisible(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    const setFalse = () => {
        setIsVisible(false);
        // setIsShowEmojiBox(false);
    }
    const handleHidePop = () => {
        Animated.timing(translateY, {
            toValue: appInfo.heightWindows,
            duration: 300,
            useNativeDriver: true,
        }).start(setFalse());
    };

    const handleNagigatePersonScreen = (user) => {
        navigation.navigate("PersonScreen", { userPost: user, isFromAvatar: true });
    }

    const handleAd = () => {
        console.log("Ad");
    };

    return (
        user ?
            <View>
                {/* Comment */}
                <View
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
                            <Text style={[StyleGlobal.textInfo, { fontSize: 12 }]}>{handleTime({ timestamp: subComment.created_at })}</Text>

                        </View>
                        <View
                            style={{
                                width: "10%",
                                height: "100%",
                                justifyContent: "center",
                            }}
                        >
                            <MoreOptionPostComponent size={20} user_id={user.user_id} isComment />
                        </View>
                    </RowComponent>
                    {/* Content Comment */}
                    <View style={{
                        width: "100%",
                        height: "auto",
                        flexDirection: 'column',
                    }}>
                        <View style={{ flexDirection: "row" }}>
                            {subComment.tag_user_id ?
                                <Text style={{ fontSize: 15, color: appcolor.primary }}
                                    onPress={() => handleNagigatePersonScreen(userTag)}
                                >@{userTag.username}</Text> : <></>}


                            {subComment.content ? <Text
                                style={{ fontSize: 15 }}
                            // onLongPress={(text) => fetchCopiedText(text.)}
                            > {subComment.content}</Text> : <></>}
                        </View>


                        {subComment.imgPost ?
                            <Image
                                style={{
                                    width: "90%",
                                    height: 150,
                                    marginTop: "3%",
                                    borderRadius: 10,
                                    backgroundColor: "black",
                                    alignSelf: "center",
                                }}
                                source={{ uri: subComment.imgPost }}
                                contentFit="contain"
                            /> : <></>}
                    </View>
                </View>
                {/* Comment Buttons */}
                <RowComponent
                    height={30}
                    style={{
                        // backgroundColor: "red",
                        justifyContent: "flex-end",
                    }}>
                    <View style={{ width: "45%" }} />
                    <TouchableOpacity
                        onPress={() => handleShowPop()}
                        style={{ flexDirection: "row", alignItems: 'center', flex: 1, alignSelf: "center" }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5,
                            }}
                            source={require('../../assets/appIcons/comment-out-post.png')}
                            contentFit="cover"
                        />
                        {/* <Text style={{ fontSize: 12, }}>{dataPostCmt == 0 ? "Trả lời " : dataPostCmt} </Text> */}
                        <Text style={{ fontSize: 12, }}>Trả lời  </Text>

                    </TouchableOpacity>


                    <TouchableOpacity onPress={handleBtnEmoji}
                        style={{ flexDirection: "row", alignItems: 'center', flex: 1, alignSelf: "center" }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5,
                            }}
                            source={countEmoji != 0 && countEmoji ? require('../../assets/emojiIcons/like-emoji.png') : require('../../assets/appIcons/like-out-post.png')}
                            contentFit="cover"
                        />
                        <Text style={{ fontSize: 12, }}>{countEmoji != 0 && countEmoji ? countEmoji : "Nhấn thích"}</Text>

                    </TouchableOpacity>
                </RowComponent>
                <ModalPop
                    visible={isVisible}
                    transparent={true}
                    onRequestClose={handleHidePop}
                >
                    <CmtBoxComponent translateY={translateY} handleHidePop={handleHidePop} user_id={currentUser.user_id} comment_id={comment.comment_id} tag_user_id={user.user_id} isSubCmt />
                </ModalPop>
            </View>
            :
            <></>
    )
})

export default React.memo(CommentScreen)

const styles = StyleSheet.create({})
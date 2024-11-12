import {
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    PermissionsAndroid,
    ToastAndroid,
    Animated,
} from "react-native";
import React, { useState, useCallback, useEffect, } from 'react'
import { Image } from 'expo-image'

import { useRoute } from '@react-navigation/native'
import PagerView from 'react-native-pager-view'
import Feather from 'react-native-vector-icons/Feather'
import AndtDegisn from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from "react-redux";

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { createFollow } from "../redux/slices/FollowerSlice";
import { updateEmojiByField, startListeningEmoji, createEmoji, deleteEmoji } from "../redux/slices/EmojiSlice";
import { createFavorite, deleteFavorite } from "../redux/slices/FavoriteSlice";

import { handleTime, formatDate, calculateEmojiCounts, formatNumber, calculateFavoriteCounts } from "../utils";
import { ModalPop } from "../modals";
import { appInfo } from '../constains/appInfo'
import { appcolor } from '../constains/appcolor'
import AnimatedQuickCmtComponent from '../component/commentBox/AnimatedQuickCmtComponent'
import { AvatarEx, ButtonsComponent } from '../component'
import EmojiBoxComponent from "../component/commentBox/EmojiBoxComponent";
import MoreOptionPostComponent from "../component/moreOptionBox/MoreOptionPostComponent";
import { app } from "../firebase/FirebaseConfig";
// import { AvatarEx } from '../component'
// import RowComponent from '../RowComponent';


const PictureScreen = ({ }) => {
    const [index, setIndex] = useState(0);
    const route = useRoute();
    const { Data: post, Select, user } = route.params;
    const userPost = route.params.userPost;

    const [isVisible, setIsVisible] = useState(true); // Hiển thị hoặc ẩn thanh navigate bar và các component khác
    // const DataLength = Object.keys(Data.imgPost).length;
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();

    const dispatch = useDispatch();
    // follow
    const follower = useSelector((state) => state.follower.follower);
    const isFollow = follower.some(f => f.user_id === post.user_id);

    // favorite
    const favorite = useSelector(state => state.favorite.currentFavorite);
    // const [isFavorite, setIsFavorite] = useState(false);
    const isFavorite = favorite.some(f => f.post_id === post.post_id);


    const dataPostView = formatNumber({ num: post.count_view });
    const dataPostCmt = null; // chưa có dữ liệu tạm thời để trống

    const [isShowEmojiBox, setIsShowEmojiBox] = useState(false);

    const translateYEmoji = useState(new Animated.Value(appInfo.heightWindows))[0]; // Start offscreen

    // const [isPressLike, setIsPressLike] = useState("false");


    const [iconEmoji, setIconEmoji] = useState("default");
    const emoji = useSelector(state => state.emoji.emojiList);
    const countEmoji = calculateEmojiCounts({ emojiList: emoji, post_id: post.post_id });
    const likeCount = formatNumber({ num: countEmoji.likeCount });
    const heartCount = formatNumber({ num: countEmoji.heartCount });
    const laughCount = formatNumber({ num: countEmoji.laughCount });
    const sadCount = formatNumber({ num: countEmoji.sadCount });
    const totalCount = formatNumber({ num: countEmoji.totalCount });
    const favoriteCount = formatNumber({ num: calculateFavoriteCounts({ favoriteList: favorite, post_id: post.post_id }).totalCount });

    // console.log(Select);

    const handleIndex = num => {
        setIndex(num.nativeEvent.position + 1);
    }


    useEffect(() => {
        const getEmoji = async () => {
            let foundEmojiType = "default";
            for (let i = 0; i < emoji.length; i++) {
                if (emoji[i].user_id !== user.user_id || emoji[i].post_id !== post.post_id) {
                    continue;
                }
                if (emoji[i].count_like > 0) {
                    foundEmojiType = "like";
                    break;
                } else if (emoji[i].count_heart > 0) {
                    foundEmojiType = "heart";
                    break;
                } else if (emoji[i].count_laugh > 0) {
                    foundEmojiType = "laugh";
                    break;
                } else if (emoji[i].count_sad > 0) {
                    foundEmojiType = "sad";
                    break;
                }
            }
            setIconEmoji(foundEmojiType);
        };
        getEmoji();
    }, [emoji]);
    const getIconImg = (emoji) => {
        switch (emoji) {
            case "like":
                return require("../../assets/emojiIcons/like-emoji.png");
            case "heart":
                return require("../../assets/emojiIcons/heart-emoji.png");
            case "laugh":
                return require("../../assets/emojiIcons/laugh-emoji.png");
            case "sad":
                return require("../../assets/emojiIcons/sad-emoji.png");
            case "default":
                return require("../../assets/appIcons/like-out-post.png");
            default:
                return require("../../assets/appIcons/like-out-post.png");
        }
    }

    const handleBtnEmoji = async (emojiType) => {
        const existingEmoji = emoji.find(e => e.user_id === user.user_id && e.post_id === post.post_id);
        if (existingEmoji) {
            console.log("existingEmoji", existingEmoji);
            console.log("existingEmoji[`count_like`]", existingEmoji[`count_like`]);
            console.log("existingEmoji[`count_heart`]", existingEmoji[`count_heart`]);
            console.log("existingEmoji[`count_laugh`]", existingEmoji[`count_laugh`]);
            console.log("existingEmoji[`count_sad`]", existingEmoji[`count_sad`]);
        }

        if (existingEmoji) {

            // Nếu người dùng đã tương tác
            if (existingEmoji[`count_${emojiType}`] > 0) {
                console.log("deleteEmoji");
                // Nếu người dùng ấn lại đúng emoji mà họ đã tương tác trước đó -> DELETE
                await dispatch(deleteEmoji({ post_id: post.post_id, user_id: user.user_id }));
                setIconEmoji("default");
            } else {
                console.log("updateEmojiByField");
                // Nếu người dùng chọn emoji khác với emoji đã tương tác trước đó -> UPDATE
                // Xóa emoji hiện tại
                await dispatch(updateEmojiByField({
                    post_id: post.post_id,
                    user_id: user.user_id,
                    count_like: emojiType === "like" ? 1 : 0,
                    count_heart: emojiType === "heart" ? 1 : 0,
                    count_laugh: emojiType === "laugh" ? 1 : 0,
                    count_sad: emojiType === "sad" ? 1 : 0,
                }));
                // await dispatch(startListeningEmoji({ user_id: user.user_id }));
                setIconEmoji(emojiType);
            }
            // await dispatch(startListeningEmoji({ user_id: user.user_id }));
        } else {
            console.log("createEmoji");
            // Nếu người dùng chưa tương tác -> CREATE
            await dispatch(createEmoji({
                emoji_id: "",
                post_id: post.post_id,
                user_id: user.user_id,
                isComment: false,
                comment_id: "",
                count_like: emojiType === "like" ? 1 : 0,
                count_heart: emojiType === "heart" ? 1 : 0,
                count_laugh: emojiType === "laugh" ? 1 : 0,
                count_sad: emojiType === "sad" ? 1 : 0,
            }));
            setIconEmoji(emojiType);
        }

        handleHidePop();
    };



    const handleFollowButton = useCallback(() => {
        const handleFollowUser = async () => {
            await dispatch(createFollow({ follower_user_id: user.user_id, user_id: userPost.user_id }));
            // await dispatch(startListeningFollowers({ follower_user_id: user.user_id }));
        }
        handleFollowUser();
    });
    const handlePressLike = () => {
        // setIsPressLike("like");
        handleBtnEmoji("like");
    }




    const handleShowPopEmoji = () => {
        // console.log("ajkhsdjkashdkjahsdkjahskjd")
        setIsShowEmojiBox(true);
        Animated.timing(translateYEmoji, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };
    const handleHidePop = () => {

        Animated.timing(translateYEmoji, {
            toValue: appInfo.heightWindows,
            duration: 300,
            useNativeDriver: true,
        }).start(setIsShowEmojiBox(false));
    };




    const handleFavorite = useCallback(() => {
        if (isFavorite) {
            dispatch(deleteFavorite({ post_id: post.post_id, user_id: user.user_id }));
            // dispatch(startListeningFavorites({ post_id: post_id, user_id: user_id }));
        } else {
            dispatch(createFavorite({ post_id: post.post_id, user_id: user.user_id }));
            // dispatch(startListeningFavorites({ post_id: post_id, user_id: user_id }));
        }
    })



    const handleSaveImage = async (url) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync(); // Yêu cầu quyền truy cập thư viện ảnh
            if (status !== 'granted') {
                Alert.alert('Quyền bị từ chối!', 'Bạn cần cấp quyền truy cập để lưu hình ảnh.');
                return;
            }
            const fileName = url.split('/').pop();
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            const download = await FileSystem.downloadAsync(url, fileUri);

            if (download.status === 200) {
                const asset = await MediaLibrary.createAssetAsync(download.uri);
                await MediaLibrary.createAlbumAsync('Download', asset, false);
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Đã lưu!', ToastAndroid.SHORT);
                } else {
                    alert('Đã lưu');
                }
            } else {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Lỗi! Không thể lưu hình ảnh.', ToastAndroid.SHORT);
                } else {
                    alert('Lỗi', 'Không thể lưu hình ảnh.');
                }
            }
        } catch (error) {
            console.log('Lỗi lưu hình ảnh:', error);
            Alert.alert('Lỗi', 'Không thể lưu hình ảnh.');
        }
    };

    const handleTouchOnImage = () => {
        setIsVisible(!isVisible);
    }



    {/* Image Viewer Versoin 1 */ }
    const imageUrls = post.imgPost.map((item) => ({ url: item }));
    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Tab Status Bar */}
            <StatusBar barStyle={'default'} backgroundColor={"transparent"} />
            {isVisible && <View style={{
                flexDirection: "row",
                position: 'absolute',
                zIndex: 999,
                top: inset.top, // Chưa tìm được cách nâng hiển thị index của ImageViewer lên, nên tạm thời hạ thanh navigate bar xuống
                padding: 10,
            }}>
                {/* <LinearGradient
                    start={{ x: 0, y: 1 }} end={{ x: 0, y: 0.5 }}
                    colors={["transparent", "black"]}

                    style={{
                        flex: 1,
                        height: 300,
                        position: 'absolute',
                        right: 0,
                        bottom: -50,
                        left: 0,
                        // backgroundColor: "black",
                    }}
                /> */}
                <Feather name='x' color={'white'} size={24}
                    onPress={() => navigation.goBack()} />

                <View style={{ width: "85%", alignItems: 'center' }}>
                    {/* Image Index Versoin 1 */}
                    {/* <Text style={{ color: "white" }}>{index}/{post.imgPost.length}</Text> */}
                </View>
                {/* <Feather name='more-vertical' color={'white'} size={24} /> */}

                <View style={{
                    flex: 1,
                    // backgroundColor: "red",
                }}>
                    <MoreOptionPostComponent isWhiteDot post_id={post.post_id} user_id={user.user_id} post_user_id={userPost.user_id} />
                </View>

            </View>}

            {/* Image Viewer Versoin 1 */}
            {/* <PagerView style={{ flex: 1 }} initialPage={Select}
                onPageSelected={handleIndex}>
                {Data.images.map((item, index) => (
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

            {/* Image Viewer Versoin 2 */}
            {/* ImageViewer directly to enable zoom from the start */}
            <ImageViewer
                imageUrls={imageUrls}
                index={Select}
                onChange={(idx) => setIndex(idx)}
                enableSwipeDown={true}
                onSwipeDown={() => navigation.goBack()}
                onClick={() => handleTouchOnImage()}
                onLongPress={() => setIsVisible(false)}
                menuContext={{ saveToLocal: 'Lưu hình', cancel: 'Hủy' }}
                onSave={(url) => handleSaveImage(url)}
            />

            {isVisible && <View style={{ flex: 1, position: 'absolute', zIndex: 999, bottom: 0, right: 0, left: 0, height: 350 }}>
                <LinearGradient
                    start={{ x: 0, y: 0.2 }} end={{ x: 0, y: 1 }}
                    colors={["transparent", "black"]}

                    style={{
                        flex: 1,
                        height: 300,
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                />

                <View style={{
                    height: "auto",
                    flexDirection: "row",
                    minHeight: "30%",
                    // backgroundColor: "red",
                }}>
                    <View style={{
                        width: "80%",
                        height: "auto",
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        // backgroundColor: "red",
                    }} >
                        <View style={{ width: "100%", height: "auto", marginLeft: "5%" }} >
                            <Text style={{ color: "white" }}>{post.title}</Text>
                        </View>
                    </View>
                    <View style={{
                        width: "20%",
                        height: "100%",
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                    }}>
                        <ButtonsComponent isButton style={{ alignItems: "center", marginBottom: "10%" }}>
                            <AvatarEx size={50} round={30} url={userPost.imgUser} frame={userPost.frame_user} style={{ marginRight: "3%" }} />

                        </ButtonsComponent>


                        { /* Follow Button */}
                        {!isFollow && user.user_id !== post.user_id ?
                            <ButtonsComponent
                                isButton
                                onPress={handleFollowButton}>
                                <AndtDegisn name='pluscircle' color={appcolor.primary} size={17} style={{ width: 17, height: 17, backgroundColor: "white", borderRadius: 100, marginTop: "-15%", top: -5 }} />

                            </ButtonsComponent>
                            : <></>}
                        <TouchableOpacity
                            onPress={handlePressLike}
                            onLongPress={handleShowPopEmoji}
                            style={{
                                alignItems: "center",
                            }}>
                            {iconEmoji === "default" ?
                                <AndtDegisn name='like1' color={"white"} size={30} style={{ marginTop: 8 }} />
                                :
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        marginTop: 8,
                                    }}
                                    source={getIconImg(iconEmoji)}
                                    contentFit="cover"
                                />
                            }
                            <Text style={{ color: "white" }}>{totalCount}</Text>
                        </TouchableOpacity>

                        {/* Comment Button */}
                        <TouchableOpacity style={{ alignItems: "center", marginTop: 8, }}>
                            <MaterialCommunityIcons name='comment-processing' color={"white"} size={30} />
                            <Text style={{ color: "white" }}>9999</Text>
                        </TouchableOpacity>

                        {/* Favorite Button */}
                        {!isFavorite ?
                            <TouchableOpacity
                                onPress={handleFavorite}
                                style={{ alignItems: "center", marginTop: 8, }}>
                                <AndtDegisn name='star' color={"white"} size={30} />
                                <Text style={{ color: "white" }}>{favoriteCount}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={handleFavorite}
                                style={{ alignItems: "center", marginTop: 8, }}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                    }}
                                    source={require("../../assets/appIcons/favorite.png")}
                                    contentFit="cover"
                                />
                                <Text style={{ color: "white" }}>{favoriteCount}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>


                {/* Emoji Count Button */}
                <View style={{
                    height: "20%",
                    width: "100%",
                    padding: 10,
                    flexDirection: "row",
                }} >
                    <TouchableOpacity
                        onPress={() => handleBtnEmoji("like")}
                        activeOpacity={0.8}
                        style={{
                            width: "auto",
                            minWidth: 60,
                            height: 30,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: iconEmoji === "like" ? appcolor.primary : 'rgba(255,255,255,0.2)',
                            flexDirection: "row",
                            marginRight: 4,
                        }}>
                        <Image
                            style={{
                                width: 18,
                                height: 18,
                            }}
                            source={getIconImg("like")}
                            contentFit="cover"
                        />
                        <Text style={{ marginLeft: 4, color: "white", fontSize: 12 }}>{likeCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleBtnEmoji("heart")}
                        activeOpacity={0.8}
                        style={{
                            width: "auto",
                            minWidth: 60,
                            height: 30,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: iconEmoji === "heart" ? appcolor.primary : 'rgba(255,255,255,0.2)',
                            flexDirection: "row",
                            marginRight: 4,
                        }}>
                        <Image
                            style={{
                                width: 18,
                                height: 18,
                            }}
                            source={getIconImg("heart")}
                            contentFit="cover"
                        />
                        <Text style={{ marginLeft: 4, color: "white", fontSize: 12 }}>{heartCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleBtnEmoji("laugh")}
                        activeOpacity={0.8}
                        style={{
                            width: "auto",
                            minWidth: 60,
                            height: 30,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: iconEmoji === "laugh" ? appcolor.primary : 'rgba(255,255,255,0.2)',
                            flexDirection: "row",
                            marginRight: 4,
                        }}>
                        <Image
                            style={{
                                width: 18,
                                height: 18,
                            }}
                            source={getIconImg("laugh")}
                            contentFit="cover"
                        />
                        <Text style={{ marginLeft: 4, color: "white", fontSize: 12 }}>{laughCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleBtnEmoji("sad")}
                        activeOpacity={0.8}
                        style={{
                            width: "auto",
                            minWidth: 60,
                            height: 30,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: iconEmoji === "sad" ? appcolor.primary : 'rgba(255,255,255,0.2)',
                            flexDirection: "row",
                            marginRight: 4,
                        }}>
                        <Image
                            style={{
                                width: 18,
                                height: 18,
                            }}
                            source={getIconImg("sad")}
                            contentFit="cover"
                        />
                        <Text style={{ marginLeft: 4, color: "white", fontSize: 12 }}>{sadCount}</Text>
                    </TouchableOpacity>


                </View>


                <View style={{
                    height: 65,
                    width: "100%",
                    position: "absolute",
                    bottom: 0,

                }} >
                    <AnimatedQuickCmtComponent isNomal post={post} userPost={userPost} user={user} />
                </View>
            </View>}
            {/* Emoji Box */}
            <ModalPop
                visible={isShowEmojiBox}
                transparent={true}
                onRequestClose={handleHidePop}
            >
                <EmojiBoxComponent
                    translateYEmoji={translateYEmoji}
                    handleBtnEmoji={handleBtnEmoji}
                    emoji={emoji}
                    user={user}
                    post={post}
                    iconEmoji={iconEmoji}
                    setIconEmoji={setIconEmoji} />


            </ModalPop>
        </View>

    )
}

export default PictureScreen

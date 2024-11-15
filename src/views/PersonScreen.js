import { StyleSheet, View, TouchableOpacity, ImageBackground, ScrollView, Animated, Text, Alert, LogBox, Clipboard } from 'react-native'
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector, useDispatch } from "react-redux";
import { createFollow, deleteFollow } from "../redux/slices/FollowerSlice";

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
//style
import { StyleGlobal } from '../styles/StyleGlobal'
//components
import { SkeletonComponent, IconComponent, StatisticsComponent, AvatarEx, ButtonBackComponent } from '../component';
import TabRecipe from '../component/TabRecipe';
//constains
import { appInfo } from '../constains/appInfo';
import { appcolor } from '../constains/appcolor';
//redux
import { listenToUserRealtime, listenToUserRealtime2, listenToUserRealtimeFollowed, listenToUserRealtimeFollowing } from '../redux/slices/UserSlices';
import { getPostUsers, getPostsFromFavouriteUsers } from '../../src/redux/slices/PostSlice';
import { getUserFromFollowedUsers, getUserFromFollowingUsers, listenToFollowerRealtime, listenToFollowingRealtime } from '../redux/slices/FollowerSlice';
import { getUserAchievement, listenToUserAchievementRealtime } from '../redux/slices/AchievementSlice';

const Tab = createMaterialTopTabNavigator();

const UPPER_HEADER_HEIGHT = appInfo.heightWindows * 0.09;
const LOWER_HEADER_HEIGHT = appInfo.heightWindows * 0.14;


const PersonScreen = ({ isAvatar }) => {
    const navigation = useNavigation();
    //firebase
    const followUp = useSelector((state) => state.follower.follower);
    const followingUsers = useSelector((state) => state.follower.following);
    const dataUser = useSelector((state) => state.user.user);
    const iUser = useSelector((state) => state.user.iUser) || {};
    const post = useSelector((state) => state.post.postByUser);
    const postFavourite = useSelector((state) => state.post.postFavourite);
    const userAchievement = useSelector((state) => state.achievement.userAchievement) || {};
    const dispatch = useDispatch();
    const isFocused = useIsFocused(); // Kiểm tra khi tab được focus
 
    //route
    const route = useRoute();
    const userPost = route.params?.userPost ?? {};
    const isFromAvatar = route.params?.isFromAvatar ?? isAvatar;

    //log
    //console.log('dataUser', dataUser);
    //console.log('iUser', iUser);
    //console.log('followUp', followUp);
    //console.log('followingUsers',followingUsers);
    //console.log('userAchievement', userAchievement);


    const follower = useSelector(state => state.follower.follower);
    const isFlag = follower.some(f => f.user_id === userPost.user_id);

    const handleFollowButton = useCallback(() => {
        const handleFollowUser = async () => {
            if (isFlag) {
                await dispatch(deleteFollow({ follower_user_id: dataUser.user_id, user_id: iUser.user_id }));
                // await dispatch(stopListeningFollowers({ follower_user_id: user.user_id }));


            } else {
                await dispatch(createFollow({ follower_user_id: dataUser.user_id, user_id: iUser.user_id }));
                // await dispatch(startListeningFollowers({ follower_user_id: user.user_id }));
            }
        }
        handleFollowUser();
    });

    //Copy
    const [showToast, setShowToast] = useState(false);
    const copyToClipboard = (id) => {
        Clipboard.setString(id);
        // Hiển thị thông báo
        setShowToast(true);

        // Tự động ẩn thông báo sau 2 giây
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
        setShowToast(true);
    };
    // Ẩn cảnh báo liên quan đến Clipboard
    LogBox.ignoreLogs([
        'Clipboard has been extracted from react-native core',
    ]);
    //Animated
    const animatedValue = useRef(new Animated.Value(0)).current;

    const avatarAnimation = {
        opacity: animatedValue.interpolate({
            inputRange: [0, UPPER_HEADER_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        }),
    };
    const avatarHeaderAnimation = {
        opacity: animatedValue.interpolate({
            inputRange: [0, LOWER_HEADER_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        }),
    };
    //BottomSheet
    const snapPoints = useMemo(() => ['30%'], []);
    const bottomSheetModalRef = useRef(null);
    const handleManagement = () => {
        bottomSheetModalRef.current?.present();
    }
    const onClose = () => {

    }
    useEffect(() => {
        if (isFocused) {
            const fetchData = async () => {
                try {
                    // Kiểm tra nếu đang từ avatar, lấy thông tin người dùng
                    if (isFromAvatar) {
                        //console.log('Fetching user data in real-time');
                        await dispatch(listenToUserRealtime2(userPost.email));  // Nếu cần async
                    } 
                    //Danh Hiệu
                    await dispatch(listenToUserAchievementRealtime({ achie_id: isFromAvatar ? userPost.achie_id : dataUser.achie_id }));
                    await dispatch(getUserAchievement({ achie_id: isFromAvatar ? userPost.achie_id : dataUser.achie_id }));
                    //lắng nghe realtime về followers
                    await dispatch(listenToFollowerRealtime({ follower_user_id: isFromAvatar ? userPost.user_id : dataUser.user_id }));
                    //lắng nghe realtime về following
                    await dispatch(listenToFollowingRealtime({ follower_user_id: isFromAvatar ? userPost.user_id : dataUser.user_id }));
                    // Bài viết 
                    await dispatch(getPostUsers({ field: "created_at", currentUserId: isFromAvatar ? userPost.user_id : dataUser.user_id }));
                    // Yêu thích
                    await dispatch(getPostsFromFavouriteUsers({ field: "created_at", currentUserId: isFromAvatar ? userPost.user_id : dataUser.user_id }));
                    // Theo dõi
                    await dispatch(getUserFromFollowedUsers({ field: "created_at", currentUserId: isFromAvatar ? userPost.user_id : dataUser.user_id }));
                    // Người theo dõi
                    await dispatch(getUserFromFollowingUsers({ field: "created_at", currentUserId: isFromAvatar ? userPost.user_id : dataUser.user_id }));

                } catch (error) {
                    console.error("Error during data fetching: ", error);
                }
            };

            fetchData();
        }
    }, [isFocused, isFromAvatar, userPost.user_id, dataUser.user_id, userPost.achie_id, dataUser.achie_id, dispatch]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* {isFromAvatar ? userPost.length === 0 : dataUser.length === 0 ? (
                <View>
                    <SkeletonComponent Data={""} style={{ width: '
                    100%', height: appInfo.heightWindows * 0.15 }} />
                    <View style={{ margin: '5%' }}>
                        <SkeletonComponent isAvatar Data={""} style={{ width: 80, height: 80 }} />
                        <SkeletonComponent Data={""} style={{ width: '60%', height: appInfo.heightWindows * 0.02 }} />
                        <SkeletonComponent Data={""} style={{ width: '70%', height: appInfo.heightWindows * 0.02 }} />
                        <SkeletonComponent Data={""} style={{ width: '80%', height: appInfo.heightWindows * 0.02 }} />
                    </View>
                </View>
            ) : ( */}
            <View >
                <View style={styles.upperHeaderPlacehholder} />
                <View style={styles.header}>
                    <ImageBackground source={{ uri: isFromAvatar ? iUser.backgroundUser : dataUser.backgroundUser }} style={styles.imageBackground}>
                        <View style={styles.upperrHeader}>
                            <Animated.View style={[styles.avatarHeader, avatarHeaderAnimation, isFromAvatar && { marginLeft: '7%' }]}>
                                <AvatarEx size={appInfo.heightWindows * 0.035} round={90} url={isFromAvatar ? iUser.imgUser : dataUser.imgUser} />
                                <Text style={styles.avatarText}>{isFromAvatar ? iUser.username : dataUser.username}</Text>
                            </Animated.View>
                        </View>
                        {
                            isFromAvatar ?
                                <View style={styles.back}>
                                    <ButtonBackComponent color={'white'} />
                                </View>
                                : <View style={styles.setting}>
                                    <IconComponent name={'settings'} size={appInfo.heightWindows * 0.03} color={'white'} onPress={() => navigation.navigate('SettingScreen')} />
                                </View>
                        }
                        <View style={styles.lowerHeader} />
                    </ImageBackground>
                </View>
                {showToast && (
                    <View style={styles.toastContainer}>
                        <Text style={styles.toastText}>Đã sao chép thành công!</Text>
                    </View>
                )}
                <ScrollView
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    onScroll={e => {
                        const offsetY = e.nativeEvent.contentOffset.y;
                        animatedValue.setValue(offsetY);
                    }}
                >
                    <TouchableOpacity
                        style={styles.paddingForHeader}
                        onPress={() => navigation.navigate('BackgroundScreen')}
                    />
                    <View style={styles.scrollViewContent}>
                        <View style={{
                            flexDirection: 'row', width: "100%",
                            // backgroundColor: "yellow",
                        }}>
                            <Animated.View style={[styles.avatar, avatarAnimation]}>
                                <AvatarEx
                                    url={isFromAvatar ? iUser.imgUser : dataUser.imgUser}
                                    size={appInfo.widthWindows * 0.22}
                                    round={20}
                                    frame={userAchievement.nameAchie}
                                    name={isFromAvatar ? iUser.username : dataUser.username} />
                                <Text style={[StyleGlobal.textTitleContent, { marginTop: '3%' }]}>{isFromAvatar ? iUser.username : dataUser.username}</Text>
                            </Animated.View>


                            {!isFromAvatar ?
                                <View style={{
                                    // backgroundColor: 'red',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}>
                                    <View style={{ marginLeft: 'auto', margin: appInfo.widthWindows * 0.02 }}>
                                        <IconComponent
                                            name={'edit'}
                                            size={appInfo.heightWindows * 0.025}
                                            color={'#190AEF'}
                                            text={'Chỉnh sửa'}
                                            textColor={'#190AEF'}
                                            style={styles.buttonEdit}
                                            onPress={() => navigation.navigate('InfomationScreen')}
                                        />
                                    </View>
                                </View>
                                :
                                <View style={{
                                    // backgroundColor: 'red',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    width: '100%',
                                    paddingRight: '6%',
                                    paddingTop: '3%',
                                }}>
                                    <TouchableOpacity
                                        // disabled={isFollow}
                                        activeOpacity={0.6}
                                        onPress={() => handleFollowButton}
                                        style={{
                                            borderColor: "rgba(121,141,218,1)",
                                            borderRadius: 100,
                                            borderWidth: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "27%",
                                            height: 40,
                                            paddingHorizontal: "2%",
                                            // opacity: isFollow ? 0 : 1,
                                        }}
                                    >
                                        <Text style={{ ...StyleGlobal.text, color: "rgba(101,128,255,1)", fontWeight: "bold" }}>{isFlag ? "Hủy theo dõi" : "Theo dõi"}</Text>
                                    </TouchableOpacity>
                                </View>
                            }

                        </View>

                        <View style={styles.iconRow}>
                            <IconComponent
                                name={'credit-card'}
                                size={appInfo.heightWindows * 0.025}
                                color={'#33363F'}
                                text={'ID: ' + (isFromAvatar ? iUser.user_id : dataUser.user_id)}
                                onPress={() => copyToClipboard(isFromAvatar ? iUser.user_id : dataUser.user_id)} />
                            <IconComponent
                                name={'user'}
                                size={appInfo.heightWindows * 0.025}
                                color={'#33363F'}
                                text={userAchievement.nickname}
                                onPress={() => navigation.navigate('AchievementsScreen')}
                                disabled={isFromAvatar} />
                        </View>

                        <View style={styles.statisticsContainer}>
                            <StatisticsComponent quantity={post.length} name={'Bài Viết'} />
                            <StatisticsComponent quantity={followUp.length} name={'Theo Dõi'} onPress={() => navigation.navigate('FollowUp')} />
                            <StatisticsComponent quantity={followingUsers.length} name={'Người Theo Dõi'} onPress={() => navigation.navigate('FollowerScreen')} />
                            <StatisticsComponent quantity={0} name={'Lượt Thích'} />
                        </View>
                        {/*  Tab Navigation */}
                        <TabRecipe post={post} postFavourite={postFavourite} user={isFromAvatar ? iUser : dataUser} />
                    </View>
                </ScrollView>
            </View>
            {/* )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    upperHeaderPlacehholder: {
        height: UPPER_HEADER_HEIGHT,
    },
    header: {
        position: 'absolute',
        width: '100%',
        backgroundColor: '#000000',
    },
    upperrHeader: {
        height: appInfo.heightWindows * 0.05,
    },
    lowerHeader: {
        height: LOWER_HEADER_HEIGHT,
    },
    paddingForHeader: {
        height: appInfo.heightWindows * 0.1,
    },
    scrollViewContainer: {
        flexGrow: 1, // Đảm bảo ScrollView có chiều cao đủ để chứa nội dung
    },
    scrollViewContent: {
        backgroundColor: 'white',
    },
    buttonEdit: {
        justifyContent: 'center',
        borderColor: '#190AEF',
        borderWidth: 2,
        borderRadius: 90,
        padding: 5,
        width: appInfo.widthWindows * 0.3
    },
    avatar: {
        position: 'absolute',
        marginRight: 'auto',
        bottom: appInfo.heightWindows * 0.003,
        left: appInfo.widthWindows * 0.05,
        alignItems: 'center',
    },
    avatarHeader: {
        position: 'absolute',
        flexDirection: 'row',
        top: appInfo.heightWindows * 0.05, // Điều chỉnh vị trí theo chiều dọc
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        marginLeft: '8%', // Khoảng cách giữa ảnh đại diện và tên
        color: 'white',
        fontSize: 12,
    },
    setting: {
        position: 'absolute', // Đặt nút settings ở vị trí tuyệt đối
        right: '3%', // Căn phải cách một khoảng
        top: appInfo.heightWindows * 0.05, // Điều chỉnh vị trí theo chiều dọc
        zIndex: 1,
    },
    back: {
        position: 'absolute', // Đặt nút settings ở vị trí tuyệt đối
        left: '1%', // Căn phải cách một khoảng
        top: appInfo.heightWindows * 0.05, // Điều chỉnh vị trí theo chiều dọc
        zIndex: 1,
    },
    iconRow: {
        marginLeft: appInfo.widthWindows * 0.03,
    },
    statisticsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        padding: appInfo.widthWindows * 0.025,
    },
    overlay: {
        width: '100%',
        position: 'absolute',
        flex: 1,
        flexDirection: 'row',
    },
    subtitle: {
        color: '#181D31',
        fontWeight: 'bold',
    },
    card: {
        height: 100,
        backgroundColor: '#E6DDC4',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 18,
        color: '#333',
    },
    activeTabText: {
        fontWeight: 'bold',
        color: '#007BFF',
    },
    contentContainer: {
        flex: 1,
        marginTop: appInfo.heightWindows * 0.02,
    },
    tabContent: {
        padding: 10,
    },
    item: {
        fontSize: 18,
        marginBottom: 8,
    },
    toastContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 8,
        top: '50%', // Căn giữa theo chiều dọc
        zIndex: 1, // Đảm bảo thông báo hiển thị trên các phần khác
    },
    toastText: {
        color: '#fff',
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    closeButton: {
        position: 'absolute',
        left: '3%',
    },
    headerText: {
        fontSize: 20,
    },
    actionsContainer: {
        marginTop: 20,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    actionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000000',
    },

});
export default PersonScreen



import { StyleSheet, View, TouchableOpacity, ImageBackground, ScrollView, Animated, Text } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector, useDispatch } from "react-redux";
//style
import { StyleGlobal } from '../styles/StyleGlobal'
//components
import { SkeletonComponent, IconComponent, StatisticsComponent, AvatarEx } from '../component';
//screen
import ArticleScreen from './ArticleScreen';
import FavouriteScreen from './FavouriteScreen';
import GroupScreen from './GroupScreen';
//constains
import { appInfo } from '../constains/appInfo';
import { appcolor } from '../constains/appcolor';
//redux
import { getUser } from '../redux/slices/UserSlices';
const Tab = createMaterialTopTabNavigator();

const UPPER_HEADER_HEIGHT = appInfo.heightWindows * 0.09;
const LOWER_HEADER_HEIGHT = appInfo.heightWindows * 0.14;


const PersonScreen = () => {
    const navigation = useNavigation();
    //firebase
    const user = useSelector((state) => state.user.user);
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
    const [selectedTab, setSelectedTab] = useState('articles');
    // Hàm để render nội dung tương ứng với tab
    const renderContent = () => {
        switch (selectedTab) {
            case 'articles':
                return (
                    <View>
                        <ArticleScreen />
                    </View>
                );
            case 'favorites':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.item}>Yêu thích 1: React Navigation</Text>
                    </View>
                );
            case 'topics':
                return (
                    <View style={styles.tabContent}>
                        <GroupScreen />
                    </View>
                );
            default:
                return null;
        }
    };
    //console.log('user[0]', user);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.upperHeaderPlacehholder} />
            <View style={styles.header}>
                <ImageBackground source={{ uri: user.backgroundUser }} style={styles.imageBackground}>
                    <View style={styles.upperrHeader}>
                        <Animated.View style={[styles.avatarHeader, avatarHeaderAnimation]}>
                            <AvatarEx
                                size={appInfo.heightWindows * 0.035}
                                round={90}
                                url={user.imgUser}
                            />
                            <Text style={styles.avatarText}>{user.username}</Text>
                        </Animated.View>
                    </View>
                    <View style={styles.setting}>
                        <IconComponent name={'settings'} size={appInfo.heightWindows * 0.03} color={'white'} onPress={() => navigation.navigate('SettingScreen')} />
                    </View>
                    <View style={styles.lowerHeader} />
                </ImageBackground>
            </View>

            <ScrollView
                nestedScrollEnabled={true}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer} // Sử dụng contentContainerStyle
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
                    <View style={{ flexDirection: 'row' }}>
                        {/* Avatar */}
                        <Animated.View style={[styles.avatar, avatarAnimation]}>
                            <AvatarEx
                                url={user.imgUser}
                                size={appInfo.widthWindows * 0.22}
                                round={20}
                                frame={user.frame_user}
                                name={user.username}
                            />
                            <Text style={[StyleGlobal.textTitleContent, {marginTop: '3%'}]}>{user[0].username}</Text>
                            
                        </Animated.View>
                        {/* Chỉnh sửa */}
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

                    {
                        user.length === 0 || !user.user_id ? (
                            <View style={styles.iconRow}>
                                <SkeletonComponent
                                    Data={""}
                                    style={{ width: '100%', height: appInfo.heightWindows * 0.1 }}
                                />
                                <SkeletonComponent
                                    Data={""}
                                    style={{ width: '100%', height: appInfo.heightWindows * 0.1 }}
                                />
                            </View>
                        ) : (
                            <View style={styles.iconRow}>
                                <IconComponent name={'credit-card'}
                                    size={appInfo.heightWindows * 0.025}
                                    color={'#33363F'}
                                    text={'ID: ' + user.user_id} />
                                <IconComponent name={'user'}
                                    size={appInfo.heightWindows * 0.025}
                                    color={'#33363F'}
                                    text={'Người ' + user.nickname}
                                    onPress={() => navigation.navigate('NickNameScreen', { nicknameUser: user.nickname })} />
                            </View>
                        )
                    }

                    <View style={styles.statisticsContainer}>
                        <StatisticsComponent quantity={0} name={'Bài Viết'} />
                        <StatisticsComponent quantity={0} name={'Theo Dõi'} onPress={() => navigation.navigate('TrackingScreen')} />
                        <StatisticsComponent quantity={0} name={'Người Theo Dõi'} onPress={() => navigation.navigate('FollowerScreen')} />
                        <StatisticsComponent quantity={0} name={'Lượt Thích'} />
                    </View>

                    {/* Tab Navigator */}
                    <View style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={styles.tabBar}>
                                <TouchableOpacity onPress={() => setSelectedTab('articles')} style={styles.tab}>
                                    <Text style={[styles.tabText, selectedTab === 'articles' && styles.activeTabText]}>Bài viết</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedTab('favorites')} style={styles.tab}>
                                    <Text style={[styles.tabText, selectedTab === 'favorites' && styles.activeTabText]}>Yêu thích</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setSelectedTab('topics')} style={styles.tab}>
                                    <Text style={[styles.tabText, selectedTab === 'topics' && styles.activeTabText]}>Chủ Đề</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.contentContainer}>
                                {renderContent()}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView >
        </View >
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
        marginTop: appInfo.heightWindows * 0.02,
        flexGrow: 1,
    },
    tabContent: {
        padding: 10,
    },
    item: {
        fontSize: 18,
        marginBottom: 8,
    },

});
export default PersonScreen



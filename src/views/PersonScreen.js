import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, ImageBackground, ScrollView, Animated, Text } from 'react-native'
import React, { useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
//style
import { StyleGlobal } from '../styles/StyleGlobal'
//components
import { UserAvatarComponent, IconComponent, StatisticsComponent, AvatarEx } from '../component';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';

const DATA = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
];
const UPPER_HEADER_HEIGHT = appInfo.heightWindows * 0.08;
const LOWER_HEADER_HEIGHT = appInfo.heightWindows * 0.15;


const PersonScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation\
    const animatedValue = useRef(new Animated.Value(0)).current;
    //Avatar
    const avatarAnimation = {
        opacity: animatedValue.interpolate({
            inputRange: [0, UPPER_HEADER_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        })
    }
    //Avatar Header
    const avatarHeaderAnimation = {
        opacity: animatedValue.interpolate({
            inputRange: [0, LOWER_HEADER_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        })
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.upperHeaderPlacehholder} />
            <View style={styles.header}>
                <ImageBackground source={require('../../assets/background/background4.jpg')} style={styles.imageBackground}>
                    <View style={styles.upperrHeader}>
                        <Animated.View style={[styles.avatarHeader, avatarHeaderAnimation]}>
                            <AvatarEx
                                size={30}
                                round={90}
                                url={'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'}
                            />
                            <Text style={{ left: '20%', color: 'white', fontSize: 12 }}>Gia Huy</Text>
                        </Animated.View>
                    </View>
                    <View style={styles.setting}>
                        <IconComponent name={'settings'} size={24} color={'white'} onPress={() => navigation.navigate('InfomationScreen')} />
                    </View>

                    <View style={styles.lowerHeader} />
                </ImageBackground>
            </View>
            <ScrollView
                scrollEventThrottle={5}
                showsHorizontalScrollIndicator={false}
                onScroll={e => {
                    const offsetY = e.nativeEvent.contentOffset.y;
                    animatedValue.setValue(offsetY);
                }}>
                <TouchableOpacity
                    style={styles.paddingForHeader}
                    onPress={() => navigation.navigate('BackgroundScreen')}>
                </TouchableOpacity>

                <View style={styles.scrollViewContent}>
                    <View style={{ flexDirection: 'row' }}>
                        <Animated.View style={[styles.avatar, avatarAnimation]}>
                            <UserAvatarComponent name={'ABC'} />
                        </Animated.View>
                        <View style={{ marginLeft: 'auto', margin: appInfo.widthWindows * 0.02 }}>
                            <IconComponent name={'edit'} size={24} color={'#190AEF'} text={'Chỉnh sửa'} textColor={'#190AEF'}
                                style={styles.button}
                                onPress={() => navigation.navigate('InfomationScreen')} />
                        </View>
                    </View>
                    <View style={styles.iconRow}>
                        <IconComponent
                            name={'credit-card'}
                            size={24}
                            color={'#33363F'}
                            text={'ID: ' + '123456'} />
                        <IconComponent
                            name={'user'}
                            size={24}
                            color={'#33363F'}
                            text={'Người bình thường'}
                            onPress={() => navigation.navigate('NickNameScreen')} />
                    </View>
                    <View style={styles.statisticsContainer}>
                        <StatisticsComponent quantity={0} name={'Bài Viết'} />
                        <StatisticsComponent quantity={0} name={'Theo Dõi'} />
                        <StatisticsComponent quantity={0} name={'Người Theo Dõi'} />
                        <StatisticsComponent quantity={0} name={'Lượt Thích'} />
                    </View>
                    {DATA.map(val => {
                        return (
                            <View key={val.id} style={styles.card}>
                                <Text style={styles.subtitle}>({val.id})</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView >
        </View>
    )
}

const styles = StyleSheet.create({
    upperHeaderPlacehholder: {
        height: appInfo.heightWindows * 0.09,
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
        height: appInfo.heightWindows * 0.14,
    },
    paddingForHeader: {
        height: appInfo.heightWindows * 0.1,
    },
    scrollViewContent: {
        height: appInfo.heightWindows * 2,
        backgroundColor: 'white',
    },
    button: {
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
    },
    avatarHeader: {
        position: 'absolute',
        flexDirection: 'row',
        left: appInfo.heightWindows * 0.01,
        top: appInfo.heightWindows * 0.05, // Điều chỉnh vị trí theo chiều dọc
        alignItems: 'center',
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

});
export default PersonScreen



import { StyleSheet, View, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView, Animated, Text } from 'react-native'
import React, { useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
//style
import { StyleGlobal } from '../styles/StyleGlobal'
//components
import { UserAvatarComponent, IconComponent, StatisticsComponent } from '../component';
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

const Header_Max_Height = appInfo.heightWindows * 0.18;
const Header_Min_Height = appInfo.heightWindows * 0.1;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({ value }) => {
    const animatedHeaderHeight = value.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [Header_Max_Height, Header_Min_Height],
        extrapolate: 'clamp',
    });
    const animatedOpacity = value.interpolate({
        inputRange: [0, Scroll_Distance / 2, Scroll_Distance],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });
    // source={{ uri: 'https://images4.alphacoders.com/973/973967.jpg' }}
    return (
        <View>
            <Animated.View style={[styles.header, { height: animatedHeaderHeight }]}>

                <Animated.View style={styles.overlay}>
                    <Animated.View style={[styles.avatar, { opacity: animatedOpacity }]}>
                        <UserAvatarComponent name={'ABC'} />
                    </Animated.View>
                    <View style={styles.setting}>
                        <IconComponent name={'settings'} size={32} color={'#222222'} />
                    </View>
                </Animated.View>
            </Animated.View>
        </View>

    );
}
const PersonScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation\
    const srcollOffsetY = useRef(new Animated.Value(0)).current;
    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView>
                <View style={styles.upperHeaderPlacehholder} />
            </SafeAreaView>
            <SafeAreaView style={styles.header}>
                <View style={styles.upperrHeader}>
                    <ImageBackground>
                        
                    </ImageBackground>
                </View>
                <View style={styles.lowerHeader} />
            </SafeAreaView>
            <ScrollView
                scrollEventThrottle={5}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { y: srcollOffsetY } } }
                ], {
                    useNativeDriver: false,
                },)} >
                <View style={styles.paddingForHeader}></View>
                <View style={styles.scrollViewContent}>
                    <View style={{ marginLeft: 'auto', margin: appInfo.widthWindows * 0.02 }}>
                        <IconComponent name={'edit'} size={24} color={'#190AEF'} text={'Chỉnh sửa'} textColor={'#190AEF'}
                            style={styles.button}
                            onPress={() => navigation.navigate('InfomationScreen')} />
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
        height: appInfo.heightWindows * 0.03,
    },
    header: {
        position: 'absolute',
        width: '100%',
        backgroundColor: '#000000',
    },
    paddingForHeader: {
        height: appInfo.heightWindows * 0.1,
    },
    upperrHeader: {
        height: appInfo.heightWindows * 0.03,
    },
    lowerHeader:{
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
        marginLeft: '5%',
        top: appInfo.heightWindows * 0.08,
    },
    setting: {
        position: 'absolute', // Đặt nút settings ở vị trí tuyệt đối
        right: '3%', // Căn phải cách một khoảng
        top: appInfo.heightWindows * 0.05, // Điều chỉnh vị trí theo chiều dọc
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
        alignItems: 'center',
    },

});
export default PersonScreen



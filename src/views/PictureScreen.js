
import { View, StatusBar, Text, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'

import { useRoute } from '@react-navigation/native'
import PagerView from 'react-native-pager-view'
import Feather from 'react-native-vector-icons/Feather'
import AndtDegisn from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


import { appInfo } from '../constains/appInfo'
import { appcolor } from '../constains/appcolor'
import { data } from '../constains/data'
import AnimatedQuickCmtComponent from '../component/commentBox/AnimatedQuickCmtComponent'
import { AvatarEx, ButtonsComponent } from '../component'
// import { AvatarEx } from '../component'
// import RowComponent from '../RowComponent';

const PictureScreen = ({ }) => {
    const [index, setIndex] = useState(0);
    const route = useRoute();
    const { Data: post, Select, User, emoji } = route.params;

    const [isVisible, setIsVisible] = useState(true); // Hiển thị hoặc ẩn thanh navigate bar và các component khác

    // const DataLength = Object.keys(Data.imgPost).length;
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();

    // console.log(Select);

    const handleIndex = num => {
        setIndex(num.nativeEvent.position + 1);
    }

    const handleSaveImage = async (url) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync(); // Yêu cầu quyền truy cập thư viện
            if (status !== 'granted') {
                Alert.alert('Quyền bị từ chối!', 'Bạn cần cấp quyền truy cập để lưu hình ảnh.');
                return;
            }
            const fileName = url.split('/').pop(); // Lấy tên file từ url
            const fileUri = `${FileSystem.documentDirectory}${fileName}`; // Đường dẫn lưu file
            const download = await FileSystem.downloadAsync(url, fileUri); // Tải file về để lưu vào thiết bị

            if (download.status === 200) {
                const asset = await MediaLibrary.createAssetAsync(download.uri);
                await MediaLibrary.createAlbumAsync('Download', asset, false);
                Alert.alert('Thành công', 'Hình ảnh đã được lưu thành công!');
            } else {
                Alert.alert('Lỗi', 'Không thể lưu hình ảnh.');
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
                <Feather name='x' color={'white'} size={24}
                    onPress={() => navigation.goBack()} />

                <View style={{ flex: 1, alignItems: 'center' }}>
                    {/* Image Index Versoin 1 */}
                    {/* <Text style={{ color: "white" }}>{index}/{DataLength}</Text> */}
                </View>
                <Feather name='more-vertical' color={'white'} size={24} />
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
                menuContext={{ saveToLocal: 'Lưu hình', cancel: 'Hủy' }}
                onSave={(url) => handleSaveImage(url)}
            />

            {isVisible && <View style={{ flex: 1, position: 'absolute', zIndex: 999, bottom: 0, right: 0, left: 0, height: 300 }}>
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

                <View style={{ height: "80%", flexDirection: "row" }}>
                    <View style={{ width: "80%", height: "auto", justifyContent: "flex-end" }} >
                        <View style={{ width: "100%", height: "auto", marginLeft: "5%" }} >
                            <Text style={{ color: "white" }}>{post.title}</Text>
                        </View>
                    </View>
                    <View style={{ width: "20%", height: "100%", alignItems: 'center' }}>
                        <ButtonsComponent isButton style={{ alignItems: "center", marginBottom: "10%" }}>
                            <AvatarEx size={50} round={30} url={User.imgUser} style={{ marginRight: "3%" }} />
                            {/* <Image source={{ uri: User.avatar }}// info.user.avatar "https://avatars.githubusercontent.com/u/118148132?v=4"
                                style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: 'white' }} /> */}
                        </ButtonsComponent>

                        <ButtonsComponent isButton>
                            <AndtDegisn name='pluscircle' color={appcolor.primary} size={17} style={{ width: 17, height: 17, backgroundColor: "white", borderRadius: 100, marginTop: "-15%", top: -5 }} />

                        </ButtonsComponent>

                        <TouchableOpacity style={{ alignItems: "center" }}>
                            <AndtDegisn name='like1' color={"white"} size={30} />
                            <Text style={{ color: "white" }}>20</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: "center" }}>
                            <MaterialCommunityIcons name='comment-processing' color={"white"} size={30} />
                            <Text style={{ color: "white" }}>20</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: "center" }}>
                            <AndtDegisn name='star' color={"white"} size={30} />
                            <Text style={{ color: "white" }}>20</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: "20%" }} >
                    {<AnimatedQuickCmtComponent isNomal post={data.user} userPost={User} emoji={emoji} />}
                </View>

            </View>}

        </View>

    )
}

export default PictureScreen

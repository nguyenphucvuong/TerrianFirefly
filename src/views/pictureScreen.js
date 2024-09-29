
import { View, StatusBar, Text, TouchableOpacity } from 'react-native'
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

import { appInfo } from '../constains/appInfo'
import { appcolor } from '../constains/appcolor'
import AnimatedQuickCmtComponent from '../component/commentBox/AnimatedQuickCmtComponent'
// import { AvatarEx } from '../component'
// import RowComponent from '../RowComponent';

const PictureScreen = ({ }) => {
    const [index, setIndex] = useState(0);
    const route = useRoute();
    const { Data, Select } = route.params;

    const DataLength = Object.keys(Data).length;
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleIndex = num => {
        setIndex(num.nativeEvent.position + 1);
    }

    {/* Image Viewer Versoin 1 */ }
    const imageUrls = Data.map((item) => ({ url: item }));
    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Tab Status Bar */}
            <StatusBar barStyle={'default'} />
            <View style={{
                flexDirection: "row",
                position: 'absolute',
                zIndex: 999,
                top: inset.top + 25, // Chưa tìm được cách nâng hiển thị index của ImageViewer lên, nên tạm thời hạ thanh navigate bar xuống
                padding: 10,
            }}>
                <Feather name='x' color={'white'} size={24}
                    onPress={() => navigation.goBack()} />

                <View style={{ flex: 1, alignItems: 'center' }}>
                    {/* Image Index Versoin 1 */}
                    {/* <Text style={{ color: "white" }}>{index}/{DataLength}</Text> */}
                </View>

                <Feather name='more-vertical' color={'white'} size={24} />
            </View>

            {/* Image Viewer Versoin 1 */}
            {/* <PagerView style={{ flex: 1 }} initialPage={Select}
                onPageSelected={handleIndex}>
                {Data.map((item, index) => (
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
            />
            <View style={{ flex: 1, position: 'absolute', zIndex: 999, bottom: 0, right: 0, left: 0, height: 300 }}>
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
                    <View style={{ width: "80%", height: "100%", }} />
                    <View style={{ width: "20%", height: "100%", alignItems: 'center' }}>
                        <TouchableOpacity style={{ alignItems: "center", marginBottom: "10%" }}>
                            <Image source={{ uri: "https://avatars.githubusercontent.com/u/118148132?v=4" }}
                                style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: 'white' }} />
                            <AndtDegisn name='pluscircle' color={appcolor.primary} size={17} style={{ width: 17, height: 17, backgroundColor: "white", borderRadius: 100, marginTop: "-15%" }} />
                        </TouchableOpacity>
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
                    {<AnimatedQuickCmtComponent isNomal />}
                </View>

            </View>
        </View>

    )
}

export default PictureScreen

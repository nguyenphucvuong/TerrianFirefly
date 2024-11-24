import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ToastAndroid, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useDispatch, useSelector } from 'react-redux';
import { Image } from 'expo-image';
import Entypo from 'react-native-vector-icons/Entypo';

import { appcolor } from '../constains/appcolor';


import { startListeningHashtags } from '../redux/slices/HashtagSlice';
import { createRequest } from '../redux/slices/RequestSlice';
import { Toast } from 'react-native-alert-notification';

const RequestAdminScreen = (num) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params;
    const dispatch = useDispatch();
    const hashtag = useSelector((state) => state.hashtag.specical);
    useEffect(() => {
        dispatch(startListeningHashtags());
    }, []);




    const [selectedHashtag, setSelectedHashtag] = useState(hashtag[0]?.hashtag_id);
    // useEffect(() => {
    //     console.log("selectedHashtag", selectedHashtag)
    // }, [selectedHashtag]);

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);

    const selectImage = async (num) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,  // Tắt chế độ chỉnh sửa ảnh
            //aspect: [4, 3],        // Tùy chọn này không cần thiết khi allowsEditing là false
            quality: 1,            // Giữ nguyên chất lượng ảnh
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            console.log("Selected Image URI:", selectedImageUri);

            // Cập nhật state cho hình ảnh
            num == 1 ? setImage1({ uri: selectedImageUri }) : num == 2 ? setImage2({ uri: selectedImageUri }) : setImage3({ uri: selectedImageUri });
            // console.log("ádasdasd", { uri: selectedImageUri })
        } else {
            console.log("Image selection was canceled or no assets found.");
        }
    };

    const [text, setText] = useState("")
    const handleSendRequest = () => {
        if (selectedHashtag == null || image1 == null || image2 == null || image3 == null) {
            alert("Vui lòng chọn hashtag và ảnh");
            return;
        }
        dispatch(createRequest(dataRequest))
        ToastAndroid.show("Gửi yêu cầu thành công", ToastAndroid.SHORT);
        navigation.goBack();
    }

    const dataRequest = {
        request_id: "",
        user_id: user.user_id,
        hashtag_id: selectedHashtag,
        created_at: Date.now(),
        info_img1: image1,
        info_img2: image2,
        info_img3: image3,
        description: text,
        status: "pending",
    }

    return (
        <>
            <ScrollView
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                }}>

                <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }}>Nội dung yêu cầu</Text>
                <TextInput
                    onEndEditing={(e) => setText(e.nativeEvent.text)}
                    placeholder="Nhâp nội dung yêu cầu"
                    focusable={true}
                    multiline={true}
                    style={{
                        padding: 10,
                        margin: 10,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        borderRadius: 10,
                    }}
                    defaultValue={text}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }}>Chọn ảnh</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {renderImagePicker(selectImage, image1, 1, "Hình mặt trước căn cước")}
                    {renderImagePicker(selectImage, image2, 2, " Hình mặt sau căn cước")}
                    {renderImagePicker(selectImage, image3, 3, "Hình giấy tờ")}
                </View>

                <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }}>Chọn Hashtag</Text>
                {hashtag.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => setSelectedHashtag(item.hashtag_id)}
                            key={index}
                            activeOpacity={0.75}
                            style={{
                                padding: 10,
                                margin: 10,
                                backgroundColor: item.hashtag_background,
                                flexDirection: 'row',
                                borderRadius: 10,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.5,
                                elevation: 5,
                            }}>
                            <Image
                                source={{ uri: item.hashtag_avatar }}
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 50,
                                    marginRight: 15,
                                }} />
                            <Text style={{ alignSelf: "center", color: item.hashtag_color }}>{item.hashtag_id}</Text>
                            {selectedHashtag != null && selectedHashtag == item.hashtag_id ?
                                <Entypo name="check" size={24} color={appcolor.primary}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        alignSelf: 'center',
                                    }} /> : null}

                        </TouchableOpacity>
                    )
                })}

            </ScrollView >
            <TouchableOpacity
                onPress={() => handleSendRequest()}
                style={{
                    position: 'absolute',
                    backgroundColor: appcolor.primary,
                    padding: 10,
                    margin: 10,
                    bottom: 20,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}>
                <Text style={{ color: 'white', fontSize: 20 }}>Gửi yêu cầu</Text>
            </TouchableOpacity>
        </>
    )
}

const renderImagePicker = (selectImage, image, num, placeholderText) => (
    <TouchableOpacity
        onPress={() => selectImage(num)}
        style={{
            width: 100,
            height: 100,
            backgroundColor: "rgba(0,0,0,0.1)",
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            margin: 10,
        }}>
        {image ? (
            <Image
                source={{ uri: image.uri }}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                }}
            />
        ) : (
            <Text style={{ color: appcolor.primary, alignSelf: "center", justifyContent: "center", textAlign: "center" }}>{placeholderText}</Text>
        )}
    </TouchableOpacity>
);
export default RequestAdminScreen

const styles = StyleSheet.create({})
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';


import { startListeningRequestAccepted, startListeningRequestPending, startListeningRequestRejected, updateRequest } from '../redux/slices/RequestSlice';
import { getUserByField, startListeningUserByID, updateUser } from '../redux/slices/UserSlices';
import { Image } from 'expo-image';
import { appcolor } from '../constains/appcolor';
import { TouchableOpacity } from 'react-native';
import { startListeningHashtagById } from '../redux/slices/HashtagSlice';


const ManageRequestScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const [selectedValue, setSelectedValue] = useState("pending");
    const requestPending = useSelector((state) => state.request.pending);
    const requestAccepted = useSelector((state) => state.request.accepted);
    const requestRejected = useSelector((state) => state.request.rejected);
    const [request, setRequest] = useState(null);



    useEffect(() => {
        // dispatch(startListeningRequestAccepted({}));
        // dispatch(startListeningRequestPending({}));
        // dispatch(startListeningRequestRejected({}));
        // console.log("requestPending", requestPending)
        // console.log("requestAccepted", requestAccepted)
        // console.log("requestRejected", requestRejected)
        console.log("request", request)
    }, [request]);

    useEffect(() => {
        if (selectedValue == "pending") {
            setRequest(requestPending);
        } else if (selectedValue == "accepted") {
            setRequest(requestAccepted);
        } else if (selectedValue == "rejected") {
            setRequest(requestRejected);
        }
    }, [selectedValue, requestPending, requestAccepted, requestRejected]);


    return (
        <>
            <ScrollView
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                }}>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedValue(value)}
                    value={selectedValue}
                    items={[
                        { label: 'Chờ xử lý', value: 'pending' },
                        { label: 'Đã chấp thuận', value: 'accepted' },
                        { label: 'Đã từ chối', value: 'rejected' },
                    ]}
                />
                {request ?
                    request.map((item, index) => {
                        return (
                            <RenderRequestItem key={index} item={item} index={index} />
                        )
                    }) : null}
            </ScrollView>
        </>

    )
}

const RenderRequestItem = ({ item, index }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user[item.user_id]);
    const hashtag = useSelector((state) => state.hashtag[item.hashtag_id]);
    useEffect(() => {
        dispatch(startListeningUserByID({ user_id: item.user_id }));
        if (item.hashtag_id) {
            dispatch(startListeningHashtagById({ hashtag_id: item.hashtag_id }));
        }
    }, [])

    useEffect(() => {
        console.log("hashtag", hashtag)
        // console.log("item", item)
        // }, [item.hashtag_id])
    }, [hashtag])
    const newData = {
        roleid: 2,
    }
    const handleAcceptRequest = () => {
        dispatch(updateRequest({ request_id: item.request_id, field: "status", value: "accepted" }))
        dispatch(updateUser({ user_id: item.user_id, newData: { roleid: 2 } }))
    }
    const handleRejectRequest = () => {
        dispatch(updateRequest({ request_id: item.request_id, field: "status", value: "rejected" }))
        dispatch(updateUser({ user_id: item.user_id, newData: { roleid: 0 } }))
    }
    const handleNagigatePersonScreen = () => {
        navigation.navigate("PersonScreen", { userPost: user, isFromAvatar: true });
    }
    return user ? (
        <View
            key={index}
            style={{
                padding: 10,
                margin: 10,
                // backgroundColor: item.status == "accepted" ? "chartreuse" : item.status == "rejected" ? "crimson" : "white",
                backgroundColor: "white",
                flexDirection: 'column',
                borderRadius: 10,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.5,
                elevation: 5,

            }}>
            <View
                style={{
                    flexDirection: 'row',
                }}>
                <TouchableOpacity
                    onPress={handleNagigatePersonScreen}
                    style={{
                        flexDirection: 'row',
                    }}>

                    <Image
                        source={{ uri: user.imgUser }}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginRight: 10,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                        <Text style={{ alignSelf: 'baseline', fontWeight: "bold" }}>{user.username}</Text>
                        <Text style={{ alignSelf: 'baseline', color: appcolor.textGray }}>{user.user_id}</Text>
                    </View>
                </TouchableOpacity>
                {item.status != "accepted" && item.status != "rejected" ? <TouchableOpacity
                    onPress={() => handleAcceptRequest()}
                    style={{
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        position: 'absolute',
                        right: 50,
                        bottom: "30%",
                    }}>
                    <AntDesign name="checkcircle" size={27} color="green" />
                </TouchableOpacity> : null}
                {item.status != "rejected" ? <TouchableOpacity
                    onPress={() => handleRejectRequest()}
                    style={{
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        position: 'absolute',
                        right: 10,
                        bottom: "30%",
                    }}>
                    <AntDesign name="closecircle" size={27} color="red" />
                </TouchableOpacity> : null}
            </View>

            <Text style={{ margin: 10, fontWeight: "bold" }}>Nội dung yêu cầu: </Text>
            <Text style={{ margin: 10 }}>{item.description}</Text>
            {hashtag ? <View
                style={{
                    padding: 10,
                    margin: 10,
                    backgroundColor: hashtag.hashtag_background,
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
                    source={{ uri: hashtag.hashtag_avatar }}
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        marginRight: 15,
                    }} />
                <Text style={{ alignSelf: "center", color: hashtag.hashtag_color }}>{hashtag.hashtag_id}</Text>


            </View> : null}

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 10,
                }}>
                <View style={{ flexDirection: 'column', }}>
                    {renderImagePicker(item.info_img1, 1, "Hình mặt trước căn cước")}
                    {renderImagePicker(item.info_img2, 2, " Hình mặt sau căn cước")}
                    {renderImagePicker(item.info_img3, 3, "Hình giấy tờ")}
                </View>
            </View>



        </View>

    ) : null
}

const renderImagePicker = (image, num, text) => (
    <View
        style={{
            width: 250,
            height: 250,
            margin: 10,
        }}>
        <Image
            source={{ uri: image }}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 30,
                contentFit: 'contain',

            }}
        />
        <Text style={{ alignSelf: 'center', color: appcolor.textGray }}>{text}</Text>
    </View>
);

export default React.memo(ManageRequestScreen)

const styles = StyleSheet.create({})
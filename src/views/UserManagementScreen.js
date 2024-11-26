import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import RNPickerSelect from 'react-native-picker-select';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { AntDesign } from 'react-native-vector-icons';



import { appcolor } from '../constains/appcolor';
import { appInfo } from '../constains/appInfo';
import { formatDate } from "../utils/converDate"

import RowComponent from '../component/RowComponent';
import YoutubePlayerComponent from '../component/YoutubePlayerComponent';

import { updateReport, deleteReport } from '../redux/slices/ReportSilce';
import { startListeningUserByID, updateUserState } from '../redux/slices/UserSlices';
import { startListeningPostByID, updatePostsByField } from '../redux/slices/PostSlice';
import { startListeningCommentByID, updateCommentByField } from '../redux/slices/CommentSlice';
import { startListeningSubCommentByID, updateSubCommentByField } from '../redux/slices/SubCommentSlice';
import { ButtonsComponent } from '../component';



const UserManagementScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedTypeValue, setSelectedTypeValue] = useState("post");
  const [selectedStatusValue, setSelectedStatusValue] = useState(0); // Status là 012 cho bị báo cáo, không vi phạm, vi phạm
  const reportPost = useSelector(state => state.report.post);
  const reportComment = useSelector(state => state.report.comment);
  const reportSubComment = useSelector(state => state.report.subComment);
  const [report, serReport] = useState(reportPost);

  useEffect(() => {
    if (selectedTypeValue == "post") {
      serReport(reportPost);
    } else if (selectedTypeValue == "comment") {
      serReport(reportComment);
    } else if (selectedTypeValue == "sub_comment") {
      serReport(reportSubComment);
    }
    // console.log("object", report)
  }, [selectedTypeValue, selectedStatusValue, reportPost, reportComment, reportSubComment]);



  useEffect(() => {
    dispatch(startListeningUserByID({}));
    // console.log("report", report)
  }, []);


  return (
    <>
      <ScrollView
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}>
        <RNPickerSelect
          // placeholder={{
          //   label: selectedTypeValue == 'post' ? "Bài đăng" : selectedTypeValue == 'comment' ? "Bình luận" : "Bình luận phụ"
          //   , value: selectedTypeValue
          // }}
          onValueChange={(value) => setSelectedTypeValue(value)}
          value={selectedTypeValue}
          items={[
            { label: 'Bài đăng', value: 'post' },
            { label: 'Bình luận', value: 'comment' },
            { label: 'Bình luận phụ', value: 'sub_comment' },
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
          }}>
          <TouchableOpacity
            onPress={() => setSelectedStatusValue(0)}
            style={{
              width: "30%",
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selectedStatusValue == 0 ? "blueviolet" : appcolor.primary,
              padding: 10,
            }}>
            <Text style={{ color: 'white' }}>Chưa xử lý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedStatusValue(1)}
            style={{
              width: "30%",
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selectedStatusValue == 1 ? "blueviolet" : appcolor.primary,
              padding: 10,
            }}>
            <Text style={{ color: 'white' }}>Đang xử lý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedStatusValue(2)}
            style={{
              width: "30%",
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selectedStatusValue == 2 ? "blueviolet" : appcolor.primary,
              padding: 10,
            }}>
            <Text style={{ color: 'white' }}>Vi phạm</Text>
          </TouchableOpacity>


        </View>


        {report ?
          report.map((item, index) => {

            return item.status == selectedStatusValue ? (

              < ReportItem key={item.item_id} item={item} index={index} />

            ) : null
          }) : null}

      </ScrollView>
    </>
  );
};

const ReportItem = ({ item, index }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user[item.user_id_reported]);
  const post = useSelector(state => state.post[item.item_id]);
  const comment = useSelector(state => state.comment[item.item_id]);
  const subComment = useSelector(state => state.subComment[item.item_id]);
  const [itemReport, setItemReport] = useState(post);
  const [itemStatus, setItemStatus] = useState('status_post_id');
  const [isExpanded, setIsExpanded] = useState(false);




  useEffect(() => {
    // console.log("item.item_type", item.item_type, item.item_id)
    dispatch(startListeningUserByID({ user_id: item.user_id_reported }));
    if (item.item_type == "post") {
      // console.log("vo day post")
      dispatch(startListeningPostByID({ post_id: item.item_id }));
    } else if (item.item_type == "comment") {
      // console.log("vo day comment")
      dispatch(startListeningCommentByID({ comment_id: item.item_id }));
    } else if (item.item_type == "sub_comment") {
      // console.log("vo day subcomment")
      dispatch(startListeningSubCommentByID({ sub_comment_id: item.item_id }));
    }
    // console.log("item", item)
  }, []);
  useEffect(() => {
    const handleCheckReport = async () => {
      if (item.item_type == "post") {
        setItemReport(post);
        setItemStatus('status_post_id');
        // console.log("post", post)
      } else if (item.item_type == "comment") {
        setItemReport(comment);
        setItemStatus('comment_status_id');
      } else if (item.item_type == "sub_comment") {
        setItemReport(subComment);
        setItemStatus('sub_comment_status_id');
        // console.log("ItemReport subComment", itemReport)
      }

      // Kiểm tra xem bài đăng, bình luận, bình luận phụ đã bị xóa chưa
      if (item.item_type == "post" && post && post.status_post_id == 2 && item.status == 1) {
        await dispatch(deleteReport({ report_id: item.report_id }));
      } else if (item.item_type == "comment" && comment && comment.comment_status_id == 2 && item.status == 1) {
        await dispatch(deleteReport({ report_id: item.report_id }));
      } else if (item.item_type == "sub_comment" && subComment && subComment.sub_comment_status_id == 2 && item.status == 1) {
        await dispatch(deleteReport({ report_id: item.report_id }));
      }

      // Kiểm tra thời gian báo cáo đã quá 3 ngày chưa
      if (item.item_type == "post" && post && post.status_post_id == 1 && item.status == 1 && item.status_changed_at <= Date.now() - 259200000) {
        await dispatch(updateReport({ report_id: item.report_id, field: "status", value: 2 }));
        checkUserCountReport();
        await dispatch(updatePostsByField({ post_id: item.item_id, field: "status_post_id", value: 2 }));
      } else if (item.item_type == "comment" && comment && comment.comment_status_id == 1 && item.status == 1 && item.status_changed_at <= Date.now() - 259200000) {
        await dispatch(updateReport({ report_id: item.report_id, field: "status", value: 2 }));
        checkUserCountReport();
        await dispatch(updateCommentByField({ comment_id: item.item_id, field: "comment_status_id", value: 2 }));
      } else if (item.item_type == "sub_comment" && subComment && subComment.sub_comment_status_id == 1 && item.status == 1 && item.status_changed_at <= Date.now() - 259200000) {
        await dispatch(updateReport({ report_id: item.report_id, field: "status", value: 2 }));
        checkUserCountReport();
        await dispatch(updateSubCommentByField({ sub_comment_id: item.item_id, field: "sub_comment_status_id", value: 2 }));
      }
    }
    handleCheckReport();
    // console.log("itemReport", itemReport)
  }, [post, comment, subComment]);
  const handleNagigatePersonScreen = () => {
    navigation.navigate("PersonScreen", { userPost: user, isFromAvatar: true });
  }

  const checkUserCountReport = async () => {
    if (user.report_count >= 2) {
      await dispatch(updateUserState({ user_id: user.user_id, field: "status", value: 2 }));
    } else {
      await (updateUserState({ user_id: user.user_id, field: "report_count", value: user.report_count + 1 }));
      await (updateUserState({ user_id: user.user_id, field: "status", value: 1 }));
    }
  }

  const handleSendWarning = async () => {
    if (item.status == 0) {
      await dispatch(updateReport({ report_id: item.report_id, field: "status", value: 1 }));
    }
    await dispatch(updateReport({ report_id: item.report_id, field: "status_changed_at", value: Date.now() }));
  }

  const handleDeleteReport = async () => {
    await dispatch(deleteReport({ report_id: item.report_id }));
    if (item.item_type == "post") {
      await dispatch(updatePostsByField({ post_id: item.item_id, field: itemStatus, value: 0 }));
    } else if (item.item_type == "comment") {
      await dispatch(updateCommentByField({ comment_id: item.item_id, field: itemStatus, value: 0 }));
    } else if (item.item_type == "subComment") {
      await dispatch(updateSubCommentByField({ subComment_id: item.item_id, field: itemStatus, value: 0 }));
    }
  }

  const checkStatus = () => {
    if (item.status == 0) {
      return "Chưa xử lý"
    } else if (item.status == 1) {
      return "Đang xử lý"
    } else if (item.status == 2) {
      return "Đã xử lý"
    }
  }

  return user && itemReport ? (
    <View
      key={item.item_id}
      style={{
        padding: 10,
        margin: 10,
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
            <Text style={{ alignSelf: 'baseline', color: appcolor.textGray }}>Id: {user.user_id}</Text>
          </View>

        </TouchableOpacity>
        {item.status != 1 && item.status != 2 ?
          <TouchableOpacity
            onPress={() => handleSendWarning()}
            style={{
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              position: 'absolute',
              right: 50,
              bottom: "30%",
            }}>
            <FontAwesome6 name="circle-exclamation" size={27} color="darkorange" />
          </TouchableOpacity> : null}

        {item.status != 2 ?
          <TouchableOpacity
            onPress={() => handleDeleteReport()}
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
      <Text style={{ margin: 10 }}>{item.report_id}</Text>


      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          margin: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={{ fontWeight: "bold" }}>Id {item.item_type}: </Text>
          <Text style={{}}>{item.item_id}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={{ fontWeight: "bold" }}>Status change time: {formatDate({ timestamp: item.status_changed_at })} </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={{ fontWeight: "bold" }}>Loại báo cáo: </Text>
          <Text style={{ fontStyle: "italic" }}>{item.item_type}</Text>
        </View>

        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}
          style={{
            position: 'absolute',
            right: 0,
          }}>
          <AntDesign name={isExpanded ? "upcircleo" : "downcircleo"} size={20} color="black" />
        </TouchableOpacity>

        {/* Post */}
        {isExpanded && item.item_type == "post" ?
          <View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{ fontWeight: "bold" }}>Nội dung: </Text>
              <Text style={{}}>{itemReport.body}</Text>
            </View>


            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{ fontWeight: "bold" }}>Thời gian đăng: </Text>
              <Text style={{}}>{formatDate({ timestamp: itemReport.created_at })}</Text>
            </View>

            {/* Hashtag */}
            {itemReport.hashtag.length === 0 ? <></> :

              // <ButtonsComponent isHashtag onPress={handleAd} hashtag={itemReport?.hashtag} isDetail />
              <ButtonsComponent isHashtag hashtag={itemReport?.hashtag} isDetail />
            }

            <View>
              {!itemReport.isYtb ? itemReport.imgPost ? <View
                style={{
                  flexDirection: 'column',
                }}>
                {itemReport.imgPost.map((item, index) => {
                  return (
                    <Image
                      key={index}
                      source={{ uri: item }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        marginVertical: 10,
                      }} />
                  )
                })}

              </View> : null :

                <View
                  style={{
                    width: "100%",
                    minHeight: appInfo.heightWindows / 6.5,
                    marginVertical: 30,
                    flexDirection: 'column',
                  }}
                >
                  <YoutubePlayerComponent url={itemReport?.body} />
                </ View>}
            </View>

          </View> : null}


        {/* Comment */}
        {isExpanded && item.item_type == "comment" ?
          <View>
            {itemReport.content ? <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{ fontWeight: "bold" }}>Nội dung: </Text>
              <Text style={{}}>{itemReport.content}</Text>
            </View> : null}

            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{ fontWeight: "bold" }}>Thời gian đăng: </Text>
              <Text style={{}}>{formatDate({ timestamp: itemReport.created_at })}</Text>
            </View>

            {itemReport.imgPost ? <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={{ uri: itemReport.imgPost }}
                contentFit='contain'
                style={{
                  backgroundColor: 'black',
                  width: "100%",
                  height: 200,
                  borderRadius: 10,
                  marginVertical: 10,
                }} />
            </View> : null}
          </View> : null}

        {/* SubComment */}
        {isExpanded && item.item_type == "sub_comment" ?
          <View>
            {itemReport.content ? <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{ fontWeight: "bold" }}>Nội dung: </Text>
              <Text style={{}}>{itemReport.content}</Text>
            </View> : null}

            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{ fontWeight: "bold" }}>Thời gian đăng: </Text>
              <Text style={{}}>{formatDate({ timestamp: itemReport.created_at })}</Text>
            </View>

            {itemReport.imgPost ? <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={{ uri: itemReport.imgPost }}
                contentFit='contain'
                style={{
                  backgroundColor: 'black',
                  width: "100%",
                  height: 200,
                  borderRadius: 10,
                  marginVertical: 10,
                }} />
            </View> : null}
          </View> : null}


      </View>
    </View >
  ) : null
};

const styles = StyleSheet.create({

});

export default UserManagementScreen;

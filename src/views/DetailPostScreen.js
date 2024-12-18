import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Platform,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageViewer from "react-native-image-zoom-viewer";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
import * as Clipboard from "expo-clipboard";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import RNPickerSelect from "react-native-picker-select";

import { appInfo } from "../constains/appInfo";
import { appcolor } from "../constains/appcolor";
import {
  calculateEmojiCounts,
  formatNumber,
  handleTime,
  formatDate,
} from "../utils";

import MoreOptionPostComponent from "../component/moreOptionBox/MoreOptionPostComponent";
import RowComponent from "../component/RowComponent";
import AvatarComponent from "../component/AvatarComponent";
import { AvatarEx, ButtonsComponent } from "../component";
import { StyleGlobal } from "../styles/StyleGlobal";
import AnimatedQuickCmtComponent from "../component/commentBox/AnimatedQuickCmtComponent";
import ImagesPaperComponent from "../component/ImagesPaperComponent";
import YoutubePlayerComponent from "../component/YoutubePlayerComponent";
import { useDispatch, useSelector } from "react-redux";
import { createFollow } from "../redux/slices/FollowerSlice";
import {
  updateEmojiByField,
  startListeningEmojiPost,
  createEmoji,
  deleteEmoji,
  startListeningEmojiCmt,
} from "../redux/slices/EmojiSlice";
import {
  startListeningCommentByPostId,
  countCommentsAndSubComments,
} from "../redux/slices/CommentSlice";
import { startListeningUserByID } from "../redux/slices/UserSlices";
import {
  countSubComments,
  startListeningSubCommentByCommentId,
} from "../redux/slices/SubCommentSlice";
import { startListeningPostByID } from "../redux/slices/PostSlice";
import { createNoti, deleteNoti } from "../redux/slices/NotiSlice";

const DetailPostScreen = () => {
  const inset = useSafeAreaInsets(); // Hook để lấy vùng an toàn của thiết bị
  const navigation = useNavigation();
  const route = useRoute().params;

  const { post, userPost, post_user_id } = route;
  const postCheck = useSelector((state) => state.post[post.post_id]);
  useEffect(() => {
    const fetchPost = async () => {
      await dispatch(startListeningPostByID({ post_id: post.post_id }));
    };
    fetchPost();
  }, []);

  // console.log("user.user_id", user.user_id)
  // console.log("post_user_id", post_user_id)
  const user = useSelector((state) => state.user.user);

  const follower = useSelector((state) => state.follower.follower);
  const dispatch = useDispatch();
  const isFlag = follower.some(
    (f) => f.user_id === post.user_id && f.follower_user_id === user.user_id
  ); // Kiểm tra xem người dùng đã theo dõi chưa
  // const comment = useSelector(state => state.comment.commentList);

  const [iconEmoji, setIconEmoji] = useState("default");
  const emoji = useSelector((state) => state.emoji[post.post_id]); // Lấy dữ liệu emoji từ store
  const countEmoji = calculateEmojiCounts({
    emojiList: emoji,
    post_id: post.post_id,
  }); // Tính toán số lượng emoji
  const likeCount = formatNumber({ num: countEmoji.likeCount });
  const heartCount = formatNumber({ num: countEmoji.heartCount });
  const laughCount = formatNumber({ num: countEmoji.laughCount });
  const sadCount = formatNumber({ num: countEmoji.sadCount });
  const comments = useSelector((state) => state.comment[post.post_id]);
  const notiList = useSelector((state) => state.noti.notiList);
  const noti = useSelector((state) => state.noti.noti);

  const findNotiById = ({ post_id, user_id, targetUser_id }) => {
    // Kiểm tra mảng thông báo có hợp lệ không
    if (!Array.isArray(notiList) || notiList.length === 0) {
      console.error("Noti array is empty or not an array.");
      return null;
    }
  
    // Tìm thông báo khớp với các điều kiện
    const foundNotification = notiList.find(
      (noti) =>
        noti.targetUser_id === targetUser_id 
    );
  
    // Kết quả tìm kiếm
    if (foundNotification) {
      console.log("Found notification:", foundNotification);
      return foundNotification.noti_id;
    } else {
      console.log("No matching notification found.");
      return null;
    }
  };

  const [selectedValue, setSelectedValue] = useState("desc"); // Giá trị mặc định của Picker
  useEffect(() => {
    dispatch(
      startListeningCommentByPostId({
        post_id: post.post_id,
        sortBy: selectedValue,
      })
    );
  }, [selectedValue]);

  const [dataPostCmt, setDataPostCmt] = useState(0); // Sử dụng state để lưu kết quả

  useEffect(() => {
    const fetchCommentCount = async () => {
      const countCmt = await countCommentsAndSubComments({
        post_id: post.post_id,
      });
      setDataPostCmt(formatNumber({ num: countCmt })); // Cập nhật state với kết quả
    };
    fetchCommentCount();
  }, [comments]);

  useEffect(() => {
    // console.log("emoji Run");
    const getEmoji = async () => {
      let foundEmojiType = "default";
      for (let i = 0; i < emoji.length; i++) {
        if (
          emoji[i].user_id !== user.user_id ||
          emoji[i].post_id !== post.post_id
        ) {
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
  };

  const handleBtnEmoji = async (emojiType) => {
    const existingEmoji = emoji.find(
      (e) => e.user_id === user.user_id && e.post_id === post.post_id
    );

    if (existingEmoji) {
      // Nếu người dùng đã tương tác
      if (existingEmoji[`count_${emojiType}`] > 0) {
        console.log("deleteEmoji");
        // Nếu người dùng ấn lại đúng emoji mà họ đã tương tác trước đó -> DELETE
        await dispatch(
          deleteEmoji({ post_id: post.post_id, user_id: user.user_id })
        );
        //thêm hàm xóa thông báo
        const notificationId = findNotiById({
            post_id: post.post_id,
            user_id: user.user_id,
            targetUser_id: post.user_id,
          });
          if (user.user_id != post.user_id) {
            await dispatch(deleteNoti({ noti_id: notificationId }));
            console.log("NotiID:", notificationId);
          }
        setIconEmoji("default");
      } else {
        console.log("updateEmojiByField");
        // Nếu người dùng chọn emoji khác với emoji đã tương tác trước đó -> UPDATE
        // Xóa emoji hiện tại
        await dispatch(
          updateEmojiByField({
            post_id: post.post_id,
            user_id: user.user_id,
            count_like: emojiType === "like" ? 1 : 0,
            count_heart: emojiType === "heart" ? 1 : 0,
            count_laugh: emojiType === "laugh" ? 1 : 0,
            count_sad: emojiType === "sad" ? 1 : 0,
          })
        );
        // await dispatch(startListeningEmoji({ user_id: user.user_id }));
        setIconEmoji(emojiType);
        
      }
      // await dispatch(startListeningEmoji({ user_id: user.user_id }));
    } else {
      console.log("createEmoji");
      // Nếu người dùng chưa tương tác -> CREATE
      await dispatch(
        createEmoji({
          emoji_id: "",
          post_id: post.post_id,
          user_id: user.user_id,
          comment_id: "",
          sub_comment_id: "",
          count_like: emojiType === "like" ? 1 : 0,
          count_heart: emojiType === "heart" ? 1 : 0,
          count_laugh: emojiType === "laugh" ? 1 : 0,
          count_sad: emojiType === "sad" ? 1 : 0,
        })
      );
      setIconEmoji(emojiType);

      if (user.user_id != post.user_id) {
        await dispatch(
          createNoti({
            post_id: post.post_id,
            user_id: user.user_id,
            targetUser_id: post.user_id,
            check_touch: false,
            checked: false,
            content: `${user.username} đã thả cảm xúc vào bài viết của bạn`,
            created_at: Date.now(),
            imgUser: user.imgUser,
            role_noti: 0,
            noti_id: "temp",
          })
        );
      }
    }
  };

  {
    /* Lấy tọa độ của component để sử dụng kích hoạt animated khi lướt đến */
  }
  const [componentPosition, setComponentPosition] = useState(0); // Để lưu tọa độ component
  const handleLayout = (event) => {
    const { y } = event.nativeEvent.layout; // lấy tọa độ Y của component
    setComponentPosition(y);
  };

  const animation = useRef(new Animated.Value(0)).current;
  const opacityNavigaion = {
    opacity: animation.interpolate({
      inputRange: [componentPosition + 50, componentPosition + 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  const userPostCheck = () => {
    if (user.user_id === post_user_id) {
      return false;
    }
    return true;
  };

  const handleFollowButton = async () => {
    await dispatch(
      createFollow({
        follower_user_id: user.user_id,
        user_id: userPost.user_id,
      })
    );
    // await dispatch(startListeningFollowers({ follower_user_id: user.user_id }));
    // await dispatch(getFollower({ follower_user_id: user.user_id }));
  };
  const handleNagigatePersonScreen = () => {
    console.log("userPostHHH", userPost)
    navigation.navigate("PersonScreen", {
      userPost: userPost,
      isFromAvatar: true,
    });
  };

  const [copiedText, setCopiedText] = useState("");
  const copyToClipboard = async (content) => {
    await Clipboard.setStringAsync(content);
  };

  const fetchCopiedText = async (content) => {
    copyToClipboard(content);
    const text = await Clipboard.getStringAsync();
    // setCopiedText(text);
    console.log(text);
    if (Platform.OS === "android") {
      ToastAndroid.show("Đã sao chép!", ToastAndroid.SHORT);
    } else {
      // Thêm code xử lý cho iOS nếu cần (iOS không hỗ trợ ToastAndroid)
      alert("Đã sao chép vào clipboard (iOS không hỗ trợ Toast)");
    }
  };

  const handleAd = () => {
    //console.log("toi day");
    //console.log(componentPosition);
  };

  if (postCheck) {
    // console.log(postCheck)
    if (postCheck.status_post_id == 2) {
      // console.log("postCheck.status_post_id == 2")
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Đã xảy ra lỗi</Text>
        </View>
      );
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
      {/* Navigate bar */}
      <RowComponent
        style={{
          width: "100%",
          position: "absolute",
          zIndex: 999,
          top: inset.top,
          paddingVertical: "4%",
          alignItems: "center",
          backgroundColor: "white",
          paddingHorizontal: "3.5%",
        }}
      >
        <Ionicons
          name="chevron-back-outline"
          color={"black"}
          size={30}
          onPress={() => navigation.goBack()}
        />

        <View
          style={{
            width: "5%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            width: "75%",
            height: "100%",
            alignItems: "flex-start",
          }}
        >
          <Animated.View
            style={[
              {
                flexDirection: "row",
                width: "100%",
                height: "100%",
              },
              opacityNavigaion,
            ]}
          >
            <TouchableOpacity
              onPress={handleNagigatePersonScreen}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "65%",
              }}
            >
              <AvatarEx
                size={30}
                round={10}
                url={userPost.imgUser}
                frame={userPost.frame_user}
              />

              <View
                style={{
                  width: "auto",
                  flexDirection: "row",
                  paddingHorizontal: "3%",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {userPost.username}
                </Text>
                {userPost.roleid != 0 ? (
                  <Image
                    source={require("../../assets/appIcons/crown.png")}
                    style={{
                      width: 20,
                      height: 20,
                      marginLeft: 10,
                    }}
                  />
                ) : null}
              </View>
            </TouchableOpacity>

            {user.status_user_id == 2 ? (
              <></>
            ) : userPostCheck() ? (
              isFlag ? (
                <></>
              ) : (
                <TouchableOpacity
                  disabled={user.status_user_id == 2 ? true : false}
                  onPress={handleFollowButton}
                  style={{
                    borderColor: "rgba(121,141,218,1)",
                    borderRadius: 100,
                    borderWidth: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 80,
                    height: "100%",
                  }}
                >
                  <Text
                    style={{
                      ...StyleGlobal.text,
                      color: "rgba(101,128,255,1)",
                    }}
                  >
                    Theo dõi
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <></>
            )}
          </Animated.View>
        </View>

        <View
          style={{
            width: "10%",
            height: "70%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MoreOptionPostComponent
            post_id={post.post_id}
            user_id={user.user_id}
            isFollow={isFlag}
            post_user_id={post_user_id}
          />
        </View>
      </RowComponent>
      {/* Quick Comment */}

      <View
        style={{
          flex: 1,
          position: "absolute",
          zIndex: 999,
          bottom: 0,
          right: 0,
          left: 0,
          height: 55,
          backgroundColor: "white",
          justifyContent: "flex-end",
        }}
      >
        {user.status_user_id == 2 ? (
          <></>
        ) : (
          <View style={{ height: "100%" }}>
            {
              <AnimatedQuickCmtComponent
                isNomal
                isImgIn
                post={post}
                userPost={userPost}
                user={user}
              />
            }
          </View>
        )}
      </View>

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: "3.5%",
          backgroundColor: "rgba(255, 255, 255, 1)",
          // backgroundColor: "blue",
          marginTop: 90,
          marginBottom: 55,
        }}
        onScroll={(offSetY) => {
          animation.setValue(offSetY.nativeEvent.contentOffset.y);
        }}
      >
        {/* Content Detail Post */}
        <View
          style={{
            flex: 1,
            // backgroundColor: "yellow",
            paddingBottom: "5%",
          }}
        >
          <View
            style={{
              marginTop: "3%",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {post.title}
            </Text>
          </View>

          <RowComponent
            style={{ height: 30, width: "100%", marginVertical: "3%" }}
          >
            <AntDesign name="clockcircle" color={"#BFBFBF"} size={15} />
            <Text
              style={{
                color: "#BFBFBF",
                fontSize: 12,
                marginRight: "15%",
                marginLeft: "2%",
              }}
            >
              {formatDate({ timestamp: post.created_at })}
            </Text>
            <AntDesign
              name="eye"
              color={"#BFBFBF"}
              size={20}
              style={{ bottom: ".5%" }}
            />
            <Text style={{ color: "#BFBFBF", fontSize: 12, marginLeft: "2%" }}>
              {post.count_view}
            </Text>
          </RowComponent>

          {/* Info user post */}
          <View
            onLayout={handleLayout}
            style={{
              height: 100,
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: 10,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={handleNagigatePersonScreen}
              activeOpacity={1}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
                height: "100%",
                paddingLeft: "3%",
              }}
            >
              <AvatarEx
                size={50}
                round={10}
                url={userPost.imgUser}
                frame={userPost.frame_user}
                style={{
                  marginHorizontal: "3%",
                }}
              />
              <View
                style={{
                  marginLeft: 10,
                  justifyContent: "center",
                  // backgroundColor: "yellow",
                }}
              >
                <View style={{ width: "auto", flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {userPost.username}
                  </Text>
                  {userPost.roleid != 0 ? (
                    <Image
                      source={require("../../assets/appIcons/crown.png")}
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 10,
                      }}
                    />
                  ) : null}
                </View>

                <Text
                  style={{
                    fontSize: 12,
                    color: "#BFBFBF",
                  }}
                >
                  {handleTime({ timestamp: post.created_at })}
                </Text>
                {userPost.status_user_id == 2 ? (
                  <Text style={{ color: "tomato", fontSize: 13 }}>
                    Vô hiệu hóa
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
            {user.status_user_id == 2 ? (
              <></>
            ) : userPostCheck() ? (
              isFlag ? (
                <></>
              ) : (
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: "2%",
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <TouchableOpacity
                    disabled={user.status_user_id == 2 ? true : false}
                    onPress={handleFollowButton}
                    style={{
                      borderColor: "rgba(121,141,218,1)",
                      borderRadius: 100,
                      borderWidth: 2,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "70%",
                      height: "30%",
                    }}
                  >
                    <Text
                      style={{
                        ...StyleGlobal.text,
                        color: "rgba(101,128,255,1)",
                      }}
                    >
                      Theo dõi
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <></>
            )}
          </View>

          {/* Content Post */}
          {post.isYtb ? (
            <></>
          ) : (
            <View
              style={{
                marginTop: "3%",
                // backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                }}
                onLongPress={() => fetchCopiedText(post.body)}
              >
                {post.body}
              </Text>
            </View>
          )}

          {/* Image Post */}
          {/* <PagerView style={{
                        height: 300,
                        width: "auto",
                        backgroundColor: "red",
                    }}

                        initialPage={index}
                        onPageSelected={handleIndex}>
                        {post.images.map((item, index) => (
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
          {!post.isYtb ? (
            post.imgPost.length > 0 ? (
              <ImagesPaperComponent
                post={post}
                user={user}
                userPost={userPost}
              />
            ) : (
              <></>
            )
          ) : (
            <RowComponent
              minHeight={appInfo.widthWindows * 0.53}
              height={"auto"}
              style={{
                paddingTop: "2%",
                marginBottom: "2%",
              }}
            >
              <YoutubePlayerComponent url={post?.body} />
            </RowComponent>
          )}
        </View>

        {/* Hashtag */}
        {post.hashtag.length === 0 ? (
          <></>
        ) : (
          <ButtonsComponent
            isHashtag
            onPress={handleAd}
            hashtag={post?.hashtag}
            isDetail
          />
        )}
        {/* Emoji Count Button */}
        <View
          style={{
            height: "auto",
            width: "100%",
            paddingVertical: "2%",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            disabled={user.status_user_id == 2 ? true : false}
            onPress={() => handleBtnEmoji("like")}
            activeOpacity={0.8}
            style={{
              width: "auto",
              minWidth: 60,
              height: 30,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                iconEmoji === "like" ? appcolor.secondary : "rgba(0,0,0,0.05)",
              flexDirection: "row",
              marginRight: 4,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={getIconImg("like")}
              contentFit="cover"
            />
            <Text
              style={{
                marginLeft: 4,
                color:
                  iconEmoji === "like" ? appcolor.primary : "rgba(0,0,0,0.4)",
                fontSize: 12,
              }}
            >
              {likeCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={user.status_user_id == 2 ? true : false}
            onPress={() => handleBtnEmoji("heart")}
            activeOpacity={0.8}
            style={{
              width: "auto",
              minWidth: 60,
              height: 30,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                iconEmoji === "heart" ? appcolor.secondary : "rgba(0,0,0,0.05)",
              flexDirection: "row",
              marginRight: 4,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={getIconImg("heart")}
              contentFit="cover"
            />
            <Text
              style={{
                marginLeft: 4,
                color:
                  iconEmoji === "heart" ? appcolor.primary : "rgba(0,0,0,0.4)",
                fontSize: 12,
              }}
            >
              {heartCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={user.status_user_id == 2 ? true : false}
            onPress={() => handleBtnEmoji("laugh")}
            activeOpacity={0.8}
            style={{
              width: "auto",
              minWidth: 60,
              height: 30,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                iconEmoji === "laugh" ? appcolor.secondary : "rgba(0,0,0,0.05)",
              flexDirection: "row",
              marginRight: 4,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={getIconImg("laugh")}
              contentFit="cover"
            />
            <Text
              style={{
                marginLeft: 4,
                color:
                  iconEmoji === "laugh" ? appcolor.primary : "rgba(0,0,0,0.4)",
                fontSize: 12,
              }}
            >
              {laughCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={user.status_user_id == 2 ? true : false}
            onPress={() => handleBtnEmoji("sad")}
            activeOpacity={0.8}
            style={{
              width: "auto",
              minWidth: 60,
              height: 30,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                iconEmoji === "sad" ? appcolor.secondary : "rgba(0,0,0,0.05)",
              flexDirection: "row",
              marginRight: 4,
            }}
          >
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              source={getIconImg("sad")}
              contentFit="cover"
            />
            <Text
              style={{
                marginLeft: 4,
                color:
                  iconEmoji === "sad" ? appcolor.primary : "rgba(0,0,0,0.4)",
                fontSize: 12,
              }}
            >
              {sadCount}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderBottomWidth: 5,
            position: "relative",
            borderRadius: 10,
            borderColor: "rgba(0,0,0,0.2)",
            marginVertical: 15, // Khoảng cách trên dưới của đường kẻ
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            Toàn bộ bình luận {dataPostCmt} -{" "}
            {selectedValue == "desc" ? "Mới nhất" : "Cũ nhất"}
          </Text>

          <RNPickerSelect
            placeholder={{ label: "Chọn một mục...", value: null }}
            onValueChange={(value) => setSelectedValue(value)}
            items={[
              { label: "Mới nhất", value: "desc" },
              { label: "Cũ nhất", value: "asc" },
            ]}
            value={selectedValue} // Giá trị mặc định
            style={{
              inputAndroid: {
                fontSize: 17,
                fontWeight: "bold",
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 4,
                color: "black",
                paddingRight: 30, // để đảm bảo văn bản không chồng lên biểu tượng bên phải
              },
              inputIOS: {
                fontSize: 17,
                fontWeight: "bold",
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 4,
                color: "black",
                paddingRight: 30, // để đảm bảo văn bản không chồng lên biểu tượng bên phải
              },
            }}
          />
        </View>

        {/* Comment List */}
        {!comments
          ? null
          : comments.map((comment, index) => {
              return (
                <CommentsPost key={comment.comment_id} comment={comment} />
              );
            })}
      </ScrollView>
    </View>
  );
};

export const CommentsPost = React.memo(({ comment }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user[comment.user_id]);
  const dispatch = useDispatch();
  const [dataPostCmt, setDataPostCmt] = useState(0); // Sử dụng state để lưu kết quả
  const emoji = useSelector((state) => state.emoji[comment.comment_id]);
  const countEmoji = calculateEmojiCounts({
    emojiList: emoji,
    comment_id: comment.comment_id,
  }).totalCount;
  const subComment = useSelector(
    (state) => state.subComment[comment.comment_id]
  );
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!user) {
      dispatch(startListeningUserByID({ user_id: comment.user_id }));
    }
    dispatch(startListeningEmojiCmt({ comment_id: comment.comment_id }));
    dispatch(
      startListeningSubCommentByCommentId({ comment_id: comment.comment_id })
    );
    // console.log("emoji Run");
  }, []);

  useEffect(() => {
    const fetchCommentCount = async () => {
      const countCmt = await countSubComments({
        comment_id: comment.comment_id,
      });
      // console.log("countCmt", countCmt);
      // console.log("countCmt", countCmt != 0 ? "Trả lời " : "Teo");
      setDataPostCmt(formatNumber({ num: countCmt })); // Cập nhật state với kết quả
    };
    fetchCommentCount();
  }, [subComment]);

  const handleBtnEmoji = async () => {
    // console.log("comment", comment.comment_id);
    // console.log("emojiType", emoji ? emoji : "null");
    const existingEmoji = !emoji
      ? false
      : emoji.find(
          (e) =>
            e.user_id === user.user_id && e.comment_id === comment.comment_id
        );
    console.log("existingEmoji", existingEmoji);
    if (existingEmoji) {
      console.log("deleteEmoji");
      // Nếu người dùng ấn lại đúng emoji mà họ đã tương tác trước đó -> DELETE
      await dispatch(
        deleteEmoji({ comment_id: comment.comment_id, user_id: user.user_id })
      );
    } else {
      console.log("createEmoji");
      // Nếu người dùng chưa tương tác -> CREATE
      await dispatch(
        createEmoji({
          emoji_id: "",
          post_id: "",
          comment_id: comment.comment_id,
          sub_comment_id: "",
          user_id: user.user_id,
          count_like: 1,
          count_heart: 0,
          count_laugh: 0,
          count_sad: 0,
        })
      );
    }
    dispatch(startListeningEmojiCmt({ comment_id: comment.comment_id }));
  };

  const handleNagigatePersonScreen = () => {
    navigation.navigate("PersonScreen", { userPost: user, isFromAvatar: true });
  };

  const handleNavigateCommentScreen = () => {
    navigation.navigate("CommentScreen", { comment: comment, user: user });
  };
  return user ? (
    <View>
      {/* Comment */}
      <View
        style={{
          height: "auto",
          width: "100%",
          // backgroundColor: "pink",
        }}
      >
        {/* Avatar */}
        <RowComponent
          height={appInfo.widthWindows / 5.7}
          style={{ alignItems: "center" }}
        >
          <TouchableOpacity
            onPress={handleNagigatePersonScreen}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
            }}
          >
            <AvatarEx
              size={30}
              round={30}
              url={user.imgUser}
              frame={user.frame_user}
            />
            <View
              style={{
                height: "80%",
                width: "80%",
                justifyContent: "center",
                paddingLeft: "3%",
              }}
            >
              <View style={{ width: "auto", flexDirection: "row" }}>
                <Text style={[StyleGlobal.textName, { fontSize: 12 }]}>
                  {user.username}
                </Text>

                {user.roleid != 0 ? (
                  <Image
                    source={require("../../assets/appIcons/crown.png")}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                    }}
                  />
                ) : null}
              </View>
              <Text style={[StyleGlobal.textInfo, { fontSize: 12 }]}>
                {handleTime({ timestamp: comment.created_at })}
              </Text>
            </View>
            <View
              style={{
                width: "10%",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <MoreOptionPostComponent
                size={20}
                user_id={user.user_id}
                comment_id={comment.comment_id}
                comment_user_id={comment.user_id}
                isComment
              />
            </View>
          </TouchableOpacity>
        </RowComponent>
        {/* Content Comment */}
        <View
          style={{
            width: "100%",
            height: "auto",
            flexDirection: "column",
          }}
        >
          {comment.content ? (
            <Text
              style={{ fontSize: 15 }}
              // onLongPress={(text) => fetchCopiedText(text.)}
            >
              {comment.content}
            </Text>
          ) : (
            <></>
          )}

          {comment.imgPost ? (
            <Image
              style={{
                width: "90%",
                height: 150,
                marginTop: "3%",
                borderRadius: 10,
                backgroundColor: "black",
                alignSelf: "center",
              }}
              source={{ uri: comment.imgPost }}
              contentFit="contain"
            />
          ) : (
            <></>
          )}
        </View>
      </View>
      {/* Comment Buttons */}
      <RowComponent
        height={30}
        style={{
          // backgroundColor: "red",
          justifyContent: "flex-end",
        }}
      >
        <View style={{ width: "45%" }} />
        <TouchableOpacity
          onPress={handleNavigateCommentScreen}
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            alignSelf: "center",
          }}
        >
          <Image
            style={{
              width: 20,
              height: 20,
              marginRight: 5,
            }}
            source={require("../../assets/appIcons/comment-out-post.png")}
            contentFit="cover"
          />
          <Text style={{ fontSize: 12 }}>
            {dataPostCmt == 0 ? "Trả lời " : dataPostCmt}{" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={currentUser.status_user_id == 2 ? true : false}
          onPress={handleBtnEmoji}
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            alignSelf: "center",
          }}
        >
          <Image
            style={{
              width: 20,
              height: 20,
              marginRight: 5,
            }}
            source={
              countEmoji != 0 && countEmoji
                ? require("../../assets/emojiIcons/like-emoji.png")
                : require("../../assets/appIcons/like-out-post.png")
            }
            contentFit="cover"
          />
          <Text style={{ fontSize: 12 }}>
            {countEmoji != 0 && countEmoji ? countEmoji : "Nhấn thích"}
          </Text>
        </TouchableOpacity>
      </RowComponent>
      {dataPostCmt != 0 ? (
        <TouchableOpacity
          onPress={handleNavigateCommentScreen}
          style={{
            flexDirection: "row",
            flex: 1,
            marginLeft: 10,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: appcolor.primary,
            }}
          >
            Xem {dataPostCmt} phản hồi khác...{" "}
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  ) : (
    <></>
  );
});
export default DetailPostScreen;

const styles = StyleSheet.create({});

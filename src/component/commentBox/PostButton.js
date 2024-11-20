/* eslint-disable no-undef */
import {
  Text,
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmoji,
  deleteEmoji,
  updateEmojiByField,
  startListeningEmoji,
} from "../../redux/slices/EmojiSlice";
import { createNoti, deleteNoti } from "../../redux/slices/NotiSlice";

import RowComponent from "../RowComponent";
import ButtonsComponent from "../ButtonsComponent";
import { StyleGlobal } from "../../styles/StyleGlobal";
// import { data } from '../../constains/data'
import { ModalPop } from "../../modals";
import { appInfo } from "../../constains/appInfo";
import { appcolor } from "../../constains/appcolor";
import EmojiBoxComponent from "./EmojiBoxComponent";
import { calculateEmojiCounts } from "../../utils";

const formatNumber = (num) => {
  // console.log(num)
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B"; // tỷ
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M"; // triệu
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K"; // nghìn
  } else {
    return num.toString(); // số bình thường
  }
};

const PostButton = ({
  toggleExpand,
  handleShowPop,
  post,
  user,
  user_post,
  handleNagigateDetailPost,
}) => {
  const dispatch = useDispatch();

  const dataPostView = formatNumber(post.count_view);
  const dataPostCmt = null; // chưa có dữ liệu tạm thời để trống

  const noti = useSelector((state) => state.noti.noti);
  const notiList = useSelector((state) => state.noti.notiList);

  const [isShowEmojiBox, setIsShowEmojiBox] = useState(false);

  const translateYEmoji = useState(
    new Animated.Value(appInfo.heightWindows)
  )[0]; // Start offscreen

  const [isPressLike, setIsPressLike] = useState("false");

  const [iconEmoji, setIconEmoji] = useState("default");
  const emoji = useSelector((state) => state.emoji.emojiList);
  const dataPostEmoji = calculateEmojiCounts({
    emojiList: emoji,
    post_id: post.post_id,
  }).totalCount; // chưa xong

  const findNotiById = ({ post_id, user_id, targetUser_id }) => {
    if (!Array.isArray(notiList) || notiList.length === 0) {
      console.error("Noti array is empty or not an array.");
      return null;
    }

    const foundNotification = notiList.find(
      (noti) =>
        noti.post_id === post_id &&
        noti.user_id === user_id &&
        noti.role_noti === 0 &&
        noti.targetUser_id === targetUser_id
    );

    if (foundNotification) {
      console.log("Found notification:", foundNotification);
      return foundNotification.noti_id;
    } else {
      console.log("No matching notification found.");
      return null;
    }
  };

  useEffect(() => {
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
        return require("../../../assets/emojiIcons/like-emoji.png");
      case "heart":
        return require("../../../assets/emojiIcons/heart-emoji.png");
      case "laugh":
        return require("../../../assets/emojiIcons/laugh-emoji.png");
      case "sad":
        return require("../../../assets/emojiIcons/sad-emoji.png");
      case "default":
        return require("../../../assets/appIcons/like-out-post.png");
      default:
        return require("../../../assets/appIcons/like-out-post.png");
    }
  };

  const handleBtnEmoji = async (emojiType) => {
    const existingEmoji = emoji.find(
      (e) => e.user_id === user.user_id && e.post_id === post.post_id
    );
    if (existingEmoji) {
      console.log("existingEmoji", existingEmoji);
      console.log("existingEmoji[`count_like`]", existingEmoji[`count_like`]);
      console.log("existingEmoji[`count_heart`]", existingEmoji[`count_heart`]);
      console.log("existingEmoji[`count_laugh`]", existingEmoji[`count_laugh`]);
      console.log("existingEmoji[`count_sad`]", existingEmoji[`count_sad`]);
    }

    if (existingEmoji) {
      // Nếu người dùng đã tương tác
      if (existingEmoji[`count_${emojiType}`] > 0) {
        console.log("deleteEmoji");
        // Nếu người dùng ấn lại đúng emoji mà họ đã tương tác trước đó -> DELETE
        await dispatch(
          deleteEmoji({ post_id: post.post_id, user_id: user.user_id })
        );
        setIconEmoji("default");

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
          isComment: false,
          comment_id: "",
          count_like: emojiType === "like" ? 1 : 0,
          count_heart: emojiType === "heart" ? 1 : 0,
          count_laugh: emojiType === "laugh" ? 1 : 0,
          count_sad: emojiType === "sad" ? 1 : 0,
        })
      );
      setIconEmoji(emojiType);

      //tạo thông báo mới nếu không phải là bài viết của bản thân
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

    handleHidePop();
  };

  // const dataEmoji = {
  //     emoji_id: "",
  //     post_id: post.post_id,
  //     user_id: user.user_id,
  //     isComment: false,
  //     comment_id: "",
  //     count_like: count_like,
  //     count_heart: count_heart,
  //     count_laugh: count_laugh,
  //     count_sad: count_sad,
  // }

  const setFalse = () => {
    // setIsVisible(false);
    setIsShowEmojiBox(false);
    // setIsPressLike("false");
  };
  const handlePressLike = () => {
    // setIsPressLike("like");
    handleBtnEmoji("like");
    toggleExpand();
  };

  const handleShowPopEmoji = () => {
    setIsShowEmojiBox(true);
    Animated.timing(translateYEmoji, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleHidePop = () => {
    Animated.timing(translateYEmoji, {
      toValue: appInfo.heightWindows,
      duration: 300,
      useNativeDriver: true,
    }).start(setFalse());
  };

  return (
    <RowComponent
      height={40}
      style={{
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          flex: 2,
          flexDirection: "row",
        }}
      >
        <ButtonsComponent
          isButton
          style={{
            marginRight: "2%",
          }}
        >
          <Image
            style={{
              width: 20,
              height: 20,
            }}
            source={require("../../../assets/appIcons/view-out-post.png")}
            contentFit="cover"
          />
        </ButtonsComponent>
        <Text
          style={[
            StyleGlobal.text,
            {
              color: "gray",
            },
          ]}
        >
          {" "}
          {dataPostView}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          flexDirection: "row",
          right: "5%",
        }}
      >
        <View
          style={{
            width: "auto",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <ButtonsComponent
            isButton
            onPress={handleNagigateDetailPost} //
            style={{ marginHorizontal: "10%" }}
          >
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={require("../../../assets/appIcons/comment-out-post.png")}
              contentFit="cover"
            />
          </ButtonsComponent>
          <Text
            style={[
              StyleGlobal.text,
              {
                color: "gray",
              },
            ]}
          >
            {dataPostCmt + 1000}
          </Text>
        </View>

        <View
          style={{
            width: "auto",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <ButtonsComponent
            onPress={handlePressLike}
            onLongPress={handleShowPopEmoji}
            isButton
            style={{ marginHorizontal: "10%" }}
          >
            <Image
              style={{
                width: 20,
                height: 20,
              }}
              source={getIconImg(iconEmoji)}
              contentFit="cover"
            />
          </ButtonsComponent>
          <Text
            style={[
              StyleGlobal.text,
              {
                color: "gray",
              },
            ]}
          >
            {dataPostEmoji}
          </Text>
        </View>
      </View>

      {/* Emoji Box */}
      <ModalPop
        visible={isShowEmojiBox}
        transparent={true}
        onRequestClose={handleHidePop}
      >
        <EmojiBoxComponent
          translateYEmoji={translateYEmoji}
          handleBtnEmoji={handleBtnEmoji}
          emoji={emoji}
          user={user}
          post={post}
          iconEmoji={iconEmoji}
          setIconEmoji={setIconEmoji}
        />
      </ModalPop>
    </RowComponent>
  );
};
const styles = StyleSheet.create({});

export default PostButton;

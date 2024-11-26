import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Alert, // Import Alert để hiển thị thông báo
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import PostViewComponent from "./PostViewComponent";
import ButtonsComponent from "./ButtonsComponent";
import ButtonBackComponent from "./ButtonBackComponent";
import { appInfo } from "../constains/appInfo";
import {
  createHashtagGroup,
  deleteHashtagGroup,
} from "../redux/HashtagGroupSlice";

const HashtagGroupComponent = ({
  groupImage,
  groupTitle,
  hashtag_background,
  dataPost,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const hashtagGroup = useSelector((state) => state.hashtagGroup.hashtagGroup);
  const [isJoin, setIsJoin] = useState(false); // Trạng thái tham gia

  const handleJoin = async () => {
    if (!isJoin) {
      const newData = {
        HashtagID: groupTitle, // Sử dụng groupTitle làm HashtagID
        UserID: user.user_id,
      };
      dispatch(createHashtagGroup(newData));
      setIsJoin(true); // Cập nhật trạng thái tham gia
    } else {
      const docId = groupTitle + "-" + user.user_id;
      dispatch(deleteHashtagGroup({ hashtagGroupID: docId }));
    }
  };

  useEffect(() => {
    // Kiểm tra nếu user đã tham gia group
    const hasJoined = hashtagGroup.some(
      (group) => group.UserID === user.user_id && group.HashtagID === groupTitle
    );
    setIsJoin(hasJoined);
  }, [hashtagGroup, user, groupTitle]); // Chạy lại khi hashtagGroup hoặc user thay đổi

  const renderPostItem = ({ item }) => (
    <PostViewComponent post={item} images={item.images} user={user} />
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ButtonsComponent
        isBack
        onPress={() => {
          navigation.goBack();
        }}
      >
        <View
          style={{
            backgroundColor: hashtag_background,
            width: appInfo.widthWindows,
          }}
        >
          <ButtonBackComponent></ButtonBackComponent>
        </View>
      </ButtonsComponent>
      <Animated.View
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: scrollY.interpolate({
            inputRange: [0, 200],
            outputRange: [250, 100],
            extrapolate: "clamp",
          }),
          backgroundColor: hashtag_background,
          zIndex: 1,
          paddingHorizontal: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.Image
          source={{ uri: groupImage }}
          style={{
            width: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: [90, 40],
              extrapolate: "clamp",
            }),
            height: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: [90, 40],
              extrapolate: "clamp",
            }),
            borderRadius: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: [20, 13],
              extrapolate: "clamp",
            }),
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1 }}>
          <Animated.Text
            style={{
              fontSize: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: [24, 16],
                extrapolate: "clamp",
              }),
              color: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: ["#000", "#888"],
                extrapolate: "clamp",
              }),
              fontWeight: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: ["900", "400"],
                extrapolate: "clamp",
              }),
            }}
          >
            {groupTitle}
          </Animated.Text>
          <Animated.Text
            style={{
              fontSize: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: [16, 10],
                extrapolate: "clamp",
              }),
              color: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: ["#000", "#888"],
                extrapolate: "clamp",
              }),
            }}
          >
            {dataPost.length} bài đăng
          </Animated.Text>
        </View>
        <TouchableOpacity
          onPress={handleJoin}
          style={{
            backgroundColor: isJoin ? "#888" : "#697BEB",
            padding: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#FFF" }}>
            {isJoin ? "Đã tham gia" : "Tham gia"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={styles.listContainer}>
        <FlatList
          data={dataPost}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          style={styles.flatList}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  listContainer: {
    flex: 1,
    marginTop: -20,
    zIndex: 2,
  },
});

export default HashtagGroupComponent;

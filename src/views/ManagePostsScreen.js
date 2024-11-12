import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
//styles
import { StyleGlobal } from "../styles/StyleGlobal";
//constains
import { appInfo } from "../constains/appInfo";
//components
import { IconComponent, AvatarEx } from "../component";
const DATAPost = [
  {
    id: 1,
    body: "sdhabskba",
    imgPost:
      "https://firebasestorage.googleapis.com/v0/b/terrianfirefly.appspot.com/o/images%2F21742F54-B0AA-42F8-A8FE-83A6EFF53194.jpg?alt=media&token=af04bb35-71ce-4859-b754-ced2bb7a0df7",
    status_post_id: 1,
    user_id: "user1",
    title: "đáád",
  },
  {
    id: 2,
    body: "áđa",
    imgPost:
      "https://firebasestorage.googleapis.com/v0/b/terrianfirefly.appspot.com/o/images%2FFA18237D-7E46-4A41-9639-FBF75967100E.jpg?alt=media&token=cf469e6f-2826-46a8-980b-27cf8399d487",
    status_post_id: 1,
    user_id: "user1",
    title: "gfdh",
  },
];
const DataUser = [
  {
    user_id: "user1",
    username: "ađá",
    imgUser:
      "https://firebasestorage.googleapis.com/v0/b/terrianfirefly.appspot.com/o/avatar%2F9BDB416F-F92C-4A73-9CD2-84CB7C240DBE.jpg?alt=media&token=ab3ffb0f-3ece-4f41-8193-7331e7383713",
  },
];
const ManagePostsScreen = () => {
  const navigation = useNavigation(); // Sử dụng hook navigation\

  // Tìm thông tin người dùng từ user_id
  const getUserDetails = (userId) => {
    return DataUser.find((user) => user.user_id === userId);
  };
  const rightSwipe = () => {
    return (
      <TouchableOpacity style={{ alignSelf: "center" }}>
        <Entypo
          name="circle-with-cross"
          size={appInfo.heightWindows * 0.05}
          color={"red"}
        />
      </TouchableOpacity>
    );
  };
  const leftSwipe = () => {
    return (
      <TouchableOpacity style={{ alignSelf: "center" }}>
        <Entypo
          name="circle-with-minus"
          size={appInfo.heightWindows * 0.05}
          color={"green"}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={StyleGlobal.container}>
      <FlatList
        data={DATAPost}
        renderItem={({ item }) => {
          const user = getUserDetails(item.user_id); // Lấy thông tin người dùng từ user_id

          return (
            <Swipeable
              renderRightActions={rightSwipe}
              renderLeftActions={leftSwipe}
            >
              <TouchableOpacity>
                <View style={styles.viewFlatList}>
                  {/* Ảnh bài viết */}
                  <Image
                    width={appInfo.widthWindows * 0.17}
                    height={appInfo.heightWindows * 0.08}
                    source={{ uri: item.imgPost }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                        marginBottom: 5,
                      }}
                    >
                      {/* Ảnh đại diện người dùng */}
                      <AvatarEx
                        size={40}
                        round={20}
                        url={
                          user?.imgUser ||
                          "https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg"
                        }
                      />
                      <View
                        style={{ justifyContent: "center", marginLeft: "3%" }}
                      >
                        {/* Tên người dùng */}
                        <Text style={{ fontWeight: "bold" }}>Người vi phạm: {user?.username}</Text>
                        {/* Nội dung bài viết */}
                        <Text>Bài viết vi phạm: {item.title}</Text>
                      </View>
                    </View>
                    {/* Tiêu đề bài viết */}
                    <Text>Nội dung: {item.body}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
        keyExtractor={(item) => item.id.toString()} // Dùng id chuyển thành string cho keyExtractor
      />
    </View>
  );
};
const styles = StyleSheet.create({
  viewFlatList: {
    flexDirection: "row",
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginBottom: appInfo.heightWindows * 0.015,
    alignItems: "center",
  },
});
export default ManagePostsScreen;

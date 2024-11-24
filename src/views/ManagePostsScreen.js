import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
//styles
import { StyleGlobal } from "../styles/StyleGlobal";
//constains
import { appInfo } from "../constains/appInfo";
//components
import { IconComponent, AvatarEx } from "../component";

import { useDispatch, useSelector } from "react-redux";
import { getRealtimePostsByStatus } from "../redux/slices/PostSlice";
import { getUserByField } from "../redux/slices/UserSlices";

const ManagePostsScreen = () => {
  const navigation = useNavigation(); // Sử dụng hook navigation\
  const dispatch = useDispatch();

  // Lấy dữ liệu bài viết từ Redux
  const { postReport, loading, error } = useSelector((state) => state.post);
  //const [loading, setLoading] = useState(true);
  // Lấy dữ liệu bài viết khi màn hình được tải
  useEffect(() => {
    dispatch(getRealtimePostsByStatus());  // Lắng nghe thay đổi bài viết

    // Cleanup khi component unmount
    return () => {
    };
  }, [dispatch]);

  console.log("datapost", postReport);
  
  if (loading) {
    return (
      <View style={StyleGlobal.container}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!Array.isArray(postReport) || postReport.length === 0) {
    return (
      <View style={StyleGlobal.container}>
        <Text>Không có bài viết nào để hiển thị.</Text>
      </View>
    );
  }
  //xoa
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
  //
  const leftSwipe = () => {
    return (
      <TouchableOpacity style={{ alignSelf: "center" }} >
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
        data={postReport}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <Swipeable
              renderRightActions={rightSwipe}
              renderLeftActions={leftSwipe}
            >
              <TouchableOpacity>
                <View style={styles.viewFlatList}>
                  {/* Ảnh bài viết */}
                <Image
                  url={ item?.imgPost || "https://via.placeholder.com/150"}
                  style={{
                    width: appInfo.widthWindows * 0.17,
                    height: appInfo.heightWindows * 0.08,
                  }}
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
                            item.user?.imgUser ||
                            "https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg"
                          
                        }
                      />
                      <View
                        style={{ justifyContent: "center", marginLeft: "3%" }}
                      >
                        {/* Tên người dùng */}
                        <Text style={{ fontWeight: "bold" }}>
                        Người vi phạm: {item.user?.username || "Chưa xác định"}
                        </Text>
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

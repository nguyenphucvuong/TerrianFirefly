import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useSelector, useDispatch } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
//styles
import { StyleGlobal } from "../styles/StyleGlobal";
//components
import { AvatarEx } from "../component";
//redux actions
import {
  getRealtimePostsByStatus,
  updatePostsByField,
} from "../redux/slices/PostSlice";
import { startListeningRequestAccepted } from "../redux/slices/RequestSlice";

const ManagePostsScreen = () => {
  const dispatch = useDispatch();
  const { postReport, loading } = useSelector((state) => state.post);
  const { accepted } = useSelector((state) => state.request);
  const user = useSelector((state) => state.user.user);

  const [expandedItems, setExpandedItems] = useState({});
  const [filterStatus, setFilterStatus] = useState(1);

  useEffect(() => {
    dispatch(getRealtimePostsByStatus());
    dispatch(startListeningRequestAccepted(dispatch));
  }, [dispatch]);

  // Lọc bài viết theo vai trò người dùng và status_post_id
  const filterPosts = () => {
    let filtered = [];
    if (user.roleid === 1) {
      filtered = postReport;
    } else if (user.roleid === 2) {
      filtered = postReport.filter((post) =>
        accepted.some(
          (request) =>
            user.user_id === request.user_id &&
            Array.isArray(post.hashtag) &&
            post.hashtag.includes(request.hashtag_id)
        )
      );
    }
    return filtered.filter((post) => post.status_post_id === filterStatus);
  };

  const filteredPosts = filterPosts();

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const rightSwipe = (post_id) => (
    <TouchableOpacity
      style={{ alignSelf: "center" }}
      onPress={() => {
        dispatch(
          updatePostsByField({ post_id, field: "status_post_id", value: 2 })
        );
      }}
    >
      <Entypo
        name="circle-with-cross"
        size={20}
        color="red"
      />
    </TouchableOpacity>
  );

  const leftSwipe = (post_id) => (
    <TouchableOpacity
      style={{ alignSelf: "center" }}
      onPress={() => {
        dispatch(
          updatePostsByField({ post_id, field: "status_post_id", value: 0 })
        );
      }}
    >
      <Entypo
        name="circle-with-minus"
        size={20}
        color="green"
      />
    </TouchableOpacity>
  );

  return (
    <View style={StyleGlobal.container}>
      {/* Thanh lọc bài viết */}
      <RNPickerSelect
        onValueChange={(value) => setFilterStatus(value)}
        items={[
          { label: "Đang xử lý", value: 1 },
          { label: "Bài viết vi phạm", value: 2 },
        ]}
        style={{
          inputAndroid: {
            color: "black",
            backgroundColor: "#f0f0f0",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          },
        }}
        placeholder={{ label: "Chọn trạng thái bài viết", value: null }}
        value={filterStatus}
      />

      {/* Hiển thị khi đang tải dữ liệu */}
      {loading ? (
        <Text>Đang tải dữ liệu...</Text>
      ) : filteredPosts.length === 0 ? (
        // Hiển thị nếu không có bài viết nào
        <Text>Không có bài viết nào để hiển thị.</Text>
      ) : (
        // Hiển thị danh sách bài viết
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const images = Array.isArray(item.imgPost) ? item.imgPost : [];
            const isExpanded = expandedItems[item.id];
            return (
              <Swipeable
                renderRightActions={() => rightSwipe(item.id)}
                renderLeftActions={() => leftSwipe(item.id)}
              >
                <View style={styles.card}>
                  <AvatarEx
                    size={40}
                    round={20}
                    url={
                      item.user?.imgUser ||
                      "https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg"
                    }
                  />
                  <View style={styles.info}>
                    <Text style={styles.username}>
                      Tên : {item.user?.username || "Chưa xác định"}
                    </Text>
                    <Text style={styles.title}>Tiêu đề :{item.title}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                    <Entypo
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View>
                      {images.length > 0 ? (
                        images.map((imgUri, index) => (
                          <Image
                            key={index}
                            source={{ uri: imgUri }}
                            style={styles.postImage}
                            resizeMode="contain"
                          />
                        ))
                      ) : (
                        <Text>Không có hình ảnh</Text>
                      )}
                    </View>
                    <Text>Nội dung :{item.body}</Text>
                  </View>
                )}
              </Swipeable>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    color: "#555",
  },
  expandedContent: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
});

export default ManagePostsScreen;

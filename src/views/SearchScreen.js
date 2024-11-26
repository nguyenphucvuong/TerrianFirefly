import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAllPost, getPostsHashtag } from "../redux/slices/PostSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [activeTab, setActiveTab] = useState("Bài viết"); // Danh mục đang chọn
  const [filteredData, setFilteredData] = useState([]); // Kết quả đã lọc
  const { hashtag } = useSelector((state) => state.hashtag); // Danh sách hashtag
  const { allUser } = useSelector((state) => state.user); // Danh sách người dùng
  const allPosts = useSelector((state) => state.post.allPost || []);
  const tabs = ["Bài viết", "Chủ đề", "Người dùng"];
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const comments = useSelector((state) => state.comment);
  const users = useSelector((state) => state.user); // Lấy tất cả user

  useEffect(() => {
    if (activeTab === "Bài viết") {
      fetchAllPosts(); // Lấy tất cả bài viết khi chuyển qua tab "Bài viết"
    } else {
      handleSearch(searchQuery); // Lọc dữ liệu khi đổi tab
    }
  }, [activeTab]);

  useEffect(()=>{
    dispatch(getAllPost());
  },[])
  // Hàm lấy tất cả bài viết
  const fetchAllPosts = async () => {
    try {
      console.log("allPosts", allPosts);
      handleSearch(searchQuery, allPosts); // Lọc dữ liệu với từ khóa hiện tại
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
    }
  };

  // Hàm tìm kiếm bài viết
  const searchPosts = (query) => {
    return allPosts.filter(
      (post) =>
        post.title?.toLowerCase().includes(query.toLowerCase()) || // Kiểm tra title
        post.body?.toLowerCase().includes(query.toLowerCase()) // Kiểm tra body
    );
  };

  // Hàm tìm kiếm chủ đề
  const searchHashtags = (query) => {
    return hashtag.filter(
      (item) => item.hashtag_id?.toLowerCase().includes(query.toLowerCase()) // Kiểm tra hashtag_id
    );
  };

  // Hàm tìm kiếm người dùng
  const searchUsers = (query) => {
    console.log("allUser", allUser);
    return allUser.filter(
      (user) => user.username?.toLowerCase().includes(query.toLowerCase()) // Kiểm tra username
    );
  };

  // Hàm lọc dữ liệu dựa trên danh mục
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredData([]); // Nếu không có từ khóa, trả về danh sách rỗng
      return;
    }

    let results = [];
    switch (activeTab) {
      case "Bài viết":
        results = searchPosts(query); // Sử dụng hàm tìm kiếm bài viết
        break;
      case "Chủ đề":
        results = searchHashtags(query); // Sử dụng hàm tìm kiếm chủ đề
        break;
      case "Người dùng":
        results = searchUsers(query); // Sử dụng hàm tìm kiếm người dùng
        break;
      default:
        break;
    }

    setFilteredData(results);
  };

  // Cập nhật từ khóa tìm kiếm
  const onSearchChange = (query) => {
    setSearchQuery(query);
    handleSearch(query); // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  };

  // Giao diện tab
  const renderTab = () => (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleGoToDetali = async (item) => {
    if (item.post_id) {
     
      const postUser = users[item.user_id];


      // console.log( "post:", item)
      // console.log( "user:", user)
      // console.log( "userPost:", postUser)
      // console.log( "post_user_id:", item.user_id)
      // console.log( "comments:", comments)

      navigation.navigate("DetailPost", {
        post: item,
        user: user,
        userPost: postUser,
        post_user_id: item.user_id,
        comments: comments,
      });
    } else if (item.hashtag_id) {
      console.log("chủ đề:", item);
      const data = await dispatch(
        getPostsHashtag({ hashtag: item.hashtag_id })
      );

      navigation.navigate("HashtagGroupScreen", {
        hashtagID: item.hashtag_id,
        hashtag_avatar: item.hashtag_avatar,
        hashtag_background: item.hashtag_background,
        postHashtag: data.payload.postHashtag,
      });
    } else if (item.user_id) {
      console.log("người dùng:", item);
      const postUser = users[item.user_id];
      navigation.navigate("PersonScreen", {
        userPost: postUser,
        isFromAvatar: true,
      });
    }
  };

  // Giao diện kết quả tìm kiếm
  const renderResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        handleGoToDetali(item);
      }}
    >
      {activeTab === "Bài viết" && (
        <>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text>{item.body}</Text>
        </>
      )}
      {activeTab === "Chủ đề" && (
        <Text style={styles.resultTitle}>{item.hashtag_id}</Text>
      )}
      {activeTab === "Người dùng" && (
        <Text style={styles.resultTitle}>{item.username}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={`Tìm kiếm ${activeTab.toLowerCase()}...`}
        value={searchQuery}
        onChangeText={onSearchChange} // Cập nhật từ khóa tìm kiếm
      />
      {renderTab()}
      <FlatList
        data={filteredData} // Kết quả đã lọc
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderResult}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    padding: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: { padding: 10, borderBottomWidth: 2, borderColor: "transparent" },
  activeTab: { borderColor: "#007BFF" },
  tabText: { fontSize: 16, color: "#000" },
  activeTabText: { color: "#007BFF" },
  resultItem: { padding: 15, borderBottomWidth: 1, borderColor: "#ccc" },
  resultTitle: { fontWeight: "bold", fontSize: 16 },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default SearchScreen;

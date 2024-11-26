import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { updateNotiByField, createNoti } from "../redux/slices/NotiSlice";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { getAllPost } from "../redux/slices/PostSlice";
import { useNavigation } from "@react-navigation/native";

const ListNotiComponent = ({ targetUser_id }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.noti.noti);
  const allPosts = useSelector((state) => state.post.allPost || []);
  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user); // Lấy tất cả user
  const comments = useSelector((state) => state.comment);
  const navigation = useNavigation();
  // Lọc thông báo theo targetUser_id và sắp xếp theo thời gian
  const userNotifications = notifications
    .filter((noti) => noti.targetUser_id === targetUser_id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Xử lý khi người dùng nhấn vào thông báo
  const handlePressNoti = (noti) => {
    if (!noti.check_touch) {
      dispatch(
        updateNotiByField({
          notiID: noti.noti_id,
          field: "check_touch",
          value: true,
        })
      );
    }

    if (noti.role_noti == 0) {
      const post = allPosts.find((p) => p.post_id === noti.post_id);
      const postUser = users[user.user_id];

      // console.log("1t", post)
      // console.log("2", user)
      // console.log("3", postUser)
      // console.log("4", post.user_id)
      // console.log("5", comments)

      navigation.navigate("DetailPost", {
        post: post,
        user: user,
        userPost: postUser,
        post_user_id: post.user_id,
        comments: comments,
      });
    } else if (noti.role_noti == 1) {
      const post = allPosts.find((p) => p.post_id === noti.post_id);
      const postUser = users[user.user_id];
      navigation.navigate("DetailPost", {
        post: post,
        user: user,
        userPost: postUser,
        post_user_id: post.user_id,
        comments: comments,
      });

    } else if (noti.role_noti == 2) {
      const post = allPosts.find((p) => p.post_id === noti.post_id);
      const postUser = users[user.user_id];
      console.log("day la bao cao");
      navigation.navigate("DetailPost", {
        post: post,
        user: user,
        userPost: postUser,
        post_user_id: post.user_id,
        comments: comments,
      });
    }
  };

  useEffect(() => {
    dispatch(getAllPost());
  }, []);

  return (
    <ScrollView style={styles.container}>
      {userNotifications.map((noti) => (
        <TouchableOpacity
          key={noti.noti_id}
          style={[
            styles.notiItem,
            !noti.check_touch ? styles.uncheckedNoti : styles.checkedNoti,
          ]}
          onPress={() => handlePressNoti(noti)}
        >
          <View style={styles.notiContent}>
            <Image source={{ uri: noti.imgUser }} style={styles.userImage} />
            <View style={styles.eventDetails}>
              <Text style={styles.notiTitle}>{noti.content}</Text>
              <Text style={styles.notiDate}>
                {formatDistanceToNow(new Date(noti.created_at * 1000), {
                  locale: vi,
                })}{" "}
                trước
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5fb",
  },
  notiItem: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  uncheckedNoti: {
    backgroundColor: "#eaf2fd",
  },
  checkedNoti: {
    backgroundColor: "#fff",
  },
  notiContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 500,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  notiTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notiDate: {
    marginTop: 5,
    color: "#888",
    fontSize: 12,
  },
});

export default ListNotiComponent;

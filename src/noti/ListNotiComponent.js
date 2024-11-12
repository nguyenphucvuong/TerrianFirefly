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

const ListNotiComponent = ({ targetUser_id }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.noti.noti);

  // const newdata = {
  //   //trạng thái mặc định là false
  //   check_touch: false, // trạng thái đã nhấn vào thông báo chưa
  //   checked: false, //trạng thái thông báo đã được gửi chưa
  //   content: "user_name đã like bài viết của bạn", //user_name của người like
  //   created_at: Date.now(), 
  //   //đường dẫn hình ảnh của người like
  //   imgUser:
  //     "https://firebasestorage.googleapis.com/v0/b/terrianfirefly.appspot.com/o/images%2FF3A0F535-95B9-4595-9BAE-7E0DD5436F0F.jpg?alt=media&token=0b05e219-8d77-4544-a95e-ce8f46ccc1fd",
  //   noti_id: "temp", //id của thông báo
  //   post_id: "temp", //id của post vừa like
  //   targetUser_id: "ETFNQWVPt27VqU9Cuyph", //id của người nhận được thông báo lấy từ post vừa like
  //   user_id: "người like", //id của người like lấy từ user hiện đang đăng nhập
  // };
  
  // Lọc thông báo theo targetUser_id và sắp xếp theo thời gian
  const userNotifications = notifications
    .filter((noti) => noti.targetUser_id === targetUser_id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Xử lý khi người dùng nhấn vào thông báo
  const handlePressNoti = (noti) => {
    if (!noti.check_touch) {
      dispatch(updateNotiByField({ notiID: noti.noti_id, field: "check_touch", value: true }));
      
    }
  };

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
                {formatDistanceToNow(new Date(noti.created_at * 1000), { locale: vi })} trước
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
    backgroundColor: "#eaf2fd", // Màu xanh nhạt cho thông báo chưa đọc
  },
  checkedNoti: {
    backgroundColor: "#fff", // Màu trắng cho thông báo đã đọc
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

import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createNoti, updateNotiByField } from "../redux/slices/NotiSlice";
import ListNotiComponent from "../noti/ListNotiComponent";
import { useNotification } from "../context/NotiProvider";
import { Video } from "expo-av";
const { height, width } = Dimensions.get("window");

const NotificationScreen = () => {
  const { schedulePushNotification } = useNotification();
  const noti = useSelector((state) => state.noti.noti);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  //tạo dữ liệu thông báo
  const newdata = {
    //trạng thái mặc định là false
    check_touch: false, // trạng thái đã nhấn vào thông báo chưa
    checked: false, //trạng thái thông báo đã được gửi chưa
    content: "user_name đã like bài viết của bạn", //user_name của người like
    created_at: Date.now(),
    //đường dẫn hình ảnh của người like
    imgUser:
      "https://firebasestorage.googleapis.com/v0/b/terrianfirefly.appspot.com/o/images%2FF3A0F535-95B9-4595-9BAE-7E0DD5436F0F.jpg?alt=media&token=0b05e219-8d77-4544-a95e-ce8f46ccc1fd",
    noti_id: "temp", //id của thông báo
    post_id: "temp", //id của post vừa like
    targetUser_id: user.user_id, //id của người nhận được thông báo lấy từ post vừa like
    user_id: "người like", //id của người like lấy từ user hiện đang đăng nhập
  };
  {
    /* <Video
        source={require("../../assets/background/T1.mp4")}
        style={styles.media}
        useNativeControls={false}  // Tắt các điều khiển native
        resizeMode="cover"         // Video sẽ tự động phóng to/thu nhỏ để phủ đầy màn hình
        shouldPlay={true}          // Video tự động phát khi màn hình hiển thị
        isLooping={true}          // Video sẽ lặp lại khi kết thúc
        isMuted={false}           // Đảm bảo âm thanh bật (false để bật âm thanh)
        onError={(error) => console.log('Video Error: ', error)} // Để bắt lỗi video
      /> */
  }
  // useEffect(() => {
  //   const uncheckedNotis = noti.filter((n) => !n.checked);

  //   // Sử dụng Promise.all để thực hiện cập nhật đồng bộ hiệu quả hơn
  //   Promise.all(
  //     uncheckedNotis.map(async (notiItem) => {
  //       await schedulePushNotification({ title: "TerrianFireFly", body: notiItem.content });
  //       dispatch(updateNotiByField({ notiID: notiItem.noti_id, field: "checked", value: true }));
  //     })
  //   );
  // }, [noti, dispatch, schedulePushNotification]);

  return (
    <View style={styles.container}>
      {noti.length != 0 ? (
        <ListNotiComponent targetUser_id={user.user_id} />
      ) : (
        <>
          <Image
            source={require("../../assets/appIcons/empty_box.png")} //icon #
            style={styles.userImage}
          />
        </>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  media: {
    // ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: 200,
    alignSelf: "center",
  },
  userImage: {
    position: "absolute",
    top: "30%",
    left: "21%",
    width: width * 0.6,
    height: height * 0.3,
  },
});

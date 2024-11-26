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

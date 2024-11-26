import React, { createContext, useContext, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useSelector, useDispatch } from "react-redux";
import { updateNotiByField } from "../redux/slices/NotiSlice";
import { useNavigation } from "@react-navigation/native";

const NotifiContext = createContext();

export const NotiProvider = ({ children }) => {
  const dispatch = useDispatch();
  const noti = useSelector((state) => state.noti.noti);
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  // Hàm gửi thông báo
  const schedulePushNotification = async ({ title, body }) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: 2 },
    });
  };

  // Xử lý sự kiện khi người dùng nhấn vào thông báo
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      // Điều hướng đến màn hình NotificationScreen
      navigation.navigate("NotificationScreen"); // Đảm bảo tên màn hình là chính xác
    });

    return () => subscription.remove(); // Xóa listener khi component bị unmount
  }, [navigation]);

  // useEffect giám sát noti và gửi thông báo nếu có thông báo chưa đọc
  useEffect(() => {
    if (user && user.user_id) {
      const uncheckedNotis = noti.filter(
        (n) => !n.checked && n.targetUser_id === user.user_id && n.noti_id !== "temp"
      );

      Promise.all(
        uncheckedNotis.map(async (notiItem) => {
          await schedulePushNotification({ title: "TerrianFireFly", body: notiItem.content });
          dispatch(updateNotiByField({ notiID: notiItem.noti_id, field: "checked", value: true }));
        })
      );
    }
  }, [noti, dispatch, user]);

  return (
    <NotifiContext.Provider value={{ schedulePushNotification }}>
      {children}
    </NotifiContext.Provider>
  );
};

export const useNotification = () => useContext(NotifiContext);

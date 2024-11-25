import React, { createContext, useContext, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useSelector, useDispatch } from "react-redux";
import { updateNotiByField } from "../redux/slices/NotiSlice";

const NotifiContext = createContext();

export const NotiProvider = ({ children }) => {
  const dispatch = useDispatch();
  const noti = useSelector((state) => state.noti.noti);
  const user = useSelector((state) => state.user.user); 

  // Hàm gửi thông báo
  const schedulePushNotification = async ({ title, body }) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: 2 },
    });
  };

<<<<<<< HEAD
  // useEffect giám sát noti và gửi thông báo nếu có thông báo chưa đọc
  useEffect(() => {
    // Kiểm tra nếu user và user.user_id không null hoặc undefined
    if (user && user.user_id) {
      // Lọc thông báo của người dùng hiện tại (targetUser_id = user.user_id)
      const uncheckedNotis = noti.filter(
        (n) => !n.checked && n.targetUser_id === user.user_id && n.noti_id != "temp"
      ); // Chỉ chọn thông báo đã có noti_id

      Promise.all(
        uncheckedNotis.map(async (notiItem) => {
          await schedulePushNotification({ title: "TerrianFireFly", body: notiItem.content });
          dispatch(updateNotiByField({ notiID: notiItem.noti_id, field: "checked", value: true }));
        })
      );
    }
  }, [noti, dispatch, user]); 
=======
 // useEffect giám sát noti và gửi thông báo nếu có thông báo chưa đọc
 useEffect(() => {
  // Kiểm tra nếu user và user.user_id không null hoặc undefined
  if (user && user.user_id) {
    // Lọc thông báo của người dùng hiện tại (targetUser_id = user.user_id)
    const uncheckedNotis = noti.filter(
      (n) => !n.checked && n.targetUser_id === user.user_id && n.noti_id != "temp"
    ); // Chỉ chọn thông báo đã có noti_id

    Promise.all(
      uncheckedNotis.map(async (notiItem) => {
        await schedulePushNotification({ title: "TerrianFireFly", body: notiItem.content });
        dispatch(updateNotiByField({ notiID: notiItem.noti_id, field: "checked", value: true }));
      })
    );
  }
}, [noti, dispatch, user]);
>>>>>>> 28bf6fcc4501f8b14507595eb7c17df3f24b5113

  return (
    <NotifiContext.Provider value={{ schedulePushNotification }}>
      {children}
    </NotifiContext.Provider>
  );
};

export const useNotification = () => useContext(NotifiContext);
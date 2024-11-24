// import IndexRouter from './src/routers/indexRouter'
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar, View, Platform } from "react-native";
import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useRef,
  useCallback,
} from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { store } from "./src/redux/store";
import "react-native-gesture-handler";
import StackNavigator from "./src/stacks/StackNavigator";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { listenToUserRealtime, } from "./src/redux/slices/UserSlices";
import { LogBox } from "react-native";
import { auth, db } from "./src/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import { getPostsFirstTime } from "./src/redux/slices/PostSlice";
import { ImageProvider } from "./src/context/ImageProvider";
import { getHashtag } from "./src/redux/slices/HashtagSlice";
import { fetchEvents } from "./src/redux/slices/EventSlice";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Title } from "react-native-paper";
import { NotiProvider } from "./src/context/NotiProvider";
import { useNotification } from "./src/context/NotiProvider";

import { SplashScreenComponent } from "./src/views";

const MainApp = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const skipAutoNavigation = useSelector((state) => state.user.skipAutoNavigation);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const dispatch = useDispatch();

  const { schedulePushNotification } = useNotification();
  const noti = useSelector((state) => state.noti.noti);

  const navigation = useNavigation();

  useEffect(() => {
    // Tắt các cảnh báo không cần thiết
    LogBox.ignoreLogs([
      'Warning: Component "RCTView" contains the string ref',
      "Possible Unhandled Promise Rejection",
    ]);
  }, []);
  const [user, setUser] = useState(null);

  // Lắng nghe trạng thái người dùng Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Cập nhật trạng thái người dùng
      if (currentUser) {
        console.log("User is logged in, navigating to IndexTab");
      } else {
        console.log("No user logged in, navigating to WellcomScreen");
      }
    });

    return () => unsubscribe(); // Hủy đăng ký khi component bị huỷ
  }, [navigation]);

  useEffect(() => {
    if (appIsReady && isLoadingData && !skipAutoNavigation) {
      if (user) {
        navigation.navigate("IndexTab");
      } else {
        navigation.navigate("WellcomScreen");
      }
    }
  }, [appIsReady, isLoadingData, user, skipAutoNavigation, navigation]);

  useEffect(() => {
    setAppIsReady(false);
    const listenToUser = async () => {
      try {
        if (user) {
          // Gọi dispatch để lắng nghe dữ liệu người dùng
          await dispatch(listenToUserRealtime(user.email)); // Nếu action là async
        }
      } catch (error) {
        console.error("Error listening to user data:", error);
      } finally {
        setAppIsReady(true);
      }
    };

    listenToUser();
  }, [dispatch, user]);

  const today = new Date();
  const value = today.toISOString(); // Đảm bảo là định dạng ISO

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // useEffect(() => {
  //   // const unsubscribeHashtag = getHashtag(dispatch);
  //   // return () => unsubscribeHashtag();
  // }, [dispatch]);

  //load dữ liệu trước khi vào màn hình app
  useEffect(() => {
    const prepareApp = async () => {
      try {
        setAppIsReady(false);
        const fetchData = [
          dispatch(fetchEvents(dispatch)),
          dispatch(getPostsFirstTime()),
          dispatch(getHashtag(dispatch)),
        ];
        await Promise.all(fetchData); // Chờ tất cả các tác vụ tải dữ liệu hoàn thành
      } catch (error) {
        console.error("Error during app preparation:", error);
      } finally {
        setIsLoadingData(true); // Đánh dấu dữ liệu đã tải xong
        setAppIsReady(true); // Đánh dấu ứng dụng đã sẵn sàng
      }
    };
    prepareApp();
  }, [dispatch]);

  if (!appIsReady || !isLoadingData) {
    return <SplashScreenComponent />; // Hiển thị splash screen khi đang tải
  }
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent={true}
        backgroundColor="white"
      />
      <StackNavigator initialRouteName={user ? "IndexTab" : "WellcomScreen"} />
    </>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Không hoạt động trên thiết bị ảo");
  }

  return token;
}

const App = () => {
  return (
    <Provider store={store}>
      <ImageProvider>
        <NotiProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <MainApp />
            </NavigationContainer>
          </SafeAreaProvider>
        </NotiProvider>
      </ImageProvider>
    </Provider>
  );
};

export default App;

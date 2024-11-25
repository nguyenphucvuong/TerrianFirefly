import { StatusBar, View, Platform } from "react-native";
import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useRef,
} from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { store } from "./src/redux/store";
import "react-native-gesture-handler";
import StackNavigator from "./src/stacks/StackNavigator";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
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
import { LogBox } from "react-native";
import { getAllNoti } from "./src/redux/slices/NotiSlice";
import { getAllHashtagGroup } from "./src/redux/HashtagGroupSlice";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MainApp = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const dispatch = useDispatch();

  const { schedulePushNotification } = useNotification();
  const noti = useSelector((state) => state.noti.noti);
  const notiList = useSelector((state) => state.noti.notiList);

  useEffect(() => {
    const unsubscribe = getAllHashtagGroup(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = getAllNoti(dispatch);
    return () => unsubscribe();
  
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeEvent = fetchEvents()(dispatch);
    // console.log(object)
    return () => unsubscribeEvent();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeHashtag = getHashtag(dispatch);
    return () => unsubscribeHashtag();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPostsFirstTime());

    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent={true}
        backgroundColor="white"
      />
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
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
            <MainApp />
          </SafeAreaProvider>
        </NotiProvider>
      </ImageProvider>
    </Provider>
  );
};

export default App;

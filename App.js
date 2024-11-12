// import IndexRouter from './src/routers/indexRouter'
import { StatusBar, View } from "react-native";

import React, { useEffect, useState, useContext, createContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { store } from "./src/redux/store";
import "react-native-gesture-handler";
import StackNavigator from "./src/stacks/StackNavigator";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { listenToUserRealtime } from "./src/redux/slices/UserSlices";
import { ImageProvider } from "./src/context/ImageProvider";
import { getHashtag } from "./src/redux/slices/HashtagSlice";
import {
  getEvent,
  getEventByField,
  fetchEvents,
} from "./src/redux/slices/EventSlice";
import { LogBox } from "react-native";
import { auth, db } from "./src/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getPostsFirstTime } from "./src/redux/slices/PostSlice";
const MainApp = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    // Tắt cảnh báo thư viện không hỗ trợ
    LogBox.ignoreLogs(['Warning: Component "RCTView" contains the string ref']);
    // Bắt các promise bị từ chối
    LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
  }, []);
  const [user, setUser] = useState("");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (navigation) {
        navigation.navigate(currentUser ? "IndexTab" : "WellcomScreen");
      }
    });
    return () => unsubscribe();
  }, [navigation]);
  useEffect(() => {
    const listenToUser = async () => {
      try {
        if (user) {
          // Gọi dispatch để lắng nghe dữ liệu người dùng
          await dispatch(listenToUserRealtime(user.email)); // Nếu action là async
        }
      } catch (error) {
        console.error("Error listening to user data:", error);
      }
    };

    listenToUser();
  }, [dispatch, user]);

  const today = new Date();
  const value = today.toISOString(); // Đảm bảo là định dạng ISO
  useEffect(() => {
    // dispatch(getPostsByField({ field: "created_at", quantity: "2", lastVisiblePost: null }));
    //dispatch(getPostsFirstTime());
    //dispatch(getHashtag());
  }, []);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        await dispatch(fetchEvents()); // Gọi action async
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEventsData();
  }, [dispatch]);
  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        translucent={true}
        backgroundColor="white"
      />
      <StackNavigator />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ImageProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <MainApp />
          </NavigationContainer>
        </SafeAreaProvider>
      </ImageProvider>
    </Provider>
  );
};

export default App;

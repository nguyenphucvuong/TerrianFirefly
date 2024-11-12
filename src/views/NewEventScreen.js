import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  BackHandler,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";

import ButtonsComponent from "../component/ButtonsComponent";
import { appInfo } from "../constains/appInfo";
import { useNavigation } from "@react-navigation/native";
import ListEventComponent from "../component/event/ListEventComponent";
import { useDispatch, useSelector } from "react-redux";
const { height, width } = Dimensions.get("window");

const NewEventScreen = () => {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.event.events);

  // Lấy ngày tháng năm hiện tại
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // Tháng bắt đầu từ 0
  const currentDate = today.getDate();

  // Kiểm tra nếu có sự kiện nào có ngày tháng năm giống với ngày hiện tại
  const eventsToday = event.filter((eventItem) => {
    const eventDate = new Date(eventItem.created_at); // Chuyển đổi timestamp thành Date
    return (
      eventDate.getFullYear() === currentYear &&
      eventDate.getMonth() === currentMonth &&
      eventDate.getDate() === currentDate
    );
  });

  const handleRefresh = () => {
    // dispatch(getEventByField({ fieldWhere: "created_at", value: Date.now() }));
  };
  const test = () => {};
  return (
    <View style={styles.container}>
      {eventsToday.length != 0 ? (
        <ListEventComponent
          events={event}
          // onRefresh={handleRefresh}
          isNew={true}
        ></ListEventComponent>
      ) : (
        <>
          <Image
            source={require("../../assets/appIcons/emptyEvent_box.png")} 
            style={styles.userImage}
          />
        </>
      )}
    </View>
  );
};
export default NewEventScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userImage: {
    position: "absolute",
    top: "30%",
    left: "21%",
    width: width * 0.6,
    height: height * 0.3,
  },
});

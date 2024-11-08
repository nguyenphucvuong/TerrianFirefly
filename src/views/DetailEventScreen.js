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
} from "react-native";

import ButtonsComponent from "../component/ButtonsComponent";
import { appInfo } from "../constains/appInfo";
import { useNavigation } from "@react-navigation/native";
import ListEventComponent from "../component/event/ListEventComponent";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPassword } from "../redux/slices/UserSlices";
import { getEvent } from "../redux/slices/EventSlice";

const DetailEventScreen = () => {
  const dispatch = useDispatch();
  const { event } = useSelector((state) => state.event); // post


  return (
    <TouchableWithoutFeedback style={{ flex: 1 }}>
      <View style={styles.container}>
       <Text style={{margin:200}} >chi tiết sự kiện</Text>  
      </View>
    </TouchableWithoutFeedback>
  );
};
export default DetailEventScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#ffff",
  },
  upperHeaderPlacehholder: {
    height: appInfo.heightWindows * 0.04,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    textAlign: "center",
    color: "#888",
  },
  eventItem: {
    flexDirection: "row",
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventDetails: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDate: {
    color: "#888",
  },
  eventLink: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});
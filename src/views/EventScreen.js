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

const EventScreen = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.events);

  const handleRefresh = () => {
    // dispatch(getEvent());
  };

  return (
    <View style={styles.container}>
      {events.length != 0 ? (
        <ListEventComponent
          events={events}
          // onRefresh={handleRefresh}
          isNew={false}
        ></ListEventComponent>
      ) : (
        <>
          <Image
            source={require("../../assets/appIcons/emptyEvent_box.png")} //icon #
            style={styles.userImage}
          />
        </>
      )}
    </View>
  );
};
export default EventScreen;
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

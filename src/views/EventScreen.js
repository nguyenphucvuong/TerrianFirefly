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

const EventScreen = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.events);


  const handleRefresh = () => {
    // dispatch(getEvent());
  };
  const test = () => {
  };


    return (
      <TouchableWithoutFeedback onPress={test} style={{ flex: 1 }}>
        <View style={styles.container}>
          <ListEventComponent
            events={events}
            onRefresh={handleRefresh}
            isNew={false}
          ></ListEventComponent>
        </View>
      </TouchableWithoutFeedback>
    );
};
export default EventScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
  },
});

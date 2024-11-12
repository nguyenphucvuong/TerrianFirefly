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

const NewEventScreen = () => {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.event.events);

  console.log();

  const handleRefresh = () => {
    // dispatch(getEventByField({ fieldWhere: "created_at", value: Date.now() }));
  };
  const test = () => {
  };
  return (
    <TouchableWithoutFeedback onPress={test} style={{ flex: 1 }}>
      <View style={styles.container}>
        <ListEventComponent
          events={event}
          onRefresh={handleRefresh}
          isNew={true}
        ></ListEventComponent>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default NewEventScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
  },
});

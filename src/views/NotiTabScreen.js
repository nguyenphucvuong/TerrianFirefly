import React, { Component,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  
} from "react-native";
import ButtonsComponent from "../component/ButtonsComponent";
import { appInfo } from "../constains/appInfo";
import { useNavigation } from "@react-navigation/native";
function NotiTabScreen() {
  const navigation = useNavigation();

  const handleNoti = () => {
    console.log("noti");
  };
  
  const handlEvt = () => {
    navigation.navigate('NewEventScreen')
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }}>
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.upperHeaderPlacehholder} />
        </SafeAreaView>

        <ButtonsComponent isNotiButton onPress={handleNoti}>
          <Image
            source={require("../../assets/bottomtabicons/notiC.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Thông báo</Text>
        </ButtonsComponent>

        <View style={{marginTop: 40}}>
        <ButtonsComponent isNotiButton onPress={handlEvt}>
          <Image
            source={require("../../assets/bottomtabicons/eventC.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Sự kiện mới</Text>
        </ButtonsComponent>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
export default NotiTabScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffff",
  },
  upperHeaderPlacehholder: {
    height: appInfo.heightWindows * 0.04,
  },
  navigationView: {
    flexDirection: "row",
  },
  text: {
    marginLeft: 20,
    marginTop: 13,
    fontSize: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
});

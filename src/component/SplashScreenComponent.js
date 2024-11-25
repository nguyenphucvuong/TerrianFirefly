import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";

const SplashScreenComponent = () => {
  return (
    <View style={styles.container}>
      {/* Thêm hình icon app */}
      <Image
        source={require("../../assets/icon.png")}
        style={styles.icon}
      />
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5D0B6F", 
  },
  
  icon: {
    width: 250, 
    height: 250, 
    //marginBottom: 20, 
    marginTop: 150,
  },
});

export default SplashScreenComponent;

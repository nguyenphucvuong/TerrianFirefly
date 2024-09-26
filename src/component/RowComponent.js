import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { appInfo } from "../constains/appInfo";

const RowComponent = (rowInfo) => {
  const [children, color, minHeight, maxHeight, height, style, width, minWidth, maxWidth] = [
    rowInfo.children,
    rowInfo.backgroundColor,
    rowInfo.minHeight,
    rowInfo.maxHeight,
    rowInfo.height,
    rowInfo.style,
    rowInfo.width,
    rowInfo.minWidth,
    rowInfo.maxWidth,
  ];

  // console.log("minHeight", minHeight, "maxHeight", maxHeight, "height", height);

  return (
    <View
      style={[
        {
          backgroundColor: color,
          minHeight: minHeight ? minHeight : "auto",
          maxHeight: maxHeight ? maxHeight : "auto",
          width: width ? width : "100%",
          minWidth: minWidth ? minWidth : "auto",
          maxWidth: maxWidth ? maxWidth : "auto",
          height: height ? height : "auto",
          flexDirection: "row",
        },
        style && style,
      ]}
    >
      {children}
    </View>
  );
};

export default React.memo(RowComponent);

const styles = StyleSheet.create({});

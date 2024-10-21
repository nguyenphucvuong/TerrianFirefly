import { StyleSheet } from "react-native";
import { appInfo } from "../constains/appInfo";
export const StyleGlobal = StyleSheet.create({
  textName: {
    fontSize: 13,
    fontWeight: "600",
  },
  textInfo: {
    fontSize: 13,
    color: "gray",
  },
  textTitleContent: {
    fontSize: 15,
    fontWeight: "bold",
  },
  textContent: {
    fontSize: 13,
    color: "gray",
  },
  text: {
    fontSize: 13,
  },
  container: {
    flex: 1,
    padding: appInfo.widthWindows * 0.04,
    backgroundColor: 'white',
  },
});

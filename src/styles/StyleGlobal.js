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
  textTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: appInfo.widthWindows * 0.04,
    backgroundColor: 'white',
  },
  buttonLg: {
    alignSelf: "center",
    width: appInfo.heightWindows * 0.41,
    height: appInfo.heightWindows * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    elevation: 2, // Thêm độ bóng cho Android
  },
  buttonTextLg: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

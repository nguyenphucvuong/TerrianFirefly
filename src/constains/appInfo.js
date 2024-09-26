import { Dimensions } from "react-native";

const widthWindows = Dimensions.get("window").width;
const heightWindows = Dimensions.get("window").height;
const toValueDimensions = Dimensions.get("window");
export const appInfo = {
    widthWindows: widthWindows,
    heightWindows: heightWindows,
    toValueDimensions: toValueDimensions,
};

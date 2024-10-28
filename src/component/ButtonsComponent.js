import {
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import React from "react";
import { Image } from "expo-image";

const ButtonsComponent = ({
  children,
  color,
  style,
  isButton,
  isPressable,
  onPress,
  onLongPress,
  isHashtag,
  hashtag,
  isDetail,
  isBack,
  isNext,
  isNotiButton,
}) => {
  // const ButtonsComponent = (infoButton) => {
  // const [children, color, style, isButton, isPressable, onPress, onLongPress, isHashtag, hashtag, isDetail] = [
  //   infoButton.children,
  //   infoButton.color,
  //   infoButton.style,
  //   infoButton.isButton,
  //   infoButton.isPressable,
  //   infoButton.onPress,
  //   infoButton.onLongPress,
  //   infoButton.isHashtag,
  //   infoButton.hashtag,
  //   infoButton.isDetail,
  // ];

  const PressableButton = () => {
    return (
      <Pressable
        // onPress={onPress}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.6}
        delayLongPress={500}
        style={[
          {
            color: color,
          },
          style && style,
        ]}
      >
        {children}
      </Pressable>
    );
  };

  const NormalTouchableOpacity = () => {
    return (
      <TouchableOpacity
        // onPress={onPress}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.6}
        delayLongPress={500}
        style={[
          {
            color: color,
          },
          style && style,
        ]}
      >
        {children}
      </TouchableOpacity>
    );
  };

  const HashtagButtons = () => {
    const RenderHashtagButtons = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[
            {
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
              height: "90%",
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginEnd: 8,
              flexDirection: "row",
              backgroundColor: "rgba(215,223,221,0.3)",
            },
            style && style,
          ]}
        >
          <Image
            style={{
              width: 15,
              height: 15,
            }}
            // eslint-disable-next-line no-undef
            source={require("../../assets/appIcons/hashtag_icon.png")}
            contentFit="cover"
          />
          <Text
            style={{
              fontSize: 12,
              color: "rgba(101,128,255,1)",
            }}
          >
            {item}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <FlatList
        scrollEnabled={!isDetail}
        showsHorizontalScrollIndicator={false}
        data={hashtag}
        renderItem={({ item }) => <RenderHashtagButtons item={item} />}
        keyExtractor={(item) => item}
        horizontal={!isDetail}
        numColumns={isDetail ? 2 : 0}
        style={{
          width: "95%",
          height: "100%",
          backgroundColor: "green",
        }}
        contentContainerStyle={{
          justifyContent: "flex-start",
          width: "auto",
          height: "100%",
        }}
      />
    );
  };

  //Nút quay lại
  const BackButton = () => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.buttonBack}>
        {children}
      </TouchableOpacity>
    );
  };

  //Nút tiếp tục
  const NextButton = () => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.buttonNext}>
        {children}
      </TouchableOpacity>
    );
  };

  //Nút chuyển trang notiButton
  const NotiButton = () => {
    return (
      <TouchableOpacity activeOpacity={1.0} onPress={onPress} style={styles.buttonNotiTab}>
        {children}
      </TouchableOpacity>
    );
  };

  if (isButton) {
    return <NormalTouchableOpacity />;
  } else if (isHashtag) {
    return <HashtagButtons />;
  } else if (isPressable) {
    return <PressableButton />;
  } else if (isBack) {
    return <BackButton />;
  } else if (isNext) {
    return <NextButton />;
  } else if (isNotiButton) {
    return <NotiButton />;
  } else {
    return <></>;
  }
};

export default React.memo(ButtonsComponent);
const styles = StyleSheet.create({
  buttonNext: {
    width: "18%",
    height: 33,
    backgroundColor: "#697BEB",
    borderRadius: 20,
    alignItems: "center",
    marginLeft: "62%",
  },
  buttonBack: {
    width: "19%",
    height: 30,
    borderRadius: 10,
  },
  buttonNotiTab: {
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
});

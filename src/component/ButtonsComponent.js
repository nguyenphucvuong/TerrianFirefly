import { Text, TouchableOpacity, FlatList, Pressable } from "react-native";
import React from "react";
import { Image } from 'expo-image';

const ButtonsComponent = ({ children, color, style, isButton, isPressable, onPress, onLongPress, isHashtag, hashtag, isDetail }) => {
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
        style={[{
          color: color,
        }, style && style]}
      >
        {children}
      </Pressable>
    );
  }

  const NormalButton = () => {

    return (
      <TouchableOpacity
        // onPress={onPress}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.6}
        delayLongPress={500}
        style={[{
          color: color,
        }, style && style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  const HashtagButtons = () => {

    const RenderHashtagButtons = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[{
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

          }, style && style]}
        >
          <Image
            style={{
              width: 15,
              height: 15,
            }}
            // eslint-disable-next-line no-undef
            source={require('../../assets/appIcons/hashtag_icon.png')}
            contentFit="cover" />
          <Text
            style={{
              fontSize: 12,
              color: "rgba(101,128,255,1)",
            }}>{item}</Text>
        </TouchableOpacity>
      )
    }
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

    )
  }

  if (isButton) {
    return <NormalButton />;
  } else if (isHashtag) {
    return <HashtagButtons />;
  } else if (isPressable) {
    return <PressableButton />;
  } else {
    return <></>
  }


};

export default React.memo(ButtonsComponent);


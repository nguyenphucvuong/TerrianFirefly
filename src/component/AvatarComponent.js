import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { Image } from "expo-image";

const AvatarComponent = ({ size, round, url, style, frame }) => {
  // const [size, round, url, style, children] = [infoImage.infoImage.size, infoImage.infoImage.round, infoImage.infoImage.url, infoImage.infoImage.style, infoImage.infoImage.children];
  const urlFrame = require('../../assets/frame/frame_background.png');
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {/* Avatar */}
        <Image
          style={
            [{
              width: size,
              height: size,
              borderRadius: round ? 100 : 0,
            }, style && style]}
          source={{
            uri: url,
          }
          }
          contentFit="cover"
        />
        {/* Khung */}
        <Image
          source={urlFrame}
          style={{
            height: size * 1.3,
            width: size * 1.3,
            position: 'absolute', // Chồng lên Avatar
            borderRadius: 80,
          }}>
        </Image >
      </View>
    </>
  );
};

const AvatarEx = ({ size, round, url, style, frame }) => {

  const AvatarCallback = useCallback(() => {
    return <AvatarComponent size={size} round={round} url={url} style={style} frame={frame} />;
  }, [size, round, url, style, frame]);

  return (
    <>
      <AvatarCallback />
    </>
  );
}

export default React.memo(AvatarEx);

const styles = StyleSheet.create({});

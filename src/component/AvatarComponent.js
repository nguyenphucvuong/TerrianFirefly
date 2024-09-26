import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { Image } from "expo-image";

const AvatarComponent = (infoImage) => {
  const [size, round, url, style] = [infoImage.infoImage.size, infoImage.infoImage.round, infoImage.infoImage.url, infoImage.infoImage.style];

  return (
    < Image
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
  );
};

const AvatarEx = (infoImage) => {

  const AvatarCallback = useCallback(() => {
    return <AvatarComponent infoImage={infoImage} />;
  }, [infoImage]);

  return (
    <>
      <AvatarCallback />
    </>
  );
}

export default React.memo(AvatarEx);

const styles = StyleSheet.create({});

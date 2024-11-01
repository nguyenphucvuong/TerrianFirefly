import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { Image } from "expo-image";
// style
import { StyleGlobal } from "../styles/StyleGlobal";

const AvatarEx = ({ size, round, url, style, frame }) => {

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
            source={frame}
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
}

export default React.memo(AvatarEx);

const styles = StyleSheet.create({});



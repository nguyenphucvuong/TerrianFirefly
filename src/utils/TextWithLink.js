import React from 'react';
import { Text, Linking, StyleSheet } from 'react-native';

const TextWithLinks = ({ content }) => {
  // Tách nội dung thành mảng các từ (hoặc cụm từ)
  const words = content.split(/(\s+)/);

  return (
    <Text style={styles.content}>
      {words.map((word, index) => {
        // Kiểm tra xem từ có phải là URL hay không
        if (word.match(/https?:\/\/[^\s]+/)) {
          return (
            <Text 
              key={index}
              style={{ color: 'blue', textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL(word)}
            >
              {word}
            </Text>
          );
        } else {
          return <Text key={index}>{word}</Text>;
        }
      })}
    </Text>
  );
};
const styles = StyleSheet.create({
    content: {
      fontSize: 17,
      lineHeight: 24,
    },
  });
export default TextWithLinks;

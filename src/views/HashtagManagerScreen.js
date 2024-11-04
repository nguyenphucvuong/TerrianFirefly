import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { ColorPicker } from "react-native-color-picker";
import Icon from "react-native-vector-icons/Ionicons"; // Thêm import cho icon

const HashtagManagerScreen = () => {
  const [hashtagName, setHashtagName] = useState("");
  const [textColor, setTextColor] = useState("#000000"); // Màu chữ mặc định
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF"); // Màu nền mặc định
  const [avatar, setAvatar] = useState(null); // Ảnh đại diện hashtag
  const [hashtags, setHashtags] = useState([]); // Danh sách hashtag

  // Mở thư viện ảnh để chọn ảnh đại diện
  const pickAvatarImage = async () => {
    if (avatar) {
      Alert.alert(
        "Lỗi",
        "Bạn đã chọn một ảnh đại diện. Vui lòng xóa ảnh nếu muốn chọn ảnh khác."
      );
      return;
    }

    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Hàm thêm hashtag
  const handleAddHashtag = () => {
    if (!hashtagName) {
      Alert.alert("Lỗi", "Vui lòng nhập tên hashtag.");
      return;
    }

    const newHashtag = {
      id: Math.random().toString(),
      name: hashtagName,
      textColor: textColor,
      backgroundColor: backgroundColor,
      avatar: avatar,
    };

    setHashtags([...hashtags, newHashtag]);
    setHashtagName("");
    setTextColor("#000000");
    setBackgroundColor("#FFFFFF");
    setAvatar(null);
  };

  // Hàm xóa hashtag
  const handleDeleteHashtag = (id) => {
    setHashtags(hashtags.filter((hashtag) => hashtag.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý Hashtag</Text>

      <TextInput
        placeholder="Tên Hashtag"
        value={hashtagName}
        onChangeText={setHashtagName}
        style={styles.input}
      />

      {/* Khung chọn ảnh đại diện và hiển thị mẫu hashtag */}
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={pickAvatarImage} style={styles.avatarPicker}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <Text>Chọn ảnh đại diện</Text>
          )}
        </TouchableOpacity>

        <View style={[styles.sampleHashtagContainer, { backgroundColor }]}>
          <Text style={[styles.sampleHashtagText, { color: textColor }]}>
            #{hashtagName}
          </Text>
        </View>
      </View>

      <View style={styles.colorPickersContainer}>
        <View style={styles.colorPicker}>
          <Text>Màu chữ</Text>
          <ColorPicker
            onColorSelected={(color) => setTextColor(color)}
            style={{ height: 100, width: "100%" }}
            hideSliders
          />
        </View>

        <View style={styles.colorPicker}>
          <Text>Màu nền</Text>
          <ColorPicker
            onColorSelected={(color) => setBackgroundColor(color)}
            style={{ height: 100, width: "100%" }}
            hideSliders
          />
        </View>
      </View>

      {/* Nút thêm hashtag */}
      <Button title="Thêm Hashtag" onPress={handleAddHashtag} />

      <FlatList
        data={hashtags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.hashtagItem,
              { backgroundColor: item.backgroundColor },
            ]}
          >
            {item.avatar && (
              <Image
                source={{ uri: item.avatar }}
                style={styles.hashtagAvatar}
              />
            )}
            <Text
              style={{ color: item.textColor, textAlign: "center", flex: 1 }}
            >
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteHashtag(item.id)}
              style={styles.deleteButton}
            >
              <Image
                source={require("../../assets/appIcons/delete.png")}
                style={styles.iconDel}
              />
            </TouchableOpacity>
          </View>
        )}
        style={styles.hashtagList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "space-between", // Để giữ nút thêm ở dưới cùng
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // Căn giữa dọc
    marginBottom: 10,
  },
  avatarPicker: {
    height: 100,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: "30%", // Chiếm 30% chiều rộng
    marginRight: 10, // Khoảng cách giữa avatar và hashtag mẫu
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  sampleHashtagContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    maxWidth: "60%", // Chiếm tối đa 60% chiều rộng
  },
  sampleHashtagText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  colorPickersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  colorPicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  hashtagList: {
    marginTop: 20,
  },
  hashtagItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  hashtagAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  iconDel: {
    alignSelf: "center",
    width: 25,
    height: 25,
    
  }
});

export default HashtagManagerScreen;

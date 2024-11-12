import React, { useEffect, useState, useRef } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ColorPicker } from "react-native-color-picker";
import Modal from "react-native-modal";
import ButtonFunctionComponent from "../component/ButtonFunctionComponent";
import { StyleGlobal } from "../styles/StyleGlobal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHashtags, // Thêm import để lấy hashtag
  addHashtagToFirestore,
  deleteHashtagFromFirestore,
} from "../redux/slices/HashtagSlice";
import { uploadImage } from "../redux/slices/UserSlices";
import { log } from "@tensorflow/tfjs";
const HashtagManagerScreen = () => {
  //firebase
  const user = useSelector((state) => state.user.user);

  const [hashtagName, setHashtagName] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [avatar, setAvatarImage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const { hashtag, isDeleting } = useSelector((state) => state.hashtag); // Lấy danh sách hashtags từ redux
  const statusHashtag = useSelector((state) => state.hashtag.statusHashtag);
  const errorHashtag = useSelector((state) => state.hashtag.errorHashtag);
  const dispatch = useDispatch();
  const colorPickerTextRef = useRef(null);
  const colorPickerBackgroundRef = useRef(null);
  // Lắng nghe sự thay đổi từ Firestore khi component mount
  useEffect(() => {
    
  }, [user.role_id]);

  if (statusHashtag === "loading") {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (errorHashtag) {
    return <Text>Error: {errorHashtag}</Text>; // Hiển thị lỗi nếu có
  }

  const pickAvatarImage = async () => {
    if (avatar) {
      Alert.alert(
        "Lỗi",
        "Bạn đã chọn một ảnh đại diện. Vui lòng xóa ảnh nếu muốn chọn ảnh khác."
      );
      return;
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatarImage(result.assets[0].uri);
      }
    } catch {
      console.error("Error picking image: ", error);
    }
  };
  
  const handleAddHashtag = async () => {
    console.log("hashtags", hashtag);
    
    if (!hashtagName) {
      Alert.alert("Lỗi", "Vui lòng nhập tên hashtag.");
      return;
    }
    // Kiểm tra nếu hashtag đã tồn tại
    const hashtagExists = hashtag.some((e) => e.hashtag_id === hashtagName);

    if (hashtagExists) {
      setModalVisible(false);
      Alert.alert("Lỗi", "Hashtag đã tồn tại.");
      return;
    }
    setisLoading(true);
    try {
      setModalVisible(true);
      let imgAvatar = "default";
      if (avatar) {
        imgAvatar = await dispatch(
          uploadImage({ imgUser: avatar, setUploadProgress })
        ).unwrap();
      }
      const newHashtag = {
        hashtag_id: hashtagName,
        role_id: user.roleid,
        hashtag_background: backgroundColor,
        hashtag_avatar: imgAvatar,
      };
      await dispatch(addHashtagToFirestore(newHashtag)); // Thêm hashtag vào Firestore
      // await dispatch(fetchHashtags());
      resetForm();
    } catch (error) {
      console.error("Upload failed:", error);
      setisLoading(false);
    } finally {
      setModalVisible(false);
      setisLoading(false);
    }
  };
  const handleDeleteHashtag = async (hashtag_id) => {
    try {
      await dispatch(deleteHashtagFromFirestore(hashtag_id)); // Xóa hashtag từ Firestore
    } catch (error) {
      console.error("Error deleting hashtag:", error);
    }
  };

  const resetForm = () => {
    setHashtagName("");
    setBackgroundColor("#FFFFFF");
    setAvatarImage("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tên Hashtag"
        value={hashtagName}
        onChangeText={setHashtagName}
        style={styles.input}
      />

      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={pickAvatarImage} style={styles.avatarPicker}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <Text>Chọn ảnh</Text>
          )}
        </TouchableOpacity>

        <View style={[styles.sampleHashtagContainer, { backgroundColor }]}>
          <Text style={[styles.sampleHashtagText]}>#{hashtagName}</Text>
        </View>
      </View>

      <View style={styles.colorPickersContainer}>
        <View style={styles.colorPicker}>
          <Text>Màu nền</Text>
          <ColorPicker
            onColorSelected={setBackgroundColor}
            style={{ height: 100, width: "100%" }}
            hideSliders
            ref={colorPickerBackgroundRef}
          />
        </View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={{ alignSelf: "center" }}>Cập Nhật</Text>
          <View style={styles.separator} />
          <Text>Đang tải... {uploadProgress}%</Text>
        </View>
      </Modal>
      <ButtonFunctionComponent
        isLoading={isLoading}
        name={"Thêm Hashtag"}
        backgroundColor={"#0286FF"}
        colorText={"#fff"}
        onPress={handleAddHashtag}
        style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
      />
      <FlatList
        data={
          Array.isArray(hashtag)
            ? hashtag.filter((item) => item.role_id === user.roleid)
            : []
        } // Sử dụng dữ liệu hashtag từ Redux
        keyExtractor={(item) => item.hashtag_id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.hashtagItem,
              { backgroundColor: item.hashtag_background },
            ]}
          >
            {item.hashtag_avatar && item.hashtag_avatar !== "default" && (
              <Image
                source={{ uri: item.hashtag_avatar }}
                style={styles.hashtagAvatar}
              />
            )}
            <Text
              style={{
                color: item.hashtag_color,
                flex: 1,
                textAlign: "center",
              }}
            >
              # {item.hashtag_id}
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteHashtag(item.hashtag_id)}
              style={styles.deleteButton}
              disabled={isDeleting} // Disable nút nếu đang xóa
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Image
                  source={require("../../assets/appIcons/delete.png")}
                  style={styles.iconDel}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
        style={styles.hashtagList}
        initialNumToRender={10} // Chỉ render 10 mục ban đầu
        windowSize={5} // Điều chỉnh số mục buffer để cải thiện hiệu suấ
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
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
    alignItems: "center",
    marginBottom: 10,
  },
  avatarPicker: {
    height: 100,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: "30%",
    marginRight: 10,
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
    maxWidth: "60%",
  },
  sampleHashtagText: {
    fontSize: 18,
    fontWeight: "bold",
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
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#B6B3B3",
    marginVertical: 5,
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
    width: 25,
    height: 25,
  },
});

export default HashtagManagerScreen;

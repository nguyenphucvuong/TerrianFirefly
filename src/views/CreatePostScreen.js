import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
  Alert,
  Platform,
  Switch,
  SafeAreaView,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { appInfo } from "../constains/appInfo";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import ButtonsComponent from "../component/ButtonsComponent";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  getPosts,
  getPostsByField,
} from "../redux/slices/PostSlice";
import { getHashtag, createHashtag } from "../redux/slices/HashtagSlice";
import { Ionicons } from "@expo/vector-icons";
import { log } from "@tensorflow/tfjs";
const { height } = Dimensions.get("window");

const CreatePostScreen = () => {
  //khai bao redux
  const dispatch = useDispatch();
  const { post, status, error } = useSelector((state) => state.post); // post
  const { hashtag, statusHashtag } = useSelector((state) => state.hashtag); //hashtag
  const { user, errorUser } = useSelector((state) => state.user); //hashtag

  // chuyển màn hình
  const navigation = useNavigation();

  //khai báo biến
  const [showOptions, setShowOptions] = useState(false); // Trạng thái của modal bảng tùy chọn
  const [textTitle, onChangeTextTitle] = React.useState(""); // tiêu đề
  const [textPost, onChangeTextPost] = React.useState(""); // nội dung
  const [textHashTag, onChangetextHashTag] = React.useState(""); //nội dung chủ đề tìm kiếm
  const [newHashtag, setNewHashtag] = useState([]); // Lưu các hashtag mới được thêm
  const [isEnabled, setIsEnabled] = useState(false); //trạng thái của switch
  const [link, onchangeLink] = useState(""); //link ytb
  const [selectedHashTag, setSelectedHashTag] = useState([]); // Danh sách chủ đề đã chọn
  const [images, setImages] = useState([]); //Lưu hình ảnh được chọn từ thư viện
  const [selectedImage, setSelectedImage] = useState(null); // Để lưu ảnh được nhấn vào để hiển fullsize
  const [isModalVisible, setModalVisible] = useState(false); //Trạng thái của modal hình ảnh

  //xử lý ẩn bảng chủ đề
  const handleHideModal = () => {
    Keyboard.dismiss();
    setShowOptions(false); //set false
  };

  //xử lý hiện bảng chủ đề
  const handleShowOptions = () => {
    onChangetextHashTag("");
    setShowOptions(true); //set true
  };

  //hàm để bật tắt switch
  const toggleSwitch = () => {
    setIsEnabled((previousState) => {
      // Xóa dữ liệu trong TextInput khi bật switch hoặc tắt
      if (!previousState) {
        // Đặt lại giá trị
        onChangeTextPost("");
        setImages([]);
      } else {
        // đặt lại giá trị
        onchangeLink("");
      }
      return !previousState;
    });
  };

  // Hàm lấy giá trị từ clipboard và dán vào text input
  const pasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    onchangeLink(clipboardContent); //gán nội dung
  };

  const handleFocus = () => {
    if (isEnabled) {
      Alert.alert(
        "Thông báo",
        "Bạn không thể nhập dữ liệu khi Switch đang bật."
      );
      // console.log("an cai cc");
    }
  };

  //Hàm lấy id trong link ytb
  const extractYouTubeVideoID = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : "Erro link";
  };
  //xử lý đăng bài viết mới
  const handlePost = async () => {
    let body = isEnabled ? link : textPost;
    if (isEnabled) {
      body = extractYouTubeVideoID(body);
    }

    const newDataPost = {
      status_post_id: 0,
      count_emoji: 0,
      count_comment: 0,
      count_view: 0,
      post_id: "temp",
      user_id: user.user_id,
      title: textTitle,
      body: body,
      hashtag: selectedHashTag,
      imgPost: images,
      isYtb: isEnabled,
      created_at: Date.now(),
    };
    // Nếu có hashtag mới, thêm vào Firestore
    if (newHashtag.length !== 0) {
      await dispatch(createHashtag(newHashtag))
        .then(() => {
          dispatch(getHashtag());
        })
        .catch((error) => {
          console.error("Lỗi thêm hashtag:", error);
        });
    }

    // Gọi lại danh sách hashtag sau khi thêm mới
    await dispatch(getHashtag()).unwrap();
    console.log("Cập nhật danh sách hashtag thành công");

    // Thêm bài viết mới vào Firestore
    await dispatch(createPost(newDataPost)).unwrap();
    console.log("Thêm bài viết thành công");

    await dispatch(getPosts()).unwrap();
    console.log("Cập nhật danh sách bài viết thành công");

    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Thông báo",
      textBody: "Thêm bài viết thành công",
      button: "Đóng",
    });
    resetData();
  };

  //xử lý quay lại màn hình trước
  const handleGoBack = async () => {
    // const postByF = await dispatch(getPostsByField({ fieldOrderBy: 'created_at', quantity: 3 })).unwrap();
    // console.log("getPostsByField", postByF);
    //gán lại
    resetData();
    navigation.goBack();
  };

  const resetData = () => {
    //gán lại
    onChangeTextTitle("");
    onChangeTextPost("");
    onChangetextHashTag("");
    onchangeLink("");
    onchangeLink("");
    setIsEnabled(false);
    setSelectedHashTag([]);
    setNewHashtag([]);
    setImages([]);
  };

  //xử lý khi chọn một chủ đề
  const handleSelectHashTag = (item) => {
    //Kiểm tra xem chủ đề đã được chọn chưa
    if (!selectedHashTag.includes(item.hashtag_id)) {
      if (selectedHashTag.length < 5) {
        setSelectedHashTag([...selectedHashTag, item.hashtag_id]);
      } else {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Cảnh báo",
          textBody: "Tối đa thêm 5 chủ đề",
          button: "Đóng",
        });
      }
    }
  };

  //xử lý xóa một chủ đề khỏi danh sách đã chọn
  const handleRemoveHashTag = (item) => {
    setSelectedHashTag(selectedHashTag.filter((HashTag) => HashTag !== item));
    const updatedNewHashTag = newHashtag.filter((hashTag) => hashTag !== item);
    setNewHashtag(updatedNewHashTag);
  };

  //render chủ đề cho trước
  const renderHashTagItem = ({ item }) => {
    // Kiểm tra xem chủ đề đã được chọn chưa
    if (selectedHashTag.includes(item.hashtag_id)) {
      return null; // ẩn đi nếu được chọn
    }
    return (
      <TouchableOpacity
        onPress={() => handleSelectHashTag(item)}
        style={styles.tagContainer}
      >
        <View style={styles.viewHashTag}>
          <Image
            source={require("../../assets/appIcons/hashtag_icon.png")} //icon #
            style={{ width: 20, height: 20 }}
            resizeMode="cover"
          />
          <Text style={styles.tagText}>{item.hashtag_id}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //render chu de de xuat
  const renderHashTagItemIn = ({ item }) => {
    // Kiểm tra xem chủ đề đã được chọn chưa
    if (selectedHashTag.includes(item.hashtag_id)) {
      return null; // ẩn nếu được chọn
    }
    return (
      <TouchableOpacity
        onPress={() => handleSelectHashTag(item)}
        style={styles.tagContainerIn}
      >
        <View style={styles.viewHashTag}>
          <Image
            source={require("../../assets/appIcons/hashtag_icon.png")} // Đường dẫn đến hình ảnh
            style={{ width: 20, height: 20 }}
            resizeMode="cover" // Tùy chọn cách hiển thị hình ảnh
          />
          <Text style={styles.tagText}>{item.hashtag_id}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //render chủ đề được chọn
  const renderSelectedHashTagItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleRemoveHashTag(item)}
      style={styles.selectedTagContainer}
    >
      <View style={styles.viewHashTag}>
        <Image
          source={require("../../assets/appIcons/hashtag_icon.png")} // Đường dẫn đến hình ảnh
          style={{ width: 20, height: 20 }}
          resizeMode="cover"
        />
        <Text style={styles.tagText}>{item} ×</Text>
      </View>
    </TouchableOpacity>
  );

  //lọc chủ đề
  const filteredHashTag = hashtag.filter(
    (hashTagName) =>
      // Kiểm tra nếu hashTagName có hashtag_id, nó là chuỗi và loại bỏ khoảng trắng thừa trước khi so sánh
      hashTagName.hashtag_id &&
      typeof hashTagName.hashtag_id === "string" &&
      hashTagName.hashtag_id
        .trim()
        .toLowerCase()
        .includes(textHashTag.trim().toLowerCase())
  );

  // Kiểm tra nếu không tìm thấy chủ đề trong danh sách, thêm vào danh sách với dấu (+)
  const isNewHashTag = !hashtag.some(
    (hashTagName) => hashTagName.hashtag_id === textHashTag
  );

  // Hiển thị chủ đề mới với dấu (+)
  const renderHashTagItemNew = () => (
    <TouchableOpacity
      onPress={handleAddNewHashTag}
      style={styles.tagContainerIn}
    >
      <View style={styles.viewHashTag}>
        <Image
          source={require("../../assets/appIcons/hashtag_icon.png")}
          style={{ width: 20, height: 20 }}
          resizeMode="cover"
        />
        <Text
          style={[styles.tagText, { marginLeft: 3, width: "84%" }]}
          numberOfLines={1} // Hiển thị 1 dòng
          ellipsizeMode="tail" // Dùng dấu ... ở cuối
        >
          {textHashTag}
        </Text>
        <Image
          source={require("../../assets/appIcons/icon_add.png")}
          style={{
            marginTop: 2,
            marginLeft: "75%",
            width: 18,
            height: 18,
            position: "absolute",
            bottom: 0,
            right: 5,
          }}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  // Hàm xử lý khi nhấn vào thêm mới
  const handleAddNewHashTag = () => {
    if (textHashTag) {
      const newHashTagItem = textHashTag; // Lấy giá trị từ ô nhập chủ đề
      if (!selectedHashTag.includes(newHashTagItem)) {
        if (selectedHashTag.length < 5) {
          // Thêm hashtag mới vào danh sách
          setSelectedHashTag([...selectedHashTag, newHashTagItem]);
          setNewHashtag([...newHashtag, newHashTagItem]); // Thêm vào newHashtag
        } else {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Cảnh báo",
            textBody: "Tối đa thêm 5 chủ đề",
            button: "Đóng",
          });
        }
      }
      onChangetextHashTag(""); // Reset nội dung input
      //console.log("newHashtag: ", newHashtag);
      //console.log("selectedHashTag: ", selectedHashTag);
    }
  };

  // Xử lý chọn hình ảnh
  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Cần quyền truy cập thư viện ảnh để tiếp tục!");
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri); // Lấy URI của các ảnh được chọn
      const newImages = selectedImages.filter((uri) => !images.includes(uri));

      if (newImages.length > 0) {
        setImages([...images, ...newImages]); // Thêm các ảnh chưa được chọn
      } else {
        alert("Bạn đã chọn các ảnh này rồi!");
      }
    }
  };

  // Hàm xóa ảnh theo index
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // Xóa ảnh tại index đã chọn
    setImages(newImages); // Cập nhật lại mảng ảnh
  };

  // Hàm hiển thị ảnh full size trong modal
  const openModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  //Nội dung màn hình
  return (
    <TouchableWithoutFeedback onPress={handleHideModal} style={{ flex: 1 }}>
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.upperHeaderPlacehholder} />
        </SafeAreaView>
        {/* View Thanh điều hướng */}
        <View style={styles.navigationView}>
          {/* Nút quay lại */}
          <ButtonsComponent isBack onPress={handleGoBack}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3114/3114883.png",
              }}
              style={{ width: 25, height: 25, marginTop: "auto" }}
            />
          </ButtonsComponent>

          {/* Nút đăng*/}
          <ButtonsComponent isNext onPress={handlePost}>
            <Text style={{ color: "#ffff", fontSize: 13, marginTop: "12%" }}>
              Đăng
            </Text>
          </ButtonsComponent>
        </View>

        {/* nhập tiêu đề bài viết */}
        <TextInput
          style={styles.inputTitle}
          placeholder="Tiêu đề bài viết ..."
          onChangeText={onChangeTextTitle}
          value={textTitle}
        />

        {/* nhập nội dung bài viết */}
        <TextInput
          style={styles.input}
          placeholder="Nội dung bài viết ..."
          multiline
          onChangeText={onChangeTextPost}
          value={textPost}
          editable={!isEnabled}
          onFocus={handleFocus} // Gọi hàm khi người dùng nhấn vào TextInput
        />

        {/* Hiển thị số lượng chủ đề đã chọn */}
        <Text style={(styles.titleHashTag, { marginTop: 7, marginBottom: -5 })}>
          Chủ đề đã chọn ({selectedHashTag.length}/5)
        </Text>

        {/*View chủ đề đã chọn và nút hiển thị modal */}
        <View style={styles.inputTag}>
          {/* Hiển thị các chủ đề đã chọn */}
          {selectedHashTag.length > 0 && (
            <FlatList
              data={selectedHashTag}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSelectedHashTagItem}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              style={styles.flatList}
            />
          )}

          {/* Nút để hiển thị bảng tùy chọn */}
          {selectedHashTag.length < 5 && (
            <TouchableOpacity onPress={handleShowOptions} style={styles.button}>
              <Text style={{ color: "#ffff", fontSize: 13, padding: 3 }}>
                Thêm chủ đề
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/*Danh sách chủ đề đề xuất*/}
        <View>
          <FlatList
            data={hashtag}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderHashTagItem}
            showsHorizontalScrollIndicator={false}
            style={styles.flatList}
          />
        </View>

        {/* Bảng tùy chọn chủ đề */}
        <Modal
          visible={showOptions}
          transparent={true}
          animationType="slide"
          onRequestClose={handleHideModal}
        >
          <TouchableOpacity activeOpacity={1.0}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/*Nút đóng bảng */}
                <ButtonsComponent isBack onPress={handleHideModal}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/3114/3114883.png",
                    }}
                    style={{ width: 25, height: 25, marginTop: "auto" }}
                  />
                </ButtonsComponent>

                {/*Nhập tên chủ đề cần tìm kiếm */}
                <TextInput
                  style={styles.inputHashTag}
                  placeholder="Nhập tên chủ đề"
                  onChangeText={onChangetextHashTag}
                  value={textHashTag}
                />
                {/*text hiển thị số lượng chủ đề chọn */}
                <Text style={styles.titleHashTag}>
                  Chủ đề đã chọn ({selectedHashTag.length}/5)
                </Text>

                {/* Hiển thị danh sách các chủ đề đã chọn */}
                <View
                  style={{
                    height: "25%",
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    borderRadius: 8,
                    padding: 7,
                  }}
                >
                  {selectedHashTag.length > 0 && (
                    <FlatList
                      data={selectedHashTag}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={renderSelectedHashTagItem}
                      showsHorizontalScrollIndicator={false}
                      style={styles.flatList}
                    />
                  )}
                </View>

                {/*Chủ đề tìm kiếm và thêm mới */}
                {textHashTag ? (
                  <>
                    {/*Hiển thị chủ đề tìm kiếm hoặc chủ đề mới */}
                    <Text style={styles.titleHashTag}>Chủ đề tìm kiếm</Text>
                    <FlatList
                      data={filteredHashTag} //hàm filter để lọc dữ liệu
                      keyExtractor={(item) => item.id}
                      renderItem={renderHashTagItemIn}
                      ListHeaderComponent={
                        isNewHashTag ? renderHashTagItemNew : null
                      }
                      showsHorizontalScrollIndicator={false}
                      style={styles.flatList}
                    />
                  </>
                ) : (
                  <>
                    {/*Hiển thị chủ đề đề xuất */}
                    <Text style={styles.titleHashTag}>Chủ đề đề xuất</Text>
                    <FlatList
                      data={hashtag}
                      keyExtractor={(item) => item.id}
                      renderItem={renderHashTagItemIn}
                      showsHorizontalScrollIndicator={false}
                      style={styles.flatList}
                    />
                  </>
                )}
                {/*End */}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Dạng bài viết */}
        <View style={styles.navigationView}>
          <Text style={{ marginLeft: 3, width: "86%", color: "#ccc" }}>
            *Nếu muốn đăng nội dung với link youtbe hãy gạt nút, nhưng bạn không
            thể nhập nội dung và thêm ảnh cho bài viết.
          </Text>
          <Switch
            style={{}}
            trackColor={{ false: "#767577", true: "#697BEB" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        {/* Nếu switch bật thì hiển thị component nhập link */}
        {isEnabled ? (
          <View style={{ marginTop: 5 }}>
            <TextInput
              onPress={pasteFromClipboard}
              style={{
                borderStyle: "dashed",
                borderColor: "#ccc",
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                color: "black",
              }}
              value={link}
              onChangeText={(text) => onchangeLink(text)}
              placeholder="Nhấn để dán link youtube"
              editable={false} //tắt nhập liệu
            />
          </View>
        ) : (
          <>
            {/* Hiển thị hình ảnh được chọn  */}
            <ScrollView horizontal={true}>
              {/**Nút chọn ảnh */}
              <TouchableOpacity style={styles.buttonAddImg} onPress={pickImage}>
                <Ionicons name="add" size={40} color="white" />
              </TouchableOpacity>

              {images.map((imageUri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => openModal(imageUri)}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        )}
        {/*End*/}

        {/* Modal hiển thị ảnh full màn hình */}
        <Modal visible={isModalVisible} transparent={true}>
          <View style={styles.modalIMGContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          </View>
        </Modal>
        {/*End modal */}

        <AlertNotificationRoot></AlertNotificationRoot>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffff",
  },
  upperHeaderPlacehholder: {
    height: appInfo.heightWindows * 0.04,
  },
  navigationView: {
    flexDirection: "row",
    marginBottom: 25,
  },
  viewHashTag: {
    flexDirection: "row",
  },
  inputTitle: {
    height: "8%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  input: {
    height: "18%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
  },
  inputHashTag: {
    marginTop: 10,
    height: height * 0.055,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  titleHashTag: {
    padding: 10,
    textAlignVertical: "top",
  },
  inputTag: {
    marginTop: 10,
    marginBottom: 10,
    //height: height * 0.05,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    width: 100,
    backgroundColor: "#697BEB",
    borderRadius: 10,
    alignItems: "center",
  },
  tagContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 3.5,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginRight: 8,
    marginBottom: 5,
  },
  tagContainerIn: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginRight: 8,
    marginBottom: 5,
    width: "100%",
  },
  tagText: {
    color: "#333",
  },
  selectedTagContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: "1%",
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  flatList: {
    marginBottom: 5,
  },
  modalContent: {
    top: "20%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    height: "94%", // Giảm chiều cao modal để vừa với màn hình
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    margin: 10,
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalIMGContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)", // Màu nền tối
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain", // Hiển thị ảnh đầy đủ, không bị cắt
  },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
  buttonAddImg: {
    marginTop: 10,
    marginLeft: 5,
    width: 70,
    height: 70,
    backgroundColor: "#dcdcdc", // Màu nền của nút
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10, // Tạo góc bo tròn cho nút

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default CreatePostScreen;

import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appInfo } from '../constains/appInfo';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import ButtonsComponent from '../component/ButtonsComponent';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
//import CustomComponent from '../component/CustomSwitchComponent';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../../src/firebase/FirebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, getPosts } from '../redux/slices/PostSlices';
import { Ionicons } from '@expo/vector-icons'; // Thư viện icon trong Expo


const { height } = Dimensions.get('window');

const CreatePostScreen = () => {

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.post);
  // sethashTag((prevHashTags) => [
  //   ...prevHashTags,
  //   { id: '100', name: "hello" }  // Tạo ID duy nhất
  // ]);

  // chuyển màn hình
  const navigation = useNavigation();

  // Trạng thái hiển thị bảng tùy chọn
  const [showOptions, setShowOptions] = useState(false);

  //khai báo biến
  const currentDate = new Date();
  const [textTitle, onChangeTextTitle] = React.useState(''); // tiêu đề
  const [textPost, onChangeTextPost] = React.useState(''); // nội dung
  const [textHashTag, onChangetextHashTag] = React.useState(''); //nội dung chủ đề tìm kiếm
  const [isEnabled, setIsEnabled] = useState(false); //trạng thái của switch
  const [link, onchangeLink] = useState(''); //link ytb

  //hàm để bật tắt switch
  const toggleSwitch = () => {
    setIsEnabled((previousState) => {
      // Xóa dữ liệu trong TextInput khi bật switch hoặc tắt
      if (!previousState) {
        // Đặt lại giá trị
        onChangeTextPost('');
        setImages([]);
      } else {
        // đặt lại giá trị
        onchangeLink('');
      }
      return !previousState;
    });
  };


  // Hàm lấy giá trị từ clipboard và dán vào text input
  const pasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getStringAsync()
    onchangeLink(clipboardContent);
    onChangeTextPost('');
  };
  const handleFocus = () => {
    if (isEnabled) {
      Alert.alert("Thông báo", "Bạn không thể nhập dữ liệu khi Switch đang bật.");
      console.log('an cai cc');
    }
  };
  // Danh sách chủ đề đã chọn
  const [selectedHashTag, setSelectedHashTag] = useState([]);

  //Hình ảnh chọn
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);  // Để lưu ảnh được chọn cho modal
  const [isModalVisible, setModalVisible] = useState(false); // Kiểm soát trạng thái của modal

  //xử lý ẩn bảng chủ đề
  const handlePressOutside = () => {
    Keyboard.dismiss();
    setShowOptions(false);
  };

  //xử lý hiện bảng chủ đề
  const handleShowOptions = () => {
    onChangetextHashTag('');
    setShowOptions(true);
  };

  //dữ liệu mẫu
  const [hashTag, sethashTag] = useState([
    { id: '1', name: 'Vẽ Nghệ Thuật' },
    { id: '2', name: 'Tích Nguyên Thạch Cho Kazuha' },
    { id: '3', name: 'Sát Thương' },
    { id: '4', name: 'Vẽ Nghệ Thuật 1' },
    { id: '5', name: 'Tích Nguyên Thạch Cho Kazuha 2' },
    { id: '6', name: 'Sát Thương 3' },
    { id: '7', name: 'Vẽ Nghệ Thuật 4' },
    { id: '8', name: 'Tích Nguyên Thạch Cho Kazuha 5' },
    { id: '9', name: 'Sát Thương 6' },
    { id: '10', name: 'Vẽ Nghệ Thuật 7' },
    { id: '11', name: 'Tích Nguyên Thạch Cho Kazuha 8' },
    { id: '12', name: 'Sát Thương 9' },
    { id: '13', name: 'Vẽ Nghệ Thuật 10' },
    { id: '14', name: 'Tích Nguyên Thạch Cho Kazuha 11' },
    { id: '15', name: 'Sát Thương 12' },
    { id: '16', name: 'Vẽ Nghệ Thuật 13' },
    { id: '17', name: 'Tích Nguyên Thạch Cho Kazuha 14' },
    { id: '18', name: 'Sát Thương 15' },
    { id: '19', name: 'Vẽ Nghệ Thuật 16' },
    { id: '20', name: 'Tích Nguyên Thạch Cho Kazuha 17' },
  ]);

  //xử lý đăng bài viết mới
  const handlePost = async () => {
    let body = '';
    if (isEnabled) {
      body = link;
    } else {
      body = textPost;
    }

    const formattedDate = currentDate.toLocaleDateString('vi-VN');
    const newData = {
      //trạng thái mặc định
      status_post_id: 0,
      //lượt tương tác gán mặc định = 0
      count_emoji: 0,
      count_comment: 0,
      count_view: 0,
      //id user và id bài viết
      post_id: "temp",
      user_id: "temp",
      //tiêu đề, nội dung (hoặc link ytb)
      title: textTitle,
      body: body,
      hashtag: selectedHashTag, //chủ đề chọn
      imgPost: images, // hình ảnh chọn
      isYtb: isEnabled, //là bài đăng dạng ảnh hay link ytb
      created_at: formattedDate,
    }; // Dữ liệu bạn muốn thêm
    console.log(dispatch(getPosts()));
    dispatch(createPost(newData));

  };


  //xử lý quay lại màn hình trước
  const handleGoBack = () => {
    onChangeTextTitle('');
    onChangeTextPost('');
    onChangetextHashTag('');
    setSelectedHashTag([]);
    setIsEnabled(false);
    setImages([]);
    onchangeLink('');
    navigation.goBack();
  };

  //xử lý khi chọn một chủ đề
  const handleSelectHashTag = (item) => {

    // Kiểm tra xem chủ đề đã được chọn chưa
    if (!selectedHashTag.includes(item.name)) {
      if (selectedHashTag.length < 5) {
        setSelectedHashTag([...selectedHashTag, item.name]);
        console.log('chu de: ', item.name);
      } else {

        Dialog.show({
                  type: ALERT_TYPE.WARNING,
                  title: 'Cảnh báo',
                  textBody: 'Tối đa thêm 5 chủ đề',
                  button: 'Đóng',
                })
      }
    }
  };

  //xử lý xóa một chủ đề khỏi danh sách đã chọn
  const handleRemoveHashTag = (item) => {
    setSelectedHashTag(selectedHashTag.filter((HashTag) => HashTag !== item));
  };

  //render chủ đề cho trước
  const renderHashTagItem = ({ item }) => {
    // Kiểm tra xem chủ đề đã được chọn chưa
    if (selectedHashTag.includes(item.name)) {
      return null; // ẩn đi nếu được chọn
    }

    return (
      <TouchableOpacity
        onPress={() => handleSelectHashTag(item)}
        style={styles.tagContainer}>
        <View style={styles.viewHashTag}>
          <Image
            source={require('../../assets/appIcons/hashtag_icon.png')}//icon #
            style={{ width: 20, height: 20 }}
            resizeMode="cover"
          />
          <Text style={styles.tagText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //render chu de de xuat
  const renderHashTagItemIn = ({ item }) => {
    // Kiểm tra xem chủ đề đã được chọn chưa
    if (selectedHashTag.includes(item.name)) {
      return null; // ẩn nếu được chọn
    }

    return (
      <TouchableOpacity
        onPress={() => handleSelectHashTag(item)}
        style={styles.tagContainerIn}>
        <View style={styles.viewHashTag}>
          <Image
            source={require('../../assets/appIcons/hashtag_icon.png')} // Đường dẫn đến hình ảnh
            style={{ width: 20, height: 20 }}
            resizeMode="cover" // Tùy chọn cách hiển thị hình ảnh
          />
          <Text style={styles.tagText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  //render chủ đề duoc chon
  const renderSelectedHashTagItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleRemoveHashTag(item)}
      style={styles.selectedTagContainer}>
      <View style={styles.viewHashTag}>
        <Image
          source={require('../../assets/appIcons/hashtag_icon.png')} // Đường dẫn đến hình ảnh
          style={{ width: 20, height: 20 }}
          resizeMode="cover" // Tùy chọn cách hiển thị hình ảnh
        />
        <Text style={styles.tagText}>{item}  ×</Text>
      </View>

    </TouchableOpacity>
  );

  //lọc chủ đề
  const filteredHashTag = hashTag.filter((hashTagName) =>
    hashTagName.name.toLowerCase().includes(textHashTag.toLowerCase())
  );

  // Kiểm tra nếu không tìm thấy chủ đề trong danh sách, thêm vào danh sách với dấu (+)
  const isNewHashTag = !hashTag.some((hashTagName) => hashTagName.name === textHashTag);

  // Hiển thị chủ đề mới với dấu (+)
  const renderHashTagItemNew = () => (
    <TouchableOpacity
      onPress={() => {
        console.log("Thêm chủ đề mới");
      }}
      style={styles.tagContainerIn}>
      <View style={styles.viewHashTag}>
        <Image
          source={require('../../assets/appIcons/hashtag_icon.png')}
          style={{ width: 20, height: 20 }}
          resizeMode="cover"
        />
        <Text style={styles.tagText}>{textHashTag} </Text>
        <Image
          source={require('../../assets/appIcons/icon_add.png')}
          style={{ marginTop: 2, marginLeft: '75%', width: 18, height: 18 }}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  // Xử lý chọn hình ảnh
  // Hỏi quyền truy cập ảnh
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Cần quyền truy cập thư viện ảnh để tiếp tục!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,  // Cho phép chọn nhiều ảnh
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri); // Lấy URI của các ảnh được chọn
      const newImages = selectedImages.filter((uri) => !images.includes(uri));

      if (newImages.length > 0) {
        setImages([...images, ...newImages]);  // Thêm các ảnh chưa được chọn
      } else {
        alert('Bạn đã chọn các ảnh này rồi!');
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

  //return màn hình
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside} style={{ flex: 1, }}>

      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.upperHeaderPlacehholder} />
        </SafeAreaView>
        {/* View Thanh điều hướng */}
        <View style={styles.navigationView}>

          {/* Nút quay lại */}
          <ButtonsComponent isBack onPress={handleGoBack}></ButtonsComponent>

          {/* Nút đăng*/}
          <ButtonsComponent isNext onPress={handlePost}>
            <Text style={{ color: '#ffff', fontSize: 13, marginTop: '12%' }}>Đăng</Text>
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

        {/*Khung chứa chủ đề đã chọn và nút hiển thị modal */}
        <View style={styles.inputTag}>
          {/* Hiển thị các chủ đề đã chọn */}
          {selectedHashTag.length > 0 && (
            <FlatList
              data={selectedHashTag}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSelectedHashTagItem}
              showsHorizontalScrollIndicator={false}
              style={styles.flatList}
            />
          )}

          {/* Nút để hiển thị bảng tùy chọn */}
          {selectedHashTag.length < 5 && (
            <TouchableOpacity onPress={handleShowOptions} style={styles.button}>
              <Text style={{ color: '#ffff', fontSize: 13, padding: 3 }}>
                Thêm chủ đề
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/*Danh sách chủ đề cho trước*/}
        <View>
          <FlatList
            data={hashTag}
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
          onRequestClose={handlePressOutside}>
          <TouchableOpacity activeOpacity={1.0}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>

                {/*Nút đóng bảng */}
                <ButtonsComponent isBack onPress={handlePressOutside}></ButtonsComponent>

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
                    height: '25%',
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    borderRadius: 8,
                    padding: 7,
                  }}>
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

                {/* */}
                {textHashTag ? (
                  <>
                    {/*Hiển thị chủ đề tìm kiếm hoặc chủ đề mới */}
                    <Text style={styles.titleHashTag}>Chủ đề tìm kiếm</Text>
                    <FlatList
                      data={filteredHashTag} //hàm filter để lọc dữ liệu
                      keyExtractor={(item) => item.id}
                      renderItem={renderHashTagItemIn}
                      ListFooterComponent={isNewHashTag ? renderHashTagItemNew : null}
                      showsHorizontalScrollIndicator={false}
                      style={styles.flatList}
                    />
                  </>
                ) : (

                  <>
                    {/*Hiển thị chủ đề đề xuất */}
                    <Text style={styles.titleHashTag}>Chủ đề đề xuất</Text>
                    <FlatList
                      data={hashTag}
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
          <Text style={{ marginLeft: 3, width: '86%', color: '#ccc' }} >
            *Nếu muốn đăng nội dung với link youtbe hãy gạt nút,
            nhưng bạn không thể nhập nội dung và thêm ảnh cho bài viết.
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
            <TouchableOpacity title="Nhấn để dán link youtube" onPress={pasteFromClipboard} >
              {/* <Text>Paste your link below:</Text> */}
              <TextInput
                style={{ borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 10, }}
                value={link}
                onChangeText={text => onchangeLink(text)}
                placeholder="Paste your link here"
                editable={false} //tắt nhập liệu
              />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Hiển thị hình ảnh được chọn  */}
            <ScrollView horizontal={true} >
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
                    onPress={() => removeImage(index)}>
                    <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView></>)}
        {/*End*/}

        {/* Modal hiển thị ảnh full màn hình */}
        <Modal visible={isModalVisible} transparent={true}>
          <View style={styles.modalIMGContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          </View>
        </Modal>
        {/*End modal */}
        <AlertNotificationRoot>
          
        </AlertNotificationRoot>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffff',
  },
  upperHeaderPlacehholder: {
    height: appInfo.heightWindows * 0.04,
  },
  navigationView: {
    marginTop: 5,
    flexDirection: 'row',
    marginBottom: 25,
  },
  viewHashTag: {
    flexDirection: 'row',
  },
  inputTitle: {
    height: '8%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  input: {
    height: '18%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
  inputHashTag: {
    marginTop: 10,
    height: height * 0.055,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
  },
  titleHashTag: {
    padding: 10,
    textAlignVertical: 'top',
  },
  inputTag: {
    marginTop: 10,
    marginBottom: 10,
    //height: height * 0.05,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
  },
  button: {
    width: 100,
    backgroundColor: '#697BEB',
    borderRadius: 10,
    alignItems: 'center',
  },
  tagContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 3.5,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 5,
  },
  tagContainerIn: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 5,
    width: '100%',
  },
  tagText: {
    color: '#333',
  },
  selectedTagContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: '1%',
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  flatList: {
    marginBottom: 5,
  },
  modalContent: {
    top: '20%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    height: '94%', // Giảm chiều cao modal để vừa với màn hình
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    elevation: 5,
  },
  imageContainer: {

    position: 'relative',
  },
  image: {
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalIMGContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)', // Màu nền tối
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',  // Hiển thị ảnh đầy đủ, không bị cắt
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonAddImg: {
    width: 70,
    height: 70,
    backgroundColor: '#dcdcdc', // Màu nền của nút
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Tạo góc bo tròn cho nút
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.8,
    //shadowRadius: 2,
    //elevation: 5, // Tạo bóng giống như trong iOS
  },
});

export default CreatePostScreen;
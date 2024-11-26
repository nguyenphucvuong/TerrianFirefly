import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { ButtonFunctionComponent } from "../component";
import { StyleGlobal } from "../styles/StyleGlobal";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, addEvent, updateEvent , fetchEvents, createEvent} from "../redux/slices/EventSlice";
import Modal from "react-native-modal";

export default function AddEditEventScreen({ route, navigation }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);

  const { dataEvent } = route.params || {}; // Lấy dữ liệu sự kiện nếu có
  const [title, setTitle] = useState(dataEvent ? dataEvent.title : "");
  const [userId, setUserId] = useState(user.user_id);
  const [imgEvent, setImgEvent] = useState(dataEvent ? dataEvent.img_event : null);
  const [content, setContent] = useState(dataEvent ? dataEvent.content : "");
  const [isLoading, setisLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    dataEvent ? new Date(dataEvent.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState(
    dataEvent ? new Date(dataEvent.end_date) : new Date()
  );
  const [roleId, setRoleId] = useState(user.roleid);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const isEditMode = Boolean(dataEvent); // Xác định chế độ: thêm mới hoặc chỉnh sửa
  const onSave = async () => {
    if (endDate < startDate) {
      alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }
    setisLoading(true);
    try {
      let imgUrl = imgEvent;
      // Kiểm tra nếu imgEvent khác với hình ảnh cũ thì tải ảnh mới lên
      if (imgEvent && imgEvent !== dataEvent?.img_event) {
        setModalVisible(true);
        imgUrl = await dispatch(
          uploadImage({ imgEvent: imgEvent, setUploadProgress })
        ).unwrap();
      }
      // Chuyển đổi ngày thành số milliseconds
      const startDateMillis = startDate.getTime();
      const endDateMillis = endDate.getTime();
      const createdAtMillis = new Date().getTime();
      const eventData = {
        title: title,
        user_id: userId,
        img_event: imgUrl,
        content: content,
        start_date: startDateMillis,
        end_date: endDateMillis,
        role_id: roleId,
      };
      
      if (isEditMode) {
        if (!dataEvent?.event_id) {
          console.error('Invalid event ID');
          return;
        }
        // Chế độ chỉnh sửa sự kiện
        await dispatch(updateEvent({updatedEvent : eventData, event_id :dataEvent.event_id })).unwrap();
      } else {
        // Chế độ thêm mới sự kiện
        await dispatch(createEvent({newData : eventData})).unwrap();
      }
      resetForm();
    } catch (error) {
      setisLoading(false);
      console.error("Lưu thất bại:", error.message || error); // In chi tiết lỗi
    } finally {
      setModalVisible(false);
      setisLoading(false);
      navigation.goBack();
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImgEvent(null);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  
    // Kiểm tra nếu ngày kết thúc nhỏ hơn ngày bắt đầu thì điều chỉnh lại
    if (endDate < currentDate) {
      setEndDate(currentDate);
    }
  };
  
  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
  
    if (currentDate < startDate) {
      alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
    } else {
      setEndDate(currentDate);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Quyền truy cập ảnh bị từ chối!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImgEvent(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Các thành phần nội dung khác */}
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Vui lòng nhập tiêu đề" />
        
        {/* Các phần chọn ngày bắt đầu và kết thúc */}
        <Text style={styles.label}>Ngày bắt đầu</Text>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={startDate.toLocaleDateString()}
          editable={false}
          placeholder="Chọn ngày bắt đầu"
        />
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      <Text style={styles.label}>Ngày kết thúc</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={endDate.toLocaleDateString()}
          editable={false}
          placeholder="Chọn ngày kết thúc"
        />
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

<Text style={styles.label}>Hình ảnh</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imgEvent ? (
          <Image source={{ uri: imgEvent }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Nhấn để chọn ảnh</Text>
        )}
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={{ alignSelf: "center" }}>Cập Nhật</Text>
          <View style={styles.separator} />
          <Text>Đang tải... {uploadProgress}%</Text>
        </View>
      </Modal>
      
        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          value={content}
          onChangeText={setContent}
          placeholder="Vui lòng nhập nội dung"
          multiline
        />
      </ScrollView>

      {/* Nút lưu cố định ở dưới */}
      {/* <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>{isEditMode ? "Cập nhật" : "Lưu"}</Text>
      </TouchableOpacity> */}
      <ButtonFunctionComponent
          isLoading={isLoading}
          name={isEditMode ? "Cập nhật" : "Lưu"}
          backgroundColor={"#0286FF"}
          colorText={"#fff"}
          onPress={onSave}
          style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg, styles.saveButton]}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Khoảng trống bên dưới cho nút lưu
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  contentInput: {
    height: 300,
    textAlignVertical: "top",
  },
  saveButton: {
    position: "absolute",
    bottom: 5,
    //left: 0,
    //right: 0,
    //alignItems: "center",
  },
  
  imageContainer: {
    marginTop: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    height: 150,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholder: {
    color: "#aaa",
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
});

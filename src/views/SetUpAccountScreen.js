import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  getUser,
  updateUser,
  getUserByField,
} from "../redux/slices/UserSlices";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
//styles
import { StyleGlobal } from "../styles/StyleGlobal";
//constains
import { appInfo } from "../constains/appInfo";
//components
import {
  IconComponent,
  ButtonsComponent,
  ButtonFunctionComponent,
} from "../component";
import { db, auth } from "../firebase/FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
const SetUpAccountScreen = () => {
  //firebase
  const user = useSelector((state) => state.user.user);

  //khai bao
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.numberPhone);
  const [isEmailLinked, setIsEmailLinked] = useState(true);
  //const [isPhoneLinked, setIsPhoneLinked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [inputPhone, setInputPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const authUser = auth.currentUser;
  useEffect(() => {
    //đọc dữ liệu
    dispatch(getUser(user.email));
  }, []);
  const handleLinkPhone = () => {
    setIsModalVisible(true);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleConfirmPhone = async () => {
    if (validatePhoneNumber(inputPhone)) {
      const newData = {
        numberPhone: inputPhone,
      };
      await dispatch(updateUser({ user_id: user.user_id, newData }));
      await dispatch(getUser(user.email));
      setPhone(inputPhone);
      setPhoneError("");
      setIsModalVisible(false);
    } else {
      setPhoneError("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
    }
  };

  const handleCancelPhone = () => {
    setInputPhone("");
    setPhoneError("");
    setIsModalVisible(false);
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handleConfirmPasswordChange = async () => {
    //kiểm tra nhập vào
    if (oldPassword != user.passWord) {
      Alert.alert("Lỗi", "Mật khẩu không chính xác");
      return;
    }
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.");
      return;
    }
    if (newPassword === confirmPassword) {
      // Thực hiện thay đổi mật khẩu
      try {
        if (authUser) {
          // Xác thực lại người dùng
          const credential = EmailAuthProvider.credential(
            authUser.email,
            oldPassword
          );
          await reauthenticateWithCredential(authUser, credential);
          await updatePassword(authUser, newPassword);
        }
        const newData = {
          passWord: newPassword,
        };
        await dispatch(updateUser({ user_id: user.user_id, newData }));
        Alert.alert("Thông báo", "Mật khẩu đã được thay đổi thành công");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setIsPasswordModalVisible(false);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể cập nhật mật khẩu. Vui lòng thử lại.");
      }
    } else {
      setPasswordError("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
    }
  };

  const handleCancelPasswordChange = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setIsPasswordModalVisible(false);
  };

  return (
    <View style={StyleGlobal.container}>
      <Text style={styles.sizeTitle}>Thiết lập an toàn tài khoản</Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: appInfo.heightWindows * 0.025,
          marginBottom: appInfo.heightWindows * 0.02,
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/ios-filled/50/000000/new-post.png",
          }}
          style={styles.icon}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, isEmailLinked && styles.disabledButton]}
          disabled={isEmailLinked}
        >
          <Text style={styles.buttonText}>
            {isEmailLinked ? "Đã liên kết" : "Liên kết"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View
        style={{
          flexDirection: "row",
          marginTop: appInfo.heightWindows * 0.025,
          marginBottom: appInfo.heightWindows * 0.02,
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/ios-filled/50/000000/phone.png",
          }}
          style={styles.icon}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.value}>{phone ? phone : "chưa liên kết"}</Text>
        </View>
        {phone ? (
          <TouchableOpacity
            style={[styles.button, styles.disabledButton]}
            disabled={true}
          >
            <Text style={[styles.buttonText]}>Đã Liên kết</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button]} onPress={handleLinkPhone}>
            <Text style={styles.buttonText}>Liên Kết</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.separator} />
      <View
        style={{
          flexDirection: "row",
          marginTop: appInfo.heightWindows * 0.025,
          marginBottom: appInfo.heightWindows * 0.02,
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/ios-filled/50/000000/key.png",
          }}
          style={styles.icon}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.label}>Đổi mật khẩu</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleOpenPasswordModal}
        >
          <Text style={styles.buttonText}>Đổi</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View
        style={{
          flexDirection: "row",
          marginTop: appInfo.heightWindows * 0.025,
          marginBottom: appInfo.heightWindows * 0.02,
          alignItems: "center",
        }}
      >
        <Text style={styles.sizeTitle}>Khóa Tài Khoản</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={{ color: "#0286FF" }}>Yêu Cầu Xóa</Text>
        </TouchableOpacity>
      </View>
      {/* Modal nhập số điện thoại */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelPhone}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={inputPhone}
              onChangeText={setInputPhone}
            />
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPhone}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelPhone}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        visible={isPasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelPasswordChange}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu cũ"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPasswordChange}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelPasswordChange}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  sizeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backgroundIcon: {
    backgroundColor: "#0286FF",
    borderRadius: 20,
    padding: 10,
    width: appInfo.widthWindows * 0.11,
    height: appInfo.widthWindows * 0.11, // Make it a square
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  button: {
    width: appInfo.widthWindows * 0.25,
    height: appInfo.widthWindows * 0.09,
    borderWidth: 1,
    borderColor: "#B6B3B3",
    alignItems: "center",
    padding: 7,
    marginLeft: "auto",
  },
  buttonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
    borderColor: "#CCC",
    color: "#C4C4C4",
  },
  separator: {
    width: "100%", // Or you can use a fixed width, like 50 or 100
    height: 1,
    backgroundColor: "#B6B3B3",
    marginVertical: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#007AFF",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#D00E39",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
});
export default SetUpAccountScreen;

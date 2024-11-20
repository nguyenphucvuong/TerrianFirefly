import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { auth, db } from "../firebase/FirebaseConfig"; // Đường dẫn đến file cấu hình Firebase
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { ButtonFunctionComponent } from "../component";
import { StyleGlobal } from "../styles/StyleGlobal";
import { appInfo } from "../constains/appInfo";
import Icon from "react-native-vector-icons/FontAwesome";
import { getUser, updateUser } from "../redux/slices/UserSlices";
import {
  updatePassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

const ResetPasswordScreen = ({ navigation, route }) => {
  const customAlert = (title, content, text, style) => {
    Alert.alert(title, content, [
      {
        text: text,
        onPress: () => console.log("ok"),
        style: style,
      },
    ]);
  };

  const { email } = route.params; // Nhận email từ params
  const [newPassword, setNewPassword] = useState("");
  const [checkPass, setCheckPass] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user); //user

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getUser(email));
    };

    fetchUser();
  }, []);

  // const userId = user && user.length > 0 ? user.user_id : null; // Lấy user_id nếu user hợp lệ
  // if (userId != null) {
  //   console.log("id", user.user_id);
  // } else {
  //   dispatch(getUser(email));
  // }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp. Vui lòng thử lại.");
      return;
    }
    setisLoading(true);
    try {
      // Đăng nhập với mật khẩu tạm thời
      await signInWithEmailAndPassword(auth, email, user.passWord);

      // Cập nhật mật khẩu mới trong Firebase Auth
      const authUser = auth.currentUser;
      if (authUser) {
        await updatePassword(authUser, newPassword);
        if (!authUser.emailVerified) {
          // Nếu chưa xác thực, gửi mã xác thực
          await sendEmailVerification(authUser);
          Alert.alert(
              "Chưa xác thực",
              "Vui lòng kiểm tra email để xác thực tài khoản."
          );
        
      }
      
        // Lấy reference đến tài liệu của người dùng
        const userRef = doc(collection(db, "user"), user.user_id);
        const newData = {
          passWord: newPassword,
        };
        // Cập nhật mật khẩu mới trong Firestore
        await updateDoc(userRef, newData);
        console.log("User updated!");

        // Thông báo thành công
        Alert.alert(
          "Thành công",
          "Mật khẩu đã được cập nhật trong Firebase Auth và Firestore."
        );
        await signOut(auth);
      }
    } catch (error) {
      console.error("Lỗi cập nhật mật khẩu:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      navigation.navigate("LoginScreen"); // Điều hướng đến màn hình home sau khi cập nhật thành công
      setisLoading(false); // Đặt trạng thái loading về false ở đây
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{
          width: appInfo.widthWindows * 0.3,
          height: appInfo.heightWindows * 0.16,
          marginBottom: appInfo.widthWindows * 0.09,
        }}
        source={require("../../assets/appIcons/lock.png")}
      />
      <Text style={styles.title}>Thiết lập mã xác nhận</Text>
      <Text style={{ marginBottom: "5%" }}>Vui Lòng Nhập Mật Khẩu Mới</Text>
      <View style={[styles.viewInput, { marginBottom: "15%" }]}>
        <Text style={{ marginBottom: "3%" }}>Password</Text>
        <View style={styles.input}>
          <Icon name="lock" size={appInfo.heightWindows * 0.028} color="#858585" />
          <TextInput
            secureTextEntry={checkPass}
            style={styles.textInput}
            placeholder="Mật Khẩu Mới"
            autoCapitalize="none"
            onChangeText={setNewPassword}
            value={newPassword}
          />
          <TouchableOpacity onPress={() => setCheckPass(!checkPass)}>
            {checkPass ? (
              <Icon
                name="eye-slash"
                size={appInfo.heightWindows * 0.028}
                color="#858585"
                style={{ marginLeft: appInfo.widthWindows * 0.19 }}
              />
            ) : (
              <Icon
                name="eye"
                size={appInfo.heightWindows * 0.028}
                color="#858585"
                style={{ marginLeft: appInfo.widthWindows * 0.19 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.viewInput, { marginBottom: "23%" }]}>
        <Text style={{ marginBottom: "3%" }}>Xác Nhận Mật Khẩu</Text>
        <View style={styles.input}>
          <Icon name="lock" size={appInfo.heightWindows * 0.028} color="#858585" />
          <TextInput
            secureTextEntry={checkPass}
            style={styles.textInput}
            placeholder="Xác nhận mật khẩu"
            autoCapitalize="none"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity onPress={() => setCheckPass(!checkPass)}>
            {checkPass ? (
              <Icon
                name="eye-slash"
                size={appInfo.heightWindows * 0.028}
                color="#858585"
                style={{ marginLeft: appInfo.widthWindows * 0.19 }}
              />
            ) : (
              <Icon
                name="eye"
                size={appInfo.heightWindows * 0.028}
                color="#858585"
                style={{ marginLeft: appInfo.widthWindows * 0.19 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      /> */}
      {/* <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      /> */}
      <ButtonFunctionComponent
        isLoading={isLoading}
        name={"Cập nhật mật khẩu"}
        backgroundColor={"#0286FF"}
        colorText={"#fff"}
        onPress={handleResetPassword}
        style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
  },
  viewInput: {
    margin: "2%",
    height: appInfo.heightWindows * 0.06,
    marginBottom: appInfo.heightWindows * 0.01,
  },
  input: {
    width: appInfo.widthWindows * 0.88,
    borderColor: "gray",
    borderWidth: 1,
    padding: "3%",
    flexDirection: "row",
    borderRadius: 100,
    backgroundColor: "#E0E5EB",
  },
  textInput: {
    width: appInfo.widthWindows * 0.5,
    marginLeft: "5%",
  },
});

export default ResetPasswordScreen;

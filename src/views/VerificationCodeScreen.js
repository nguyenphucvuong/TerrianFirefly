import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { auth } from "../firebase/FirebaseConfig";
import { appInfo } from "../constains/appInfo";
import { ButtonFunctionComponent } from "../component";
import { StyleGlobal } from "../styles/StyleGlobal";
import { getUser, updateUser } from "../redux/slices/UserSlices";
import { useDispatch, useSelector } from "react-redux";


const VerificationCodeScreen = ({ route, navigation }) => {

  const [isLoading, setisLoading] = useState(false);
  const { email, code } = route.params;
  // Khởi tạo mảng 6 ô
  const [verificationCode, setVerificationCode] = useState(Array(6).fill('')); 
  const [message, setMessage] = useState("");
  const inputRefs = useRef(Array(6).fill(null)); // Tạo ref cho các ô nhập
  // Tạo các tham chiếu để chuyển đổi giữa các TextInput
  const inputs = useRef([]);
  const handleInputChange = (text, index) => {
    const newCode = [...verificationCode];
    newCode[index] = text.replace(/[^0-9]/g, ''); // Chỉ cho phép số

    setVerificationCode(newCode);
    // Chuyển đến ô tiếp theo nếu có
    if (text && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus(); // Tự động chuyển đến ô tiếp theo nếu ref không phải là null
      }
    } else if (!text && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus(); // Nếu xóa, quay lại ô trước đó nếu ref không phải là null
      }
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = verificationCode.join('');
    if (verificationCode.length !== 6) {
      setMessage("Vui lòng nhập đủ 6 số.");
      setisLoading(false);
      return;
    }
    else if (enteredCode === code.toString()) {
      setisLoading(true);
      // Mã xác nhận đúng, điều hướng đến màn hình đặt lại mật khẩu
      navigation.navigate('ResetPasswordScreen', { email,  });

    } else {
      setisLoading(false);
      alert('Mã xác nhận không đúng. Vui lòng kiểm tra lại.');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          style={{
            width: appInfo.widthWindows * 0.3,
            height: appInfo.heightWindows * 0.16,
          }}
          source={require("../../assets/appIcons/verymail.png")}
        />
        <Text style={styles.title}>Xác Minh Bảo Mật</Text>
        <Text style={[styles.textEmail]}>
          Vui lòng nhập mã xác nhận từ email
        </Text>
        <Text
          style={[
            styles.textEmail,
            { marginBottom: appInfo.heightWindows * 0.05 },
          ]}
        >
          {email}
        </Text>
        <View style={styles.inputContainer}>
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
            ref={ref => inputRefs.current[index] = ref} // Gán ref cho ô nhập
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={text => handleInputChange(text, index)}
            onFocus={() => setVerificationCode(prev => prev.map((val, i) => (i === index ? '' : val)))}
          
            />
          ))}
        </View>
        <ButtonFunctionComponent
          isLoading={isLoading}
          name={"Xác Minh"}
          backgroundColor={"#0286FF"}
          colorText={"#fff"}
          onPress={handleVerifyCode}
          style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: appInfo.heightWindows * 0.05,
    marginTop: appInfo.heightWindows * 0.08,
  },
  textNote: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 24,
    margin: 5,
    borderRadius: 10,
    marginBottom: appInfo.heightWindows * 0.09,
  },
  message: {
    marginTop: 20,
    color: "red",
  },
});

export default VerificationCodeScreen;

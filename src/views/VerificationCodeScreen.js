// VerificationCodeScreen.js
import React, { useRef, useState } from "react";
import { 
    View, 
    TextInput,  
    Text, 
    StyleSheet, 
    Image} from "react-native";
import { auth } from "../firebase/FirebaseConfig";
import { appInfo } from "../constains/appInfo";
import { ButtonFunctionComponent } from "../component";
import { StyleGlobal } from "../styles/StyleGlobal";
const VerificationCodeScreen = ({ route, navigation }) => {
  //const { email } = route.params;
  const [code, setCode] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");

  // Tạo các tham chiếu để chuyển đổi giữa các TextInput
  const inputs = useRef([]);

  const handleChangeText = (text, index) => {
    if (text.length > 1) {
      return; // Không cho phép nhập quá 1 ký tự
    }
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Tự động di chuyển đến ô tiếp theo khi người dùng nhập
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setMessage("Vui lòng nhập đủ 6 số.");
      return;
    }

    try {
      // Kiểm tra mã xác nhận
      await auth().verifyPasswordResetCode(verificationCode);
      setMessage("Mã xác nhận đúng. Hãy đặt lại mật khẩu.");
      navigation.navigate("ResetPasswordScreen", { verificationCode });
    } catch (error) {
      setMessage("Mã xác nhận không đúng. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <View style={styles.container}>
      <Image style={{ width: appInfo.widthWindows * 0.3, height: appInfo.heightWindows* 0.16}} source={require('../../assets/appIcons/verymail.png')} />
      <Text style={styles.title}>Xác Minh Bảo Mật</Text>
      <Text style={[styles.textEmail]}>Vui lòng nhập mã xác nhận từ email</Text>
      <Text style={[styles.textEmail, {marginBottom: appInfo.heightWindows * 0.05}]}>test@mail.com</Text>
      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(input) => (inputs.current[index] = input)}
            onKeyPress={({ nativeEvent }) => {
              if (
                nativeEvent.key === "Backspace" &&
                index > 0 &&
                !code[index]
              ) {
                inputs.current[index - 1].focus();
              }
            }}
          />
        ))}
      </View>
      <ButtonFunctionComponent
        //isLoading={isLoading}
        name={"Xác Minh"}
        backgroundColor={"#0286FF"}
        colorText={"#fff"}
        //onPress={}
        style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
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

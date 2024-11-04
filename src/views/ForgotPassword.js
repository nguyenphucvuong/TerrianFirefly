import { React, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { StyleGlobal } from "../styles/StyleGlobal";
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonFunctionComponent from "../component/ButtonFunctionComponent";
import { appInfo } from "../constains/appInfo";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { log } from "@tensorflow/tfjs";
import emailjs from "emailjs-com";


function ForgotPassword() {
  //Khai bao bien
  const navigation = useNavigation();
  const [email, onChangeTextEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);

  //gửi mã xác nhận
  const handleSendVerificationCode = async () => {
    if (!email || !email.includes("@")) {
      setMessage("Vui lòng nhập email hợp lệ.");
      setisLoading(false)
      return;
    }
    setisLoading(true)
    try {
      setMessage('Đã gửi mã xác nhận đến email của bạn.');
      // Gửi mã xác nhận qua EmailJS
      const code = Math.floor(100000 + Math.random() * 900000); // Tạo mã 6 chữ số ngẫu nhiên
      console.log("gui ma", code);
      await sendVerificationCode(email, code); // Gửi mã xác nhận qua EmailJS
      navigation.navigate('VerificationCodeScreen', { email, code }); // Chuyển đến màn xác nhận
      
    } catch (error) {
      setisLoading(false)
      console.error('Lỗi gửi mã xác nhận:', error);
      setMessage('Có lỗi xảy ra. Vui lòng kiểm tra lại email.');
    }
    finally {
      setisLoading(false); // Đặt trạng thái loading về false ở đây
    }
  };

  
  const sendVerificationCode = (email, code) => {
    const templateParams = {
      to_email: email,
      code: code,
    };

    return emailjs.send('service_s12kzan', 'template_iv9ic3k', templateParams, '9tDjYisoOmpgluM-8')
      .then(response => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch(err => {
        console.error('Failed to send email:', err);
      });
    // try {
    //   await sendPasswordResetEmail(auth, email);
    //   setMessage("Đã gửi mã xác nhận đến email của bạn.");
    //   navigation.navigate("VerificationCodeScreen", { email });
    // } catch (error) {
    //   setMessage("Không thể gửi mã xác nhận. Vui lòng thử lại.");
    //   console.log("error", error);
    // }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[StyleGlobal.container, { flex: 1 }]}>
        <Text style={styles.textNameApp}>Terrian Firefly</Text>

        <Text style={styles.textRegister}>Quên Mật Khẩu</Text>

        <View style={styles.viewInput}>
          <Text style={{ marginBottom: "3%" }}>Email</Text>
          <View style={styles.input}>
            <Icon name="envelope" size={25} color="#858585" />
            <TextInput
              style={styles.textInput}
              placeholder="Nhập email"
              onChangeText={onChangeTextEmail}
              value={email}
              autoCapitalize="none"
              type="email"
            />
          </View>
          {message ? <Text >{message}</Text> : null}
        </View>
        <ButtonFunctionComponent
          isLoading={isLoading}
          name={"Xác Nhận"}
          backgroundColor={"#0286FF"}
          colorText={"#fff"}
          onPress={handleSendVerificationCode}
          style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: "3%",
  },
  textRegister: {
    fontWeight: "bold",
    fontSize: 28,
    marginLeft: "3%",
    marginBottom: "19%",
  },
  texErr: {
    alignContent: "center",

  },
  textNameApp: {
    marginTop: appInfo.heightWindows * 0.05,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 28,
    padding: "4%",
    marginBottom: appInfo.heightWindows * 0.08,
  },
  viewInput: {
    margin: "3%",
    height: appInfo.heightWindows * 0.06,
    marginBottom: appInfo.heightWindows * 0.4,
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
  link: {
    marginTop: "auto",
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  linkForgotPassword: {
    marginTop: "10%",
    width: "100%",
    alignItems: "center",
  },
  buttonHover: {
    backgroundColor: "#0276E3",
  },
});
export default ForgotPassword;

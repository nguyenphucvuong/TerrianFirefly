import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { StyleGlobal } from "../styles/StyleGlobal";
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonFunctionComponent from "../component/ButtonFunctionComponent";
import { appInfo } from "../constains/appInfo";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase/FirebaseConfig";
//redux
import { getUser } from "../redux/slices/UserSlices";
import { getAchievement } from "../redux/slices/AchievementSlice";
import { getNickname } from "../redux/slices/NicknameSlice";
import { useDispatch, useSelector } from "react-redux";
//
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { makeRedirectUri } from "expo-auth-session";
import * as AuthSession from "expo-auth-session";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

function LoginScreen() {
  const customAlert = (title, content, text, style) => {
    Alert.alert(title, content, [
      {
        text: text,
        onPress: () => console.log("ok"),
        style: style,
      },
    ]);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "713889504554-n59dd9fqvj97l93aie6710seqnajg9cv.apps.googleusercontent.com",
    androidClientId:
      "713889504554-hja3akqt7bludpfsdvgldd7nsav2np9c.apps.googleusercontent.com",
    iosClientId:
      "713889504554-uj322qe5knbs1bpotj0jq0pjr1c3q6pv.apps.googleusercontent.com",
    webClientId:
      "713889504554-n59dd9fqvj97l93aie6710seqnajg9cv.apps.googleusercontent.com",
  });

  //Khai bao bien
  const dispatch = useDispatch();
  const { user, statusUser, errorUser } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [email, onChangeTextEmail] = useState("");
  const [password, onChangeTextPass] = useState("");
  const [errorTextEmail, setErrorTextEmail] = useState("");
  const [errorTextPass, setErrorTextPass] = useState("");
  const [checkPass, setCheckPass] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingGg, setisLoadingGg] = useState(false);
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      // Handle the authentication object here, e.g., fetch user info
    }
  }, [response]);

  // Regex để kiểm tra email
  const validateEmail = (text) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(text);
  };
  // Regex để kiểm tra mật khẩu (ít nhất 6 ký tự, có cả chữ và số)
  const validatePassword = (text) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(text);
  };

  //hàm đăng nhập với google
  //const [user, setUser] = useState(null);
  // Thông tin cấu hình Google
  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  };
  // Thiết lập thông tin client ID của bạn
  const clientId =
    "713889504554-3m9k1n4jtohud708icu3cpkn1srdcder.apps.googleusercontent.com"; // Thay bằng OAuth Client ID của bạn

  // Tạo một yêu cầu xác thực
  // Đảm bảo hàm authenticate được khai báo là async
  async function authenticate() {
    // Tạo một yêu cầu xác thực
    const authRequestConfig = {
      clientId: clientId,
      redirectUri: "https://auth.expo.io/@truongthien/TerrianFirefly",
      scopes: ["profile", "email"],
      responseType: AuthSession.ResponseType.Token,
    };
    //console.log(authRequestConfig);
    // Tạo AuthRequest từ config
    const authRequest = new AuthSession.AuthRequest(authRequestConfig);

    try {
      // Bắt đầu yêu cầu xác thực với discovery
      const result = await authRequest.promptAsync(discovery);
      //console.log("réult", result.type);
      if (result.type === "success") {
        // Kiểm tra sự tồn tại của access token trong phản hồi
        const { access_token } = result.params;
        if (access_token) {
          // Xử lý thành công\\
          setisLoadingGg(true);
          //console.log("Access Token:", access_token);
        } else {
          // Không có access token trong phản hồi
          setisLoadingGg(false);
          Alert.alert("Error", "No access token returned.");
        }
      } else {
        // Xử lý lỗi hoặc người dùng hủy xác thực
        setisLoadingGg(false);
        Alert.alert("Error", "Authentication canceled or failed.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  //hàm đăng nhập với email, password
  const handleLoginWithEmail = async () => {
    if (!email || !password) {
      customAlert(
        "Thông báo",
        "vui lòng nhập đầy đủ thông tin",
        "OK",
        "cancel"
      );
    } else if (!validateEmail(email)) {
      setErrorTextEmail("Email không hợp lệ");
    } else if (!validatePassword(password)) {
      setErrorTextPass(
        "Mật khẩu phải có ít nhất 6 ký tự và bao gồm cả chữ và số"
      );
    } else {
      //kiểm tra thành công
      setErrorTextEmail("");
      setErrorTextPass("");
      setisLoading(true);
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed up
          const userL = userCredential.user;
          if (userL.emailVerified) {
            await dispatch(getUser(email));
            navigation.navigate("IndexTab");
            setisLoading(false);
          }
          else{
             // Email chưa xác thực
             customAlert(
              "Thông báo",
              "Email chưa được xác thực. Vui lòng xác thực email của bạn trước khi đăng nhập.",
              "OK",
              "cancel"
            );
            setisLoading(false);
          }
        })
        .catch((error) => {
          setisLoading(false);
          const errorMessage = error.message;
          if (errorMessage == "Firebase: Error (auth/invalid-credential).") {
            setErrorTextPass("Email hoặc mật khẩu không chính xác");
          }
          //console.log("handleLogin", errorMessage);
        });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[StyleGlobal.container, { flex: 1 }]}>
        <Text style={styles.textNameApp}>Terrian Firefly</Text>
        <Text style={styles.textRegister}>Đăng Nhập</Text>
        <View style={styles.viewInput}>
          <Text style={{ marginBottom: "3%" }}>Email</Text>
          <View style={styles.input}>
            <Icon name="envelope" size={appInfo.heightWindows * 0.028} color="#858585" />
            <TextInput
              style={styles.textInput}
              placeholder="Nhập email"
              onChangeText={onChangeTextEmail}
              value={email}
              type="email"
              autoCapitalize="none"
            />
          </View>
          {errorTextEmail ? (
            <Text style={{ color: "red" }}>{errorTextName}</Text>
          ) : null}
        </View>
        <View style={[styles.viewInput, { marginBottom: "20%" }]}>
          <Text style={{ marginBottom: "3%" }}>Password</Text>
          <View style={styles.input}>
            <Icon name="lock" size={appInfo.heightWindows * 0.028} color="#858585" />
            <TextInput
              secureTextEntry={checkPass}
              style={styles.textInput}
              placeholder="Mật Khẩu"
              autoCapitalize="none"
              onChangeText={onChangeTextPass}
              value={password}
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
          {errorTextPass ? (
            <Text style={{ color: "red" }}>{errorTextPass}</Text>
          ) : null}
        </View>
        <ButtonFunctionComponent
          isLoading={isLoading}
          name={"Đăng Nhập"}
          backgroundColor={"#0286FF"}
          colorText={"#fff"}
          onPress={handleLoginWithEmail}
          style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
        />
        {/* Phần Ngăn Cách */}
        <View style={[styles.separatorContainer]}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Hoặc</Text>
          <View style={styles.separator} />
        </View>
        <ButtonFunctionComponent
          isLoading={isLoadingGg}
          check={true}
          name={" Đăng Nhập với Google"}
          backgroundColor={"#fff"}
          colorText={"#000"}
          url={require("../../assets/google-icon.png")}
          //disabled={!request}
          onPress={authenticate}
          style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
        />
        <View style={styles.linkForgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={{ color: "#0286FF" }}> Quên Mật Khẩu ?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.link}>
          <View style={{ flexDirection: "row" }}>
            <Text>Chưa có tài khoản ?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text style={{ color: "#0286FF" }}> Đăng Ký</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginBottom: appInfo.heightWindows * 0.04,
  },
  textNameApp: {
    marginTop: appInfo.heightWindows * 0.05,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 28,
    padding: "4%",
    marginBottom: appInfo.heightWindows * 0.008,
  },
  viewInput: {
    margin: "3%",
    height: appInfo.heightWindows * 0.06,
    marginBottom: appInfo.heightWindows * 0.08,
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
    marginTop: appInfo.heightWindows * 0.15,
  },
  linkForgotPassword: {
    marginTop: appInfo.heightWindows * 0.04,
    width: "100%",
    alignItems: "center",
  },
  buttonHover: {
    backgroundColor: "#0276E3",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20, // Khoảng cách giữa các nút
  },
  separator: {
    flex: 1,
    height: 2,
    backgroundColor: "#CCCCCC", // Màu đường kẻ
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000", // Màu chữ
  },
});
export default LoginScreen;

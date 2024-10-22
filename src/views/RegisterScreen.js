import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StyleGlobal } from "../styles/StyleGlobal";
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonFunctionComponent from "../component/ButtonFunctionComponent";
import { db, auth } from "../firebase/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { appInfo } from "../constains/appInfo";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

function RegisterScreen() {
  const customAlert = (title, content, text, style) => {
    Alert.alert(title, content, [
      {
        text: text,
        onPress: () => console.log("ok"),
        style: style,
      },
    ]);
  };

  const navigation = useNavigation();

  //Khai bao bien
  const [name, onChangeTextName] = useState("");
  const [email, onChangeTextEmail] = useState("");
  const [password, onChangeTextPass] = useState("");
  const [errorTextName, setErrorTextName] = useState("");
  const [errorTextEmail, setErrorTextEmail] = useState("");
  const [errorTextPass, setErrorTextPass] = useState("");
  const [checkPass, setCheckPass] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingGg, setisLoadingGg] = useState(false);

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
    console.log(authRequestConfig);
    // Tạo AuthRequest từ config
    const authRequest = new AuthSession.AuthRequest(authRequestConfig);

    try {
      // Bắt đầu yêu cầu xác thực với discovery
      const result = await authRequest.promptAsync(discovery);
      console.log("réult", result.type);
      if (result.type === "success") {
        // Kiểm tra sự tồn tại của access token trong phản hồi
        const { access_token } = result.params;
        if (access_token) {
          // Xử lý thành công\\
          setisLoadingGg(true);
          console.log("Access Token:", access_token);
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

  //them du lieu user

  const addUser = async (userName, email, password) => {
    try {
      const docRef = await addDoc(collection(db, "user"), {
        username: userName,
        numberPhone: "",
        email: email,
        roleid: 0,
        imimgUser: "",
        gender: "",
        passWord: password,
        status_user_id: 0,
        nickname: "",
        total_interact_id: 0,
        backgroundUser: "",
        frame_user: "",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Regex để kiểm tra tên người dùng (ít nhất 2 ký tự, không phải chỉ có ký tự đặc biệt)
  const validateUsername = (text) => {
    const usernameRegex = /^(?!.*[^a-zA-Z0-9]).{2,}$/; // Tên người dùng phải có ít nhất 2 ký tự và không chỉ là ký tự đặc biệt
    return usernameRegex.test(text);
  };
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
  //nếu người dùng nhập thông tin đúng định dạng
  useEffect(() => {
    if (name || email || password) {
      setErrorTextEmail("");
      setErrorTextName("");
      setErrorTextPass("");
    }
  }, [name, email, password]);
  //đăng ký với email, passWord
  const handleSinginWithEmail = async () => {
    if (!email || !password || !name) {
      customAlert(
        "Thông báo",
        "vui lòng nhập đầy đủ thông tin",
        "OK",
        "cancel"
      );
    } else if (!validateUsername(name)) {
      setErrorTextName(
        "Tên người dùng phải có ít nhất 2 ký tự và không được chứa ký tự đặc biệt"
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
      setErrorTextName("");
      setErrorTextPass("");
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          customAlert("Thông báo", "Đăng ký thành công.", "OK", "cancel");
          addUser(name, email, password);
          navigation.navigate("LoginScreen");
          const user = userCredential.user;
          console.log("log user", user);
          // ...
        })
        .catch((error) => {
          if (
            error.message ==
            "Firebase: Password should be at least 6 characters (auth/weak-password)."
          ) {
            customAlert(
              "Thông báo",
              "Mật khẩu phải chứa ít nhất 6 ký tự",
              "OK",
              "cancel"
            );
          } else if (
            error.message == "Firebase: Error (auth/email-already-in-use)."
          ) {
            setErrorTextEmail("Email đã tồn tại.", "OK", "cancel");
          } else {
            customAlert(
              "Thông báo",
              "Đăng ký không thành công.",
              "OK",
              "cancel"
            );
          }
          console.log("er", error.message);
        });
    }
  };
  return (
    <View style={[StyleGlobal.container, { flex: 1 }]}>
      <Text style={styles.textNameApp}>Terrian Firefly</Text>

      <Text style={styles.textRegister}>Đăng Ký</Text>
      <View style={styles.viewInput}>
        <Text style={{ marginBottom: "3%" }}>Tên Người Dùng</Text>
        <View style={styles.input}>
          <Icon name="user" size={25} color="#858585" />
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tên người dùng"
            onChangeText={onChangeTextName}
            value={name}
          />
        </View>
        {errorTextName ? (
          <Text style={{ color: "red" }}>{errorTextName}</Text>
        ) : null}
      </View>

      <View style={styles.viewInput}>
        <Text style={{ marginBottom: "3%" }}>Email</Text>
        <View style={styles.input}>
          <Icon name="envelope" size={25} color="#858585" />
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
          <Text style={{ color: "red" }}>{errorTextEmail}</Text>
        ) : null}
      </View>
      <View style={[styles.viewInput, { marginBottom: "18%" }]}>
        <Text style={{ marginBottom: "3%" }}>Password</Text>
        <View style={styles.input}>
          <Icon name="lock" size={25} color="#858585" />
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
                size={20}
                color="#858585"
                style={{ marginLeft: appInfo.widthWindows * 0.19 }}
              />
            ) : (
              <Icon
                name="eye"
                size={20}
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
        name={"Đăng Ký"}
        backgroundColor={"#0286FF"}
        colorText={"#fff"}
        onPress={handleSinginWithEmail}
        style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
      />
      {/* Phần Ngăn Cách */}
      <View style={[styles.separatorContainer]}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>Hoặc</Text>
        <View style={styles.separator} />
      </View>
      <ButtonFunctionComponent
        check={true}
        isLoading={isLoadingGg}
        name={" Đăng Nhập với Google"}
        backgroundColor={"#fff"}
        colorText={"#000"}
        url={require("../../assets/google-icon.png")}
        onPress={authenticate}
        style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
      />

      <View style={styles.link}>
        <View style={{ flexDirection: "row" }}>
          <Text>Đã có tài khoản ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={{ color: "#0286FF" }}> Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    margin: "2%",
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
    width: "100%",
    alignItems: "center",
    marginTop: appInfo.heightWindows * 0.1,
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
export default RegisterScreen;

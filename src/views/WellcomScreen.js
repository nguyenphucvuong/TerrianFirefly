import {
  React,
  useState} from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StyleGlobal } from "../styles/StyleGlobal";
import ButtonFunctionComponent from '../component/ButtonFunctionComponent';
import { ButtonsComponent } from "../component";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
WebBrowser.maybeCompleteAuthSession();
function WellcomScreen() {

  //
  const [isLoadingGg, setisLoadingGg] = useState(false);
  

  //hàm đăng nhập với google
  // Thông tin cấu hình Google
  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  };
  // Thiết lập thông tin client ID 
  const clientId =
    "713889504554-3m9k1n4jtohud708icu3cpkn1srdcder.apps.googleusercontent.com"; // OAuth Client ID 

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
      if (result.type === "success") {
        // Kiểm tra sự tồn tại của access token trong phản hồi
        const { access_token } = result.params;
        if (access_token) {
          // Xử lý thành công\\
          setisLoadingGg(true);
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
  const navigation = useNavigation();
  return (
    <ImageBackground
      style={styles.imageBg}
      source={require("../../assets/app_bg.jpg")}
    >
      <View style={[StyleGlobal.container, { flex: 1 }]}>
        <Image
          source={require("../../assets/app_icon.png")}
          style={styles.image}
        />
        <Text style={styles.textWellcom}>Chào Mừng Bạn Đến với</Text>
        <Text style={styles.textWellcom}>Terrian Firefly</Text>
        <Text style={[StyleGlobal.textTitle, styles.textLogin]}>
          Đăng Nhập/Tạo Tài Khoản
        </Text>
        <ButtonFunctionComponent
          
          name={"Đăng Ký"}
          backgroundColor={"#0286FF"}
          colorText={"#fff"}
          onPress={() => navigation.navigate('RegisterScreen')}
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
          onPress={authenticate}
          style={[StyleGlobal.buttonLg, StyleGlobal.buttonTextLg]}
        />
        <View style={styles.link}>
          <View style={{ flexDirection: "row" }}>
            <Text>Đã có tài khoản ?</Text>
            <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={{ color: "#0286FF" }}> Đăng Nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBg: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  textWellcom: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    alignSelf: "center",
    width: 160,
    height: 160,
    marginTop: "25%",
  },
  textLogin: {
    textAlign: "center",
    marginTop: "15%",
    marginBottom: "15%",
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
  link: {
    marginTop: "auto",
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
});
export default WellcomScreen;

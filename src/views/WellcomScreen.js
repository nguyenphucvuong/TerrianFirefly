import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground, } from 'react-native';
import { StyleGlobal } from '../styles/StyleGlobal';
import ButtonFunctionComponent from '../component/ButtonFunctionComponent';

import { useNavigation } from '@react-navigation/native'

function WellcomScreen() {
  const navigation = useNavigation();
  return (
    <ImageBackground style={styles.imageBg} source={{ uri: "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-nen-dien-thoai-13.jpg" }}>
      <View style={[StyleGlobal.container, { flex: 1 }]}>
        <Image source={require("../../assets/app_icon.png")} style={styles.image} />
        <Text style={styles.textWellcom}>Chào Mừng Bạn Đến với</Text>
        <Text style={styles.textWellcom}>Terrian Firefly</Text>
        <Text style={[StyleGlobal.textTitle, styles.textLogin]}>Đăng Nhập/Tạo Tài Khoản</Text>
        <ButtonFunctionComponent
          name={'Đăng Ký'}
          backgroundColor={'#0286FF'}
          colorText={'#fff'}
          onPress={() => navigation.navigate('RegisterScreen')}
        />
        {/* Phần Ngăn Cách */}
        <View style={[styles.separatorContainer, ]}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Hoặc</Text>
          <View style={styles.separator} />
        </View>
        <ButtonFunctionComponent check={true} name={' Đăng Nhập với Google'} backgroundColor={'#fff'} colorText={'#000'}
          url={require('../../assets/google-icon.png')}
        />
        <View style={styles.link}>
          <View style={{ flexDirection: "row" }}>
            <Text>Đã có tài khoản ?</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={{ color: '#0286FF' }}> Đăng Nhập</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imageBg: {
    resizeMode: "cover",
    width: '100%',
    height: '100%',
  },
  textWellcom: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    alignSelf: 'center',
    width: 160,
    height: 160,
    marginTop: "25%",

  },
  textLogin: {
    textAlign: 'center',
    marginTop: "15%",
    marginBottom: "15%"
  },
  buttonHover: {
    backgroundColor: '#0276E3',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Khoảng cách giữa các nút
  },
  separator: {
    flex: 1,
    height: 2,
    backgroundColor: '#CCCCCC', // Màu đường kẻ
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000', // Màu chữ
  },
  link: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
});
export default WellcomScreen;
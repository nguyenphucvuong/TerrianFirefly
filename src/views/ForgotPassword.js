import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { StyleGlobal } from '../styles/StyleGlobal';
import Icon from 'react-native-vector-icons/FontAwesome'
import ButtonFunctionComponent from '../component/ButtonFunctionComponent';

import { useNavigation } from '@react-navigation/native'

function ForgotPassword() {

    

    //Khai bao bien
    const navigation = useNavigation();
    const [email, onChangeTextEmail] = React.useState('');
    
    
    return(
        <View style={[StyleGlobal.container, { flex: 1 }]}>
        <Text style={styles.textNameApp}>Terrian Firefly</Text>
        
        <Text style={styles.textRegister}>Quên Mật Khẩu</Text>
        
        
        <View style={styles.viewInput}>
        <Text style={{marginBottom : '3%'}}>Email</Text>
        <View style={styles.input}>
        <Icon name="envelope" size={30} color="#858585" />
        <TextInput style={styles.textInput}
          placeholder="Nhập email"
          onChangeText={onChangeTextEmail}
          value={email}
          type='email'
        />
        </View>
        </View>
        <ButtonFunctionComponent
          name={'Xác Nhận'}
          backgroundColor={'#0286FF'}
          colorText={'#fff'}
          onPress={() => navigation.navigate('LoginScreen')}
        />
      </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: '3%',
      },
    textRegister: {
        fontWeight: 'bold',
        fontSize: 28,
        marginLeft: '3%',
        marginBottom: '19%',
    },
    textNameApp: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 28,
        padding: '4%',
        marginBottom: '8%',
    },
    viewInput: {
        margin: '3%',
        height: '8%',
        marginBottom: '85%',
    },
    input: {

        borderColor: 'gray',
        borderWidth: 1,
        padding: '3%',
        flexDirection: 'row',
        borderRadius: 100,
        backgroundColor: '#E0E5EB',
      },
    textInput: {
        marginLeft : '5%',
    },
    link: {
        marginTop: 'auto',
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
      },
      linkForgotPassword: {
        marginTop: '10%',
        width: '100%',
        alignItems: 'center',
        
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
});
export default ForgotPassword;
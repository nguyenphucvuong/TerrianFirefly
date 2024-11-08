import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AccountSettings() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('abc@gmail.com');
  const [phone, setPhone] = useState('');
  const [isEmailLinked, setIsEmailLinked] = useState(true);
  const [isPhoneLinked, setIsPhoneLinked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [inputPhone, setInputPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLinkPhone = () => {
    setIsModalVisible(true);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleConfirmPhone = () => {
    if (validatePhoneNumber(inputPhone)) {
      setPhone(inputPhone);
      setIsPhoneLinked(true);
      setPhoneError('');
      setIsModalVisible(false);
    } else {
      setPhoneError('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
    }
  };

  const handleCancelPhone = () => {
    setInputPhone('');
    setPhoneError('');
    setIsModalVisible(false);
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handleConfirmPasswordChange = () => {
    if (newPassword === confirmPassword) {
      // Thực hiện thay đổi mật khẩu
      Alert.alert('Thông báo', 'Mật khẩu đã được thay đổi thành công');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setIsPasswordModalVisible(false);
    } else {
      setPasswordError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
    }
  };

  const handleCancelPasswordChange = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsPasswordModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Hàng chứa nút quay lại và tiêu đề */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={{ uri: 'https://img.icons8.com/ios-glyphs/30/000000/back.png' }} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.header}>Thiết lập tài khoản</Text>
      </View>
      
      <Text style={styles.subHeader}>Thiết lập an toàn tài khoản</Text>

      <View style={styles.row}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/new-post.png' }} style={styles.icon} />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <TouchableOpacity style={[styles.button, isEmailLinked && styles.disabledButton]} disabled={isEmailLinked}>
          <Text style={styles.buttonText}>{isEmailLinked ? 'Đã liên kết' : 'Liên kết'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/phone.png' }} style={styles.icon} />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.value}>{isPhoneLinked ? phone : 'chưa liên kết'}</Text>
        </View>
        <TouchableOpacity style={[styles.button, isPhoneLinked && styles.disabledButton]} onPress={handleLinkPhone} disabled={isPhoneLinked}>
          <Text style={styles.buttonText}>{isPhoneLinked ? 'Đã liên kết' : 'Liên kết'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/key.png' }} style={styles.icon} />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Đổi mật khẩu</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleOpenPasswordModal}>
          <Text style={styles.buttonText}>Đổi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Khóa Tài Khoản</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => Alert.alert('Yêu cầu xóa tài khoản')}>
          <Text style={styles.deleteButtonText}>Yêu cầu xóa</Text>
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
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPhone}>
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPhone}>
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
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPasswordChange}>
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPasswordChange}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#007AFF',
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#888',
  },
  button: {
    width: 80,
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#CCC',
  },
  deleteButton: {
    width: 100,
    paddingVertical: 5,
    backgroundColor: '#FFF',
    borderColor: '#FF5252',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF5252',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#D00E39',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

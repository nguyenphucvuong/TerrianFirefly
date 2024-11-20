import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { listenToUserWithStatus } from '../redux/slices/UserSlices';
import { useNavigation } from '@react-navigation/native';  // Nếu bạn muốn điều hướng sang màn khác
import { AvatarEx } from '../component';  // Giả sử bạn có component AvatarEx

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Lấy dữ liệu người dùng từ Redux store
  const userReport = useSelector((state) => state.user.userReport);
  
  // Lắng nghe dữ liệu người dùng khi màn hình được render lần đầu tiên
  useEffect(() => {
    // Gọi listenToUserWithStatus khi component được mount
    dispatch(listenToUserWithStatus());
  }, [dispatch]);
  
  // Render item cho FlatList
  const renderItem = ({ item }) => {
    // Xác định màu nền dựa vào status_user_id
    const backgroundColor = item.status_user_id === 1 ? '#FFEE58' : item.status_user_id === 2 ? '#E53935' : '#FFFFFF';
    return (
      <TouchableOpacity onPress={() => navigation.navigate('AccountDetailsScreen', { email: item.email })}>
        <View style={[styles.itemContainer, { backgroundColor }]}>
          <AvatarEx
            size={50}
            round={20}
            url={item.imgUser || 'https://example.com/default-avatar.jpg'}
          />
          <View style={styles.textContainer}>
            <Text>Name: {item.name}</Text>
            <Text>Email: {item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userReport}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
});

export default UserListScreen;

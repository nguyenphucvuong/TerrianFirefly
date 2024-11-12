import { StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useFocusEffect } from '@react-navigation/native';
//Screen
import { PersonScreen } from '../views'
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from '@react-navigation/native';

const PersonTab = () => {
    const [isAvatar, setIsFromAvatar] = useState(false); // Trạng thái để quản lý isFromAvatar
    
    useEffect(() => {
        // Cập nhật isFromAvatar khi cần thiết
        setIsFromAvatar(false); // Hoặc gán giá trị động tùy vào điều kiện
    }, []);
    return (
        <PersonScreen isAvatar={isAvatar} />
    )
}
export default PersonTab

const styles = StyleSheet.create({})
import { ScrollView, View, } from "react-native";
import React from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { getUser } from '../redux/slices/UserSlices';
import { useDispatch, useSelector } from 'react-redux';

import PostViewComponent from "../component/PostViewComponent";

const HomeScreen = () => {
  const {user, statusUser, errorUser } = useSelector((state) => state.user);
    console.log('dang nhap thanh cong', user);
  return (
    <ScrollView
      style={[{
      }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={StyleGlobal.container}>
        <PostViewComponent></PostViewComponent>
        <PostViewComponent></PostViewComponent>
        <PostViewComponent></PostViewComponent>


      </View>
    </ScrollView>




  );
};

export default HomeScreen;



import { RefreshControl, ScrollView, Text, View, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { getUser } from '../redux/slices/UserSlices';
import { useDispatch, useSelector } from 'react-redux';

import PostViewComponent from "../component/PostViewComponent";

const HomeScreen = () => {
  const {user, statusUser, errorUser } = useSelector((state) => state.user);
    console.log('dang nhap thanh cong', user);
  return (
    <FlatList

      data={data.post}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <PostViewComponent post={item} user={user} images={item.images} emoji={emoji} />
        )
      }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />


  );
};

export default HomeScreen;



import { RefreshControl, ScrollView, Text, View, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { data } from "../constains/data";




import PostViewComponent from "../component/PostViewComponent";

const HomeScreen = () => {
  // console.log(data.post);
  const user = data.user;
  const emoji = data.emoji;



  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Giả lập gọi API để làm mới dữ liệu
    setTimeout(() => {
      // Sau khi hoàn thành refresh, có thể cập nhật lại dữ liệu từ API hoặc giữ nguyên
      setRefreshing(false);
    }, 2000);
  }, []);




  const fetchData = () => {
    vugndpsd
  }

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



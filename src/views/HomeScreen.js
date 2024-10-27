import { RefreshControl, ScrollView, Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { data } from "../constains/data";
import { useSelector, useDispatch } from "react-redux";
import { getPosts, getPostsByField, getPostsRefresh } from '../../src/redux/slices/PostSlice';
import { SkeletonComponent } from "../component";





import PostViewComponent from "../component/PostViewComponent";
const HomeScreen = () => {
  // console.log(data.post);
  const user = data.user;
  const emoji = data.emoji;
  const post = useSelector((state) => state.post.post);
  const dispatch = useDispatch();



  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);



  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(getPostsRefresh({ field: "created_at", quatity: 10 }));
    setTimeout(() => {
      // Sau khi hoàn thành refresh, có thể cập nhật lại dữ liệu từ API hoặc giữ nguyên
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <>
      {post.length === 0 ? (
        <View style={{ height: 100, width: "100%", paddingHorizontal: "5%", }}>
          <SkeletonComponent isAvatar Data={""} />
          <SkeletonComponent style={{ width: "60%", height: 20 }} Data={""} />
          <SkeletonComponent style={{ width: "80%", height: 10 }} Data={""} />
          <SkeletonComponent style={{ width: "90%", height: 10 }} Data={""} />
        </View>
      ) : (
        <FlatList
          data={post}
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
          ListFooterComponent={() => (
            loading ? //  a==b ? b : a
              <View style={{
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 10,
                // width : WIDTH,
                // height : 50 ,
                flexDirection: 'column'
              }} >
                <ActivityIndicator size="large" color='#0000ff' />
              </View> : null
          )}

          onEndReached={() => {
            setLoading(true)
            // setData(mang_du_lieu)
            setTimeout(async () => {
              if (loading) {
                await dispatch(getPostsByField({ field: "created_at", quantity: 3 }));

              }
              setLoading(false)
            }, 2000);
          }}
          onEndReachedThreshold={0.1}
        />)}
    </>
  );
};

export default HomeScreen;



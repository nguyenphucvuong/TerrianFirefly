import { RefreshControl, ScrollView, Text, View, FlatList, ActivityIndicator, Image } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { data } from "../constains/data";
import { useSelector, useDispatch } from "react-redux";
import { getPosts, getPostsByField, getPostsRefresh } from '../../src/redux/slices/PostSlice';
import { SkeletonComponent } from "../component";





import PostViewComponent from "../component/PostViewComponent";
import { ImageCheckContext } from "../context/ImageProvider";
const HomeScreen = () => {
  // console.log(data.post);
  const user = data.user;
  const emoji = data.emoji;
  const post = useSelector((state) => state.post.post);
  const dispatch = useDispatch();
  // const lastVisiblePost = useContext(ImageCheckContext).lastVisiblePost;
  // const setLastVisiblePost = useContext(ImageCheckContext).setLastVisiblePost;




  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);




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
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              setTimeout(async () => {
                const dataRefresh = await dispatch(getPostsRefresh({ field: "created_at", quantity: 3 }));
                // setLastVisiblePost(dataRefresh.payload.lastVisiblePost);
                console.log("getPostsRefresh")
                // Sau khi hoàn thành refresh, có thể cập nhật lại dữ liệu từ API hoặc giữ nguyên
                setRefreshing(false);
              }, 2000);
            }} />
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

          onEndReached={async () => {
            if (loading) return; // Avoid multiple calls while still loading

            setLoading(true);

            try {
              const dataLoadMore = await dispatch(getPostsByField({ field: "created_at", quantity: 3 }));

              // Stop loading only if there are no more posts to load
              if (!dataLoadMore.payload.postData.length) {
                setLoading(false);
              }
            } catch (error) {
              console.error("Error loading more posts:", error);
            } finally {
              setLoading(false); // Ensure loading state is reset
            }
          }}
          onEndReachedThreshold={0.1}
        />)}
    </>
  );
};

export default HomeScreen;



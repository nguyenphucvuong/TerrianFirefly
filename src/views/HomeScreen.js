import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { data } from "../constains/data";
import { useSelector, useDispatch } from "react-redux";
import {
  getPosts,
  getPostsByField,
  getPostsRefresh,
} from "../../src/redux/slices/PostSlice";
import { SkeletonComponent } from "../component";
import PostViewComponent from "../component/PostViewComponent";
import { ImageCheckContext } from "../context/ImageProvider";
import { getUserByField } from "../redux/slices/UserSlices";
import { getNoti } from "../redux/slices/NotiSlice";

const HomeScreen = () => {
  // console.log(data.post);
  // const user = data.user;
  const emoji = data.emoji;
  const post = useSelector((state) => state.post.post);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const noti = useSelector((state) => state.noti.noti);

  useEffect(() => {
    const unsubscribe = getNoti(dispatch, user.user_id);
    // console.log("notiHome:",noti)
    return () => unsubscribe();
  }, [dispatch]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // const handleGetUser = useCallback(async () => {
  //   const user = await dispatch(getUserByField({ user_id: "1" }));
  //   console.log(user);
  // }, []);

  return (
    <>
      {post.length === 0 || user === null ? (
        <View style={{ height: 100, width: "100%", paddingHorizontal: "5%" }}>
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
              <PostViewComponent
                post={item}
                images={item.images}
                emoji={emoji}
                user={user}
              />
            );
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setTimeout(async () => {
                  const dataRefresh = await dispatch(
                    getPostsRefresh({ field: "created_at", quantity: 3 })
                  );
                  // setLastVisiblePost(dataRefresh.payload.lastVisiblePost);
                  console.log("getPostsRefresh");
                  // Sau khi hoàn thành refresh, có thể cập nhật lại dữ liệu từ API hoặc giữ nguyên
                  setRefreshing(false);
                  setHasMorePosts(true);
                }, 2000);
              }}
            />
          }
          ListFooterComponent={() =>
            loading ? ( //  a==b ? b : a
              <View
                style={{
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: 10,
                  // width : WIDTH,
                  // height : 50 ,
                  flexDirection: "column",
                }}
              >
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : null
          }
          onEndReached={async () => {
            if (loading || !hasMorePosts) return; // Check if loading or no more posts to load
            setLoading(true);

            try {
              const dataLoadMore = await dispatch(
                getPostsByField({ field: "created_at", quantity: 3 })
              );

              if (dataLoadMore.payload.postData.length === 0) {
                setHasMorePosts(false);
              } else {
                // Append new posts while ensuring no duplicates
                // Example: setPost((prevPosts) => [...new Set([...prevPosts, ...dataLoadMore.payload.postData])]);
              }
            } catch (error) {
              console.error("Error loading more posts:", error);
            } finally {
              setLoading(false);
            }
          }}
          onEndReachedThreshold={0.1}
        />
      )}
    </>
  );
};

export default HomeScreen;

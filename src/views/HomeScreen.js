import { RefreshControl, ScrollView, Text, View, FlatList, ActivityIndicator, Image } from "react-native";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { SkeletonComponent } from "../component";

import PostViewComponent from "../component/PostViewComponent";

import { getPostsByField, getPostsRefresh, getPostsFromUnfollowedUsers } from '../../src/redux/slices/PostSlice';
import { startListeningFollowers } from "../redux/slices/FollowerSlice";
import { startListeningFavorites } from "../redux/slices/FavoriteSlice";
import { startListeningEmoji } from "../redux/slices/EmojiSlice";
import { ImageCheckContext } from "../context/ImageProvider";
import { getUserByField } from "../redux/slices/UserSlices";
import { getNoti } from "../redux/slices/NotiSlice";
import { startListeningReportBySubCommentId, startListeningReportByPostId, startListeningReportByCommentId } from "../redux/slices/ReportSilce";
import { startListeningRequestAccepted, startListeningRequestPending, startListeningRequestRejected, } from '../redux/slices/RequestSlice';
import { startListeningSubCommentByCommentId } from "../redux/slices/SubCommentSlice";
import { startListeningAchieByID } from "../redux/slices/AchievementSlice";

const HomeScreen = () => {

  const post = useSelector((state) => state.post.post);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const noti = useSelector((state) => state.noti.noti);


  // console.log(user_id)


  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = getNoti(dispatch, user.user_id);
      // console.log("notiHome:",noti)
      return () => unsubscribe();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        await dispatch(startListeningFollowers({ follower_user_id: user.user_id }));
        await dispatch(startListeningFavorites({ user_id: user.user_id }));
        // await dispatch(startListeningEmoji({ user_id: user.user_id }));
        // dispatch(getPostsByField({ field: "created_at", quantity: 3, isFollow: false, currentUserId: user?.user_id }));
        await dispatch(startListeningReportByPostId({}));
        await dispatch(startListeningReportBySubCommentId({}));
        await dispatch(startListeningReportByCommentId({}));

        await dispatch(startListeningRequestAccepted({}));
        await dispatch(startListeningRequestPending({}));
        await dispatch(startListeningRequestRejected({}));

        await dispatch(startListeningAchieByID({ achie_id: user.achie_id }));
      }
      fetchData();
    }
  }, [user]);

  return (
    <>
      {post == [] || user === null ? (
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
              <PostViewComponent post={item} images={item.images} user={user} />
            )
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              setTimeout(async () => {
                const dataRefresh = await dispatch(getPostsRefresh({ isFollow: false, currentUserId: user?.user_id }));
                // await startListeningFollowers({ follower_user_id: user?.user_id });
                // await startListeningFavorites({ user_id: user?.user_id });
                // setLastVisiblePost(dataRefresh.payload.lastVisiblePost);
                console.log("getPostsRefresh")
                // Sau khi hoàn thành refresh, có thể cập nhật lại dữ liệu từ API hoặc giữ nguyên
                setRefreshing(false);
                setHasMorePosts(true);
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
            if (loading || !hasMorePosts || !user) return; // Check if loading or no more posts to load
            setLoading(true);

            try {
              const dataLoadMore = await dispatch(getPostsFromUnfollowedUsers({ field: "created_at", quantity: 3, currentUserId: user?.user_id }));
              // await startListeningFollowers({ follower_user_id: user?.user_id });
              // await startListeningFavorites({ user_id: user?.user_id });
              // console.log("objecta", dataLoadMore.payload.postData.length)
              if (dataLoadMore.payload.postData.length === 0) {
                setHasMorePosts(false);
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

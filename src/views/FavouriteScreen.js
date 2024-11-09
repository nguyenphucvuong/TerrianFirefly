import { View, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { data } from "../constains/data";
import { useSelector, useDispatch } from "react-redux";
import { getPostsFromFavouriteUsers, getPostsRefresh } from '../../src/redux/slices/PostSlice';
import { SkeletonComponent } from "../component";
//components
import PostViewComponent from "../component/PostViewComponent";
const FavouriteScreen = () => {
    const emoji = data.emoji;
    const post = useSelector((state) => state.post.postByUser);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    // useEffect( async () => {
    //     await dispatch(getPostsFromFavouriteUsers({ field: "created_at", currentUserId: user?.user_id }));
    // }, [user]);
    // console.log('user?.user_id',user?.user_id);

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
                    scrollEnabled={false}
                    data={post}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <PostViewComponent post={item} images={item.images} emoji={emoji} user={user} />
                        )
                    }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => {
                            setRefreshing(true);
                            setTimeout(async () => {
                                const dataRefresh = await dispatch(getPostsRefresh({ isFollow: true, currentUserId: user?.user_id }));
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
                            console.log('currentUserId: user?.user_id',user?.user_id);
                            
                            const dataLoadMore = await dispatch(getPostsFromFavouriteUsers({ field: "created_at", currentUserId: user?.user_id }));
                            // await startListeningFollowers({ follower_user_id: user?.user_id });
                            // await startListeningFavorites({ user_id: user?.user_id });
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
                />)}
        </>
    );
}
export default FavouriteScreen;
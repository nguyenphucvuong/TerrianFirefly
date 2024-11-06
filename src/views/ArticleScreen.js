import { RefreshControl, ScrollView, Text, View, FlatList, ActivityIndicator, Image } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { data } from "../constains/data";
import { useSelector, useDispatch } from "react-redux";
import { getPosts, getPostsByField, getPostsRefresh } from '../../src/redux/slices/PostSlice';
import { SkeletonComponent } from "../component";
//components
import PostViewComponent from "../component/PostViewComponent";
const ArticleScreen = () => {
    const emoji = data.emoji;
    const post = useSelector((state) => state.post.post);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    //console.log('user1',user);
    //console.log('post1',post);

    return (

        <FlatList
            data={post}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
                return (
                    // bài viết người dùng đăng
                    <>
                        {user.user_id === item.user_id ?
                            <PostViewComponent post={item} user={user} images={item.images} emoji={emoji} />
                            : null
                        }
                    </>
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
                if (loading || !hasMorePosts) return; // Check if loading or no more posts to load
                setLoading(true);

                try {
                    const dataLoadMore = await dispatch(getPostsByField({ field: "created_at", quantity: 3 }));

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

    )
}
export default React.memo(ArticleScreen);
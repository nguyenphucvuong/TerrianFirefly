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
    const post = useSelector((state) => state.post.postFavourite);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    useEffect(() => {
        dispatch(getPostsFromFavouriteUsers({ field: "created_at", currentUserId: user?.user_id }));
      }, [user?.user_id]);
    // console.log('user?.user_id',user?.user_id);
    // console.log('post1234', post);
    // console.log('user', user);
    return (
        <>
            {post.length === 0 || user === null ? (
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
                            <PostViewComponent post={item} images={item.images} user={user} />
                        )
                    }}
                    contentContainerStyle={{ flexGrow: 1 }}

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
                />)}
        </>
    );

}
export default React.memo(FavouriteScreen);
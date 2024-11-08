import { RefreshControl, ScrollView, Text, View, FlatList, ActivityIndicator, Image } from "react-native";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { data } from "../constains/data";
import { useSelector, useDispatch } from "react-redux";
import { getPostsByField, getPostsRefresh, getPostsFromUnfollowedUsers, getPostUsers } from '../../src/redux/slices/PostSlice';
import { startListeningFollowers } from "../redux/slices/FollowerSlice";
import { startListeningFavorites } from "../redux/slices/FavoriteSlice";
import { startListeningEmoji } from "../redux/slices/EmojiSlice";
import { SkeletonComponent } from "../component";
//components
import PostViewComponent from "../component/PostViewComponent";
const ArticleScreen = () => {
    const emoji = data.emoji;
    const post = useSelector((state) => state.post.postByUser);
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);


    useEffect(() => {
        dispatch(getPostUsers({ field: "created_at", currentUserId: user?.user_id }));
    },[user]);
    // console.log('user1',user);
    // console.log('post1',post);
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
export default React.memo(ArticleScreen);
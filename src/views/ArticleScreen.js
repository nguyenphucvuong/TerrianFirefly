import { View, FlatList, ActivityIndicator, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { data } from "../constains/data";
import { useSelector, useDispatch } from "react-redux";
import { getPostUsers } from '../../src/redux/slices/PostSlice';
import { SkeletonComponent } from "../component";
//components
import PostViewComponent from "../component/PostViewComponent";
const ArticleScreen = ({post, user}) => {
    const emoji = data.emoji;

    const [loading, setLoading] = useState(false);

    // console.log('user1',user);
    //console.log('post1', post);
    return (
        <>
            {post.length === 0 ? (
                <View style={{ alignItems: 'center', marginTop: '50%' }}>
                    <Text> Chưa có bài viết</Text>
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
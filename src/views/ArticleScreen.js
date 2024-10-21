import { StyleSheet, View, FlatList, ScrollView } from 'react-native'
import React from 'react';
import { data } from "../constains/data";
//components
import PostViewComponent from "../component/PostViewComponent";
const ArticleScreen = () => {
    const user = data.user;
    const emoji = data.emoji;
    return (

            <View style={{ flexGrow: 1 }}>
                {/* {data.post.map((item, index) => (
                    <PostViewComponent
                        key={index.toString()} // Dùng index làm key
                        post={item}
                        user={user}
                        images={item.images}
                        emoji={emoji}
                    />
                ))} */}
            </View>

    )
}
const styles = StyleSheet.create({

});
export default ArticleScreen;
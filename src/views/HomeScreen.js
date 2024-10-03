import { ScrollView, View, } from "react-native";
import React from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import { data } from "../constains/data";



import PostViewComponent from "../component/PostViewComponent";

const HomeScreen = () => {
  // console.log(data.post);
  const user = data.user;
  const emoji = data.emoji;
  return (
    <ScrollView
      style={[{
      }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Post */}
      {data.post.map((item, index) => {
        // console.log(item.images.length);
        return (
          <PostViewComponent key={index} post={item} user={user} images={item.images} emoji={emoji} />
        )
      })}


    </ScrollView>




  );
};

export default HomeScreen;



import React from "react";
import { SafeAreaView } from "react-native";
import HashtagGroupComponent from "../component/HashtagGroupComponent";

const data = [
  {
    id: "1",
    title: "Boss chó trắng",
    description: "abc abc abc...",
    imageUrl: "link_to_image1",
  },
  {
    id: "2",
    title: "Boss đầu to",
    description: "abc abc abc...",
    imageUrl: "link_to_image2",
  },
  {
    id: "2",
    title: "Boss đầu to",
    description: "abc abc abc...",
    imageUrl: "link_to_image2",
  },{
    id: "2",
    title: "Boss đầu to",
    description: "abc abc abc...",
    imageUrl: "link_to_image2",
  },{
    id: "2",
    title: "Boss đầu to",
    description: "abc abc abc...",
    imageUrl: "link_to_image2",
  },{
    id: "2",
    title: "Boss đầu to",
    description: "abc abc abc...",
    imageUrl: "link_to_image2",
  },
  // Các bài viết khác...
];



const HashtagGroupScreen = ({ route, navigation }) => {
  const { hashtagID, hashtag_avatar, hashtag_background, postHashtag } = route.params;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <HashtagGroupComponent
        dataPost={postHashtag}
        groupImage={hashtag_avatar}
        groupTitle = {hashtagID}
        hashtag_background= {hashtag_background}
      />
    </SafeAreaView>
  );
};

export default HashtagGroupScreen;

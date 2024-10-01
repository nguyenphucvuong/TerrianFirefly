import { ScrollView, View, } from "react-native";
import React from "react";
import { StyleGlobal } from "../styles/StyleGlobal";
import PostViewComponent from "../component/PostViewComponent";


const FollowScreen = () => {
    return (
        <ScrollView
            style={[{
            }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={StyleGlobal.container}>
                <PostViewComponent></PostViewComponent>
                <PostViewComponent></PostViewComponent>
                <PostViewComponent></PostViewComponent>


            </View>
        </ScrollView>

    )
}

export default FollowScreen


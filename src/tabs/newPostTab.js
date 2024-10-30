import { StyleSheet } from 'react-native'
import React from 'react'
import { CreatePostScreen } from "../views/";
import { useDispatch, useSelector } from "react-redux";
import { getHashtag } from "../redux/slices/HashtagSlice";

const NewPostTab = () => {
    return (
        <CreatePostScreen></CreatePostScreen>
    )
}

export default NewPostTab

const styles = StyleSheet.create({})
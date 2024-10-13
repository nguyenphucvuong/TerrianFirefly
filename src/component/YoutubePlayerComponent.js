import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";

const YoutubePlayerComponent = ({ url }) => {
    return (
        <YoutubePlayer
            height={"100%"}
            width={"100%"}
            videoId={url}
        />
    )
}

export default React.memo(YoutubePlayerComponent)

const styles = StyleSheet.create({})
/* eslint-disable no-undef */
import { Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import RowComponent from '../RowComponent'
import ButtonsComponent from '../ButtonsComponent'
import { StyleGlobal } from '../../styles/StyleGlobal'


const PostButton = (infoBtn) => {
    const [toggleExpand, handleShowPopEmoji] = [infoBtn.toggleExpand, infoBtn.handleShowPopEmoji];
    return (
        <RowComponent
            height={40}
            style={{
                flexDirection: "row",
            }}>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    flex: 2,
                    flexDirection: "row",
                }}
            >
                <ButtonsComponent isButton
                    style={{
                        marginRight: "2%",
                    }}>
                    <Image
                        style={{
                            width: 20,
                            height: 20,
                        }}
                        source={require('../../../assets/appIcons/view-out-post.png')}
                        contentFit="cover"
                    />
                </ButtonsComponent>
                <Text
                    style={[StyleGlobal.text, {

                        color: "gray",
                    }]}> 6k</Text>
            </View>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    flexDirection: "row",
                }}
            >
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "row",
                    }}>
                    <ButtonsComponent isButton
                        style={{
                            marginRight: "2%",
                        }}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={require('../../../assets/appIcons/comment-out-post.png')}
                            contentFit="cover"
                        />
                    </ButtonsComponent>
                    <Text
                        style={[StyleGlobal.text, {

                            color: "gray",
                            flex: 1,
                        }]}> 6k</Text>
                </View>

                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "row",
                    }}>
                    <ButtonsComponent
                        onPress={toggleExpand}
                        onLongPress={handleShowPopEmoji}
                        isButton
                        style={{ marginRight: "2%", }}
                    ><Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={require('../../../assets/appIcons/like-out-post.png')}
                            contentFit="cover"
                        /></ButtonsComponent>
                    <Text
                        style={[StyleGlobal.text, {
                            color: "gray",
                            flex: 1,
                        }]}> 6k</Text>
                </View>
            </View>
        </RowComponent>
    )
}

export default PostButton

/* eslint-disable no-undef */
import { Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import RowComponent from '../RowComponent'
import ButtonsComponent from '../ButtonsComponent'
import { StyleGlobal } from '../../styles/StyleGlobal'


const PostButton = (infoBtn) => {
    const [toggleExpand] = [infoBtn.toggleExpand];
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
                        source={require('../../../assets/view_icon_outside.png')}
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
                            source={require('../../../assets/comment_icon_outside.png')}
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
                        onLongPress={() => console.log("long press")}
                        isButton
                        style={{ marginRight: "2%", }}
                    ><Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            source={require('../../../assets/like_icon_outside.png')}
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

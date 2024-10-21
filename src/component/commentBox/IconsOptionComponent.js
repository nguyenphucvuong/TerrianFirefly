import { ScrollView, StyleSheet, } from 'react-native'
import React from 'react'
import ButtonsComponent from '../ButtonsComponent'
import { Image } from 'expo-image'

const IconsOptionComponent = () => {

    return (
        <ScrollView
            horizontal={true}
            scrollEnabled={true}
            style={{
                // backgroundColor: "green",
                flexDirection: "row",
                marginLeft: -16,
                left: 16,
            }}>
            <ButtonsComponent
                isButton
                // onPress={aaaaa}
                style={{
                    // backgroundColor: "red",
                    marginRight: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{
                        width: 28,
                        height: 28,
                    }}
                    source={require('../../../assets/appIcons/smile_icon_cmt.png')} />
            </ButtonsComponent>
            <ButtonsComponent
                isButton
                // onPress={aaaaa}
                style={{
                    // backgroundColor: "red",
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{
                        width: 28,
                        height: 28,
                    }}
                    source={require('../../../assets/appIcons/smile_icon_cmt.png')} />
            </ButtonsComponent>
            <ButtonsComponent
                isButton
                // onPress={aaaaa}
                style={{
                    // backgroundColor: "red",
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{
                        width: 28,
                        height: 28,
                    }}
                    source={require('../../../assets/appIcons/smile_icon_cmt.png')} />
            </ButtonsComponent>
            <ButtonsComponent
                isButton
                // onPress={aaaaa}
                style={{
                    // backgroundColor: "red",
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{
                        width: 28,
                        height: 28,
                    }}
                    source={require('../../../assets/appIcons/smile_icon_cmt.png')} />
            </ButtonsComponent>
            <ButtonsComponent
                isButton
                // onPress={aaaaa}
                style={{
                    // backgroundColor: "red",
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{
                        width: 28,
                        height: 28,
                    }}
                    source={require('../../../assets/appIcons/smile_icon_cmt.png')} />
            </ButtonsComponent>
            <ButtonsComponent
                isButton
                // onPress={aaaaa}
                style={{
                    // backgroundColor: "red",
                    marginHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{
                        width: 28,
                        height: 28,
                    }}
                    source={require('../../../assets/appIcons/smile_icon_cmt.png')} />
            </ButtonsComponent>
        </ScrollView>
    )
}

export default IconsOptionComponent

const styles = StyleSheet.create({})
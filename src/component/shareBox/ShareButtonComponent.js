import { StyleSheet, Text } from 'react-native'
import React from 'react'
import ButtonsComponent from '../ButtonsComponent'
import { Image } from 'expo-image';

const ShareButtonComponent = (infoButton) => {
    const [isRow, styleBtn, styleImg, styleText, onPress, url, text] = [

        infoButton.isRow,
        infoButton.styleBtn,
        infoButton.styleImg,
        infoButton.styleText,
        infoButton.onPress,
        infoButton.url,
        infoButton.text,
    ];




    const SharePop = () => {
        return isRow ? (
            <ButtonsComponent isPressable
                onPress={onPress}
                style={[styles.btnLogoRow, styleBtn && styleBtn]}>
                <Image source={url}
                    style={[styles.iconBtnLogoRow, styleImg && styleImg]} />
                <Text style={[styles.textShareRow, styleText && styleText]}>{text}</Text>
            </ButtonsComponent>
        ) : (
            <ButtonsComponent isPressable
                onPress={onPress}
                style={[styles.btnLogoCol, styleBtn && styleBtn]}>
                <Image source={url}
                    style={[styles.iconBtnLogoCol, styleImg && styleImg]} />
                <Text style={[styles.textShareCol, styleText && styleText]}>{text}</Text>
            </ButtonsComponent >
        )
    }

    return (
        <>
            <SharePop />
        </>
    )

}

export default ShareButtonComponent

const styles = StyleSheet.create({
    btnLogoCol: {
        justifyContent: "center",
        height: "auto",
        flexDirection: "collumn",
        paddingBottom: 10,
        marginHorizontal: 4,
    },
    textShareCol: {
        fontSize: 15,
        textAlign: "center",
    },
    iconBtnLogoCol: {
        width: 60,
        height: 60,
        marginBottom: 5,
    },

    btnLogoRow: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: "yellow",
        alignItems: "center",
        marginVertical: 10,
    },
    textShareRow: {
        color: "gray",
        fontSize: 13,
        textAlign: "center",
    },
    iconBtnLogoRow: {
        width: 35,
        height: 35,
        marginRight: 5,
    },
})
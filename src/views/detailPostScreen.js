import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Feather from 'react-native-vector-icons/Feather'


const DetailPostScreen = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, }}>
            <StatusBar barStyle={'default'} />
            <View style={{
                flexDirection: "row",
                position: 'absolute',
                zIndex: 999,
                top: inset.top + 25,
                padding: 10,
            }}>
                <Feather name='x' color={'white'} size={24}
                    onPress={() => navigation.goBack()} />

                <View style={{ flex: 1, alignItems: 'center' }}>

                </View>

                <Feather name='more-vertical' color={'white'} size={24} />
            </View>
        </View>
    )
}

export default DetailPostScreen

const styles = StyleSheet.create({})
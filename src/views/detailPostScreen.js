import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'


import MoreOptionPostComponent from '../component/moreOptionBox/MoreOptionPostComponent';
import RowComponent from '../component/RowComponent';
import AvatarComponent from '../component/AvatarComponent';
import { ButtonsComponent } from '../component';
import { StyleGlobal } from '../styles/StyleGlobal';


const DetailPostScreen = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();

    const handleAd = () => {
        console.log("toi day");
    };
    return (
        <View style={{
            flex: 1,
            paddingHorizontal: "3.5%",
            backgroundColor: "rgba(255, 255, 255, 1)",

        }}>
            <StatusBar barStyle={'default'} />

            {/* Navigate bar */}
            <RowComponent style={{
                width: "100%",
                position: 'absolute',
                zIndex: 999,
                top: inset.top,
                paddingVertical: "4%",
                paddingHorizontal: "2.5%",
                alignItems: "center",
            }}>
                <Ionicons name='chevron-back-outline' color={'black'} size={25}
                    onPress={() => navigation.goBack()} />

                <View
                    style={{
                        width: "90%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                </View>

                <View
                    style={{
                        width: "10%",
                        height: "70%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <MoreOptionPostComponent />
                </View>
            </RowComponent>

            {/* Content */}
            <View style={{
                flex: 1,
                // backgroundColor: "black",
                top: "7%",
            }}>
                <View style={{
                    marginTop: "3%",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                    }}>Detail Post Screen</Text>
                </View>

                <RowComponent style={{ height: 30, width: "100%", marginVertical: "3%" }}>
                    <AntDesign name='clockcircle' color={'#BFBFBF'} size={15} />
                    <Text style={{ color: "#BFBFBF", fontSize: 12, marginRight: "15%", marginLeft: "2%" }}>1 hour ago</Text>
                    <AntDesign name='eye' color={'#BFBFBF'} size={20} style={{ bottom: ".5%" }} />
                    <Text style={{ color: "#BFBFBF", fontSize: 12, marginLeft: "2%" }}>100</Text>
                </RowComponent>

                <RowComponent style={{
                    height: 100,
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: 10,
                    alignItems: "center",
                }}>
                    <AvatarComponent size={50} round={10} url={"https://avatars.githubusercontent.com/u/118148132?v=4"}
                        style={{
                            marginHorizontal: "3%",
                        }} />
                    <View style={{
                        flexDirection: "column",
                        width: "50%",
                        height: "100%",
                        justifyContent: "center",
                        // backgroundColor: "yellow",
                    }}>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: "bold",
                        }}>User Name</Text>
                        <Text style={{
                            fontSize: 12,
                            color: "#BFBFBF",
                        }}>User Info</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: "2%",
                        // backgroundColor: "red",
                    }}>
                        <ButtonsComponent isButton onPress={handleAd}
                            style={{
                                borderColor: "rgba(121,141,218,1)",
                                borderRadius: 100,
                                borderWidth: 2,
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                height: "30%",
                            }}
                        >
                            <Text style={{ ...StyleGlobal.text, color: "rgba(101,128,255,1)" }}>Theo dõi</Text>
                        </ButtonsComponent>
                    </View>

                </RowComponent>

            </View >
        </View >
    )
}

export default DetailPostScreen

const styles = StyleSheet.create({})
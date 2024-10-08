import { SafeAreaView, Image, View, ImageBackground, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
//components
import { SelectImageComponent, ButtonBackComponent, UserAvatarComponent, ButtonFunctionComponent } from '../component';
//style
import { StyleGlobal } from '../styles/StyleGlobal';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
const BackgroundScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    const data = [
        { id: 1, image: 'https://i.pinimg.com/736x/81/31/20/8131208cdb98026d71d3f89b8097c522.jpg' },
        { id: 2, image: 'https://mega.com.vn/media/news/2605_hinh-nen-anime-may-tinh41.jpg' },
        { id: 3, image: 'https://gstatic.gvn360.com/2021/06/Mot-vu-tru-moi_-11-scaled.jpg' },
        { id: 4, image: 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/12/hinh-nen-vu-tru-72.jpg' },
    ];
    return (
        <View style={{ flex: 1}}>
            <ImageBackground style={{ width: '100%', height: appInfo.heightWindows * 0.2, }}
                source={{ uri: 'https://images4.alphacoders.com/973/973967.jpg' }}>
                <View style={[StyleGlobal.container, { position: 'absolute', top: appInfo.heightWindows * 0.03 }]}>
                    <ButtonBackComponent color={'white'} />
                </View>
                <View style={styles.background}>
                    <View style={{ marginRight: 'auto', marginLeft: '5%', bottom: appInfo.heightWindows * 0.04 }}>
                        <UserAvatarComponent />
                    </View>
                </View>
            </ImageBackground>
            <FlatList
                style={{ margin: '2%', marginTop: '20%' }}
                numColumns={2}
                data={data}
                renderItem={({ item }) => {
                    return (
                        <SelectImageComponent uri={item.image} width={'100%'} height={appInfo.heightWindows * 0.1}/>
                    )
                }}
                keyExtractor={(item) => item.id.toString()}
            />
            <ButtonFunctionComponent name={'Dùng'} backgroundColor={'#8B84E9'} colorText={'#FFFFFF'} style={styles.button}/>
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: '100%', // Chiều rộng chiếm 100% của container
        height: 100,
        borderRadius: 20,
    },
    background: {
        width: '90%',
        height: appInfo.heightWindows * 0.11,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        position: 'absolute',
        borderRadius: 20,
        top: appInfo.heightWindows * 0.17,
    },
    button: {
        margin: '4%',
        width: '90%',
        height: appInfo.heightWindows * 0.055,
    },
});
export default BackgroundScreen;
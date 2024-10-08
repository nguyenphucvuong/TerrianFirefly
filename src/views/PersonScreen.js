import { SafeAreaView, Text, View, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
//style
import { StyleGlobal } from '../styles/StyleGlobal'
//components
import { UserAvatarComponent, IconComponent, StatisticsComponent } from '../component';
// Lấy chiều cao màn hình để tính toán
import { appInfo } from '../constains/appInfo';
const PersonScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook navigation
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.navigate('BackgroundScreen')}>
                <ImageBackground style={{
                    width: '100%',
                    height: appInfo.heightWindows * 0.2,
                }}
                    source={{ uri: 'https://images4.alphacoders.com/973/973967.jpg' }}
                >
                    <View style={{ position: 'absolute', right: '5%', top: '20%' }}>
                        <IconComponent 
                            style={{}}
                            name={'settings'}
                            size={32}
                            color={'#222222'} />
                    </View>

                    <View style={{ marginRight: 'auto', marginLeft: '5%', marginTop: appInfo.heightWindows * 0.15, }}>
                        <UserAvatarComponent />
                    </View>
                    <View style={{margin: '4%'}}>
                        <IconComponent
                            name={'credit-card'}
                            size={24}
                            color={'#33363F'}
                            text={'ID: ' + '123456'}
                        />
                        <IconComponent
                            name={'user'}
                            size={24}
                            color={'#33363F'}
                            text={'Người bình thường'}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            <StatisticsComponent quantity={0} name={'Bài Viết'} />
                            <StatisticsComponent quantity={0} name={'Theo Dõi'} />
                            <StatisticsComponent quantity={0} name={'Người Theo Dõi'} />
                            <StatisticsComponent quantity={0} name={'Lượt Thích'} />
                        </View>
                    </View>
                </ImageBackground>
                <View style={{ marginLeft: 'auto', margin: '4%'}}>
                            <IconComponent name={'edit'} size={24} color={'#33363F'} text={'Chỉnh sửa'}
                                borderColor={'#190AEF'}
                                borderWidth={2}
                                borderRadius={90}
                                padding={7}
                                onPress={() => navigation.navigate('InfomationScreen')}
                            />
                        </View>
            </TouchableOpacity>
            <View style={StyleGlobal.container}>

            </View>
        </View>
    )
}

export default PersonScreen


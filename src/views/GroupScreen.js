import { StyleSheet, View, FlatList, TouchableOpacity, Text, Image } from 'react-native'
import React from 'react';
//components
import { AvatarEx, IconComponent } from '../component';
//constains
import { appInfo } from "../constains/appInfo";
const GroupScreen = ({ hashtag }) => {
    //console.log('hashtaghashtaghashtag', hashtag);
    return (
        <>
            {
                hashtag.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: '50%' }}>
                        <Text> Chưa tham gia chủ đề</Text>
                    </View>
                ) : (
                    <FlatList
                        data={hashtag}
                        style={{margin: '2%'}}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.hashtag_id}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity style={styles.viewFlatList}>
                                    <AvatarEx
                                        size={50}
                                        url={item.hashtag_avatar !== "default" ? item.hashtag_avatar : Image.resolveAssetSource(require('../../assets/appIcons/avatar_hashtagGroup.png')).uri}
                                    />
                                    <View style={{ justifyContent: 'center', marginLeft: '3%' }}>
                                        <IconComponent name={'hash'} color={'#190AEF'} size={appInfo.heightWindows * 0.02} text={item.hashtag_id} />
                                        <View style={{ flexDirection: 'row', marginTop: appInfo.heightWindows * 0.005 }}>
                                            <Text>{2000} bài đăng/</Text>
                                            <Text>{18}K thành viên:</Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                )
            }
        </>
    )
}
const styles = StyleSheet.create({
    viewFlatList: {
        flexDirection: 'row',
        borderColor: '#D9D9D9',
        padding: 5,
        marginBottom: appInfo.heightWindows * 0.015,
    },
});
export default React.memo(GroupScreen);
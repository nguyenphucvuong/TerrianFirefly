import { View, Switch, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
//style
import { StyleGlobal } from '../styles/StyleGlobal'
///constains
import { appInfo } from '../constains/appInfo'
const NotificationManagement = () => {
    const [swithValue, setSwithValue] = useState(false);

    const toggleSwitch = (value) => {
        setSwithValue(value);
    }
    return (
        <View style={StyleGlobal.container}>
            <Text>Thông báo trong ứng dụng</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', top: appInfo.heightWindows * 0.015}}>
                <Text style={{fontSize: 20}}>Thông báo </Text>
                <Switch
                style={{marginLeft: 'auto'}}
                    onValueChange={toggleSwitch}
                    value={swithValue}
                />
            </View>


        </View>
    )
}
export default NotificationManagement;
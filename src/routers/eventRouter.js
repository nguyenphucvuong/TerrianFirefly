import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appcolor } from '../constains/appcolor';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from 'react-native-vector-icons';

const Router = createStackNavigator();

const GenshinScreen = () => {
    return (
        <View>
            <Text>GenshinScreen</Text>
        </View>
    );
};
const HonkaiScreen = () => {
    return (
        <View>
            <Text>HonkaiScreen</Text>
        </View>
    );
};
const HonkaiStarRailScreen = () => {
    return (
        <View>
            <Text>HonkaiScreen</Text>
        </View>
    );
};

const ZZZScreen = () => {
    return (
        <View>
            <Text>ZZZScreen</Text>
        </View>
    );
};

const dataList = [
    {
        index: 0,
        title: 'Genshin',
        route: 'genshin',
        component: GenshinScreen,
    },
    {
        index: 1,
        title: 'Honkai impact',
        route: 'honkai_impact',
        component: HonkaiScreen,
    },
    {
        index: 2,
        title: 'Honkai Star Rail',
        route: 'honkai_star_rail',
        component: HonkaiStarRailScreen,
    },
    {
        index: 3,
        title: 'Zenless Zone Zero',
        route: 'zzz',
        component: ZZZScreen,
    },
];

const EventRouter = (route) => {
    const [id, setId] = React.useState(0);
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();

    React.useEffect(() => { }, [route.params?.id]);

    return (
        <>





        </>
    );
};

export default EventRouter;
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, ScrollView } from 'react-native';
import ArticleScreen from '../views/ArticleScreen';
import FavouriteScreen from '../views/FavouriteScreen';
import GroupScreen from '../views/GroupScreen';
import { appInfo } from '../constains/appInfo';

const { width } = Dimensions.get('window');

const TabRecipe = ({ post, user }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabHeights, setTabHeights] = useState([0, 0, 0]);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [selectedTab, setSelectedTab] = useState('articles');

  const handleContentSizeChange = (index, contentWidth, contentHeight) => {
    setTabHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = contentHeight;
      return newHeights;
    });
  };
  const screens = [
    <ArticleScreen post={post} user={user} key="0" />,
    <FavouriteScreen key="1" />,
    <GroupScreen key="2" />,
  ];
  const animateTabTransition = (newIndex) => {
    setActiveTabIndex(newIndex);
    setSelectedTab(newIndex === 0 ? 'articles' : newIndex === 1 ? 'favorites' : 'topics');
    Animated.timing(animatedValue, {
      toValue: newIndex,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Interpolations for opacity and positioning
  const tabOpacity = (index) =>
    animatedValue.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

  return (
    <>
      {/* Tab Navigation Buttons */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => animateTabTransition(0)} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'articles' && styles.activeTabText]}>Bài viết</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => animateTabTransition(1)} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'favorites' && styles.activeTabText]}>Yêu thích</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => animateTabTransition(2)} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'topics' && styles.activeTabText]}>Chủ Đề</Text>
        </TouchableOpacity>
      </View>

      {/* Animated Tab Content */}
      <View style={{ flex: 1, height: tabHeights[activeTabIndex] }}>
        {screens.map((screen, index) => (
          <Animated.View
            key={index}
            style={{
              width,
              opacity: tabOpacity(index),
              height: tabHeights[index] || 'auto',
            }}
          >
            <ScrollView
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: '38%' }}
              onContentSizeChange={(contentWidth, contentHeight) =>
                handleContentSizeChange(index, contentWidth, contentHeight)
              }
            >
              {screen}
            </ScrollView>
          </Animated.View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
    color: '#333',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default TabRecipe;

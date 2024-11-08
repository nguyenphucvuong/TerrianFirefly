// import IndexRouter from './src/routers/indexRouter'
import { StatusBar, View } from 'react-native'

import React, { useEffect, useState, useContext, createContext } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/redux/store';
import "react-native-gesture-handler";
import StackNavigator from './src/stacks/StackNavigator'
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { getPostsFirstTime, getPostsByField } from './src/redux/slices/PostSlice';
import { ImageProvider } from './src/context/ImageProvider';
import { getHashtag } from './src/redux/slices/HashtagSlice';
import { getEvent, getEventByField,fetchEvents } from "./src/redux/slices/EventSlice";
import { LogBox } from 'react-native';

const MainApp = () => {
  useEffect(() => {
    // Tắt cảnh báo cụ thể
    LogBox.ignoreLogs([
      "Warning: Component \"RCTView\" contains the string ref",
    ]);
  }, []);

  const dispatch = useDispatch();
  const today = new Date();
  const value = today.toISOString(); // Đảm bảo là định dạng ISO
  useEffect(() => {
    // dispatch(getPostsByField({ field: "created_at", quantity: "2", lastVisiblePost: null }));
    dispatch(getPostsFirstTime());
    dispatch(getHashtag()); 
  }, []);

  useEffect(() => {
    const unsubscribe = dispatch(fetchEvents()); 
    return () => unsubscribe(); // Cleanup
  }, [dispatch]);
  return (
    <>
      <StatusBar barStyle={'dark-content'} translucent={true} backgroundColor="white" />
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </>
  );
};

const App = () => {

  return ( 
    <Provider store={store}>
      <ImageProvider>
        <SafeAreaProvider>
          <MainApp />

        </SafeAreaProvider>
      </ImageProvider>
    </Provider>
  )
}

export default App;



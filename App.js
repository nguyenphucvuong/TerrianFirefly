// import IndexRouter from './src/routers/indexRouter'
import { StatusBar } from 'react-native'

import React, { useEffect, useState, useContext, createContext } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import "react-native-gesture-handler";
import StackNavigator from './src/stacks/StackNavigator'
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, getPostsByField } from './src/redux/slices/PostSlice';
import { ImageProvider } from './src/context/ImageProvider';




const MainApp = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPostsByField({ field: "title", quantity: "2", lastVisiblePost: null }));


  }, []);

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



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
import { ImageProvider } from './src/context/ImageProvider';



const MainApp = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(getPostsByField({ field: "created_at", quantity: "2", lastVisiblePost: null }));

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



// import IndexRouter from './src/routers/indexRouter'
import { StatusBar, View } from 'react-native'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/redux/store';

import { Provider } from 'react-redux';

import "react-native-gesture-handler";
import StackNavigator from './src/stacks/StackNavigator'

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={'dark-content'} translucent={true} backgroundColor="white" />
        {/* <IndexRouter /> */}
        <NavigationContainer >
          <StackNavigator />
        </NavigationContainer >

      </SafeAreaProvider>
    </Provider>

  )
}

export default App


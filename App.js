// import IndexRouter from './src/routers/indexRouter'
import { StatusBar, View } from 'react-native'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/redux/store';

import StackNavigator from './src/stacks/StackNavigator'
import { Provider } from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
      <StatusBar barStyle={'default'} />
      {/* <IndexRouter /> */}
      <NavigationContainer >
        <StackNavigator />
      </NavigationContainer >

    </SafeAreaProvider>
    </Provider>

  )
}

export default App


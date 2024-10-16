// import IndexRouter from './src/routers/indexRouter'
import { StatusBar } from 'react-native'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import "react-native-gesture-handler";
import StackNavigator from './src/stacks/StackNavigator'
 
const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} translucent={true} backgroundColor="transparent" />
      {/* <IndexRouter /> */}
      <NavigationContainer >
        <StackNavigator />
      </NavigationContainer >

    </SafeAreaProvider>

  )
}

export default App


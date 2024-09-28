// import IndexRouter from './src/routers/indexRouter'
import { StatusBar } from 'react-native'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'


import IndexTab from './src/tabs/indexTab'

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'default'} />
      {/* <IndexRouter /> */}
      <NavigationContainer >
        <IndexTab />
      </NavigationContainer >

    </SafeAreaProvider>

  )
}

export default App


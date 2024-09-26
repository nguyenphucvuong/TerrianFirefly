import IndexRouter from './src/routers/indexRouter'
import { StatusBar } from 'react-native'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
const App = () => {
  return (
    <SafeAreaProvider>
      <IndexRouter />
      <StatusBar barStyle={'default'} />
    </SafeAreaProvider>

  )
}

export default App


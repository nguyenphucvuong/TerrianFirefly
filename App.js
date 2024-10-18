// import IndexRouter from './src/routers/indexRouter'
import { StatusBar } from 'react-native'
import React,{useEffect} from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import "react-native-gesture-handler";
import StackNavigator from './src/stacks/StackNavigator'
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { getHashtag } from './src/redux/slices/HashtagSlices';
import { getPosts } from './src/redux/slices/PostSlices';



// Component con sử dụng Redux
const MainApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHashtag());
    dispatch(getPosts());
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
      <SafeAreaProvider>
        <MainApp /> 
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

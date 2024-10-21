import { configureStore } from '@reduxjs/toolkit'
// ...
import Post from './slices/PostSlices';
import HashtagSlice from './slices/HashtagSlices';
export const store = configureStore({
  reducer: {
    post: Post,
    hashtag: HashtagSlice,
  },
})




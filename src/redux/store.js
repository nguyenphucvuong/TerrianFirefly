import { configureStore } from '@reduxjs/toolkit'
// ...
import Post from './slices/PostSlices';
import HashtagSlices from './slices/HashtagSlices';
import UserSlices  from './slices/UserSlices';
export const store = configureStore({
  reducer: {
    post: Post,
    hashtag: HashtagSlices,
    user: UserSlices,
  },
})




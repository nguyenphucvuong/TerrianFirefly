import { configureStore } from '@reduxjs/toolkit'
// ...
import Post from './slices/PostSlice';
import HashtagSlice from './slices/HashtagSlice';
export const store = configureStore({
    reducer: {
        post: Post,
        hashtag: HashtagSlice,
    },
})



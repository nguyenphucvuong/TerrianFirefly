import { configureStore } from '@reduxjs/toolkit'
// ...

import Post from './slices/PostSlice';
import HashtagSlice from './slices/HashtagSlice';
import CommentSlice from './slices/CommentSlice';

export const store = configureStore({
    reducer: {
        post: Post,
        hashtag: HashtagSlice,
        comment: CommentSlice,
    },
})



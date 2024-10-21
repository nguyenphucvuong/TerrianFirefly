import { configureStore } from '@reduxjs/toolkit'
// ...
<<<<<<< HEAD
=======

>>>>>>> 3ca95859d3312b3c40fb87abf7d8b34d96568116
import Post from './slices/PostSlice';
import HashtagSlice from './slices/HashtagSlice';
export const store = configureStore({
    reducer: {
        post: Post,
        hashtag: HashtagSlice,
    },
})



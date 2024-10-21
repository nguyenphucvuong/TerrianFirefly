import { configureStore } from '@reduxjs/toolkit'
// ...
import Post from './slices/PostSlice';

export const store = configureStore({
    reducer: {
        post: Post,
    },

})



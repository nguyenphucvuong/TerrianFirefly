import { configureStore } from '@reduxjs/toolkit'
// ...
import Post from './slices/PostSlices';
export const store = configureStore({
  reducer: {
    post: Post,
  },
})


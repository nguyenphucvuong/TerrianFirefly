import { configureStore } from '@reduxjs/toolkit'
// ...

import Post from './slices/PostSlice';
import HashtagSlice from './slices/HashtagSlice';
import BackgroundSlice from './slices/BackgroundSlice';
import AchievementSlice  from './slices/AchievementSlice';
import NicknameSlice  from './slices/NicknameSlice';
export const store = configureStore({
    reducer: {
        post: Post,
        hashtag: HashtagSlice,
        background: BackgroundSlice,
        achievement: AchievementSlice,
        nickname: NicknameSlice,
    },
})



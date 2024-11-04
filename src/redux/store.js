import { configureStore } from '@reduxjs/toolkit'
// ...

import Post from './slices/PostSlice';
import HashtagSlice from './slices/HashtagSlice';
import CommentSlice from './slices/CommentSlice';

import BackgroundSlice from './slices/BackgroundSlice';
import AchievementSlice from './slices/AchievementSlice';
import NicknameSlice from './slices/NicknameSlice';
import UserSlices from './slices/UserSlices';
import FollowerSlice from './slices/FollowerSlice';
import FavoriteSlice from './slices/FavoriteSlice';

export const store = configureStore({
        reducer: {
                post: Post,
                hashtag: HashtagSlice,
                comment: CommentSlice,
                background: BackgroundSlice,
                achievement: AchievementSlice,
                nickname: NicknameSlice,
                user: UserSlices,
                follower: FollowerSlice,
                favorite: FavoriteSlice,
        },
})




import { configureStore } from '@reduxjs/toolkit'
import Post from './slices/PostSlice';
import HashtagSlice from './slices/HashtagSlice';
import CommentSlice from './slices/CommentSlice';

import BackgroundSlice from './slices/BackgroundSlice';
import AchievementSlice from './slices/AchievementSlice';
import UserSlices from './slices/UserSlices';
import FollowerSlice from './slices/FollowerSlice';
import FavoriteSlice from './slices/FavoriteSlice';
import EmojiSlice from './slices/EmojiSlice';
import EventSlice from './slices/EventSlice';
import NotiSlice from './slices/NotiSlice';


export const store = configureStore({
        reducer: {
                post: Post,
                hashtag: HashtagSlice,
                comment: CommentSlice,
                background: BackgroundSlice,
                achievement: AchievementSlice,
                user: UserSlices,
                follower: FollowerSlice,
                favorite: FavoriteSlice,
                emoji: EmojiSlice,
                event: EventSlice,
                noti: NotiSlice,
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                  serializableCheck: {
                    ignoredActions: ['data/getRealtimePostsByStatus/fulfilled', 'data/listenToUserWithStatus/fulfilled'],
                    ignoredPaths: ['payload'],
                  },
                }),
})




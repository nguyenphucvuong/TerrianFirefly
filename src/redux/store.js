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
<<<<<<< HEAD
import  NotiSlice  from './slices/NotiSlice';
import  HashtagGroupSlice  from './HashtagGroupSlice';

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
                emoji: EmojiSlice,
                event: EventSlice,
                noti: NotiSlice,
                hashtagGroup: HashtagGroupSlice,
        },
=======
import NotiSlice from './slices/NotiSlice';
import SubCommentSlice from './slices/SubCommentSlice';
import RequestSlice from './slices/RequestSlice';
import ReportSlice from './slices/ReportSilce';
import { sub } from '@tensorflow/tfjs';


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
    subComment: SubCommentSlice,
    request: RequestSlice,
    report: ReportSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['data/getRealtimePostsByStatus/fulfilled', 'data/listenToUserWithStatus/fulfilled'],
        ignoredPaths: ['payload'],
      },
    }),
>>>>>>> 28bf6fcc4501f8b14507595eb7c17df3f24b5113
})




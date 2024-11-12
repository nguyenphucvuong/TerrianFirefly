import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    achievement: [],
    statusAchievement: 'idle',
    error: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getAchievement = createAsyncThunk('data/getAchievement', async () => {
    try {
        const achievementRef = collection(db, "Achievements");
        const q = query(achievementRef, orderBy('level')); //sắp xếp tăng dần theo leve 
        const querySnapshot = await getDocs(q);
        
        const achievementData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return achievementData; // Trả về danh sách bài đăng
    } catch (error) {
        console.error('Error fetching posts: ', error);
        throw error;
    }
});

// Tạo slice cho Post
export const AchievementSlice = createSlice({
    name: 'achievement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Xử lý khi lấy dữ liệu thành công
            .addCase(getAchievement.fulfilled, (state, action) => {
                state.achievement = action.payload; // Cập nhật danh sách
                state.statusAchievement = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(getAchievement.pending, (state) => {
                state.statusAchievement = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(getAchievement.rejected, (state, action) => {
                state.error = action.error.message; // lưu lỗi
                state.statusAchievement = 'failed'; // Đánh dấu không thành công
            });

    },
});

// export const { setPost } = PostSlice.actions

export default AchievementSlice.reducer;

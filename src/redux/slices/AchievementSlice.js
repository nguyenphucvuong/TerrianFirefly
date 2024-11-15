import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    achievement: [],
    userAchievement: null,
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
// Thiết lập listener thời gian thực cho dữ liệu người dùng
export const listenToUserAchievementRealtime = (achie_id) => (dispatch) => {
    const q = query(collection(db, "Achievements"), where("achie_id", "==", achie_id));

    const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
            if (!querySnapshot.empty) {
                const userData = {
                    id: querySnapshot.docs[0].id,
                    ...querySnapshot.docs[0].data(),
                };
                //console.log('userData',userData);
                
                dispatch(setUserAchievement(userData));
            }
        },
        (error) => {
            console.error("Error in realtime listener:", error);
        }
    );

    return unsubscribe; // Trả về hàm unsubscribe để có thể ngừng listener khi không cần thiết
};
export const getUserAchievement = createAsyncThunk('data/getUserAchievement', async ({ achie_id }) => {
    try {
        const q = query(collection(db, "Achievements"), where("achie_id", "==", achie_id));
        const querySnapshot = await getDocs(q);

        const achievementData = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };
        //console.log('achievementData', achievementData);

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
    reducers: {
        setUserAchievement: (state, action) => {
            state.userAchievement = action.payload;
            state.errorUser = null; // Reset lỗi khi có dữ liệu người dùng mới
        },
    },
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
            })
            //
            .addCase(getUserAchievement.fulfilled, (state, action) => {
                state.userAchievement = action.payload; // Cập nhật danh sách
                state.statusAchievement = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(getUserAchievement.pending, (state) => {
                state.statusAchievement = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(getUserAchievement.rejected, (state, action) => {
                state.error = action.error.message; // lưu lỗi
                state.statusAchievement = 'failed'; // Đánh dấu không thành công
            });

    },
});

export const { setUserAchievement } = AchievementSlice.actions

export default AchievementSlice.reducer;

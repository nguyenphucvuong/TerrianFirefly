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

export const startListeningAchieByID = ({ achie_id }) => (dispatch) => {
    if (!achie_id) return;

    //console.log('achie_id',achie_id);

    const followerQuery = query(
        collection(db, "Achievements"),
        where("achie_id", "==", achie_id)
    );
    const unsubscribe = onSnapshot(followerQuery, (querySnapshot) => {
        // const followers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // const followers = querySnapshot.docs.map(doc => ({ ...doc.data() }));
        const achieById = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };
        //console.log("userById00", userById)
        dispatch(setAchieById(achieById));

        // console.log("followers", followers)
    }, (error) => {
        console.error('Error fetching follower: ', error);
    });

    return unsubscribe; // Trả về hàm unsubscribe để có thể dừng lắng nghe khi cần
};
// Tạo slice cho Post
export const AchievementSlice = createSlice({
    name: 'achievement',
    initialState,
    reducers: {
        // setUserAchievement: (state, action) => {
        //     state.userAchievement = action.payload;
        //     state.errorUser = null; // Reset lỗi khi có dữ liệu người dùng mới
        // },
        setAchieById: (state, action) => {
            state[action.payload.achie_id] = action.payload;
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
            // .addCase(getUserAchievement.fulfilled, (state, action) => {
            //     state.userAchievement = action.payload; // Cập nhật danh sách
            //     state.statusAchievement = 'succeeded'; // Đánh dấu thành công
            // })
            // .addCase(getUserAchievement.pending, (state) => {
            //     state.statusAchievement = 'loading'; // Đánh dấu trạng thái đang tải
            // })
            // .addCase(getUserAchievement.rejected, (state, action) => {
            //     state.error = action.error.message; // lưu lỗi
            //     state.statusAchievement = 'failed'; // Đánh dấu không thành công
            // });

    },
});

export const { setUserAchievement, setAchieById } = AchievementSlice.actions

export default AchievementSlice.reducer;

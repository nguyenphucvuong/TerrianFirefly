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
export const getAchievement = () => (dispatch) => {

    const achieveRef = collection(db, "Achievements");
    const achieveQuery = query(achieveRef, orderBy('level')); // sắp xếp tăng dần theo level

    const unsubscribe = onSnapshot(achieveQuery, (querySnapshot) => {

        // Lấy tất cả các tài liệu từ querySnapshot và chuyển thành mảng
        const achievementData = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Lấy id của tài liệu
            ...doc.data(), // Lấy dữ liệu của tài liệu
        }));

        dispatch(setAchievement(achievementData));


    }, (error) => {
        console.error('Error fetching achievementData: ', error);
    });
    return unsubscribe;

};
export const startListeningAchieByID = ({ achie_id }) => (dispatch) => {
    if (!achie_id) return;

    //console.log('achie_id',achie_id);

    const achieQuery = query(
        collection(db, "Achievements"),
        where("achie_id", "==", achie_id)
    );
    const unsubscribe = onSnapshot(achieQuery, (querySnapshot) => {

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
        setAchievement: (state, action) => {
            state.achievement = action.payload;
            state.errorUser = null; // Reset lỗi khi có dữ liệu người dùng mới
        },
        setAchieById: (state, action) => {
            state[action.payload.achie_id] = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
    },
});

export const { setAchievement, setAchieById } = AchievementSlice.actions

export default AchievementSlice.reducer;

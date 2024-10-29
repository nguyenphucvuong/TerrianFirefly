import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, auth } from '../../firebase/FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

// Trạng thái ban đầu
const initialState = {
    user: [],
    statusUser: 'idle',
    errorUser: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getUser = createAsyncThunk('data/getUser', async (email) => {
    try {
        const q = query(collection(db, 'user'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        // console.log('querySnapshot',querySnapshot);
        
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        console.log('users',users);
        
        return users;
    } catch (err) {
        return err.message;
    }

});
// Tạo async thunk để cập nhật thông tin người dùng trong Firestore
export const updateUser = createAsyncThunk('user/updateUser', async (user) => {
    try {
        const userRef = doc(db, 'user', user.user_id); // Tham chiếu đến tài liệu người dùng

        // Cập nhật các trường trong tài liệu
        await updateDoc(userRef, {
            imgUser: user.imgUser,
            frame_user: user.frame_user,
            gender: user.gender,
            username: user.username, // Sử dụng user.username thay vì chỉ username
        });

        // Lấy lại thông tin người dùng đã được cập nhật từ Firestore
        const updatedSnap = await getDoc(userRef);
        if (updatedSnap.exists()) {
            return {
                id: updatedSnap.id,
                ...updatedSnap.data(),
            };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
}
);


// Tạo slice cho user
export const UserSlices = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Xử lý khi lấy dữ liệu thành công
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload; // Cập nhật danh sách
                state.statusUser = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(getUser.pending, (state) => {
                state.statusUser = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(getUser.rejected, (state, action) => {
                state.errorUser = action.error.message; // Lưu lỗi nếu quá trình lấy thất bại
                state.statusUser = 'failed'; // Đánh dấu thất bại
            })
            // Xử lý khi thêm dữ liệu thành công
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user.push(action.payload); // Thêm dữ liệu mới vào state
                state.status = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.error.message; // Lưu lỗi nếu quá trình thêm thất bại
                state.status = 'failed'; // Đánh dấu thất bại
            })

    },
});

// export const { sethashtag } = UserSlice.actions

export default UserSlices.reducer;

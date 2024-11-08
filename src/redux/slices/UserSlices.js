import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, auth } from '../../firebase/FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

// Trạng thái ban đầu
const initialState = {
    user: null,
    userByField: {},
    statusUser: 'idle',
    errorUser: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getUser = createAsyncThunk('data/getUser', async (email) => {
    try {
        const q = query(collection(db, 'user'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        // const posts = querySnapshot.docs.map(doc => ({
        //     id: doc.id,
        //     ...doc.data(),
        // }));

        const posts = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };

        return posts;
    } catch (err) {
        return err.message;
    }

});
// Tạo async thunk để cập nhật thông tin người dùng trong Firestore
// export const updateUser = createAsyncThunk('user/updateUser', async (user) => {
//     try {
//         const userRef = doc(db, 'user', user.user_id); // Tham chiếu đến tài liệu người dùng

//         // Cập nhật các trường trong tài liệu
//         await updateDoc(userRef, {
//             imgUser: user.imgUser,
//             frame_user: user.frame_user,
//             gender: user.gender,
//             username: user.username, // Sử dụng user.username thay vì chỉ username
//         });

//         // Lấy lại thông tin người dùng đã được cập nhật từ Firestore
//         const updatedSnap = await getDoc(userRef);
//         if (updatedSnap.exists()) {
//             return {
//                 id: updatedSnap.id,
//                 ...updatedSnap.data(),
//             };
//         } else {
//             throw new Error('User not found');
//         }
//     } catch (error) {
//         console.error('Error adding document: ', error);
//         throw error;
//     }
// }
// );

export const updateUser = createAsyncThunk('user/updateUser',
    async ({ user_id, field, value }, { getState, dispatch }) => {
        try {
            const userRef = doc(db, 'user', user_id); // Tham chiếu đến tài liệu người dùng

            // Cập nhật các trường trong tài liệu
            await updateDoc(userRef, {
                [field]: value,
            });

            // Lấy lại thông tin người dùng đã được cập nhật từ Firestore
            const updatedSnap = await getDoc(userRef);
            console.log("updatedSnap", updatedSnap.data());
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



export const getUserByField = createAsyncThunk('data/getUserByField', async ({ user_id }) => {
    try {
        const queryDoc = query(collection(db, 'user'), where('user_id', '==', user_id));
        const querySnapshot = await getDocs(queryDoc);

        if (querySnapshot.empty) {
            return null; // No user found
        }

        // const userById = querySnapshot.docs.map(doc => ({
        //     id: doc.id,
        //     ...doc.data(),
        // }));
        const userById = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };
        // console.log("userById", userById);

        return { user_id, userById };
    } catch (error) {
        console.error('Error fetching user: ', error);
        throw error; // Just return the error message
    }
});

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
                // console.log("action.payload", action.payload);
                // console.log("state.user", state.user);
                state.statusUser = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(getUser.pending, (state) => {
                state.statusUser = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(getUser.rejected, (state, action) => {
                state.errorUser = action.error.message; // Lưu lỗi nếu quá trình lấy thất bại
                state.statusUser = 'failed'; // Đánh dấu thất bại
            })

            // getUserByField
            // .addCase(getUserByField.fulfilled, (state, action) => {
            //     state.userByField = action.payload.userById;
            //     // console.log("userByField", state.userByField);
            // })
            .addCase(getUserByField.fulfilled, (state, action) => {
                const { user_id, userById } = action.payload;
                state[user_id] = userById;
            })
            .addCase(getUserByField.pending, (state) => {
            })
            .addCase(getUserByField.rejected, (state, action) => {
                state.errorUser = action.error.message;
            })

            // updateUser
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.statusUser = 'succeeded';
            })
            .addCase(updateUser.pending, (state) => {
                state.statusUser = 'loading';
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.errorUser = action.error.message;
                state.statusUser = 'failed';
            })
    },
});

// export const { sethashtag } = UserSlice.actions

export default UserSlices.reducer;

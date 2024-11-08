import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, auth, storage} from '../../firebase/FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
    user: null,
    // userByField: {},
    statusUser: 'idle',
    errorUser: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getUser = createAsyncThunk('data/getUser', async (email) => {
    try {
        const q = query(collection(db, 'user'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const posts = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };

        return posts;
    } catch (err) {
        return err.message;
    }

});
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


        return userById;
    } catch (error) {
        console.error('Error fetching user: ', error);
        throw error; // Just return the error message
    }
});

// // Tạo async thunk để cập nhật dữ liệu Firestore
export const updateUser = createAsyncThunk('data/upDateUser', async ({ user_id, newData }) => {

    try {
        if (!user_id) {
            throw new Error("User ID is required.");
        }
        
        const userDocRef = doc(collection(db, "user"), user_id);
        await updateDoc(userDocRef, newData);
        console.log("User updated!");
        
        //Alert.alert("Thành công", "Đã cập nhật Firestore.");
    } catch (error) {
        console.error("Error updating user:", error);
        //Alert.alert("Lỗi", "Không thể cập nhật.");
    }
});

// Tạo async thunk để upload ảnh
export const uploadImage = createAsyncThunk('data/uploadImage', async ({ imgUser, setUploadProgress }, { rejectWithValue }) => {
    try {
        const response = await fetch(imgUser);
        const blob = await response.blob();
        const imgRef = ref(storage, `avatar/${imgUser.split("/").pop()}`);
        const uploadTask = uploadBytesResumable(imgRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Upload failed', error);
                    reject(error);
                },
                async () => {
                    const imgUrl = await getDownloadURL(imgRef);
                    console.log('File available at', imgUrl);
                    blob.close();
                    resolve(imgUrl);
                }
            );
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        return rejectWithValue(error.message);
    }
});

export const updateUserPassword = createAsyncThunk('data/updateUserPassword', async ({ userId, newPassWord }) => {
    try {
        const userRef = doc(db, 'user', userId); // Tạo tham chiếu đến tài liệu của người dùng trong Firestore
        await updateDoc(userRef, {
            passWord: newPassWord, // Cập nhật trường passWord với mật khẩu mới
        });

        return { userId, newPassWord }; // Trả về userId và mật khẩu mới sau khi cập nhật thành công
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// Tạo slice cho user
export const UserSlices = createSlice({
  name: "user",
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
            .addCase(getUserByField.fulfilled, (state, action) => {
                // const userId = action.payload[0]?.id; // Giả định rằng action.payload là mảng người dùng
                // if (userId && !state.userByField[userId]) {
                //     state.userByField[userId] = action.payload[0]; // Lưu người dùng vào state
                // }
                state.userByField = action.payload;
            })
            .addCase(getUserByField.pending, (state) => {
            })
            .addCase(getUserByField.rejected, (state, action) => {
                state.errorUser = action.error.message;
            })
            //updateUser
            .addCase(updateUser.fulfilled, (state, action) => {
                // const userId = action.payload[0]?.id; // Giả định rằng action.payload là mảng người dùng
                // if (userId && !state.userByField[userId]) {
                //     state.userByField[userId] = action.payload[0]; // Lưu người dùng vào state
                // }
                state.userByField = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.errorUser = action.error.message;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                // Update state or user with the new image URL if needed
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.errorUser = action.payload;
            });

    },
});

// export const { sethashtag } = UserSlice.actions

export default UserSlices.reducer;

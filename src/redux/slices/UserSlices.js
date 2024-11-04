import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, auth, storage } from '../../firebase/FirebaseConfig';
import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
    user: null,
    userByField: {},
    statusUser: 'idle',
    errorUser: null,
};

// Thiết lập listener thời gian thực cho dữ liệu người dùng
export const listenToUserRealtime = (email) => (dispatch) => {
    const q = query(collection(db, 'user'), where('email', '==', email));

    const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
            if (!querySnapshot.empty) {
                const userData = {
                    id: querySnapshot.docs[0].id,
                    ...querySnapshot.docs[0].data(),
                };
                dispatch(setUser(userData));
            }
        },
        (error) => {
            console.error('Error in realtime listener:', error);
            dispatch(setError(error.message));
        }
    );

    return unsubscribe; // Trả về hàm unsubscribe để có thể ngừng listener khi không cần thiết
};

// Tạo async thunk để lấy dữ liệu người dùng
export const getUser = createAsyncThunk('data/getUser', async (email, { rejectWithValue }) => {
    try {
        const q = query(collection(db, 'user'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) throw new Error('No user found');

        return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// Tạo async thunk để lấy người dùng theo trường
export const getUserByField = createAsyncThunk('data/getUserByField', async ({ user_id }, { rejectWithValue }) => {
    try {
        const queryDoc = query(collection(db, 'user'), where('user_id', '==', user_id));
        const querySnapshot = await getDocs(queryDoc);
        if (querySnapshot.empty) return null;

        return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };
    } catch (error) {
        console.error('Error fetching user: ', error);
        return rejectWithValue(error.message);
    }
});

// Tạo async thunk để cập nhật người dùng
export const updateUser = createAsyncThunk('data/updateUser', async ({ user_id, newData }, { rejectWithValue }) => {
    try {
        const userDocRef = doc(db, "user", user_id);
        await updateDoc(userDocRef, newData);
        console.log("User updated!");
        return newData; // Trả về dữ liệu mới đã cập nhật
    } catch (error) {
        console.error("Error updating user:", error);
        return rejectWithValue(error.message);
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

// Tạo slice cho user
export const UserSlices = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.errorUser = null; // Reset lỗi khi có dữ liệu người dùng mới
        },
        setError: (state, action) => {
            state.errorUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.statusUser = 'succeeded';
            })
            .addCase(getUser.pending, (state) => {
                state.statusUser = 'loading';
            })
            .addCase(getUser.rejected, (state, action) => {
                state.errorUser = action.payload;
                state.statusUser = 'failed';
            })
            .addCase(getUserByField.fulfilled, (state, action) => {
                if (action.payload) {
                    state.userByField[action.payload.id] = action.payload;
                }
            })
            .addCase(getUserByField.rejected, (state, action) => {
                state.errorUser = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.userByField[action.payload.id] = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.errorUser = action.payload;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                // Update state or user with the new image URL if needed
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.errorUser = action.payload;
            });
    },
});

export const { setUser, setError } = UserSlices.actions;

export default UserSlices.reducer;

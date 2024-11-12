import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
  background: [],
  statusBackground: 'idle',
  error: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getBackground = createAsyncThunk('data/getBackground', async () => {
  try {
    const backgroundRef = collection(db, "Background");
    const q = query(backgroundRef, orderBy('level')); // sắp xếp tăng dần theo level

    const querySnapshot = await getDocs(q);
    const backgroundData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return backgroundData;
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});

// Tạo slice cho Post
export const BackgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Xử lý khi lấy dữ liệu thành công
      .addCase(getBackground.fulfilled, (state, action) => {
        state.background = action.payload; // Cập nhật danh sách
        state.statusBackground = 'succeeded'; // Đánh dấu thành công
      })
      .addCase(getBackground.pending, (state) => {
        state.statusBackground = 'loading'; // Đánh dấu trạng thái đang tải
      })
      .addCase(getBackground.rejected, (state, action) => {
        state.error = action.error.message; // lưu lỗi
        state.statusBackground = 'failed'; // Đánh dấu không thành công
      });

  },
});

// export const { setPost } = PostSlice.actions

export default BackgroundSlice.reducer;

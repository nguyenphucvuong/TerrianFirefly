import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
  nickname: [],
  statusNickname: 'idle',
  error: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getNickname = createAsyncThunk('data/getNickname', async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Nickname"));
    querySnapshot.forEach((doc) => {
      console.log(`Nickname: ${doc.id} => `, doc.data());
    });
    //const querySnapshot = await getDocs(collection(db, "Posts")); // Thay "Posts" bằng tên bộ sưu tập của bạn
    const nicknameData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Lấy dữ liệu và ID của từng tài liệu

    //console.log("Danh sách post: ",postData[0].imgPost);
    return nicknameData; // Trả về danh sách bài đăng
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});

// Tạo slice cho Post
export const NicknameSlice = createSlice({
  name: 'nickname',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Xử lý khi lấy dữ liệu thành công
      .addCase(getNickname.fulfilled, (state, action) => {
        state.nickname = action.payload; // Cập nhật danh sách
        state.statusNickname = 'succeeded'; // Đánh dấu thành công
      })
      .addCase(getNickname.pending, (state) => {
        state.statusNickname = 'loading'; // Đánh dấu trạng thái đang tải
      })
      .addCase(getNickname.rejected, (state, action) => {
        state.error = action.error.message; // lưu lỗi
        state.statusNickname = 'failed'; // Đánh dấu không thành công
      });

  },
});

// export const { setPost } = PostSlice.actions

export default NicknameSlice.reducer;

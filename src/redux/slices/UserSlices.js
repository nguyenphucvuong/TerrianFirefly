import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../firebase/FirebaseConfig";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

// Trạng thái ban đầu
const initialState = {
  user: [],
  statusUser: "idle",
  errorUser: null,
};

// Tạo async thunk để lấy dữ liệu từ Firestore bằng email
export const getUser = createAsyncThunk("data/getUser", async (email) => {
  try {
    const q = query(collection(db, "user"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (err) {
    return err.message;
  }
});

// Tạo async thunk để cập nhật dữ liệu Firestore
export const updateUser = createAsyncThunk(
  "data/updateUser",
  async ({ userId, newData }, { rejectWithValue }) => {
    const userRef = doc(collection(db, "user"), userId);
    try {
      // Cập nhật dữ liệu trong Firestore
      await updateDoc(userRef, newData);
      return { userId, newData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
        state.statusUser = "succeeded"; // Đánh dấu thành công
      })
      .addCase(getUser.pending, (state) => {
        state.statusUser = "loading"; // Đánh dấu trạng thái đang tải
      })
      .addCase(getUser.rejected, (state, action) => {
        state.errorUser = action.error.message; // Lưu lỗi nếu quá trình lấy thất bại
        state.statusUser = "failed"; // Đánh dấu thất bại
      })
      //Xử lý update data mới
      // Khi `updateUser` đang trong quá trình chạy (pending)
      .addCase(updateUser.pending, (state) => {
        state.loading = true;  // Bật trạng thái loading
        state.error = null;    // Xóa lỗi trước đó (nếu có)
      })
      // Khi `updateUser` thành công (fulfilled)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;  // Tắt trạng thái loading
        // Cập nhật người dùng với dữ liệu mới trong Redux store
        state.users[action.payload.userId] = action.payload.newData;
      })
      // Khi `updateUser` thất bại (rejected)
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;  // Tắt trạng thái loading
        state.error = action.payload;  // Ghi lại lỗi
      });
  },
});

// export const { sethashtag } = UserSlice.actions

export default UserSlices.reducer;

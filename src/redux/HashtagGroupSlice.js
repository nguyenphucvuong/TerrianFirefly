import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  limit,
  orderBy,
  where,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";

const initialState = {
  hashtagGroup: [],
};

export const createHashtagGroup = createAsyncThunk(
    "data/createHashtagGroup",
    async (newData) => {
      try {
        // Tạo ID tài liệu bằng cách kết hợp HashtagID và UserID
        const idDoc = newData.HashtagID +"-"+ newData.UserID;
  
        // Tạo tham chiếu tới tài liệu với ID tùy chỉnh
        const docRef = doc(collection(db, "HashtagGroup"), idDoc);
  
        // Thiết lập dữ liệu tài liệu
        await setDoc(docRef, newData);
  
        // Trả về dữ liệu của thông báo vừa tạo
        return { noti_id: idDoc, ...newData };
      } catch (error) {
        console.error("Error adding or updating document: ", error);
        throw error;
      }
    }
  );

// Hàm xóa thông báo
export const deleteHashtagGroup = createAsyncThunk(
  "data/deleteHashtagGroup",
  async ({ hashtagGroupID }) => {
    console.log("id group trong slice: ", hashtagGroupID)
    try {
      if (!hashtagGroupID) {
        throw new Error("Invalid hashtagGroupID: null or undefined");
      }
      const notiRef = doc(db, "HashtagGroup", hashtagGroupID);
      await deleteDoc(notiRef);
      console.log("Document deleted successfully");
      return hashtagGroupID;
    } catch (error) {
      console.error("Error deleting notification: ", error);
      throw error;
    }
  }
);

// Tạo hàm lấy danh sách tất cả thông báo
export const getAllHashtagGroup = (dispatch) => {
  // Tạo truy vấn để lấy 10 thông báo mới nhất
  const notiQuery = query(collection(db, "HashtagGroup"));

  // Đăng ký lắng nghe thay đổi dữ liệu
  const unsubscribe = onSnapshot(notiQuery, (querySnapshot) => {
    const notiList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Cập nhật thông báo vào Redux store
    dispatch(setAllHashtagGroup(notiList));
  });

  return unsubscribe; // Trả về hàm hủy đăng ký lắng nghe
};

export const HashtagGroupSlice = createSlice({
  name: "hashtagGroup",
  initialState,
  reducers: {
    setAllHashtagGroup: (state, action) => {
      state.hashtagGroup = action.payload;
    },
  },
  extraReducers: (builder) => {},
});
export const { setAllHashtagGroup } = HashtagGroupSlice.actions;
export default HashtagGroupSlice.reducer;

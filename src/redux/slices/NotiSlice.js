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
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";

const initialState = {
  noti: [],
};

export const createNoti = createAsyncThunk(
  "data/createNoti",
  async (newData) => {
    try {
      // Thêm tài liệu vào Firestore
      const docRef = await addDoc(collection(db, "Noti"), newData);

      if (!docRef.id) {
        throw new Error("Document reference does not have a valid ID");
      }

      // Cập nhật `noti_id` ngay sau khi thêm
      await updateDoc(docRef, {
        noti_id: docRef.id,
      });

      console.log("Document updated successfully with ID:", docRef.id);

      // Trả về dữ liệu của thông báo vừa tạo
      return { noti_id: docRef.id, ...newData };
    } catch (error) {
      console.error("Error adding or updating document: ", error);
      throw error;
    }
  }
);

//tạo 1 hàm lấy danh sách các thông báo bằng trường targetUser_id phù hợp
export const getNoti = (dispatch, targetUser_id) => {
  const q = query(
    collection(db, "Noti"),
    where("targetUser_id", "==", targetUser_id),
    orderBy("created_at", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const notiList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log("l",notiList)
    dispatch(setNotifications(notiList));
  });

  return unsubscribe; // Trả về hàm hủy
};

//tạo 1 hàm update trạng thái checked
export const updateNotiByField = createAsyncThunk(
  "data/updateNotiByField",
  async ({ notiID, field, value }) => {
    try {
      // Tạo tham chiếu đến tài liệu trong Firestore
      const notiRef = doc(db, "Noti", notiID);

      // Cập nhật trường cụ thể bằng cách sử dụng [field] để cập nhật trường động
      await updateDoc(notiRef, {
        [field]: value,
      });

      console.log(`Field '${field}' updated successfully with value: ${value}`);
      return { notiID, field, value }; // Return necessary data for updating the state
    } catch (error) {
      console.error("Error updating notification: ", error);
      throw error;
    }
  }
);

export const NotiSlice = createSlice({
  name: "noti",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.noti = action.payload;
    },
  },
  extraReducers: (builder) => {
  },
});
export const { setNotifications } = NotiSlice.actions;
export default NotiSlice.reducer;

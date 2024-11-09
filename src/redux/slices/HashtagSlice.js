import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection, addDoc, getDoc, getDocs, setDoc, doc,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig"; // Firebase config
import { storage } from "../../firebase/FirebaseConfig"; // Firebase config
// Trạng thái ban đầu
const initialState = {
  hashtag: [],
  statusHashtag: "idle",
  errorHashtag: null,
};

const addHashtag = async (hashtagData, hashtagId) => {
  try {
    const docRef = doc(db, "Hashtag", hashtagId); // Sử dụng hashtagId để làm ID tài liệu
    await setDoc(docRef, hashtagData);
    return { id: hashtagId, ...hashtagData }; // Trả về kết quả với ID vừa thêm
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Tạo async thunk để thêm dữ liệu lên Firestore
export const createHashtag = createAsyncThunk(
  "data/createHashtag",
  async (newData) => {
    try {
      const addedHashtags = [];

      // Lặp qua từng phần tử trong mảng
      for (const hashtag of newData) {
        const formattedHashtag = {
          hashtag_id: hashtag,
          hashtag_background: "#ffff",
          // hashtag_color: "#000",
          hashtag_avatar: "default",
          role_id: "user",
        };

        // Gọi hàm thêm hashtag vào Firebase Firestore và sử dụng hashtag_id làm customId
        const addedHashtag = await addHashtag(
          formattedHashtag,
          formattedHashtag.hashtag_id
        );

        // Thêm hashtag vừa được thêm vào mảng kết quả
        addedHashtags.push(addedHashtag);
      }

      // Trả về tất cả các hashtag vừa thêm
      return addedHashtags;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }
);

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getHashtag = createAsyncThunk("data/getHashtag", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Hashtag"));
    querySnapshot.forEach((doc) => {
      //console.log(`hashtag: ${doc.id} => `, doc.data());
    });
    //console.log('querysnap', querySnapshot);
    const hashTagData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })); // Lấy dữ liệu và ID của từng tài liệu
    return hashTagData;
  } catch (errorHashtag) {
    console.errorHashtag("ErrorHashtag fetching hashtag: ", errorHashtag);
    throw errorHashtag;
  }
});

// Tạo slice cho hashtag
export const HashtagSlice = createSlice({
  name: "hashtag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Xử lý khi thêm dữ liệu thành công
      .addCase(createHashtag.fulfilled, (state, action) => {
        state.hashtag.push(...action.payload); // Sử dụng spread operator để thêm nhiều hashtag vào state
        state.statusHashtag = "succeeded"; // Đánh dấu thành công
      })
      .addCase(createHashtag.pending, (state) => {
        state.statusHashtag = "loading"; // Đánh dấu trạng thái đang tải
      })
      .addCase(createHashtag.rejected, (state, action) => {
        state.error = action.error.message; // Lưu lỗi nếu quá trình thêm thất bại
        state.statusHashtag = "failed"; // Đánh dấu thất bại
      })

      // Xử lý khi lấy dữ liệu thành công
      .addCase(getHashtag.fulfilled, (state, action) => {
        state.hashtag = action.payload; // Cập nhật danh sách
        state.statusHashtag = "succeeded"; // Đánh dấu thành công
      })
      .addCase(getHashtag.pending, (state) => {
        state.statusHashtag = "loading"; // Đánh dấu trạng thái đang tải
      })
      .addCase(getHashtag.rejected, (state, action) => {
        state.errorHashtag = action.errorHashtag.message; // lưu lỗi
        state.statusHashtag = "failed"; // Đánh dấu không thành công
      });
  },
});

// export const { sethashtag } = hashtagSlice.actions

export default HashtagSlice.reducer;

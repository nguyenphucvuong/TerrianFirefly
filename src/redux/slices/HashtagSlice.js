import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  doc,
  query,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig"; // Firebase config
import { storage } from "../../firebase/FirebaseConfig"; // Firebase config
// Trạng thái ban đầu
const initialState = {
  hashtag: [],
  statusHashtag: "idle",
  errorHashtag: null,
  isDeleting: false, // Thêm trạng thái cho việc xóa
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
          hashtag_color: "#000",
          hashtag_avatar: "default",
          role_id: "0",
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

// Tạo async thunk để thêm hashtag với custom ID vào Firestore
export const addHashtagToFirestore = createAsyncThunk(
  "hashtag/addHashtag",
  async (hashtagData, { rejectWithValue }) => {
    try {
      const { hashtag_id, hashtag_avatar, ...otherData } = hashtagData;

      // Kiểm tra nếu hashtag_avatar không có giá trị, đặt giá trị mặc định là "default"
      const finalAvatar = hashtag_avatar || "default";

      // Chuẩn bị dữ liệu để lưu, bao gồm cả hashtag_id và hashtag_avatar mặc định (nếu cần)
      const hashtagToSave = {
        hashtag_id, // Đảm bảo có trường hashtag_id trong Firestore
        hashtag_avatar: finalAvatar,
        ...otherData,
      };

      // Tạo document với custom ID là hashtag_id
      const docRef = doc(db, "Hashtag", hashtag_id);
      await setDoc(docRef, hashtagToSave); // Lưu dữ liệu vào Firestore

      // Trả về dữ liệu vừa thêm vào
      return { id: hashtag_id, ...hashtagToSave };
    } catch (error) {
      console.error("Error adding hashtag: ", error);
      return rejectWithValue(error.message);
    }
  }
);

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore và lắng nghe thay đổi
// export const fetchHashtags = createAsyncThunk(
//   "hashtag/fetchHashtags",
//   async (_, { rejectWithValue }) => {
//     return new Promise((resolve, reject) => {
//       const unsubscribe = onSnapshot(
//         collection(db, "Hashtag"),
//         (querySnapshot) => {
//           const hashtags = [];
//           querySnapshot.forEach((doc) => {
//             hashtags.push({ id: doc.id, ...doc.data() });
//           });
//           resolve(hashtags);
//         },
//         (error) => {
//           reject(rejectWithValue(error));
//         }
//       );

//       return unsubscribe; // Đảm bảo trả về unsubscribe
//     });
//   }
// );

// Thunk để xóa hashtag từ Firestore
export const deleteHashtagFromFirestore = createAsyncThunk(
  "hashtag/deleteHashtagFromFirestore",
  async (hashtag_id, { rejectWithValue }) => {
    try {
      // Xóa tài liệu từ Firestore dựa trên hashtag_id
      const docRef = doc(db, "Hashtag", hashtag_id);
      await deleteDoc(docRef);
      return hashtag_id; // Trả về hashtag_id để cập nhật state trong reducer
    } catch (error) {
      console.error("Error deleting hashtag:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const getHashtag = (dispatch) => {
  try {
    const q = query(collection(db, "Hashtag"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const hashtagData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("eventdata", hashtagData);
      dispatch(sethashtag(hashtagData));
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up real-time event listener: ", error);
  }
};

// Tạo slice cho hashtag
export const HashtagSlice = createSlice({
  name: "hashtag",
  initialState,
  reducers: {
    sethashtag: (state, action) => {
      state.hashtag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const { sethashtag } = HashtagSlice.actions;

export default HashtagSlice.reducer;

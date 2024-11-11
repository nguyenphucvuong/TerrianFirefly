import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  doc,
  query,
  onSnapshot,
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

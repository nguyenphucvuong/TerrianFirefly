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
  where,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig"; // Firebase config
import { storage } from "../../firebase/FirebaseConfig"; // Firebase config
// Trạng thái ban đầu
const initialState = {
  hashtag: [],
  members: 0,
  postCount: 0,
  specical: [],
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
export const startListeningMembers = ({ currentUserId }) => (dispatch) => {
  if (!currentUserId) return;

  // Lấy danh sách Hashtag mà người dùng hiện tại tham gia
  const hashtagQuery = query(
    collection(db, "HashtagGroup"),
    where("UserID", "==", currentUserId)
  );

  const unsubscribe = onSnapshot(
    hashtagQuery,
    async (querySnapshot) => {
      if (!querySnapshot.empty) {
        // Lấy tất cả HashtagID mà người dùng tham gia
        const hashtagIds = querySnapshot.docs.map((doc) => doc.data().HashtagID);
        //console.log("hashtagIds:", hashtagIds);

        if (hashtagIds.length > 0) {
          // Lấy toàn bộ số lượng người tham gia cho từng HashtagID
          const memberCountsPromises = hashtagIds.map(async (hashtagId) => {
            const countQuery = query(
              collection(db, "HashtagGroup"),
              where("HashtagID", "==", hashtagId)
            );
            const countSnapshot = await getDocs(countQuery);
            return { hashtagId, count: countSnapshot.size }; // Trả về số lượng
          });

          // Chờ tất cả các promise hoàn thành
          const memberCounts = await Promise.all(memberCountsPromises);

          //console.log("memberCounts:", memberCounts);

          // Gửi dữ liệu số lượng thành viên vào Redux
          dispatch(setMembers(memberCounts));
        }
      }
    },
    (error) => {
      console.error("Error fetching Hashtag: ", error);
    }
  );

  return unsubscribe; // Trả về hàm unsubscribe để dừng lắng nghe
};
export const startListeningPostCount = ({ currentUserId }) => (dispatch) => {
  if (!currentUserId) return;

  // Lấy danh sách Hashtag mà người dùng hiện tại tham gia
  const hashtagQuery = query(
    collection(db, "HashtagGroup"),
    where("UserID", "==", currentUserId)
  );

  const unsubscribe = onSnapshot(
    hashtagQuery,
    async (querySnapshot) => {
      if (!querySnapshot.empty) {
        // Lấy tất cả HashtagID mà người dùng tham gia
        const hashtagIds = querySnapshot.docs.map((doc) => doc.data().HashtagID);
        //console.log("hashtagIds:", hashtagIds);

        if (hashtagIds.length > 0) {
          // Lấy toàn bộ số lượng người tham gia cho từng HashtagID
          const hashtagCountsPromises = hashtagIds.map(async (hashtag) => {
            const postQuery = query(
              collection(db, "Posts"),
              where("hashtag", "array-contains", hashtag) // Tìm bài viết chứa hashtag
            );
            const querySnapshot = await getDocs(postQuery);
            return {
              hashtag,
              count: querySnapshot.size, // Đếm số lượng bài viết
            };
          });

          // Chờ tất cả các truy vấn hoàn thành
          const hashtagCounts = await Promise.all(hashtagCountsPromises);

          //console.log("Số lượng bài viết theo hashtag:", hashtagCounts);

          // Gửi dữ liệu số lượng thành viên vào Redux
          dispatch(setPostCount(hashtagCounts));
        }
      }
    },
    (error) => {
      console.error("Error fetching Hashtag: ", error);
    }
  );

  return unsubscribe; // Trả về hàm unsubscribe để dừng lắng nghe
};


export const startListeningHashtags = () => (dispatch) => {
  const q = query(
    collection(db, "Hashtag"),
    where("role_id", "==", 1),
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const hashtagData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // hashtagData.forEach((hashtag) => {
    //   // console.log("hashtaghashtag", hashtag)
    //   // console.log("hashtaghashtaghashtag_id", hashtag.hashtag_id)
    //   dispatch(setHashtagSpecical({ hashtag: hashtag, hashtag_id: hashtag.hashtag_id }));
    // });
    dispatch(setHashtagSpecical(hashtagData));
  });
  return unsubscribe;
};

export const startListeningHashtagById = ({ hashtag_id }) => (dispatch) => {
  // console.log("hashtag_idhashtag_id", hashtag_id)
  const q = query(
    collection(db, "Hashtag"),
    // where("role_id", "==", 1),
    where("hashtag_id", "==", hashtag_id),
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const hashtagData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // hashtagData.forEach((hashtag) => {
    //   // console.log("hashtaghashtag", hashtag)
    //   // console.log("hashtaghashtaghashtag_id", hashtag.hashtag_id)
    //   dispatch(setHashtagSpecical({ hashtag: hashtag, hashtag_id: hashtag.hashtag_id }));
    // });
    // console.log("hashtagData", hashtagData)
    dispatch(setHashtagSpecicalById({ hashtag: hashtagData[0], hashtag_id: hashtag_id }));
  });
  return unsubscribe;
};


// Tạo slice cho hashtag
export const HashtagSlice = createSlice({
  name: "hashtag",
  initialState,
  reducers: {
    sethashtag: (state, action) => {
      state.hashtag = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setPostCount: (state, action) => {
      state.postCount = action.payload;
    },
    setHashtagSpecical: (state, action) => {
      // const { hashtag, hashtag_id } = action.payload;
      // // console.log("hashtaghashtag", hashtag)
      // // console.log("hashtaghashtaghashtag_id", hashtag_id)
      // state.specical[hashtag_id] = hashtag;
      // console.log(state.specical)
      state.specical = action.payload
      // console.log("specical", state.specical)
      state.status = 'succeeded';
    },
    setHashtagSpecicalById: (state, action) => {
      const { hashtag, hashtag_id } = action.payload;
      state[hashtag_id] = hashtag;
      state.status = 'succeeded';
    },

  },
  extraReducers: (builder) => {
    builder;
  },
});



export const { sethashtag, setMembers, setPostCount, setHashtagSpecical, setHashtagSpecicalById } = HashtagSlice.actions;


export default HashtagSlice.reducer;
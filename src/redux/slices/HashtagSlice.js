import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  doc,
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

const addHashtag = async (hashtagData, customId) => {
  try {
    const docRef = doc(db, "Hashtag", customId); // Sử dụng customId để làm ID tài liệu
    await setDoc(docRef, hashtagData);
    return { id: customId, ...hashtagData }; // Trả về kết quả với ID vừa thêm
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
export const fetchHashtags = createAsyncThunk(
  "hashtag/fetchHashtags",
  async (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        collection(db, "Hashtag"),
        (querySnapshot) => {
          const hashtags = [];
          querySnapshot.forEach((doc) => {
            hashtags.push({ id: doc.id, ...doc.data() });
          });
          resolve(hashtags);
        },
        (error) => {
          reject(rejectWithValue(error));
        }
      );

      return unsubscribe; // Đảm bảo trả về unsubscribe
    });
  }
);

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

// Hàm này thêm một hashtag vào Firebase Firestore
const addHashtagToFirebase = async (hashtag) => {
  try {
    // Thêm đối tượng hashtag vào Firestore
    const docRef = await addDoc(collection(db, "Hashtag"), hashtag);

    // Lấy tài liệu vừa thêm từ Firestore
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Trả về dữ liệu của tài liệu vừa thêm
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

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
      })
      //lấy dữ liệu và cập nhật nêu có thay đổi
      .addCase(fetchHashtags.fulfilled, (state, action) => {
        state.hashtags = action.payload; // Cập nhật danh sách
        state.statusHashtag = "succeeded"; // Đánh dấu thành công
      })
      .addCase(fetchHashtags.pending, (state) => {
        state.statusHashtag = "loading"; // Đánh dấu trạng thái đang tải
      })
      .addCase(fetchHashtags.rejected, (state, action) => {
        state.errorHashtag = action.error.message; // lưu lỗi
        state.statusHashtag = "failed"; // Đánh dấu không thành công
      })
      // Thêm hashtag thành công

      .addCase(addHashtagToFirestore.fulfilled, (state, action) => {
        state.hashtag.push(action.payload); // Cập nhật ngay lập tức trong state
        state.status = "succeeded";
      })
      .addCase(addHashtagToFirestore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addHashtagToFirestore.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      // Trong extraReducers
      .addCase(deleteHashtagFromFirestore.pending, (state) => {
        state.isDeleting = true; // Đánh dấu đang xóa
      })
      .addCase(deleteHashtagFromFirestore.fulfilled, (state, action) => {
        // Kiểm tra state.hashtags có tồn tại hay không
        if (state.hashtags) {
          state.hashtags = state.hashtags.filter(
            (hashtag) => hashtag.hashtag_id !== action.payload
          );
          state.isDeleting = false; // Đánh dấu đã xóa xong
        }
      })
      .addCase(deleteHashtagFromFirestore.rejected, (state, action) => {
        state.error = action.payload;
        state.isDeleting = false; // Đánh dấu đã xóa xong
      });
  },
});

// export const { sethashtag } = hashtagSlice.actions

export default HashtagSlice.reducer;

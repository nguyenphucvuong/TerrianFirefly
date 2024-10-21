import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
  hashtag: [],
  statusHashtag: 'idle',
  errorHashtag: null,
};


// Tạo async thunk để thêm dữ liệu lên Firestore
export const createHashtag = createAsyncThunk('data/createHashtag', async (newData) => {
  try {
    // Thêm dữ liệu mới vào Firestore
    const docRef = await addDoc(collection(db, 'Hashtag'), newData);

    // Lấy tài liệu vừa thêm từ Firestore
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Trả về dữ liệu của tài liệu vừa thêm
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('No such document!');
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
});

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getHashtag = createAsyncThunk('data/getHashtag', async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Hashtag"));
    querySnapshot.forEach((doc) => {
      console.log(`hashtag: ${doc.id} => `, doc.data());
    });
    //console.log('querysnap', querySnapshot);
    const hashTagData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Lấy dữ liệu và ID của từng tài liệu
    return hashTagData;
  } catch (errorHashtag) {
    console.errorHashtag('ErrorHashtag fetching hashtag: ', errorHashtag);
    throw errorHashtag;
  }
});

// Tạo slice cho hashtag
export const HashtagSlice = createSlice({
  name: 'hashtag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Xử lý khi thêm dữ liệu thành công
      .addCase(createHashtag.fulfilled, (state, action) => {
        state.hashtag.push(action.payload); // Thêm dữ liệu mới vào state
        state.statusHashtag = 'succeeded'; // Đánh dấu thành công
      })
      .addCase(createHashtag.pending, (state) => {
        state.statusHashtag = 'loading'; // Đánh dấu trạng thái đang tải
      })
      .addCase(createHashtag.rejected, (state, action) => {
        state.error = action.error.message; // Lưu lỗi nếu quá trình thêm thất bại
        state.statusHashtag = 'failed'; // Đánh dấu thất bại
      })

      // Xử lý khi lấy dữ liệu thành công
      .addCase(getHashtag.fulfilled, (state, action) => {
        state.hashtag = action.payload; // Cập nhật danh sách
        state.statusHashtag = 'succeeded'; // Đánh dấu thành công
      })
      .addCase(getHashtag.pending, (state) => {
        state.statusHashtag = 'loading'; // Đánh dấu trạng thái đang tải
      })
      .addCase(getHashtag.rejected, (state, action) => {
        state.errorHashtag = action.errorHashtag.message; // lưu lỗi
        state.statusHashtag = 'failed'; // Đánh dấu không thành công
      });

  },
});

// export const { sethashtag } = hashtagSlice.actions

export default HashtagSlice.reducer;

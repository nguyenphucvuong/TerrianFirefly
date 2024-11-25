import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
  background: [],
  statusBackground: 'idle',
  error: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getBackground = () => (dispatch) => {

  const backgroundRef = collection(db, "Background");
  const backgroundQuery = query(backgroundRef, orderBy('level')); // sắp xếp tăng dần theo level

  const unsubscribe = onSnapshot(backgroundQuery, (querySnapshot) => {

    // Lấy tất cả các tài liệu từ querySnapshot và chuyển thành mảng
    const backgrounds = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Lấy id của tài liệu
      ...doc.data(), // Lấy dữ liệu của tài liệu
    }));

    dispatch(setBackground(backgrounds));


  }, (error) => {
    console.error('Error fetching follower: ', error);
  });
  return unsubscribe;

};

// Tạo slice cho Post
export const BackgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {
    setBackground: (state, action) => {
      state.background = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

  },
});

export const { setBackground } = BackgroundSlice.actions

export default BackgroundSlice.reducer;

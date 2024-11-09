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
  event: [],
  statusEvent: "idle",
  errorEvent: null,
  eventByField: [],
  detaiEvent: null,
};

// Thiết lập listener realtime để lấy tất cả dữ liệu từ Firestore
export const fetchEvent = () => (dispatch) => {
  try {
    const q = query(collection(db, "Event"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("eventdata", eventData);
      dispatch(setEvent(eventData));
    });

    return unsubscribe; 
  } catch (error) {
    console.error("Error setting up real-time event listener: ", error);
  }
};

//tạo 1 hàm update trạng thái checked
export const updateEventByField = createAsyncThunk(
  "data/updateEventByField",
  async ({ eventID, field, value }) => {
    try {
      // Tạo tham chiếu đến tài liệu trong Firestore
      const notiRef = doc(db, "Event", eventID);

      // Cập nhật trường cụ thể bằng cách sử dụng [field] để cập nhật trường động
      await updateDoc(notiRef, {
        [field]: value,
      });

      return { eventID, field, value }; // Return necessary data for updating the state
    } catch (error) {
      console.error("Error updating notification: ", error);
      throw error;
    }
  }
);



const EventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvent: (state, action) => {
      state.event = action.payload;
    },
    // setEventByField: (state, action) => {
    //   state.eventByField = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const { setEvent, setEventByField } = EventSlice.actions;
export default EventSlice.reducer;

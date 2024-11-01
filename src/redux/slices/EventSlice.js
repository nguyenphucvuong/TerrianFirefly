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
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";
import { log } from "@tensorflow/tfjs";

const initialState = {
  event: [],
  statusEvent: "idle",
  errorEvent: null,
  eventByField: [],
  detaiEvent: null,
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getEvent = createAsyncThunk("data/getEvent", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Event"));
    const eventData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return eventData;
  } catch (error) {
    console.error("Error fetching event: ", error);
    throw error;
  }
});

export const getEventByField = createAsyncThunk(
  "data/getEventByField",
  async ({ fieldWhere, value }) => {
    try {
      if (!fieldWhere || !value) {
        throw new Error("fieldWhere and value are required");
      }
      // Chuyển value từ timestamp về Date
      const date = new Date(value);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0); // 00:00:00
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); // 23:59:59

      // Lấy thời gian dưới dạng mili giây
      const start = startOfDay.getTime();
      const end = endOfDay.getTime();

      // Tạo một truy vấn Firestore với where
      const e = query(
        collection(db, "Event"),
        where(fieldWhere, ">=", start),
        where(fieldWhere, "<=", end)
      );

      // Lấy tài liệu dựa trên truy vấn (query)
      const querySnapshot = await getDocs(e);

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return [];
      }

      // Map qua các tài liệu để lấy dữ liệu cần thiết
      const event = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });

      console.log("get event by field", event);
      return event;
    } catch (error) {
      console.error("Error fetching events: ", error);
      throw error;
    }
  }
);


// Tạo async thunk để thêm dữ liệu lên Firestore
export const createEvent = createAsyncThunk(
  "data/createEvent",
  async ({ newData }) => {
    try {
      // Thêm dữ liệu mới vào Firestore
      const docRef = await addDoc(collection(db, "Event"), newData);

      const response = await fetch(newData.url_game);
      const blob = await response.blob(); // Chuyển đổi URL thành blob

      const imgRef = ref(
        storage,
        `EventImage/${newData.url_game.split("/").pop()}`
      ); // Đặt tên cho ảnh
      await uploadBytes(imgRef, blob); // Tải lên ảnh

      // Lấy URL tải về
      const imgUrl = await getDownloadURL(imgRef);

      // Lấy tài liệu vừa thêm từ Firestore
      const docSnap = await getDoc(docRef);

      await updateDoc(docRef, {
        event_id: docRef.id,
        url_game: imgUrl,
      });

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
  }
);
export const EventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.fulfilled, (state, action) => {
        state.event.push(action.payload);
        state.statusEvent = "succeeded";
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.event = action.payload;
        state.statusEvent = "succeeded";
      })
      .addCase(getEvent.pending, (state) => {
        state.statusEvent = "loading";
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.errorEvent = action.error.message;
        state.statusEvent = "failed";
      })

      .addCase(getEventByField.fulfilled, (state, action) => {
        state.eventByField = action.payload;
        state.statusEvent = "succeeded";
      })
      .addCase(getEventByField.pending, (state) => {
        state.statusEvent = "loading";
      })
      .addCase(getEventByField.rejected, (state, action) => {
        state.errorEvent = action.error.message;
        state.statusEvent = "failed";
      });
  },
});

export default EventSlice.reducer;

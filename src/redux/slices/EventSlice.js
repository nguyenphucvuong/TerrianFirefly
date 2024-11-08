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
  doc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase/FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { log } from "@tensorflow/tfjs";

const initialState = {
  events: [],
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

      // const response = await fetch(newData.img_event);
      // const blob = await response.blob(); // Chuyển đổi URL thành blob

      // const imgRef = ref(
      //   storage,
      //   `EventImage/${newData.img_event.split("/").pop()}`
      // ); // Đặt tên cho ảnh
      // await uploadBytes(imgRef, blob); // Tải lên ảnh

      // // Lấy URL tải về
      // const imgUrl = await getDownloadURL(imgRef);

      // // Lấy tài liệu vừa thêm từ Firestore
      const docSnap = await getDoc(docRef);

      await updateDoc(docRef, {
        event_id: docRef.id,
        count_like: 0, // Giá trị mặc định cho số like
        count_view: 0,
        created_at: new Date().getTime(),
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

// Tạo async thunk để upload ảnh
export const uploadImage = createAsyncThunk(
  "data/uploadImage",
  async ({ imgEvent, setUploadProgress }, { rejectWithValue }) => {
    try {
      const response = await fetch(imgEvent);
      const blob = await response.blob();
      const imgRef = ref(storage, `Event/${imgEvent.split("/").pop()}`);
      const uploadTask = uploadBytesResumable(imgRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload failed", error);
            reject(error);
          },
          async () => {
            const imgUrl = await getDownloadURL(imgRef);
            console.log("File available at", imgUrl);
            blob.close();
            resolve(imgUrl);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thêm một sự kiện mới lên Firestore
export const addEvent = createAsyncThunk(
  "event/addEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      // Thêm sự kiện vào Firestore
      const eventRef = await addDoc(collection(db, "Event"), {
        ...eventData,
        count_like: 0, // Giá trị mặc định cho số like
        count_view: 0, // Giá trị mặc định cho số view
      });

      // Cập nhật trường `event_id` với ID tài liệu
      await updateDoc(doc(db, "Event", eventRef.id), {
        event_id: eventRef.id,
      });

      // Lấy dữ liệu sự kiện sau khi đã cập nhật `event_id`
      const eventSnapshot = await getDoc(eventRef);

      // Chuyển đổi `created_at` thành số milliseconds để dễ tuần tự hóa
      const eventDataWithSerializableDate = {
        id: eventRef.id,
        ...eventSnapshot.data(),
      };

      return eventDataWithSerializableDate;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Async thunk để lấy dữ liệu sự kiện theo thời gian thực từ Firestore
export const fetchEvents = () => (dispatch) => {
  const q = query(collection(db, "Event"));

  // Thiết lập listener (onSnapshot) cho Firestore
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        const eventData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(updateEvents(eventData)); // Gửi dữ liệu vào Redux state
      }
    },
    (error) => {
      console.error("Error in realtime listener:", error);
      dispatch(setError(error.message)); // Gửi lỗi vào Redux state
    }
  );

  // Trả về một đối tượng có thể tuần tự hóa (hoặc không trả gì nếu không cần thiết)
  return unsubscribe;
};

// Async thunk để cập nhật sự kiện đã có trên Firestore
// Tạo async thunk để cập nhật người dùng
export const updateEvent = createAsyncThunk(
  "data/updateEvent",
  async ({updatedEvent, event_id}, { rejectWithValue }) => {
    console.log(event_id);
    try {
      const eventDocRef = doc(collection(db, "Event"), event_id);
      console.log("eventDocRef", eventDocRef);
      await updateDoc(eventDocRef, updatedEvent);
      console.log("User updated!");
      return updatedEvent;
    } catch (error) {
      console.error("Error updating event: ", error);
      return rejectWithValue(error.message);
    }
  }
);
// Thunk để xóa Event từ Firestore
export const deleteEventFromFirestore = createAsyncThunk(
  "event/deleteEventFromFirestore",
  async (event_id, { rejectWithValue }) => {
    try {
      // Xóa tài liệu từ Firestore dựa trên hashtag_id
      const docRef = doc(db, "Event", event_id);
      await deleteDoc(docRef);
      return event_id; // Trả về hashtag_id để cập nhật state trong reducer
    } catch (error) {
      console.error("Error deleting Event:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const EventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    statusEvent: "idle", // Trạng thái của sự kiện
    errorEvent: null,
  },
  reducers: {
    updateEvents: (state, action) => {
      state.events = action.payload;
      state.errorEvent = null; // Reset lỗi khi có dữ liệu mới
    },
    setError: (state, action) => {
      state.errorEvent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      
  },
});

export const { updateEvents, setError } = EventSlice.actions;

export default EventSlice.reducer;

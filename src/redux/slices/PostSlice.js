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
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig"; // Firebase config
import { storage } from "../../firebase/FirebaseConfig"; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Trạng thái ban đầu
const initialState = {
  post: [],
  status: "idle",
  error: null,
  postByField: [],
};

// Tạo async thunk để thêm dữ liệu lên Firestore
export const createPost = createAsyncThunk(
  "data/createPost",
  async (newData) => {
    try {
      // Thêm dữ liệu mới vào Firestore
      const docRef = await addDoc(collection(db, "Posts"), newData);

      const imgUrls = [];

      // Tải lên từng ảnh trong imgPost
      for (const img of newData.imgPost) {
        const response = await fetch(img);
        const blob = await response.blob(); // Chuyển đổi URL thành blob

        const imgRef = ref(storage, `images/${img.split("/").pop()}`); // Đặt tên cho ảnh
        await uploadBytes(imgRef, blob); // Tải lên ảnh

        // Lấy URL tải về
        const imgUrl = await getDownloadURL(imgRef);
        imgUrls.push(imgUrl); // Lưu URL vào mảng
      }

      console.log(imgUrls);
      // Lấy tài liệu vừa thêm từ Firestore
      const docSnap = await getDoc(docRef);

      await updateDoc(docRef, {
        id: docRef.id,
        imgPost: imgUrls, // Lưu ID vào tài liệu
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

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getPosts = createAsyncThunk("data/getPosts", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Posts"));
    querySnapshot.forEach((doc) => {
      console.log(`post: ${doc.id} => `, doc.data());
    });
    //const querySnapshot = await getDocs(collection(db, "Posts")); // Thay "Posts" bằng tên bộ sưu tập của bạn
    const postData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })); // Lấy dữ liệu và ID của từng tài liệu

    //console.log("Danh sách post: ",postData[0].imgPost);
    return postData; // Trả về danh sách bài đăng
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
});

// lấy dữ liệu theo trường yêu cầu từ firestore
// lấy dữ liệu theo trường yêu cầu từ firestore
export const getPostsByField = createAsyncThunk(
  "data/getPostsByField",
  async ({ fieldOrderBy, quantity }) => {
    try {
      // Kiểm tra xem giá trị fieldOrderBy và quantity có hợp lệ không
      if (!fieldOrderBy || !quantity) {
        throw new Error("fieldOrderBy and quantity are required");
      }

      // Tạo một truy vấn Firestore với limit và orderBy
      const q = query(
        collection(db, "Posts"), // Collection "Posts"
        orderBy(fieldOrderBy, "desc"), // Sắp xếp theo trường yêu cầu
        limit(quantity) // Giới hạn số lượng tài liệu trả về
      );

      // Lấy tài liệu dựa trên truy vấn (query)
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return [];
      }

      // Map qua các tài liệu để lấy dữ liệu cần thiết
      const posts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Post data: ", data); // Debug xem dữ liệu có hợp lệ không
        return {
          id: doc.id,
          ...data,
        };
      });

      console.log("get by field", posts); // Debug để xem có dữ liệu nào không
      return posts;
    } catch (error) {
      console.error("Error fetching posts: ", error);
      throw error; // Ném lại lỗi để xử lý sau
    }
  }
);

// Tạo async thunk để xóa bài viết và ảnh liên quan
export const deletePostById = createAsyncThunk(
  "data/deletePostById",
  async (postId, { rejectWithValue }) => {
    try {
      // Lấy thông tin bài viết trước khi xóa
      const postDoc = await getDoc(doc(db, "Posts", postId));

      if (postDoc.exists()) {
        const postData = postDoc.data();

        // Nếu bài viết có ảnh, xóa ảnh khỏi Firebase Storage
        if (postData.imgPost && postData.imgPost.length > 0) {
          const deletePromises = postData.imgPost.map((imgUrl) => {
            const imgRef = ref(storage, `images/${imgUrl.split("/").pop()}`);
            return deleteObject(imgRef); // Xóa ảnh
          });

          // Thực hiện xóa ảnh
          await Promise.all(deletePromises);
        }

        // Xóa bài viết khỏi Firestore
        await deleteDoc(doc(db, "Posts", postId));
      } else {
        throw new Error("No such document!");
      }

      return postId; // Trả về ID của bài viết đã xóa
    } catch (error) {
      console.error("Error deleting post: ", error);
      return rejectWithValue(error.message);
    }
  }
);

// Tạo slice cho Post
export const PostSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý khi thêm dữ liệu thành công
      .addCase(createPost.fulfilled, (state, action) => {
        state.post.push(action.payload); // Thêm dữ liệu mới vào state
        state.status = "succeeded"; // Đánh dấu thành công
      })

      // Xử lý khi lấy dữ liệu thành công
      .addCase(getPosts.fulfilled, (state, action) => {
        state.post = action.payload; // Cập nhật danh sách bài đăng
        state.status = "succeeded"; // Đánh dấu thành công
      })

      // Xử lý khi lấy dữ liệu thành công
      .addCase(getPostsByField.fulfilled, (state, action) => {
        state.postByField = action.payload; // Cập nhật danh sách bài đăng
        state.status = "succeeded"; // Đánh dấu thành công
      })

      // Xử lý khi xóa dữ liệu thành công
      .addCase(deletePostById.fulfilled, (state, action) => {
        state.post = state.post.filter((post) => post.id !== action.payload); // Loại bỏ bài viết đã xóa
        state.status = "succeeded";
      });
  },
});

// export const { setPost } = PostSlice.actions

export default PostSlice.reducer;

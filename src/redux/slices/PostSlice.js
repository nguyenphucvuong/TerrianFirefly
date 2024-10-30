import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref,collection, addDoc, getDoc, getDocs, query, orderBy, limit, startAfter, doc, getCountFromServer, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
  post: [],
  lastVisiblePost: null,
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
        const blob = await response.blob(); // Chuyển đổi URL thành dạng nhị phân
        console.log("so nhi phan", blob);
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
        post_id: docRef.id,
        imgPost: imgUrls, // Lưu ID vào tài liệu
      });

      if (docSnap.exists()) {
        // Trả về dữ liệu của tài liệu vừa thêm
        return { post_id: docSnap.id, ...docSnap.data() };
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
export const getPostsFirstTime = createAsyncThunk('data/getPostsFirstTime', async () => {
  try {
    let postsQuery = query(
      collection(db, "Posts"),
      orderBy("created_at", "desc"),
      limit(3)
    );

    const querySnapshot = await getDocs(postsQuery);

    if (querySnapshot.empty) {
      return { posts: [], lastVisiblePost: null };

    }
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Thêm lượt xem mỗi khi duyệt qua bài viết
    querySnapshot.docs.forEach(async doc => {
      const currentCountView = doc.data().count_view || 0;
      await updateDoc(doc.ref, {
        count_view: currentCountView + 1
      });
    });

    return {
      postData: postData,
      lastVisiblePost: lastVisible ? lastVisible.id : null, // Serialize the last visible post
    }; // Return only the document ID for `lastVisiblePost`
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});

export const getPostsRefresh = createAsyncThunk('data/getPostsRefresh', async () => {
  try {
    let postsQuery = query(
      collection(db, "Posts"),
      orderBy("created_at", "desc"),
      limit(3)
    );

    const querySnapshot = await getDocs(postsQuery);

    if (querySnapshot.empty) {
      return { posts: [], lastVisiblePost: null };
    }

    querySnapshot.docs.forEach(async doc => {
      const currentCountView = doc.data().count_view || 0;
      await updateDoc(doc.ref, {
        count_view: currentCountView + 1
      });
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return {
      postData: postData,
      lastVisiblePost: lastVisible ? lastVisible.id : null, // Serialize the last visible post
    }; // Return only the document ID for `lastVisiblePost`
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});

export const getPostsByField = createAsyncThunk('data/getPostsByField', async ({ field, quantity }, { getState, dispatch }) => {

  try {
    const totalPostsCount = getState().post.totalPostsCount;
    // Chỉ lấy tổng số lượng bài viết một lần nếu chưa có
    if (totalPostsCount === 0) {
      const coll = collection(db, "Posts");
      const snapshot = await getCountFromServer(coll);
      const count = snapshot.data().count;
      dispatch(setTotalPostsCount(count)); // Cập nhật totalPostsCount trong Redux
    }

    const lastVisiblePostId = getState().post.lastVisiblePost;
    let lastVisibleDoc = null;
    if (lastVisiblePostId) {
      const lastVisibleDocRef = doc(db, "Posts", lastVisiblePostId);
      lastVisibleDoc = await getDoc(lastVisibleDocRef);
    }

    let postsQuery = query(
      collection(db, "Posts"),
      orderBy(field, "desc"),
      limit(quantity)
    );

    if (lastVisibleDoc) {
      postsQuery = query(
        collection(db, "Posts"),
        orderBy(field, "desc"),
        startAfter(lastVisibleDoc),
        limit(quantity)
      );
    }

    const querySnapshot = await getDocs(postsQuery);

    if (querySnapshot.empty) {
      return { postData: [], lastVisiblePost: null };
    }

    querySnapshot.docs.forEach(async doc => {
      const currentCountView = doc.data().count_view || 0;
      await updateDoc(doc.ref, {
        count_view: currentCountView + 1
      });
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      postData: postData,
      lastVisiblePost: lastVisible ? lastVisible.id : null, // Serialize the last visible post

    }; // Return only the document ID for `lastVisiblePost`
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});


export const updatePostsByField = createAsyncThunk(
  'data/updatePostsByField',
  async ({ postId, field, value }, { getState, dispatch }) => {
    try {
      // Tạo tham chiếu đến tài liệu trong Firestore
      const postRef = doc(db, "Posts", postId);

      // Cập nhật trường cụ thể
      await updateDoc(postRef, {
        [field]: value
      });

      console.log(`Field '${field}' updated successfully with value: ${value}`);

      // Bạn có thể dispatch thêm action nếu cần
      // dispatch(someAction(...));

    } catch (error) {
      console.error('Error updating post: ', error);
      throw error;
    }
  }
);


// Tạo slice cho Post
export const PostSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // Xử lý khi thêm dữ liệu thành công
      .addCase(createPost.fulfilled, (state, action) => {
        state.post.push(action.payload); // Thêm dữ liệu mới vào state
        state.status = 'succeeded'; // Đánh dấu thành công
      })
      .addCase(createPost.pending, (state) => {
        state.status = 'loading'; // Đánh dấu trạng thái đang tải
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message; // Lưu lỗi nếu quá trình thêm thất bại
        state.status = 'failed'; // Đánh dấu thất bại
      })

      // Xử lý khi lấy dữ liệu thành công
      .addCase(getPostsFirstTime.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload.postData;
        state.lastVisiblePost = action.payload.lastVisiblePost; // Lưu lại lastVisiblePost
        state.status = "succeeded";
      })
      .addCase(getPostsFirstTime.pending, (state) => {
        state.status = 'loading'; // Đánh dấu trạng thái đang tải
      })
      .addCase(getPostsFirstTime.rejected, (state, action) => {
        state.error = action.error.message; // Lưu lỗi nếu quá trình lấy thất bại
        state.status = 'failed'; // Đánh dấu thất bại
      })

      // getPostsByField
      .addCase(getPostsByField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsByField.fulfilled, (state, action) => {
        state.loading = false;
        state.post.push(...action.payload.postData); // Push dữ liệu mới vào mảng posts
        state.lastVisiblePost = action.payload.lastVisiblePost; // Lưu lại lastVisiblePost
        state.status = "succeeded"; // Đánh dấu thành công
      })
      .addCase(getPostsByField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // getPostsRefresh
      .addCase(getPostsRefresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsRefresh.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload.postData;
        state.lastVisiblePost = action.payload.lastVisiblePost; // Lưu lại lastVisiblePost
        state.status = "succeeded";
      })
      .addCase(getPostsRefresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const { } = PostSlice.actions

export default PostSlice.reducer;
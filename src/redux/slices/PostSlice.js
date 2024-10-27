import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
  post: [],
  lastVisiblePost: null,
  status: 'idle',
  error: null,
};

// Tạo async thunk để thêm dữ liệu lên Firestore
export const createPost = createAsyncThunk('data/createPost', async (newData) => {
  try {
    // Thêm dữ liệu mới vào Firestore
    const docRef = await addDoc(collection(db, 'Posts'), newData);

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
export const getPosts = createAsyncThunk('data/getPosts', async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Posts"),);
    querySnapshot.forEach((doc) => {
      // console.log(`post: ${doc.id} => `, doc.data());
    });
    //const querySnapshot = await getDocs(collection(db, "Posts")); // Thay "Posts" bằng tên bộ sưu tập của bạn
    const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Lấy dữ liệu và ID của từng tài liệu

    //console.log("Danh sách post: ",postData[0].imgPost);
    return postData; // Trả về danh sách bài đăng
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});

export const getPostsRefresh = createAsyncThunk('data/getPostsRefresh', async ({ field, quatity }) => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "Posts"), orderBy(field, "desc"), limit(quatity)));

    //const querySnapshot = await getDocs(collection(db, "Posts")); // Thay "Posts" bằng tên bộ sưu tập của bạn
    const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Lấy dữ liệu và ID của từng tài liệu

    //console.log("Danh sách post: ",postData[0].imgPost);
    return postData; // Trả về danh sách bài đăng
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});

export const getPostsByField = createAsyncThunk('data/getPostsByField', async ({ field, quantity }, { getState }) => {

  try {
    const lastVisiblePost = getState().post.lastVisiblePost;

    let postsQuery = query(
      collection(db, "Posts"),
      orderBy(field, "desc"),
      limit(quantity)
    );
    if (lastVisiblePost) {
      console.log(lastVisiblePost)
      postsQuery = query(
        collection(db, "Posts"),
        orderBy(field, "desc"),
        startAfter(lastVisiblePost),
        limit(quantity)
      );
    }

    const querySnapshot = await getDocs(postsQuery);

    if (querySnapshot.empty) {
      return { posts: [], lastVisiblePost: null };
    }

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      postData: postData,
      lastVisiblePost: lastVisible ? lastVisible : null, // Serialize the last visible post

    }; // Return only the document ID for `lastVisiblePost`
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
});



// Tạo slice cho Post
export const PostSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
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
      .addCase(getPosts.fulfilled, (state, action) => {
        state.post = action.payload; // Cập nhật danh sách bài đăng
        state.status = 'succeeded'; // Đánh dấu thành công
      })
      .addCase(getPosts.pending, (state) => {
        state.status = 'loading'; // Đánh dấu trạng thái đang tải
      })
      .addCase(getPosts.rejected, (state, action) => {
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
        state.post = action.payload;
        state.status = "succeeded";
      })
      .addCase(getPostsRefresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

// export const { setPost } = PostSlice.actions

export default PostSlice.reducer;

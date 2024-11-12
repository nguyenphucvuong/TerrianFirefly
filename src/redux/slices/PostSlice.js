import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  getCountFromServer,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig"; // Firebase config

// Trạng thái ban đầu
const initialState = {
  post: [],
  followerPost: [],
  currentPost: null,
  lastVisiblePost: null,
  lastVisiblePostFollower: null,
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

// Hàm để cập nhật số lượt xem cho bài viết
const updatePostViewCount = async (docs) => {
  await Promise.all(
    docs.map(async (doc) => {
      const currentCountView = doc.data().count_view || 0;
      await updateDoc(doc.ref, {
        count_view: currentCountView + 1,
      });
    })
  );
};

// Hàm lấy danh sách user ID đã được follow
const getFollowedUserIds = async ({ currentUserId }) => {
  const followerQuery = query(
    collection(db, "Follower"),
    where("follower_user_id", "==", currentUserId)
  );
  const followerSnapshot = await getDocs(followerQuery);
  // console.log("followerSnapshot", followerSnapshot.docs.map((doc) => doc.data().user_id));

  return followerSnapshot.docs.map((doc) => doc.data().user_id);
};

// Hàm chính để lấy bài viết mới
export const getPostsRefresh = createAsyncThunk(
  "data/getPostsRefresh",
  async ({ currentUserId, isFollow }) => {
    try {
      const followedUserIds = await getFollowedUserIds({ currentUserId: currentUserId });

      if (followedUserIds.length === 0 && isFollow) {
        return { postData: [], lastVisiblePost: null, isFollow: isFollow, };
      }

      let postsQuery = query(
        collection(db, "Posts"),
        orderBy("created_at", "desc"),
        limit("3")
      );
      if (followedUserIds.length > 0) {
        postsQuery = isFollow
          ? query(postsQuery, where("user_id", "in", followedUserIds))
          : query(postsQuery, where("user_id", "not-in", followedUserIds.slice(0, 10)));
      }

      const querySnapshot = await getDocs(postsQuery);

      if (querySnapshot.empty) {
        return { postData: [], lastVisiblePost: null };
      }
      await updatePostViewCount(querySnapshot.docs);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return {
        postData: postData,
        lastVisiblePost: lastVisible ? lastVisible.id : null,
        isFollow: isFollow,
      };
    } catch (error) {
      console.error("Error refreshing posts: ", error);
      throw error;
    }
  }
);

export const getPostsByField = createAsyncThunk(
  "data/getPostsByField",
  async ({ field, value }, { getState, dispatch }) => {
    try {

      const postQuery = query(
        collection(db, "Posts"),
        orderBy(field, "desc"),
        limit(1),
        where(field, "==", value)
      );

      const querySnapshot = await getDocs(postQuery);
      if (querySnapshot.empty) {
        return { postData: [], lastVisiblePost: null };
      }

      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return postData;

    } catch (error) {
      console.error("Error fetching posts by field: ", error);
      throw error;
    }
  }
);

export const getPostsFromUnfollowedUsers = createAsyncThunk(
  "data/getPostsFromUnfollowedUsers",
  async ({ field, quantity, currentUserId }, { getState }) => {
    try {
      const followedUserIds = await getFollowedUserIds({ currentUserId: currentUserId });

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

      // Lấy bài đăng từ những người dùng chưa được follow
      if (followedUserIds.length > 0) {
        postsQuery = query(
          postsQuery,
          where("user_id", "not-in", followedUserIds.slice(0, 10))
        );
      }

      if (lastVisibleDoc) {
        postsQuery = query(postsQuery, startAfter(lastVisibleDoc));
      }

      const querySnapshot = await getDocs(postsQuery);

      if (querySnapshot.empty) {
        return { postData: [], lastVisiblePost: null };
      }

      await updatePostViewCount(querySnapshot.docs);

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        postData: postData,
        lastVisiblePost: lastVisible ? lastVisible.id : null,
      };
    } catch (error) {
      console.error("Error fetching posts from unfollowed users: ", error);
      throw error;
    }
  }
);



// Hàm lấy bài đăng từ những người dùng đã được follow
export const getPostsFromFollowedUsers = createAsyncThunk(
  "data/getPostsFromFollowedUsers",
  async ({ field, quantity, currentUserId }, { getState }) => {
    try {


      // Lấy danh sách user ID đã được follow
      const followedUserIds = await getFollowedUserIds({ currentUserId: currentUserId });

      // Nếu không có user nào được follow, trả về mảng rỗng
      if (followedUserIds.length === 0) {
        return { postData: [], lastVisiblePost: null };
      }

      // Kiểm tra lastVisiblePostFollower để lấy bài đăng từ trang trước đó
      const lastVisiblePostId = getState().post.lastVisiblePostFollower;
      console.log("currentUserId", getState().post.lastVisiblePostFollower);
      let lastVisibleDoc = null;

      if (lastVisiblePostId) {
        const lastVisibleDocRef = doc(db, "Posts", lastVisiblePostId);
        lastVisibleDoc = await getDoc(lastVisibleDocRef);
      }

      // Tạo query lấy bài đăng từ những người dùng đã được follow
      let postsQuery = query(
        collection(db, "Posts"),
        orderBy(field, "desc"),
        limit(quantity),
        where("user_id", "in", followedUserIds)
      );

      if (lastVisibleDoc) {
        postsQuery = query(postsQuery, startAfter(lastVisibleDoc));
      }

      const querySnapshot = await getDocs(postsQuery);

      // Trả về mảng rỗng nếu không có bài đăng nào
      if (querySnapshot.empty) {
        return { postData: [], lastVisiblePost: null };
      }

      // Cập nhật lượt xem
      await updatePostViewCount(querySnapshot.docs);

      // Lấy ID của bài đăng cuối cùng để hỗ trợ paginating
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        postData: postData,
        lastVisiblePost: lastVisible ? lastVisible.id : null,
      };
    } catch (error) {
      console.error("Error fetching posts from followed users: ", error);
      throw error;
    }
  }
);

export const updatePostsByField = createAsyncThunk(
  "data/updatePostsByField",
  async ({ post_id, field, value }, { getState, dispatch }) => {
    // console.log("postId", post_id);
    // console.log("field", [field]);
    // console.log("value", value);
    try {
      const postRef = doc(db, "Posts", post_id);

      await updateDoc(postRef, {
        [field]: value,
      });

      console.log(`Field '${field}' updated successfully with value: ${value}`);

    } catch (error) {
      console.error("Error updating post: ", error);
      throw error;
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
      .addCase(createPost.pending, (state) => {
        state.status = "loading"; // Đánh dấu trạng thái đang tải
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message; // Lưu lỗi nếu quá trình thêm thất bại
        state.status = "failed"; // Đánh dấu thất bại
      })

      // getPostsByField
      .addCase(getPostsByField.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.postData;
        // console.log("getPostsByField", state.currentPost);
        state.status = "succeeded"; // Đánh dấu thành công
      })
      .addCase(getPostsByField.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        // console.log("action.payload.isFollow", action.payload.isFollow)
        if (action.payload.isFollow) {
          // console.log("action.payload.postData", action.payload.postData)
          state.followerPost = action.payload.postData;
          state.lastVisiblePostFollower = action.payload.lastVisiblePost;
        } else {
          state.post = action.payload.postData;
          state.lastVisiblePost = action.payload.lastVisiblePost;
        }
        state.status = "succeeded";
      })
      .addCase(getPostsRefresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //getPostsFromUnfollowedUsers
      .addCase(getPostsFromUnfollowedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsFromUnfollowedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.post.push(...action.payload.postData);
        state.lastVisiblePost = action.payload.lastVisiblePost;
        state.status = "succeeded";
      })
      .addCase(getPostsFromUnfollowedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //getPostsFromFollowedUsers
      .addCase(getPostsFromFollowedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsFromFollowedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.followerPost.push(...action.payload.postData);
        state.lastVisiblePostFollower = action.payload.lastVisiblePost;
        state.status = "succeeded";
      })
      .addCase(getPostsFromFollowedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { } = PostSlice.actions;

export default PostSlice.reducer;
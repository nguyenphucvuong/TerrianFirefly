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
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "../../firebase/FirebaseConfig"; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
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
  postByUser: [],
  postFavourite: [],
  postReport: [],
  loading: false,
};

// Tạo async thunk để thêm dữ liệu lên Firestore

export const createPost = createAsyncThunk(
  "data/createPost",
  async (newData) => {
    try {
      // Thêm dữ liệu mới vào Firestore
      const docRef = await addDoc(collection(db, "Posts"), newData);
      const imgUrls = [];

      // Tải lên tất cả ảnh
      const uploadPromises = newData.imgPost.map(async (img) => {
        const response = await fetch(img);
        const blob = await response.blob(); // Chuyển đổi URL thành dạng nhị phân
        const imgRef = ref(storage, `images/${img.split("/").pop()}`); // Đặt tên cho ảnh

        // Tải lên ảnh và lấy URL tải về
        await uploadBytes(imgRef, blob);
        const imgUrl = await getDownloadURL(imgRef);
        imgUrls.push(imgUrl);
      });

      // Chờ tất cả ảnh được tải lên
      await Promise.all(uploadPromises);

      // Cập nhật tài liệu với ID và URL ảnh
      await updateDoc(docRef, {
        post_id: docRef.id,
        imgPost: imgUrls,
      });

      // Lấy tài liệu vừa thêm từ Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Trả về dữ liệu của tài liệu vừa thêm
        return { post_id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("No such document!");
      }
    } catch (error) {
      console.error("Error adding document:", error.message);
      throw error;
    }
  }
);
// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getPostsFirstTime = createAsyncThunk(
  "data/getPostsFirstTime",
  async () => {
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
      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Thêm lượt xem mỗi khi duyệt qua bài viết
      querySnapshot.docs.forEach(async (doc) => {
        const currentCountView = doc.data().count_view || 0;
        await updateDoc(doc.ref, {
          count_view: currentCountView + 1,
        });
      });

      return {
        postData: postData,
        lastVisiblePost: lastVisible ? lastVisible.id : null, // Serialize the last visible post
      }; // Return only the document ID for `lastVisiblePost`
    } catch (error) {
      console.error("Error fetching posts: ", error);
      throw error;
    }
  }
);


// Hàm chính để lấy bài viết mới
export const getPostsRefresh = createAsyncThunk(
  "data/getPostsRefresh",
  async ({ currentUserId, isFollow }) => {
    try {
      const followedUserIds = await getFollowedUserIds({
        currentUserId: currentUserId,
      });

      if (followedUserIds.length === 0 && isFollow) {
        return { postData: [], lastVisiblePost: null, isFollow: isFollow };
      }

      let postsQuery = query(
        collection(db, "Posts"),
        orderBy("created_at", "desc"),
        where("status_post_id", "<", 2),
        limit("3")
      );
      if (followedUserIds.length > 0) {
        postsQuery = isFollow
          ? query(postsQuery, where("user_id", "in", followedUserIds))
          : query(
            postsQuery,
            where("user_id", "not-in", followedUserIds.slice(0, 10))
          );
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
  async ({ field, value }) => {
    console.log("field, value", field, value);
    try {
      let postsQuery = query(
        collection(db, "Posts"),
        where(field, "==", value)
      );

      const querySnapshot = await getDocs(postsQuery);

      if (querySnapshot.empty) {
        return { postData: [] };
      }
      await updatePostViewCount(querySnapshot.docs);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("postData[0]", postData[0]);
      console.log("postData[0].imgPost", postData[0].imgPost);
      return {
        postData: postData[0],
      };
    } catch (error) {
      console.error("Error getPostsByField: ", error);
      throw error;
    }
  }
);

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
  //console.log("followerSnapshot", followerSnapshot.docs.map((doc) => doc.data().user_id));

  return followerSnapshot.docs.map((doc) => doc.data().user_id);
};

// Hàm lấy bài đăng từ những người dùng chưa được follow
export const getPostsFromUnfollowedUsers = createAsyncThunk(
  "data/getPostsFromUnfollowedUsers",
  async ({ field, quantity, currentUserId }, { getState }) => {
    try {
      const followedUserIds = await getFollowedUserIds({
        currentUserId: currentUserId,
      });

      const lastVisiblePostId = getState().post.lastVisiblePost;
      let lastVisibleDoc = null;

      if (lastVisiblePostId) {
        const lastVisibleDocRef = doc(db, "Posts", lastVisiblePostId);
        lastVisibleDoc = await getDoc(lastVisibleDocRef);
      }
      let postsQuery = query(
        collection(db, "Posts"),
        orderBy(field, "desc"),
        where("status_post_id", "<", 2),
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
      const followedUserIds = await getFollowedUserIds({
        currentUserId: currentUserId,
      });

      // Nếu không có user nào được follow, trả về mảng rỗng
      if (followedUserIds.length === 0) {
        return { postData: [], lastVisiblePost: null };
      }

      // Kiểm tra lastVisiblePostFollower để lấy bài đăng từ trang trước đó
      const lastVisiblePostId = getState().post.lastVisiblePostFollower;
      //console.log("currentUserId", getState().post.lastVisiblePostFollower);
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
        where("status_post_id", "<", 2),
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


// hàm lấy bài đăng của người dùng
export const getPostUsers = createAsyncThunk(
  "data/getPostUsers",
  async ({ field, currentUserId }, { getState }) => {
    //console.log('currentUserId', currentUserId);

    try {
      let postsQuery = query(
        collection(db, "Posts"),
        orderBy(field, "desc"),
        where("user_id", "==", currentUserId)
      );

      const querySnapshot = await getDocs(postsQuery);

      if (querySnapshot.empty) {
        return { postData: [] };
      }

      await updatePostViewCount(querySnapshot.docs);

      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        postData: postData,
      };
    } catch (error) {
      console.error("Error fetching posts from unfollowed users: ", error);
      throw error;
    }
  }
);

// Hàm lấy danh sách user ID đã được yêu thích
const getFavouriteUserIds = async ({ currentUserId }) => {
  try {
    const favouriteQuery = query(
      collection(db, "Favorite"),
      where("user_id", "==", currentUserId)  // Lấy bài viết yêu thích của currentUserId
    );

    const favouriteSnapshot = await getDocs(favouriteQuery);
    // Lấy danh sách post_id từ các bài viết mà người dùng yêu thích
    //console.log('favouriteSnapshot', favouriteSnapshot.docs.map((doc) => doc.data().post_id));

    return favouriteSnapshot.docs.map((doc) => doc.data().post_id);  // Trả về post_id của bài viết yêu thích
  } catch (error) {
    console.error("Error fetching favourite post IDs: ", error);
    throw error;
  }
};

//hàm lấy bài người dùng đã yêu thích
export const getPostsFromFavouriteUsers = createAsyncThunk(
  "data/getPostsFromFavouriteUsers",
  async ({ field, currentUserId }, { getState }) => {
    // console.log('currentUserId',currentUserId);

    try {
      // Lấy danh sách user ID đã được follow
      const favouriteUserIds = await getFavouriteUserIds({
        currentUserId: currentUserId,
      });
      //console.log('favouriteUserIds', favouriteUserIds);

      // Nếu không có user nào được follow, trả về mảng rỗng
      if (favouriteUserIds.length === 0) {
        return { postData: [] };
      }

      // Tạo query lấy bài đăng từ những người dùng đã được yêu thích
      let postsQuery = query(
        collection(db, "Posts"),
        orderBy(field, "desc"),
        where("post_id", "in", favouriteUserIds)
      );

      const querySnapshot = await getDocs(postsQuery);

      // Trả về mảng rỗng nếu không có bài đăng nào
      if (querySnapshot.empty) {
        return { postData: [] };
      }

      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        postData: postData,
      };
    } catch (error) {
      console.error("Error fetching posts from favourite users: ", error);
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

      ///console.log(`Field '${field}' updated successfully with value: ${value}`);
    } catch (error) {
      console.error("Error updating post: ", error);
      throw error;
    }
  }
);

export const getRealtimePostsByStatus = createAsyncThunk(
  "data/getRealtimePostsByStatus",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const postsQuery = query(
        collection(db, "Posts"),
        where("status_post_id", "!=", 0)
      );

      // Lắng nghe thay đổi từ Firestore
      const unsubscribe = onSnapshot(postsQuery, async (querySnapshot) => {
        try {
          const postsWithUser = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const post = { id: doc.id, ...doc.data() };


              // Lấy thông tin người dùng từ user_id
              const userQuery = query(
                collection(db, "user"),
                where("user_id", "==", post.user_id)
              );
              const userSnapshot = await getDocs(userQuery);

              if (!userSnapshot.empty) {
                const user = userSnapshot.docs[0].data();
                post.user = { id: userSnapshot.docs[0].id, ...user };
              } else {
                post.user = null;
              }

              return post;
            })
          );

          // Dispatch chỉ dữ liệu tuần tự hóa, không chứa hàm
          dispatch(setPostsWithUser(postsWithUser));
        } catch (error) {
          rejectWithValue(error.message);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// export const startListeningPostByID = createAsyncThunk(
//   "data/startListeningPostByID",
//   async ({ post_id }, { dispatch, rejectWithValue }) => {
export const startListeningPostByID = ({ post_id }) => (dispatch) => {
  // console.log("post_id", post_id);
  const postQuery = query(
    collection(db, "Posts"),
    where("post_id", "==", post_id)
  );
  const unsubscribe = onSnapshot(postQuery, (querySnapshot) => {
    const postById = querySnapshot.docs.map(doc => {
      const data = doc.data(); // Extract post_id from the report content 
      return { id: doc.id, ...data };
    });

    // console.log("postById", postById[0]);
    dispatch(setPostById({ post_id: post_id, postById: postById[0] }));
  }, (error) => {
    console.error('Error fetching report: ', error);
  });
  return unsubscribe;
}



// Tạo slice cho Post
export const PostSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostsWithUser: (state, action) => {
      state.postReport = action.payload;
    },
    setPostById: (state, action) => {
      const { post_id, postById } = action.payload;


      state[post_id] = postById;

      state.status = "succeeded";
    }
  },
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
        state.currentPost = action.payload;
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
      })

      //getPostsFromFavouriteUsers
      .addCase(getPostsFromFavouriteUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsFromFavouriteUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.postFavourite = action.payload.postData;
        state.lastVisiblePostFollower = action.payload.lastVisiblePost;
        state.status = "succeeded";
      })
      .addCase(getPostsFromFavouriteUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //getPostUsers
      .addCase(getPostUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.postByUser = action.payload.postData;
        state.status = "succeeded";
      })
      .addCase(getPostUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Xử lý trạng thái khi lắng nghe thay đổi bài viết thành công
      .addCase(getRealtimePostsByStatus.pending, (state) => {
        state.loading = true;  // Đang lắng nghe
      })
      .addCase(getRealtimePostsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Updated posts:", action.payload); // Kiểm tra dữ liệu nhận được
        // Không cần cập nhật postReport trong action.fulfilled nữa vì đã được xử lý trong setPostsWithUser
      })
      .addCase(getRealtimePostsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPostsWithUser, setPostById } = PostSlice.actions;

export default PostSlice.reducer;

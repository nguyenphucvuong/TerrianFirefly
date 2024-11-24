import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, auth, storage } from '../../firebase/FirebaseConfig';
import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
  user: null,
  iUser: null,
  userByField: {},
  statusUser: 'idle',
  errorUser: null,
  postFavourite: [],
  userReport: [],
  userHashtag: [],
  totalEmoji: 0,
  skipAutoNavigation: false,
};
let unsubscribeListener = null; // Biến toàn cục quản lý listener
let unsubscribeListenerFavourite = null; // Biến toàn cục quản lý listener

let isTest = null;
let isTestFavourite = null;
// Thiết lập listener thời gian thực cho dữ liệu người dùng
export const listenToUserRealtime = (email) => (dispatch) => {
  const q = query(collection(db, "user"), where("email", "==", email));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        };
        dispatch(setUser(userData));
      }
    },
    (error) => {
      console.error("Error in realtime listener:", error);
      dispatch(setError(error.message));
    }
  );

  return unsubscribe; // Trả về hàm unsubscribe để có thể ngừng listener khi không cần thiết
};
// Thiết lập listener thời gian thực cho dữ liệu người dùng
export const listenToUserRealtime2 = (email) => (dispatch) => {
  const q = query(collection(db, "user"), where("email", "==", email));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        };
        dispatch(setIUser(userData));
      }
    },
    (error) => {
      console.error("Error in realtime listener:", error);
      dispatch(setError(error.message));
    }
  );

  return unsubscribe; // Trả về hàm unsubscribe để có thể ngừng listener khi không cần thiết
};

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getUser = createAsyncThunk("data/getUser", async (email) => {
  try {
    const q = query(collection(db, "user"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    // const posts = querySnapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data(),
    // }));

    const posts = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    };

    return posts;
  } catch (err) {
    return err.message;
  }
});

export const updateUserState = createAsyncThunk(
  "user/updateUser",
  async ({ user_id, field, value }, { getState, dispatch }) => {
    try {
      const userRef = doc(db, "user", user_id); // Tham chiếu đến tài liệu người dùng

      // Cập nhật các trường trong tài liệu
      await updateDoc(userRef, {
        [field]: value,
      });

      // Lấy lại thông tin người dùng đã được cập nhật từ Firestore
      const updatedSnap = await getDoc(userRef);
      // console.log("updatedSnap", updatedSnap.data());
      if (updatedSnap.exists()) {
        return {
          id: updatedSnap.id,
          ...updatedSnap.data(),
        };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }
);

export const getUserByField = createAsyncThunk(
  "data/getUserByField",
  async ({ user_id }) => {
    try {
      const queryDoc = query(
        collection(db, "user"),
        where("user_id", "==", user_id)
      );
      const querySnapshot = await getDocs(queryDoc);

      if (querySnapshot.empty) {
        return null; // No user found
      }

      // const userById = querySnapshot.docs.map(doc => ({
      //     id: doc.id,
      //     ...doc.data(),
      // }));
      const userById = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      };
      // console.log("userById", userById);

      return { user_id, userById };
    } catch (error) {
      console.error("Error fetching user: ", error);
      throw error; // Just return the error message
    }
  }
);


// Tạo async thunk để cập nhật dữ liệu Firestore
export const updateUser = createAsyncThunk('data/upDateUser', async ({ user_id, newData }) => {

  try {
    if (!user_id) {
      throw new Error("User ID is required.");
    }

    const userDocRef = doc(collection(db, "user"), user_id);
    await updateDoc(userDocRef, newData);
    console.log("User updated!");

    //Alert.alert("Thành công", "Đã cập nhật Firestore.");
  } catch (error) {
    console.error("Error updating user:", error);
  }
});



export const updateUserPassword = createAsyncThunk(
  "data/updateUserPassword",
  async ({ userId, newPassWord }) => {
    try {
      const userRef = doc(db, "user", userId); // Tạo tham chiếu đến tài liệu của người dùng trong Firestore
      await updateDoc(userRef, {
        passWord: newPassWord, // Cập nhật trường passWord với mật khẩu mới
      });

      return { userId, newPassWord }; // Trả về userId và mật khẩu mới sau khi cập nhật thành công
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Tạo async thunk để upload ảnh
export const uploadImage = createAsyncThunk(
  "data/uploadImage",
  async ({ imgUser, setUploadProgress }, { rejectWithValue }) => {
    try {
      const response = await fetch(imgUser);
      const blob = await response.blob();
      const imgRef = ref(storage, `avatar/${imgUser.split("/").pop()}`);
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
export const startListeningUserByID = ({ user_id }) => (dispatch) => {
  if (!user_id) return;

  const followerQuery = query(
    collection(db, "user"),
    where("user_id", "==", user_id)
  );
  const unsubscribe = onSnapshot(followerQuery, (querySnapshot) => {
    // const followers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // const followers = querySnapshot.docs.map(doc => ({ ...doc.data() }));
    const userById = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    };
    //console.log("userById00", userById)
    dispatch(setUserById(userById));

    // console.log("followers", followers)
  }, (error) => {
    console.error('Error fetching follower: ', error);
  });

  return unsubscribe; // Trả về hàm unsubscribe để có thể dừng lắng nghe khi cần
};
//
export const listenToUserWithStatus = createAsyncThunk(
  "data/listenToUserWithStatus",
  async (_, { dispatch }) => {
    try {
      const q = query(collection(db, "user"), where("status_user_id", "!=", 0));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const usersWithStatus = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Dispatch action để lưu dữ liệu vào state
          dispatch(setUserReport(usersWithStatus));
        },
        (error) => {
          console.error("Error in realtime listener:", error);
          dispatch(setError(error.message));
        }
      );

      return unsubscribe;  // Trả về hàm unsubscribe thay vì dispatch trực tiếp trong payload
    } catch (error) {
      console.error("Error listening to users with status:", error);
      throw error;
    }
  }
);
export const startListeningFavourite = ({ currentUserId, forceRefresh }) => async (dispatch) => {
  // console.log('currentUserId', currentUserId);
  // console.log('isTestFavourite', isTestFavourite);
  // console.log('forceRefresh',forceRefresh);
  //Hủy listener cũ nếu đã tồn tại
  if (unsubscribeListenerFavourite) {
    // console.log("Hủy listener cũ.");
    unsubscribeListenerFavourite(); // Dừng lắng nghe
    unsubscribeListenerFavourite = null;
    currentUserId = null;
  }
  if (isTestFavourite === currentUserId && forceRefresh !== false) {
    // console.log("Đã lắng nghe User ID này, bỏ qua.");
    return; // Không làm gì nếu User ID đã được xử lý trước đó
  }
  if (!currentUserId) {
    // console.log("Không có currentUserId.");
    dispatch(setFavourite([]));
    return; // Dừng ngay lập tức nếu không có currentUserId
  }

  try {

    const favouriteQuery = query(
      collection(db, "Favorite"),
      where("user_id", "==", currentUserId)
    );
    const userSnapshot = await getDocs(favouriteQuery);
    if (userSnapshot.empty) {
      console.log("User ID không tồn tại.");
      currentUserId = null;
      // Reset Redux 
      dispatch(setUserHashtag([]));
      return; // Dừng nếu UserID không tồn tại
    } else {
      // console.log("User ID tồn tại.");
      isTestFavourite = currentUserId;
      forceRefresh = true;
      //tiep tuc lang nghe
      // console.log('currentUserIdcurrentUserId', currentUserId);

      const favouriteQuery = query(
        collection(db, "Favorite"),
        where("user_id", "==", currentUserId)
      );
      unsubscribeListenerFavourite = onSnapshot(favouriteQuery, async (querySnapshot) => {
        if (!querySnapshot.empty) {


          // Lấy tất cả user_id của những người yêu thích
          const favouriteUserIds = querySnapshot.docs.map((doc) => doc.data().post_id);

          if (favouriteUserIds.length > 0) {

            // Tạo query để lấy dữ liệu của các user từ bảng Posts
            const userQuery = query(
              collection(db, "Posts"),
              where("post_id", "in", favouriteUserIds)
            );

            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
              const favouritesData = userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              // console.log("favouritesData", favouritesData);
              // Gửi dữ liệu vào Redux
              dispatch(setFavourite(favouritesData));
            }
          }
        }
        else {
          console.log('roong');
        }
      }, (error) => {
        console.error('Error fetching Favourite: ', error);
      });

      return unsubscribeListenerFavourite; // Trả về hàm unsubscribe để dừng lắng nghe khi không cần thiết
    }

  } catch (error) {
    console.error("Error in startListeningFavourite: ", error);
  }
};

export const startListeningHashtag = ({ currentUserId, forceRefresh }) => async (dispatch) => {
  // console.log("currentUserId", currentUserId);

  //Hủy listener cũ nếu đã tồn tại
  if (unsubscribeListener) {
    // console.log("Hủy listener cũ.");
    unsubscribeListener(); // Dừng lắng nghe
    unsubscribeListener = null;
    currentUserId = null;
  }
  // console.log('isTest', isTest);
  // console.log('forceRefresh',forceRefresh);

  if (isTest === currentUserId && forceRefresh !== false) {
    // console.log("Đã lắng nghe User ID này, bỏ qua.");
    // dispatch(setUserHashtag([]));
    return; // Không làm gì nếu User ID đã được xử lý trước đó
  }
  // console.log("currentUserId", currentUserId);
  if (!currentUserId) {
    // console.log("Không có currentUserId.");
    dispatch(setUserHashtag([]));
    return; // Dừng ngay lập tức nếu không có currentUserId
  }

  try {
    // Kiểm tra UserID tồn tại
    const userExistsQuery = query(
      collection(db, "HashtagGroup"),
      where("UserID", "==", currentUserId)
    );

    const userSnapshot = await getDocs(userExistsQuery);

    if (userSnapshot.empty) {
      // console.log("User ID không tồn tại.");
      currentUserId = null;
      // Reset Redux 
      dispatch(setUserHashtag([]));
      return; // Dừng nếu UserID không tồn tại
    } else {
      // console.log("User ID tồn tại.");
      isTest = currentUserId;
      forceRefresh = true;
      // Tiếp tục lắng nghe hashtag
      const hashtagQuery = query(
        collection(db, "HashtagGroup"),
        where("UserID", "==", currentUserId)
      );

      unsubscribeListener = onSnapshot(
        hashtagQuery,
        async (querySnapshot) => {
          if (!querySnapshot.empty) {
            const hashtagUserIds = querySnapshot.docs.map((doc) => doc.data().HashtagID);

            if (hashtagUserIds.length > 0) {
              const userQuery = query(
                collection(db, "Hashtag"),
                where("hashtag_id", "in", hashtagUserIds)
              );

              const userSnapshot = await getDocs(userQuery);

              if (!userSnapshot.empty) {
                const hashtagsData = userSnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                //console.log("hashtagsData", hashtagsData);
                dispatch(setUserHashtag(hashtagsData));
              }
            }
          }
        },
        (error) => {
          console.error("Error fetching Hashtag: ", error);
          dispatch(setUserHashtag([]));
        }
      );

      return unsubscribeListener; // Trả về unsubscribe để dừng lắng nghe khi không cần thiết
    }
  } catch (error) {
    console.error("Error in startListeningHashtag: ", error);
  }
};

//Lắng nghe và lấy Emoji
export const startListeningTotalEmoji = ({ currentUserId }) => (dispatch, getState) => {
  if (!currentUserId) return;

  // Lắng nghe thay đổi từ bảng Posts
  const followerQuery = query(
    collection(db, "Posts"),
    where("user_id", "==", currentUserId)
  );

  const unsubscribePosts = onSnapshot(followerQuery, async (querySnapshot) => {
    if (!querySnapshot.empty) {
      // Lấy tất cả post_id từ bảng Posts
      const emojiUserIds = querySnapshot.docs.map((doc) => doc.data().post_id);
      //console.log('emojiUserIds', emojiUserIds);

      if (emojiUserIds.length > 0) {
        // Lắng nghe thay đổi trong bảng Emoji cho các post_id
        const emojiQuery = query(
          collection(db, "Emoji"),
          where("post_id", "in", emojiUserIds)
        );

        const unsubscribeEmoji = onSnapshot(emojiQuery, (emojiSnapshot) => {
          if (!emojiSnapshot.empty) {
            // Lấy dữ liệu emoji từ snapshot
            const totalEmoji = emojiSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            const total = totalLike(totalEmoji);
            dispatch(setTotalEmoji(total));  // Gửi dữ liệu totalEmoji vào Redux
          } else {
            console.log("No emoji data found for the posts.");
          }
        }, (error) => {
          console.error("Error fetching emoji data: ", error);
        });

        // Trả về hàm unsubscribe để dừng lắng nghe sự thay đổi trong bảng Emoji khi không cần thiết
        return unsubscribeEmoji;
      } else {
        console.log("No posts found for this user.");
      }
    }
  }, (error) => {
    console.error('Error fetching posts data: ', error);
  });

  // Trả về hàm unsubscribe để dừng lắng nghe sự thay đổi trong bảng Posts khi không cần thiết
  return unsubscribePosts;
};

//Tính tổng
const totalLike = (item) => {
  if (!Array.isArray(item)) {
    console.log("Input is not an array");
    return 0; // Trả về 0 nếu item không phải là mảng
  }

  const totalSum = item.reduce((acc, curr) => {
    acc.count_heart += curr.count_heart;
    acc.count_laugh += curr.count_laugh;
    acc.count_like += curr.count_like;
    acc.count_sad += curr.count_sad;

    return acc;
  }, { count_heart: 0, count_laugh: 0, count_like: 0, count_sad: 0 });

  // Tính tổng các giá trị count_heart, count_laugh, count_like, count_sad
  const finalTotal = totalSum.count_heart + totalSum.count_laugh + totalSum.count_like + totalSum.count_sad;
  return finalTotal;
};

// Tạo slice cho user
export const UserSlices = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.errorUser = null; // Reset lỗi khi có dữ liệu người dùng mới
    },
    setError: (state, action) => {
      state.errorUser = action.payload;
    },
    setUserById: (state, action) => {
      // const { user_id, userById } = action.payload;
      // console.log("userByIddddds ", action.payload);
      // console.log("user_id, ", action.payload.user_id);
      state[action.payload.user_id] = action.payload;
    },
    setIUser: (state, action) => {
      state.iUser = action.payload;
      state.errorUser = null; // Reset lỗi khi có dữ liệu người dùng mới
    },
    setUserReport: (state, action) => {
      state.userReport = action.payload;  // Cập nhật mảng userReport
    },
    setFavourite: (state, action) => {
      state.postFavourite = action.payload;
    },
    setUserHashtag: (state, action) => {
      state.userHashtag = action.payload;
    },
    setTotalEmoji: (state, action) => {
      state.totalEmoji = action.payload;
    },
    setSkipAutoNavigation: (state, action) => {
      state.skipAutoNavigation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByField.fulfilled, (state, action) => {
        const { user_id, userById } = action.payload;
        state[user_id] = userById;
      })
      .addCase(getUserByField.pending, (state) => { })
      .addCase(getUserByField.rejected, (state, action) => {
        state.errorUser = action.error.message;
      })
      // updateUserState
      .addCase(updateUserState.fulfilled, (state, action) => {
        state.user = action.payload;
        state.statusUser = "succeeded";
      })
      .addCase(updateUserState.pending, (state) => {
        state.statusUser = "loading";
      })
      .addCase(updateUserState.rejected, (state, action) => {
        state.errorUser = action.error.message;
        state.statusUser = "failed";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        // Update state or user with the new image URL if needed
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.errorUser = action.payload;
      })
  },
});

export const { setUser, setError, setUserById, setIUser, setUserReport, setUserHashtag, setFavourite, setTotalEmoji, setSkipAutoNavigation  } = UserSlices.actions;

export default UserSlices.reducer;

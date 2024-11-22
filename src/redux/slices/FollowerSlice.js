import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, query, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config
import { add } from '@tensorflow/tfjs';

// Trạng thái ban đầu
const initialState = {
    follower: [],
    following: [],
    currentFollower: [],
    status: 'idle',
    error: null,
};

export const createFollow = createAsyncThunk('data/createFollow', async ({ follower_user_id, user_id }) => {
    try {
        // Create a new document in the 'Follower' collection with initial data as an object
        const docRef = await addDoc(collection(db, 'Follower'), {
            follower_user_id,  // Set initial follower_user_id
            user_id            // Set initial user_id
        });

        // Retrieve the document snapshot
        const docSnap = await getDoc(docRef);

        // Update the document with desired values
        await updateDoc(docRef, {
            follower_user_id: follower_user_id,   // follower_user_id will store the logged-in user's ID
            user_id: user_id,   // user_id will store the followed user's ID
        });

        if (docSnap.exists()) {
            return { ...docSnap.data() };
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
});

export const deleteFollow = createAsyncThunk('data/deleteFollow', async ({ follower_user_id, user_id }, { getState, dispatch }) => {
    try {
        const followQuery = query(
            collection(db, 'Follower'),
            where('follower_user_id', '==', follower_user_id),
            where('user_id', '==', user_id)
        );
        const querySnapshot = await getDocs(followQuery);
        for (const docSnapshot of querySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
        }
        // await dispatch(removeFollower({ follower_user_id, user_id }));
        //console.log(`Successfully deleted follow relationship between ${follower_user_id} and ${user_id}`);
        return { follower_user_id, user_id };
    } catch (error) {
        console.error('Error deleting document: ', error);
        throw error;
    }
});

export const getFollower = createAsyncThunk('data/getFollower', async ({ follower_user_id }) => {
    // console.log("follower_user_id", follower_user_id)
    if (follower_user_id === undefined) {
        return [];
    }
    try {

        const followerQuery = query(collection(db, "Follower"), where('follower_user_id', "==", follower_user_id));

        const querySnapshot = await getDocs(followerQuery);
        // console.log("querySnapshot", querySnapshot)

        if (querySnapshot.empty) {
            return [];
        }
        const commentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return commentData;
    } catch (error) {
        console.error('Error fetching follower: ', error);
        throw error;
    }
});
export const startListeningFollowers = ({ follower_user_id }) => (dispatch) => {
    if (!follower_user_id) return;

    const followerQuery = query(
        collection(db, "Follower"),
        where('follower_user_id', "==", follower_user_id),

    );
    const unsubscribe = onSnapshot(followerQuery, (querySnapshot) => {
        // const followers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const followers = querySnapshot.docs.map(doc => ({ ...doc.data() }));
        dispatch(setFollowers(followers));
        // console.log("followers", followers)
    }, (error) => {
        console.error('Error fetching follower: ', error);
    });

    return unsubscribe; // Trả về hàm unsubscribe để có thể dừng lắng nghe khi cần
};
export const listenToFollowerRealtime = ({ follower_user_id }) => (dispatch) => {
    // Lấy query từ bảng Follower để tìm các follower_user_id tương ứng
    const followerQuery = query(
        collection(db, "Follower"),
        where('follower_user_id', "==", follower_user_id)
    );

    const unsubscribe = onSnapshot(
        followerQuery,
        async (querySnapshot) => {
            if (!querySnapshot.empty) {
                // Lấy tất cả user_id của những người đã follow
                const followedUserIds = querySnapshot.docs.map((doc) => doc.data().user_id);

                if (followedUserIds.length > 0) {
                    // Tạo query để lấy dữ liệu của các user từ bảng user
                    const userQuery = query(
                        collection(db, "user"),
                        where("user_id", "in", followedUserIds)
                    );

                    // Lắng nghe sự thay đổi thời gian thực từ bảng user
                    const userSnapshot = await getDocs(userQuery);

                    if (!userSnapshot.empty) {
                        const followersData = userSnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        // Gửi dữ liệu followers vào Redux
                        dispatch(setFollowers(followersData));
                    }
                }
            }
        },
        (error) => {
            console.error("Lỗi trong listener thời gian thực:", error);
        }
    );

    return unsubscribe; // Trả về hàm unsubscribe để dừng listener khi không cần thiết
};
export const listenToFollowingRealtime = ({ follower_user_id }) => (dispatch) => {
    // Lấy query từ bảng Follower để tìm các follower_user_id tương ứng
    const followerQuery = query(
        collection(db, "Follower"),
        where('user_id', "==", follower_user_id)
    );

    const unsubscribe = onSnapshot(
        followerQuery,
        async (querySnapshot) => {
            if (!querySnapshot.empty) {
                // Lấy tất cả user_id của những người đã follow
                const followedUserIds = querySnapshot.docs.map((doc) => doc.data().follower_user_id);
                //console.log('followedUserIds', followedUserIds);

                if (followedUserIds.length > 0) {
                    // Tạo query để lấy dữ liệu của các user từ bảng user
                    const userQuery = query(
                        collection(db, "user"),
                        where("user_id", "in", followedUserIds)
                    );

                    // Lắng nghe sự thay đổi thời gian thực từ bảng user
                    const userSnapshot = await getDocs(userQuery);
                    if (!userSnapshot.empty) {
                        const followersData = userSnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        // Gửi dữ liệu following vào Redux
                        dispatch(setFollowing(followersData));
                    }
                }
            }
        },
        (error) => {
            console.error("Lỗi trong listener thời gian thực:", error);
        }
    );

    return unsubscribe; // Trả về hàm unsubscribe để dừng listener khi không cần thiết
};
// Hàm lấy danh sách user ID đã được follow
const getFollowedUserIds = async ({ currentUserId }) => {
    //console.log('currentUserId', currentUserId);

    const followerQuery = query(
        collection(db, "Follower"),
        where("follower_user_id", "==", currentUserId)
    );
    const followerSnapshot = await getDocs(followerQuery);
    //console.log("followerSnapshot", followerSnapshot.docs.map((doc) => doc.data().user_id));

    return followerSnapshot.docs.map((doc) => doc.data().user_id);
};

// Hàm lấy bài đăng từ những người dùng đã được follow
export const getUserFromFollowedUsers = createAsyncThunk(
    "data/getUserFromFollowedUsers",
    async ({ field, currentUserId }, { getState }) => {
        try {
            // Lấy danh sách user ID đã được follow
            const followedUserIds = await getFollowedUserIds({ currentUserId: currentUserId });
            // console.log('followedUserIds',followedUserIds);

            // Nếu không có user nào được follow, trả về mảng rỗng
            if (followedUserIds.length === 0) {
                return [];
            }
            // console.log('followedUserIds2',followedUserIds); 
            // Tạo query lấy bài đăng từ những người dùng đã được follow
            let userQuery = query(
                collection(db, "user"),
                where("user_id", "in", followedUserIds)
            );
            // console.log('userQuery',userQuery);


            const querySnapshot = await getDocs(userQuery);
            // console.log('querySnapshot1',querySnapshot);

            // Trả về mảng rỗng nếu không có user nào
            if (querySnapshot.empty) {
                console.log('empty');
                return [];
            }
            // Trả về danh sách followers
            const follower = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            //console.log('followerfollower',follower);

            return follower;
            // console.log('follower',follower);

            // return {
            //     follower,
            // };
        } catch (error) {
            console.error("Error fetching user from followed users: ", error);
            throw error;
        }
    }
);
// Hàm lấy danh sách user ID đã được follow
const getFollowingUsersIds = async ({ currentUserId }) => {
    //console.log('currentUserId', currentUserId);

    const followerQuery = query(
        collection(db, "Follower"),
        where("user_id", "==", currentUserId)
    );
    const followerSnapshot = await getDocs(followerQuery);
    //console.log("followerSnapshot", followerSnapshot.docs.map((doc) => doc.data().follower_user_id));
    //lấy danh sách follower_user_id từ user_id
    return followerSnapshot.docs.map((doc) => doc.data().follower_user_id);
};
// Hàm lấy người dùng từ những người dùng đã follow
export const getUserFromFollowingUsers = createAsyncThunk(
    "data/getUserFromFollowingUsers",
    async ({ field, currentUserId }, { getState }) => {
        try {
            // Lấy danh sách user ID đã được follow
            const followedUserIds = await getFollowingUsersIds({ currentUserId: currentUserId });
            //console.log('followedUserIds',followedUserIds);

            // Nếu không có user nào được follow, trả về mảng rỗng
            if (followedUserIds.length === 0) {
                return [];
            }
            // console.log('followedUserIds2',followedUserIds); 
            // Tạo query lấy bài đăng từ những người dùng đã được follow
            let userQuery = query(
                collection(db, "user"),
                where("user_id", "in", followedUserIds)
            );
            //console.log('userQuery',userQuery);


            const querySnapshot = await getDocs(userQuery);
            // console.log('querySnapshot1',querySnapshot);

            // Trả về mảng rỗng nếu không có user nào
            if (querySnapshot.empty) {
                console.log('empty');
                return [];
            }
            const following = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log('following',following);

            return following;
           
        } catch (error) {
            console.error("Error fetching user from followed users: ", error);
            throw error;
        }
    }
);

export const FollowerSlice = createSlice({
    name: 'follower',
    initialState,
    reducers: {
        setFollowers: (state, action) => {
            state.follower = action.payload;
            //console.log("follower setFollowers", action.payload)
            state.status = 'succeeded';
        },
        setCurrentFollower: (state, action) => {
            state.currentFollower = action.payload;
        },
        addFollower: (state, action) => {
            state.follower.push(action.payload);
        },
        removeFollower: (state, action) => {
            state.follower = state.follower.filter(f => f.user_id !== action.payload.user_id);
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            //createFollow
            .addCase(createFollow.fulfilled, (state, action) => {
                //console.log(action.payload);
                state.follower.push(action.payload);
                //console.log("follower createFollow", state.follower)
                state.status = 'succeeded';
            })
            .addCase(createFollow.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createFollow.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })

            //getFollower
            .addCase(getFollower.fulfilled, (state, action) => {
                state.follower = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getFollower.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getFollower.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })

            //  deleteFollow
            .addCase(deleteFollow.fulfilled, (state, action) => {
                state.follower = state.follower.filter(item => item.user_id !== action.payload.user_id);
                //console.log("follower deleteFollow", state.follower)
                state.status = 'succeeded';
            })
            .addCase(deleteFollow.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteFollow.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })
            //getUserFromFollowedUsers
            .addCase(getUserFromFollowedUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserFromFollowedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.follower = action.payload;
                state.status = "succeeded";
            })
            .addCase(getUserFromFollowedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            //getUserFromFollowingUsers
            .addCase(getUserFromFollowingUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserFromFollowingUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.following = action.payload;
                state.status = "succeeded";
            })
            .addCase(getUserFromFollowingUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export const { setFollowers, setCurrentFollower, addFollower, removeFollower, setFollowing } = FollowerSlice.actions

export default FollowerSlice.reducer;

import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, query, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config
import { add } from '@tensorflow/tfjs';

// Trạng thái ban đầu
const initialState = {
    follower: [],
    userFollower: [],
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

// Hàm lấy và lắng nghe người dùng từ những người dùng đã follow
export const startListeningFollowingUsers = ({ currentUserId }) => (dispatch) => {
    if (!currentUserId) return;

    const followerQuery = query(
        collection(db, "Follower"),
        where("user_id", "==", currentUserId)
    );

    const unsubscribe = onSnapshot(followerQuery, async (querySnapshot) => {
        if (!querySnapshot.empty) {
            // Lấy tất cả user_id của những người đã follow
            const followingUserIds = querySnapshot.docs.map((doc) => doc.data().follower_user_id);
            
            if (followingUserIds.length > 0) {
                // Tạo query để lấy dữ liệu của các user từ bảng user
                const userQuery = query(
                    collection(db, "user"),
                    where("user_id", "in", followingUserIds)
                );

                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    const followingsData = userSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    // Gửi dữ liệu followings vào Redux
                    dispatch(setFollowing(followingsData));
                }
            }
        }
    }, (error) => {
        console.error('Error fetching following: ', error);
    });

    return unsubscribe; // Trả về hàm unsubscribe để dừng lắng nghe khi không cần thiết
};
// Hàm lấy và lắng nghe dữ liệu người dùng theo ID đã follow
export const startListeningFollowedUsers = ({ currentUserId }) => (dispatch) => {
    if (!currentUserId) return;

    const followerQuery = query(
        collection(db, "Follower"),
        where("follower_user_id", "==", currentUserId)
    );

    const unsubscribe = onSnapshot(followerQuery, async (querySnapshot) => {
        if (!querySnapshot.empty) {
            // Lấy tất cả user_id của những người đã follow
            const followedUserIds = querySnapshot.docs.map((doc) => doc.data().user_id);

            if (followedUserIds.length > 0) {
                // Tạo query để lấy dữ liệu của các user từ bảng user
                const userQuery = query(
                    collection(db, "user"),
                    where("user_id", "in", followedUserIds)
                );

                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    const followersData = userSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    // Gửi dữ liệu followers vào Redux
                    dispatch(setUserFollower(followersData));
                }
            }
        }
    }, (error) => {
        console.error('Error fetching follower: ', error);
    });

    return unsubscribe; // Trả về hàm unsubscribe để dừng lắng nghe khi không cần thiết
};
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
        setUserFollower: (state, action) => {
            state.userFollower = action.payload;
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
    },
});

export const { setFollowers, setCurrentFollower, addFollower, removeFollower, setFollowing, setUserFollower } = FollowerSlice.actions

export default FollowerSlice.reducer;

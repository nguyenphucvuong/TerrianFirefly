import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, query } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    follower: [],
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
            follower_user_id: user_id,   // follower_user_id will store the logged-in user's ID
            user_id: follower_user_id    // user_id will store the followed user's ID
        });

        if (docSnap.exists()) {
            return { follower_user_id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
});


export const getFollower = createAsyncThunk('data/getFollower', async ({ user_id }) => {
    // console.log("empty", user_id)
    try {

        const followerQuery = query(collection(db, "Follower"), where('follower_user_id', "==", user_id));

        const querySnapshot = await getDocs(followerQuery);

        if (querySnapshot.empty) {
            console.log("empty")
            return [];
        }
        const commentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return commentData;
    } catch (error) {
        console.error('Error fetching: ', error);
        throw error;
    }
});

export const FollowerSlice = createSlice({
    name: 'follower',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //createFollow
            .addCase(createFollow.fulfilled, (state, action) => {
                state.follower.push(action.payload);
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
            });

    },
});

// export const { setPost } = PostSlice.actions

export default FollowerSlice.reducer;

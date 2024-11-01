import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    comment: [],
    status: 'idle',
    error: null,
};

export const createComment = createAsyncThunk('data/createComment', async (newData) => {
    try {
        const docRef = await addDoc(collection(db, 'Comment'), newData);

        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
            // id: docRef.id,
            comment_id: docRef.id,
        });
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

export const getComment = createAsyncThunk('data/getComment', async ({ post_id }) => {
    try {
        const querySnapshot = await getDocs(collection(db, "Comment"), where('post_id' == post_id));
        querySnapshot.forEach((doc) => {
        });
        const commentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return commentData;
    } catch (error) {
        console.error('Error fetching posts: ', error);
        throw error;
    }
});

export const CommentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createComment.fulfilled, (state, action) => {
                state.comment.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createComment.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })

            .addCase(getComment.fulfilled, (state, action) => {
                state.comment = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getComment.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            });

    },
});

// export const { setPost } = PostSlice.actions

export default CommentSlice.reducer;

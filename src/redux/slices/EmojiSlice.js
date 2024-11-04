import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, query, deleteDoc, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    emojiList: [],
    currentEmoji: [],
    status: 'idle',
    error: null,
};

export const createEmoji = createAsyncThunk('data/createEmoji', async (
    { emoji_id, post_id, user_id, isComment, comment_id, count_like, count_heart, count_laugh, count_sad }) => {
    try {
        const docRef = await addDoc(collection(db, 'Emoji'), {
            emoji_id: emoji_id,
            post_id: post_id,
            user_id: user_id,
            isComment: isComment,
            comment_id: comment_id,
            count_like: count_like,
            count_heart: count_heart,
            count_laugh: count_laugh,
            count_sad: count_sad,
        });

        const docSnap = await getDoc(docRef);

        await updateDoc(docRef, {
            emoji_id: docRef.id,
            post_id: post_id,
            user_id: user_id,
            isComment: isComment,
            comment_id: comment_id,
            count_like: count_like,
            count_heart: count_heart,
            count_laugh: count_laugh,
            count_sad: count_sad,
        });

        if (docSnap.exists()) {
            return { currentEmoji: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
});

export const deleteEmoji = createAsyncThunk('data/deleteEmoji', async ({ post_id, user_id }) => {
    try {
        const emojiQuery = query(
            collection(db, 'Emoji'),
            where('post_id', '==', post_id),
            where('user_id', '==', user_id)
        );
        const querySnapshot = await getDocs(emojiQuery);
        for (const docSnapshot of querySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
        }
        console.log(`Successfully deleted Emoji relationship between ${post_id} and ${user_id}`);
    } catch (error) {
        console.error('Error deleting document: ', error);
        throw error;
    }
});

export const getEmoji = createAsyncThunk('data/getEmoji', async ({ post_id, user_id }) => {
    if (post_id === undefined || user_id === undefined) {
        return [];
    }
    try {

        const emojiQuery = query(collection(db, "Emoji"), where('post_id', "==", post_id));

        const querySnapshot = await getDocs(emojiQuery);

        if (querySnapshot.empty) {
            return [];
        }
        const emojiData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return emojiData;
    } catch (error) {
        console.error('Error fetching currentEmoji: ', error);
        throw error;
    }
});

export const startListeningEmoji = ({ post_id, user_id }) => (dispatch) => {
    // console.log("!post_id || !user_id", !post_id || !user_id)
    if (!post_id || !user_id) return;

    const emojiQuery = query(
        collection(db, "Emoji"),
        where('post_id', "==", post_id),
        where('user_id', "==", user_id),
        limit(1));
    const unEmoji = onSnapshot(emojiQuery, (querySnapshot) => {
        const emojis = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("emojis", emojis);
        if (emojis.length > 0) {
            // Dispatch only the first document if available
            dispatch(setCurrentEmoji([emojis[0]]));
        } else {
            console.log("No document found");
            dispatch(setCurrentEmoji([])); // Empty array if no document is found
        }
    }, (error) => {
        console.error('Error fetching Emoji: ', error);
    });

    return unEmoji;
};
export const EmojiSlice = createSlice({
    name: 'emoji',
    initialState,
    reducers: {
        setCurrentEmoji: (state, action) => {
            state.currentEmoji = action.payload;
            state.status = 'succeeded';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEmoji.fulfilled, (state, action) => {
                state.currentEmoji = action.payload;
                state.status = 'succeeded';
            })
            .addCase(createEmoji.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createEmoji.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })

            .addCase(getEmoji.fulfilled, (state, action) => {
                state.currentEmoji = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getEmoji.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getEmoji.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })

            .addCase(deleteEmoji.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(deleteEmoji.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteEmoji.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })
    },
});

export const { setCurrentEmoji } = EmojiSlice.actions

export default EmojiSlice.reducer;

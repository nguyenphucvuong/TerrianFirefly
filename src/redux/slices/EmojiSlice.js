import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, query, deleteDoc, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    emojiList: [],
    currentEmoji: null,
    status: 'idle',
    error: null,
};

export const createEmoji = createAsyncThunk('data/createEmoji', async ({ post_id, user_id }) => {
    try {
        const docRef = await addDoc(collection(db, 'Emoji'), {
            post_id: post_id,
            user_id: user_id,
        });

        const docSnap = await getDoc(docRef);

        await updateDoc(docRef, {
            post_id: post_id,
            user_id: user_id,
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

export const getEmoji = createAsyncThunk('data/getEmoji', async ({ post_id }) => {
    if (post_id === undefined) {
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

export const startListeningEmoji = ({ post_id }) => (dispatch) => {
    if (!post_id) return;

    const favoriteQuery = query(collection(db, "Favorite"), where('post_id', "==", post_id), limit(1));
    const unFavorite = onSnapshot(favoriteQuery, (querySnapshot) => {
        const favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("favorites", favorites);
        if (favorites.length > 0) {
            // Dispatch only the first document if available
            dispatch(setCurrentFavorite([favorites[0]]));
        } else {
            console.log("No document found");
            dispatch(setCurrentFavorite([])); // Empty array if no document is found
        }
    }, (error) => {
        console.error('Error fetching Favorite: ', error);
    });

    return unFavorite;
};
export const EmojiSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setCurrentEmoji: (state, action) => {
            state.currentFavorite = action.payload;
            state.status = 'succeeded';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEmoji.fulfilled, (state, action) => {
                state.currentFavorite.push(action.payload);
                state.status = 'succeeded';
            })
            .addCase(createEmoji.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createEmoji.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })

            .addCase(getFavorites.fulfilled, (state, action) => {
                state.currentFavorite = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getFavorites.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getFavorites.rejected, (state, action) => {
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

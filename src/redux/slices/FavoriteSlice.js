import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, query, deleteDoc, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    favoriteList: [],
    currentFavorite: [],
    status: 'idle',
    error: null,
};

export const createFavorite = createAsyncThunk('data/createFavorite', async ({ post_id, user_id }) => {
    try {
        const docRef = await addDoc(collection(db, 'Favorite'), {
            post_id: post_id,
            user_id: user_id,
        });

        const docSnap = await getDoc(docRef);

        await updateDoc(docRef, {
            post_id: post_id,
            user_id: user_id,
        });

        if (docSnap.exists()) {
            return { currentFavorite: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
});

export const deleteFavorite = createAsyncThunk('data/deleteFavorite', async ({ post_id, user_id }) => {
    try {
        const favoriteQuery = query(
            collection(db, 'Favorite'),
            where('post_id', '==', post_id),
            where('user_id', '==', user_id)
        );
        const querySnapshot = await getDocs(favoriteQuery);
        for (const docSnapshot of querySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
        }
        console.log(`Successfully deleted Favorite relationship between ${post_id} and ${user_id}`);
    } catch (error) {
        console.error('Error deleting document: ', error);
        throw error;
    }
});

export const getFavorites = createAsyncThunk('data/getFavorite', async ({ post_id }) => {
    if (post_id === undefined) {
        return [];
    }
    try {

        const favoriteQuery = query(collection(db, "Favorite"), where('post_id', "==", post_id));

        const querySnapshot = await getDocs(favoriteQuery);

        if (querySnapshot.empty) {
            console.log("empty")
            return [];
        }
        const favoriteData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return favoriteData;
    } catch (error) {
        console.error('Error fetching currentFavorite: ', error);
        throw error;
    }
});

export const startListeningFavorites = ({ post_id, user_id }) => (dispatch) => {
    if (!post_id) return;

    const favoriteQuery =
        query(
            collection(db, "Favorite"),
            where('post_id', "==", post_id),
            where('user_id', "==", user_id),
            limit(1));
    const unFavorite = onSnapshot(favoriteQuery, (querySnapshot) => {
        const favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("favorites", favorites);
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
export const FavoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setCurrentFavorite: (state, action) => {
            state.currentFavorite = action.payload;
            state.status = 'succeeded';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createFavorite.fulfilled, (state, action) => {
                state.currentFavorite = action.payload;
                state.status = 'succeeded';
            })
            .addCase(createFavorite.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createFavorite.rejected, (state, action) => {
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

            .addCase(deleteFavorite.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(deleteFavorite.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteFavorite.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            })
    },
});

export const { setCurrentFavorite } = FavoriteSlice.actions

export default FavoriteSlice.reducer;

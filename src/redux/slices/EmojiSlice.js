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
    { emoji_id, post_id, comment_id, sub_comment_id, user_id, count_like, count_heart, count_laugh, count_sad }) => {
    // console.log("emoji_id, post_id, user_id, isComment, comment_id, count_like, count_heart, count_laugh, count_sad", emoji_id, post_id, user_id, isComment, comment_id, count_like, count_heart, count_laugh, count_sad)
    try {
        const docRef = await addDoc(collection(db, 'Emoji'), {
            emoji_id: emoji_id,
            post_id: post_id,
            comment_id: comment_id,
            sub_comment_id: sub_comment_id,
            user_id: user_id,
            count_like: count_like,
            count_heart: count_heart,
            count_laugh: count_laugh,
            count_sad: count_sad,
        });

        const docSnap = await getDoc(docRef);

        await updateDoc(docRef, {
            emoji_id: docRef.id,
            post_id: post_id,
            comment_id: comment_id,
            sub_comment_id: sub_comment_id,
            user_id: user_id,
            count_like: count_like,
            count_heart: count_heart,
            count_laugh: count_laugh,
            count_sad: count_sad,
        });

        if (docSnap.exists()) {
            return { ...docSnap.data() };
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error('Error adding Emoji: ', error);
        throw error;
    }
});

export const deleteEmoji = createAsyncThunk('data/deleteEmoji', async ({ post_id, comment_id, sub_comment_id, user_id }, { getState, dispatch }) => {
    // console.log("post_id, user_id", post_id, user_id)
    try {
        const emojiQuery = post_id ? query(
            collection(db, 'Emoji'),
            where('post_id', '==', post_id),
            where('user_id', '==', user_id)
        ) : comment_id ? query(
            collection(db, 'Emoji'),
            where('comment_id', '==', comment_id),
            where('user_id', '==', user_id)
        ) : sub_comment_id ? query(
            collection(db, 'Emoji'),
            where('sub_comment_id', '==', sub_comment_id),
            where('user_id', '==', user_id)
        ) : null;



        const querySnapshot = await getDocs(emojiQuery);
        for (const docSnapshot of querySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
        }
        // await dispatch(removeEmoji({ post_id, user_id }));
        console.log(`Successfully deleted Emoji relationship between ${post_id} and ${user_id}`);
        return { post_id, user_id };
    } catch (error) {
        console.error('Error deleting Emoji: ', error);
        throw error;
    }
});

export const getEmoji = createAsyncThunk('data/getEmoji', async ({ post_id, user_id }, { getState, dispatch }) => {
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

export const updateEmojiByField = createAsyncThunk(
    "data/updateEmojiByField",
    async ({ post_id, comment_id, sub_comment_id, user_id, count_like, count_heart, count_laugh, count_sad }, { getState, dispatch }) => {
        // console.log("post_id, user_id, count_like, count_heart, count_laugh, count_sad", post_id, user_id, count_like, count_heart, count_laugh, count_sad)
        try {
            const emojiQuery = post_id ? query(
                collection(db, 'Emoji'),
                where('post_id', '==', post_id),
                where('user_id', '==', user_id)
            ) : comment_id ? query(
                collection(db, 'Emoji'),
                where('comment_id', '==', comment_id),
                where('user_id', '==', user_id)
            ) : sub_comment_id ? query(
                collection(db, 'Emoji'),
                where('sub_comment_id', '==', sub_comment_id),
                where('user_id', '==', user_id)
            ) : null;


            const querySnapshot = await getDocs(emojiQuery);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref; // Lấy tài liệu đầu tiên trong kết quả truy vấn
                await updateDoc(docRef, {
                    count_like: count_like,
                    count_heart: count_heart,
                    count_laugh: count_laugh,
                    count_sad: count_sad,
                });
                // console.log(`Field '${field}' updated successfully with value: ${value}`);
            } else {
                throw new Error('No matching document found!');
            }
        } catch (error) {
            console.error("Error updating emoji: ", error);
            throw error;
        }
    }
);



export const startListeningEmojiPost = ({ post_id }) => (dispatch) => {
    // console.log("!post_id || !user_id", !post_id || !user_id)
    // if (!user_id) return;

    const emojiQuery = query(
        collection(db, "Emoji"),
        where('post_id', "==", post_id),
    );
    const unEmoji = onSnapshot(emojiQuery, (querySnapshot) => {
        const emojis = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("emojis", emojis);
        if (emojis.length > 0) {
            // Dispatch only the first document if available
            dispatch(setEmoji({ emojis, post_id })); // Dispatch the first document
        } else {
            console.log("No document found");
            dispatch(setEmoji({ emojis: [], post_id })); // Empty array if no document is found
        }
    }, (error) => {
        console.error('Error fetching Emoji: ', error);
    });

    return unEmoji;
};

export const startListeningEmojiCmt = ({ comment_id }) => (dispatch) => {
    // console.log("!post_id || !user_id", !post_id || !user_id)
    // if (!user_id) return;

    const emojiQuery = query(
        collection(db, "Emoji"),
        where('comment_id', "==", comment_id),
    );
    const unEmoji = onSnapshot(emojiQuery, (querySnapshot) => {
        const emojis = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("emojiscomment_id", emojis);
        if (emojis.length > 0) {
            // Dispatch only the first document if available
            dispatch(setEmojiCmt({ emojis, comment_id: comment_id })); // Dispatch the first document
        } else {
            console.log("No document found");
            dispatch(setEmojiCmt({ emojis: [], comment_id: comment_id })); // Empty array if no document is found
        }
    }, (error) => {
        console.error('Error fetching Emoji: ', error);
    });

    return unEmoji;
};
export const startListeningEmojiSubCmt = ({ sub_comment_id }) => (dispatch) => {
    // console.log("!post_id || !user_id", !post_id || !user_id)
    // if (!user_id) return;

    const emojiQuery = query(
        collection(db, "Emoji"),
        where('sub_comment_id', "==", sub_comment_id),
    );
    const unEmoji = onSnapshot(emojiQuery, (querySnapshot) => {
        const emojis = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("emojis", emojis);
        if (emojis.length > 0) {
            // Dispatch only the first document if available
            dispatch(setEmojiSubCmt({ emojis, sub_comment_id: sub_comment_id })); // Dispatch the first document
        } else {
            console.log("No document found");
            dispatch(setEmojiSubCmt({ emojis: [], sub_comment_id: sub_comment_id })); // Empty array if no document is found
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

        setEmoji: (state, action) => {
            const { emojis, post_id } = action.payload;
            state[post_id] = emojis;
            // console.log("emojiList setemojiLists", post_id)
            state.status = 'succeeded';
        },
        setEmojiCmt: (state, action) => {
            const { emojis, comment_id } = action.payload;
            state[comment_id] = emojis;
            // console.log("emojiList setemojiLists", post_id)
            state.status = 'succeeded';
        },
        setEmojiSubCmt: (state, action) => {
            const { emojis, sub_comment_id } = action.payload;
            state[sub_comment_id] = emojis;
            // console.log("emojiList setemojiLists", post_id)
            state.status = 'succeeded';
        },


        setCurrentEmoji: (state, action) => {
            state.currentEmoji = action.payload;
            state.status = 'succeeded';
        },

        // addEmoji: (state, action) => {
        //     state.emojiList.push(action.payload);
        // },
        removeEmoji: (state, action) => {
            state.emojiList = state.emojiList.filter(e => e.post_id !== action.payload.post_id && e.user_id !== action.payload.user_id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEmoji.fulfilled, (state, action) => {
                // state.emojiList.push(action.payload);
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
                state.emojiList = action.payload;
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
                // state.emojiList = state.emojiList.filter(e => e.post_id !== action.payload.post_id && e.user_id !== action.payload.user_id);
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

export const { setCurrentEmoji, setEmoji, setEmojiCmt, setEmojiSubCmt, addEmoji, removeEmoji } = EmojiSlice.actions

export default EmojiSlice.reducer;

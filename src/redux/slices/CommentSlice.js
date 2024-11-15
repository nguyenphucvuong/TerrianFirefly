import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, onSnapshot, query } from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseConfig'; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
    comment: [],
    status: 'idle',
    error: null,
};


export const createComment = createAsyncThunk('data/createComment', async (
    { comment_id, post_id, user_id, content, count_like, count_comment, created_at, imgPost }
) => {
    try {
        console.log("toi day", imgPost)
        const docRef = await addDoc(collection(db, 'Comment'), {
            comment_id,
            post_id,
            user_id,
            content,
            count_like,
            count_comment,
            created_at,
            imgPost: "",
        });
        // console.log("toi day", img_id)
        // console.log("toi day33", img_id.uri)
        // Kiểm tra nếu có một ảnh trong newData
        if (imgPost) {
            const response = await fetch(imgPost.uri);
            const blob = await response.blob(); // Chuyển đổi URL thành dạng nhị phân
            const imgRef = ref(storage, `images/${imgPost.uri.split("/").pop()}`); // Đặt tên cho ảnh

            // Tải lên ảnh và lấy URL tải về
            await uploadBytes(imgRef, blob);
            const imgUrl = await getDownloadURL(imgRef);

            // Cập nhật tài liệu với ID và URL ảnh
            await updateDoc(docRef, {
                comment_id: docRef.id,
                imgPost: imgUrl,
            });
        }
        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
            comment_id: docRef.id,
        });

        if (docSnap.exists()) {
            return { comment_id: docSnap.id, ...docSnap.data() };
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
        const querySnapshot = await getDocs(collection(db, "Comment"), where('post_id', "==", post_id));
        querySnapshot.forEach((doc) => {
        });
        const commentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return commentData;
    } catch (error) {
        console.error('Error fetching posts: ', error);
        throw error;
    }
});

export const startListeningCommentByPostId = ({ post_id }) => (dispatch) => {
    if (!post_id) return;
    console.log("post_id", post_id)
    const commentQuery = query(
        collection(db, "Comment"),
        where("post_id", "==", post_id)
    );
    const uncomment = onSnapshot(commentQuery, (querySnapshot) => {
        // const followers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // const followers = querySnapshot.docs.map(doc => ({ ...doc.data() }));
        const commentPostById = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("commentPostById", commentPostById)
        dispatch(setComentById({ commentPostById, post_id }));
    }, (error) => {
        console.error('Error fetching follower: ', error);
    });

    return uncomment; // Trả về hàm unsubscribe để có thể dừng lắng nghe khi cần
};


export const CommentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setComentById: (state, action) => {
            const { commentPostById, post_id } = action.payload;
            state[post_id] = commentPostById;
            console.log("commentPostById setcommentPostById", post_id)
            console.log("commentPostById setcommentPostById", commentPostById)
            state.status = 'succeeded';
        },
    },
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

export const { setComentById } = CommentSlice.actions

export default CommentSlice.reducer;

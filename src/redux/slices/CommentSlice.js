import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, onSnapshot, query, or, orderBy, doc } from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseConfig'; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
    comment: [],
    status: 'idle',
    error: null,
};


export const createComment = createAsyncThunk('data/createComment', async (
    { comment_id, post_id, user_id, content, created_at, imgPost, comment_status_id }
) => {
    try {
        // console.log("toi day", imgPost)
        const docRef = await addDoc(collection(db, 'Comment'), {
            comment_id,
            post_id,
            user_id,
            content,
            created_at,
            imgPost: "",
            comment_status_id
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

export const updateCommentByField = createAsyncThunk(
    "data/updateCommentByField",
    async ({ comment_id, field, value }, { getState, dispatch }) => {
        console.log(comment_id, field, value)
        try {
            const commentRef = doc(db, "Comment", comment_id);

            await updateDoc(commentRef, {
                [field]: value,
            });
        } catch (error) {
            console.error("Error updating comment: ", error);
            throw error;
        }
    }
);


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

export const startListeningCommentByPostId = ({ post_id, sortBy }) => (dispatch) => {
    if (!post_id) return;
    // console.log("post_id", post_id)
    const commentQuery = query(
        collection(db, "Comment"),
        where("post_id", "==", post_id),
        where('comment_status_id', '<', 2),
        orderBy("created_at", sortBy)
        // orderBy("created_at", "desc", "asc")
    );
    const uncomment = onSnapshot(commentQuery, (querySnapshot) => {
        // const followers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // const followers = querySnapshot.docs.map(doc => ({ ...doc.data() }));
        const commentPostById = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("commentPostById", commentPostById)
        dispatch(setComentByPostId({ commentPostById, post_id }));
    }, (error) => {
        console.error('Error fetching comment: ', error);
    });

    return uncomment; // Trả về hàm unsubscribe để có thể dừng lắng nghe khi cần
};


export const countCommentsAndSubCommentsRealTime = ({ post_id }) => {
    try {
        const commentsQuery = query(
            collection(db, 'Comment'),
            where('post_id', '==', post_id),
            where('comment_status_id', '<', 2),
        );
        const unsubscribeComments = onSnapshot(commentsQuery, (commentsSnapshot) => {
            let commentsCount = commentsSnapshot.size;
            let subCommentsCount = 0;

            commentsSnapshot.forEach((doc) => {
                const commentId = doc.id;
                const subCommentsQuery = query(
                    collection(db, 'SubComment'),
                    where('comment_id', '==', commentId),
                    where("sub_comment_status_id", "<", 2),

                );
                onSnapshot(subCommentsQuery, (subCommentsSnapshot) => {
                    subCommentsCount += subCommentsSnapshot.size;
                    const totalCount = commentsCount + subCommentsCount;
                    // setTotalCount(totalCount);
                });
            });
            return commentsCount + subCommentsCount;
        });
        return () => {
            unsubscribeComments();
        };
    } catch (error) {
        console.error('Lỗi:', error);
    }
};

export const countCommentsAndSubComments = async ({ post_id }) => {
    try {
        const commentsQuery = query(
            collection(db, 'Comment'),
            where('post_id', '==', post_id),
            where('comment_status_id', '<', 2),
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsCount = commentsSnapshot.size;

        let subCommentsCount = 0;

        for (const doc of commentsSnapshot.docs) {
            const commentId = doc.id;
            const subCommentsQuery = query(
                collection(db, 'SubComment'),
                where('comment_id', '==', commentId),
                where("sub_comment_status_id", "<", 2),
            );
            const subCommentsSnapshot = await getDocs(subCommentsQuery);
            subCommentsCount += subCommentsSnapshot.size;
        }

        const totalCount = commentsCount + subCommentsCount;

        // console.log('Tổng số lượng comment và subcomment:', totalCount);
        return totalCount;
    } catch (error) {
        console.error('Lỗi:', error);
    }
};


export const startListeningCommentByID = ({ comment_id }) => (dispatch) => {
    console.log("comment_id", comment_id)
    if (!comment_id) return;

    const commentQuery = query(
        collection(db, "Comment"),
        where("comment_id", "==", comment_id)
    );
    const unsubscribe = onSnapshot(commentQuery, (querySnapshot) => {
        const commentById = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        };
        dispatch(setCommentById({ comment_id: comment_id, commentById: commentById }));
    }, (error) => {
        console.error('Error fetching follower: ', error);
    });

    return unsubscribe; // Trả về hàm unsubscribe để có thể dừng lắng nghe khi cần
};





export const CommentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setComentByPostId: (state, action) => {
            const { commentPostById, post_id } = action.payload;
            state[post_id] = commentPostById;
            // console.log("commentPostById setcommentPostById", post_id)
            // console.log("commentPostById setcommentPostById", commentPostById)
            state.status = 'succeeded';
        },
        setCommentById: (state, action) => {
            const { comment_id, commentById } = action.payload;
            state[comment_id] = commentById;
            // console.log("commentPostById setcommentPostById", post_id)
            // console.log("commentPostById setcommentPostById", commentPostById)
            state.status = 'succeeded';
        },

    },
    extraReducers: (builder) => {
        builder

    },
});

export const { setComentByPostId, setCommentById } = CommentSlice.actions

export default CommentSlice.reducer;

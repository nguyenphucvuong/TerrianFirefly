import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, onSnapshot, query, orderBy, or } from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseConfig'; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
    comment: [],
    status: 'idle',
    error: null,
};



export const createSubComment = createAsyncThunk('data/createSubComment', async (
    { sub_comment_id, comment_id, user_id, content, created_at, imgPost, tag_user_id }
) => {
    try {
        console.log("toi day", sub_comment_id, comment_id, user_id, content, created_at, imgPost)
        const docRef = await addDoc(collection(db, 'SubComment'), {
            sub_comment_id,
            comment_id,
            user_id,
            tag_user_id: tag_user_id ? tag_user_id : "",
            content,
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
                sub_comment_id: docRef.id,
                imgPost: imgUrl,
            });
        }
        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
            sub_comment_id: docRef.id,
        });

        if (docSnap.exists()) {
            return { sub_comment_id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('No such document!');
        }
    } catch (error) {
        console.error('Error adding document: ', error);
        throw error;
    }
});





export const startListeningSubCommentByPostId = ({ comment_id }) => (dispatch) => {
    if (!comment_id) return;
    // console.log("comment_id", comment_id)
    const commentQuery = query(
        collection(db, "SubComment"),
        where("comment_id", "==", comment_id),
        orderBy("created_at", "desc")
    );
    const uncomment = onSnapshot(commentQuery, (querySnapshot) => {
        // const followers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // const followers = querySnapshot.docs.map(doc => ({ ...doc.data() }));
        const subCommentPostById = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("commentPostById", commentPostById)
        dispatch(setSubComentById({ subCommentPostById, comment_id }));
    }, (error) => {
        console.error('Error fetching subComment: ', error);
    });

    return uncomment; // Trả về hàm unsubscribe để có thể dừng lắng nghe khi cần
};

export const countSubComments = async ({ comment_id }) => {
    try {
        const commentsQuery = query(
            collection(db, 'SubComment'),
            where('comment_id', '==', comment_id)
        );
        const commentsSnapshot = await getDocs(commentsQuery);



        const totalCount = commentsSnapshot.size;

        // console.log('Tổng số lượng subcomment:', totalCount);
        return totalCount;
    } catch (error) {
        console.error('Lỗi:', error);
    }
};


export const SubCommentSlice = createSlice({
    name: 'subComment',
    initialState,
    reducers: {
        setSubComentById: (state, action) => {
            const { subCommentPostById, comment_id } = action.payload;
            state[comment_id] = subCommentPostById;
            // console.log("subCommentPostById comment_id", comment_id)
            // console.log("subCommentPostById", subCommentPostById)
            state.status = 'succeeded';
        },
    },
    extraReducers: (builder) => {
        builder

    },
});

export const { setSubComentById } = SubCommentSlice.actions

export default SubCommentSlice.reducer;

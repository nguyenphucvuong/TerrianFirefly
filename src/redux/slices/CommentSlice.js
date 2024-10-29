import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    comment: [],
    status: 'idle',
    error: null,
};

// Tạo async thunk để thêm dữ liệu lên Firestore
export const createComment = createAsyncThunk('data/createComment', async (newData) => {
    try {
        // Thêm dữ liệu mới vào Firestore
        // const docRef = await addDoc(collection(db, 'Comment'), newData);
        const docRef = await addDoc(collection(db, 'Comment'), newData);

        // Lấy tài liệu vừa thêm từ Firestore
        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
            id: docRef.id, // Lưu ID vào tài liệu
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

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getComment = createAsyncThunk('data/getComment', async ({ post_id }) => {
    try {
        const querySnapshot = await getDocs(collection(db, "Comment"), where('post_id' == post_id));
        querySnapshot.forEach((doc) => {
            // console.log(`post: ${doc.id} => `, doc.data());
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
            // Xử lý khi thêm dữ liệu thành công
            .addCase(createComment.fulfilled, (state, action) => {
                state.comment.push(action.payload); // Thêm dữ liệu mới vào state
                state.status = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(createComment.pending, (state) => {
                state.status = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(createComment.rejected, (state, action) => {
                state.error = action.error.message; // Lưu lỗi nếu quá trình thêm thất bại
                state.status = 'failed'; // Đánh dấu thất bại
            })

            // Xử lý khi lấy dữ liệu thành công
            .addCase(getComment.fulfilled, (state, action) => {
                state.comment = action.payload; // Cập nhật danh sách bài đăng
                state.status = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(getComment.pending, (state) => {
                state.status = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(getComment.rejected, (state, action) => {
                state.error = action.error.message; // Lưu lỗi nếu quá trình lấy thất bại
                state.status = 'failed'; // Đánh dấu thất bại
            });

    },
});

// export const { setPost } = PostSlice.actions

export default CommentSlice.reducer;

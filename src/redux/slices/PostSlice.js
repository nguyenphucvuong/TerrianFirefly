import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig'; // Firebase config

// Trạng thái ban đầu
const initialState = {
    post: [],
    status: 'idle',
    error: null,
};

// Tạo async thunk để thêm dữ liệu lên Firestore
export const createPost = createAsyncThunk('data/createPost', async (newData) => {
    try {
        // Thêm dữ liệu mới vào Firestore
        const docRef = await addDoc(collection(db, 'Posts'), newData);

        // Lấy tài liệu vừa thêm từ Firestore
        const docSnap = await getDoc(docRef);

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
export const getPosts = createAsyncThunk('data/getPosts', async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "Posts"));
        querySnapshot.forEach((doc) => {
            // console.log(`post: ${doc.id} => `, doc.data());
        });
        //const querySnapshot = await getDocs(collection(db, "Posts")); // Thay "Posts" bằng tên bộ sưu tập của bạn
        const postData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Lấy dữ liệu và ID của từng tài liệu

        //console.log("Danh sách post: ",postData[0].imgPost);
        return postData; // Trả về danh sách bài đăng
    } catch (error) {
        console.error('Error fetching posts: ', error);
        throw error;
    }
});

// Tạo slice cho Post
export const PostSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Xử lý khi thêm dữ liệu thành công
            .addCase(createPost.fulfilled, (state, action) => {
                state.post.push(action.payload); // Thêm dữ liệu mới vào state
                state.status = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(createPost.pending, (state) => {
                state.status = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(createPost.rejected, (state, action) => {
                state.error = action.error.message; // Lưu lỗi nếu quá trình thêm thất bại
                state.status = 'failed'; // Đánh dấu thất bại
            })

            // Xử lý khi lấy dữ liệu thành công
            .addCase(getPosts.fulfilled, (state, action) => {
                state.post = action.payload; // Cập nhật danh sách bài đăng
                state.status = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(getPosts.pending, (state) => {
                state.status = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.error = action.error.message; // Lưu lỗi nếu quá trình lấy thất bại
                state.status = 'failed'; // Đánh dấu thất bại
            });

    },
});

// export const { setPost } = PostSlice.actions

export default PostSlice.reducer;
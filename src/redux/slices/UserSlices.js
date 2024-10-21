import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, auth } from '../../firebase/FirebaseConfig';
import { collection, addDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

// Trạng thái ban đầu
const initialState = {
    user: null,
    statusUser: 'idle',
    errorUser: null,
};
//

//đăng ký với email, passWord
// const handleSinginWithEmail = async () => {
//     if (!email || !password || !name) {
//         customAlert('Thông báo', 'vui lòng nhập đầy đủ thông tin', 'OK', 'cancel')
//     }
//     else if (!validateUsername(name)) {
//         setErrorTextName('Tên người dùng phải có ít nhất 2 ký tự và không được chứa ký tự đặc biệt');
//     }
//     else if (!validateEmail(email)) {
//         setErrorTextEmail('Email không hợp lệ');
//     }
//     else if (!validatePassword(password)) {
//         setErrorTextPass('Mật khẩu phải có ít nhất 6 ký tự và bao gồm cả chữ và số');
//     }
//     else {
//         //kiểm tra thành công
//         setErrorTextEmail('');
//         setErrorTextName('');
//         setErrorTextPass('');
//         await createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 // Signed up 
//                 customAlert('Thông báo', 'Đăng ký thành công.', 'OK', 'cancel')
//                 addUser(name, email, password)
//                 navigation.navigate('LoginScreen')
//                 user = userCredential.user;

//                 // ...
//             })
//             .catch((error) => {
//                 if (error.message == 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
//                     customAlert('Thông báo', 'Mật khẩu phải chứa ít nhất 6 ký tự', 'OK', 'cancel')
//                 }
//                 else if (error.message == 'Firebase: Error (auth/email-already-in-use).') {
//                     setErrorTextEmail('Email đã tồn tại.', 'OK', 'cancel')
//                 }
//                 else {
//                     customAlert('Thông báo', 'Đăng ký không thành công.', 'OK', 'cancel')
//                 }
//                 console.log('er', error.message);

//             });
//     }
// }

// Tạo async thunk để lấy tất cả dữ liệu từ Firestore
export const getUser = createAsyncThunk('data/getUser', async (email) => {
    
    
    try {
        const q = query(collection(db, 'user'), where('email', '==', email));
                const querySnapshot = await getDocs(q);

                const posts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                return posts;
            } catch (err) {
                return err.message;
            }
       
});

// Tạo slice cho hashtag
export const UserSlices = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Xử lý khi lấy dữ liệu thành công
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload; // Cập nhật danh sách
                state.statusUser = 'succeeded'; // Đánh dấu thành công
            })
            .addCase(getUser.pending, (state) => {
                state.statusUser = 'loading'; // Đánh dấu trạng thái đang tải
            })
            .addCase(getUser.rejected, (state, action) => {
                state.errorUser = action.error.message; // Lưu lỗi nếu quá trình lấy thất bại
                state.statusUser = 'failed'; // Đánh dấu thất bại
            });

    },
});

// export const { sethashtag } = UserSlice.actions

export default UserSlices.reducer;

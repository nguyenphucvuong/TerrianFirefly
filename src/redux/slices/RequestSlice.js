import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, onSnapshot, query, orderBy, or, doc } from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseConfig'; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
    pending: [],
    accepted: [],
    rejected: [],
    status: 'idle',
    error: null,
};

export const createRequest = createAsyncThunk('data/createRequest', async (
    { request_id, user_id, hashtag_id, created_at, info_img1, info_img2, info_img3, description, status }
) => {
    try {
        const docRef = await addDoc(collection(db, 'Request'), {
            request_id,
            user_id,
            hashtag_id,
            created_at,
            info_img1,
            info_img2,
            info_img3,
            description,
            status,
        });


        if (info_img1 && info_img2 && info_img3) {
            const images = [info_img1, info_img2, info_img3];
            for (let i = 0; i < images.length; i++) {
                const response = await fetch(images[i].uri)
                const blob = await response.blob(); // Chuyển đổi URL thành dạng nhị phân
                const imgRef = ref(storage, `images/${images[i].uri.split("/").pop()}`); // Đặt tên cho ảnh

                // Tải lên ảnh và lấy URL tải về
                await uploadBytes(imgRef, blob);
                const imgUrl = await getDownloadURL(imgRef);

                // Cập nhật tài liệu với ID và URL ảnh
                await updateDoc(docRef, {
                    [`info_img${i + 1}`]: imgUrl,
                });
            }
        }

        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
            request_id: docRef.id,
        });

        if (docSnap.exists()) {
            return { request_id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('No such Request!');
        }
    } catch (error) {
        console.error('Error adding Request: ', error);
        throw error;
    }
});


export const updateRequest = createAsyncThunk(
    "user/updateRequest",
    async ({ request_id, field, value }, { getState, dispatch }) => {
        try {
            const requestRef = doc(db, "Request", request_id);
            await updateDoc(requestRef, {
                [field]: value,
            });

            const updatedSnap = await getDoc(requestRef);
            // console.log("updatedSnap", updatedSnap.data());
            if (updatedSnap.exists()) {
                return {
                    id: updatedSnap.id,
                    ...updatedSnap.data(),
                };
            } else {
                throw new Error("Request not found");
            }
        } catch (error) {
            console.error("Error Update Request: ", error);
            throw error;
        }
    }
);

export const startListeningRequestPending = ({ }) => (dispatch) => {
    const requestQuery = query(
        collection(db, "Request"),
        where("status", "==", "pending"),
    );
    const unRequest = onSnapshot(requestQuery, (querySnapshot) => {

        const requestByUserId = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data };
        });
        dispatch(setRequestPending(requestByUserId));
    }, (error) => {
        console.error('Error fetching request: ', error);
    });
    return unRequest;
};

export const startListeningRequestAccepted = ({ }) => (dispatch) => {
    const requestQuery = query(
        collection(db, "Request"),
        where("status", "==", "accepted"),
    );
    const unRequest = onSnapshot(requestQuery, (querySnapshot) => {

        const requestByUserId = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data };
        });
        dispatch(setRequestAccepted(requestByUserId));
    }, (error) => {
        console.error('Error fetching request: ', error);
    });
    return unRequest;
};

export const startListeningRequestRejected = ({ }) => (dispatch) => {
    const requestQuery = query(
        collection(db, "Request"),
        where("status", "==", "rejected"),
    );
    const unRequest = onSnapshot(requestQuery, (querySnapshot) => {

        const requestByUserId = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data };
        });
        dispatch(setRequestRejected(requestByUserId));
    }, (error) => {
        console.error('Error fetching request: ', error);
    });
    return unRequest;
};


export const RequestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        setRequestPending: (state, action) => {
            state.pending = action.payload;
            // console.log("pending", state.pending)
            state.status = 'succeeded';
        },

        setRequestAccepted: (state, action) => {
            state.accepted = action.payload;
            // console.log("accepted", state.accepted)
            state.status = 'succeeded';

        },
        setRequestRejected: (state, action) => {
            state.rejected = action.payload;
            // console.log("rejected", state.rejected)
            state.status = 'succeeded';
        },


    },
    extraReducers: (builder) => {
        builder

    },
});

export const { setRequestPending, setRequestAccepted, setRequestRejected } = RequestSlice.actions

export default RequestSlice.reducer;

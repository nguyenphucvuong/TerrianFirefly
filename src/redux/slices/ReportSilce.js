import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, onSnapshot, query, orderBy, or, doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseConfig'; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { sub } from '@tensorflow/tfjs';

// Trạng thái ban đầu
const initialState = {
    post: [],
    comment: [],
    subComment: [],
    status: 'idle',
    error: null,
};


export const createReport = createAsyncThunk('data/createReport', async (
    { report_id, item_id, item_type, status, reported_at, status_changed_at, user_id_reported, user_id_reporter }
) => {
    try {
        // console.log("toi day", report_id, user_id, reason, created_at, type)
        const docRef = await addDoc(collection(db, 'Report'), {
            report_id,
            item_id,
            item_type,
            status,
            reported_at,
            status_changed_at,
            user_id_reported,
            user_id_reporter,
        });


        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
            report_id: docRef.id,
        });

        if (docSnap.exists()) {
            return { report_id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('No such report!');
        }
    } catch (error) {
        console.error('Error adding report: ', error);
        throw error;
    }
});


export const updateReport = createAsyncThunk(
    "user/updateReport",
    async ({ report_id, field, value }, { getState, dispatch, rejectWithValue }) => {
        console.log(report_id, field, value)
        try {
            const reportRef = doc(db, "Report", report_id); // Tham chiếu đến tài liệu người dùng
            // Cập nhật các trường trong tài liệu
            await updateDoc(reportRef, {
                [field]: value,
            });

            // Lấy lại thông tin người dùng đã được cập nhật từ Firestore
            const updatedSnap = await getDoc(reportRef);
            console.log("updatedSnap", updatedSnap.data());
            if (updatedSnap.exists()) {
                return {
                    id: updatedSnap.id,
                    ...updatedSnap.data(),
                };
            } else {
                throw new Error("Report not found");
            }
        } catch (error) {
            console.error("Error Update Report: ", error);
            throw error;
            // return rejectWithValue("Error updating report");
        }
    }
);

export const deleteReport = createAsyncThunk(
    "user/deleteReport",
    async ({ report_id }, { getState, dispatch, rejectWithValue }) => {
        try {
            const reportRef = doc(db, "Report", report_id); // Tham chiếu đến tài liệu người dùng
            // Cập nhật các trường trong tài liệu
            await deleteDoc(reportRef);
            return report_id;
        } catch (error) {
            console.error("Error Delete Report: ", error);
            throw error;
            // return rejectWithValue("Error updating report");
        }
    }
);


export const startListeningReportByPostId = ({ }) => (dispatch) => {
    const reportQuery = query(
        collection(db, "Report"),
        where("item_type", "==", "post"),
    );
    const unReport = onSnapshot(reportQuery, (querySnapshot) => {

        const reportPostById = querySnapshot.docs.map(doc => {
            const data = doc.data(); // Extract post_id from the report content 
            return { id: doc.id, ...data };
        });
        dispatch(setReportPostById(reportPostById));
    }, (error) => {
        console.error('Error fetching report: ', error);
    });
    return unReport;
};

export const startListeningReportByCommentId = ({ }) => (dispatch) => {
    const reportQuery = query(
        collection(db, "Report"),
        where("item_type", "==", "comment"),
    );
    const unReport = onSnapshot(reportQuery, (querySnapshot) => {

        const reportPostById = querySnapshot.docs.map(doc => {
            const data = doc.data(); // Extract post_id from the report content 
            return { id: doc.id, ...data };
        });

        dispatch(setReportCommentById(reportPostById));
    }, (error) => {
        console.error('Error fetching report: ', error);
    });
    return unReport;
};

export const startListeningReportBySubCommentId = ({ }) => (dispatch) => {
    const reportQuery = query(
        collection(db, "Report"),
        where("item_type", "==", "sub_comment"),
    );
    const unReport = onSnapshot(reportQuery, (querySnapshot) => {

        const reportSubComment = querySnapshot.docs.map(doc => {
            const data = doc.data(); // Extract post_id from the report content 
            return { id: doc.id, ...data };
        });
        // console.log("reportSubComment", reportSubComment)
        dispatch(setReportSubCommentById(reportSubComment));
    }, (error) => {
        console.error('Error fetching report: ', error);
    });
    return unReport;
};


export const ReportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setReportPostById: (state, action) => {
            state.post = action.payload;
            state.status = 'succeeded';
        },
        setReportCommentById: (state, action) => {
            state.comment = action.payload;
            state.status = 'succeeded';
        },
        setReportSubCommentById: (state, action) => {
            state.subComment = action.payload;
            state.status = 'succeeded';
        },
    },
    extraReducers: (builder) => {
        builder

    },
});

export const { setReportPostById, setReportCommentById, setReportSubCommentById } = ReportSlice.actions

export default ReportSlice.reducer;

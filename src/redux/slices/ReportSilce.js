import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, where, updateDoc, onSnapshot, query, orderBy, or } from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseConfig'; // Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage

// Trạng thái ban đầu
const initialState = {
    status: 'idle',
    error: null,
};

export const createReport = createAsyncThunk('data/createReport', async (
    { report_id, user_id, reason, created_at, type, status }
) => {
    try {
        // console.log("toi day", report_id, user_id, reason, created_at, type)
        const docRef = await addDoc(collection(db, 'Report'), {
            report_id,
            user_id,
            reason,
            created_at,
            type,
            status,
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


export const updateReport = updateReport(
    "user/updateReport",
    async ({ report_id, field, value }, { getState, dispatch }) => {
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
        }
    }
);

export const startListeningReportByPostId = ({ }) => (dispatch) => {
    const reportQuery = query(
        collection(db, "Report"),
        where("type", "==", "post"),
    );
    const unReport = onSnapshot(reportQuery, (querySnapshot) => {

        const reportPostById = querySnapshot.docs.map(doc => {
            const data = doc.data(); // Extract post_id from the report content 
            return { id: doc.id, ...data };
        });
        reportPostById.forEach(report => {
            dispatch(setReportPostById({ reportData: report, report_id: report.report_id }));
        });
    }, (error) => {
        console.error('Error fetching report: ', error);
    });
    return unReport;
};

export const startListeningReportByCommentId = ({ }) => (dispatch) => {
    const reportQuery = query(
        collection(db, "Report"),
        where("type", "==", "comment"),
    );
    const unReport = onSnapshot(reportQuery, (querySnapshot) => {

        const reportPostById = querySnapshot.docs.map(doc => {
            const data = doc.data(); // Extract post_id from the report content 
            return { id: doc.id, ...data };
        });
        reportPostById.forEach(report => {
            dispatch(setReportCommentById({ reportData: report, report_id: report.report_id }));
        });
    }, (error) => {
        console.error('Error fetching report: ', error);
    });
    return unReport;
};

export const startListeningReportBySubCommentId = ({ }) => (dispatch) => {
    const reportQuery = query(
        collection(db, "Report"),
        where("type", "==", "subComment"),
    );
    const unReport = onSnapshot(reportQuery, (querySnapshot) => {

        const reportPostById = querySnapshot.docs.map(doc => {
            const data = doc.data(); // Extract post_id from the report content 
            return { id: doc.id, ...data };
        });
        reportPostById.forEach(report => {
            dispatch(setReportSubCommentById({ reportData: report, report_id: report.report_id }));
        });
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
            const { reportData, report_id } = action.payload;
            state.post[report_id] = reportData;
            // console.log("subCommentPostById comment_id", comment_id)
            // console.log("subCommentPostById", subCommentPostById)
            state.status = 'succeeded';
        },

        setReportCommentById: (state, action) => {

        },
        setReportSubCommentById: (state, action) => {

        },
    },
    extraReducers: (builder) => {
        builder

    },
});

export const { setReportPostById, setReportCommentById, setReportSubCommentById } = ReportSlice.actions

export default ReportSlice.reducer;

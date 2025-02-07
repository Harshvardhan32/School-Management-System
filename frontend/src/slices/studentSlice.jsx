import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allStudents: [],
    studentDetails: null
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setStudents(state, action) {
            state.allStudents = action.payload;
        },
        setStudentDetails(state, action) {
            state.studentDetails = action.payload;
        }
    },
});

export const { setLoading, setStudents, setStudentDetails } = studentSlice.actions;
export default studentSlice.reducer;
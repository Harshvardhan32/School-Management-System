import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    paginatedStudents: [],
    allStudents: [],
    totalPages: 0,
    currentPage: 1,
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setStudents(state, action) {
            state.allStudents = action.payload; // Non-paginated students
        },
        setPaginatedStudents(state, action) {
            state.paginatedStudents = action.payload.data; // Paginated students
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setStudents, setPaginatedStudents } = studentSlice.actions;
export default studentSlice.reducer;
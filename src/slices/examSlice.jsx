import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    paginatedExams: [],
    allExams: [],
    totalPages: 0,
    currentPage: 1,
};

const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setExams(state, action) {
            state.allExams = action.payload; // Non-paginated exams
        },
        setPaginatedExams(state, action) {
            state.paginatedExams = action.payload.data; // Paginated exams
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setExams, setPaginatedExams } = examSlice.actions;
export default examSlice.reducer;
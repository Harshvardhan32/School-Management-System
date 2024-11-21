import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    paginatedTeachers: [],
    allTeachers: [],
    totalPages: 0,
    currentPage: 1,
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setTeachers(state, action) {
            state.allTeachers = action.payload; // Non-paginated teachers
        },
        setPaginatedTeachers(state, action) {
            state.paginatedTeachers = action.payload.data; // Paginated teachers
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setTeachers, setPaginatedTeachers } = teacherSlice.actions;
export default teacherSlice.reducer;
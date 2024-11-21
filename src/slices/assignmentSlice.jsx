import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    paginatedAssignments: [], // For paginated data
    allAssignments: [], // For non-paginated data
    totalPages: 0,
    currentPage: 1,
};

const assignmentSlice = createSlice({
    name: 'assignments',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAssignments(state, action) {
            state.allAssignments = action.payload; // Non-paginated data
        },
        setPaginatedAssignments(state, action) {
            state.paginatedAssignments = action.payload.data; // Paginated data
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setAssignments, setPaginatedAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;
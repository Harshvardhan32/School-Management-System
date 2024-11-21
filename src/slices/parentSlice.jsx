import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    paginatedParents: [],
    allParents: [],
    totalPages: 0,
    currentPage: 1,
};

const parentSlice = createSlice({
    name: 'parent',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setParents(state, action) {
            state.allParents = action.payload; // Non-paginated parents
        },
        setPaginatedParents(state, action) {
            state.paginatedParents = action.payload.data; // Paginated parents
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setParents, setPaginatedParents } = parentSlice.actions;
export default parentSlice.reducer;
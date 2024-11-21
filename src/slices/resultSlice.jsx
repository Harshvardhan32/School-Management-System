import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    paginatedResults: [],
    allResults: [],
    totalPages: 0,
    currentPage: 1,
};

const resultSlice = createSlice({
    name: 'result',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setResults(state, action) {
            state.allResults = action.payload; // Non-paginated results
        },
        setPaginatedResults(state, action) {
            state.paginatedResults = action.payload.data; // Paginated results
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setResults, setPaginatedResults } = resultSlice.actions;
export default resultSlice.reducer;
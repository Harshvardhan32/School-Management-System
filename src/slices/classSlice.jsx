import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    paginatedClasses: [],  // For paginated display
    allClasses: [],        // For forms (non-paginated)
    totalPages: 0,         // Total pages for paginated data
    currentPage: 1,        // Current page for paginated data
};

// Slice definition
const classSlice = createSlice({
    name: 'class',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setPaginatedClasses(state, action) {
            state.paginatedClasses = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
        setAllClasses(state, action) {
            state.allClasses = action.payload;
        },
    }
});

export const { setLoading, setPaginatedClasses, setAllClasses } = classSlice.actions;
export default classSlice.reducer;
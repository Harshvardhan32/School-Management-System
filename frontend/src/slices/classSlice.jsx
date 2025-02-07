import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    allClasses: [],
};

// Slice definition
const classSlice = createSlice({
    name: 'class',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAllClasses(state, action) {
            state.allClasses = action.payload;
        },
    }
});

export const { setLoading, setAllClasses } = classSlice.actions;
export default classSlice.reducer;
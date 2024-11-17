import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    classes: []
}

// Slice definition
const classSlice = createSlice({
    name: 'class',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setClasses(state, action) {
            state.classes = action.payload;
        },
    }
});

export const { setLoading, setClasses } = classSlice.actions;
export default classSlice.reducer;
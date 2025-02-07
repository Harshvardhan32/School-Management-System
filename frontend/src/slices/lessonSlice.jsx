import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    allLessons: []
};

// Slice definition
const lessonSlice = createSlice({
    name: 'lesson',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAllLessons(state, action) {
            state.allLessons = action.payload;
        },
    }
});

export const { setLoading, setAllLessons } = lessonSlice.actions;
export default lessonSlice.reducer;
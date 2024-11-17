import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    lessons: []
}

// Slice definition
const lessonSlice = createSlice({
    name: 'lesson',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setLessons(state, action) {
            state.lessons = action.payload;
        },
    }
});

export const { setLoading, setLessons } = lessonSlice.actions;
export default lessonSlice.reducer;
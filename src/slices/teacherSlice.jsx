import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allTeachers: [],
    teacherDetails: null,
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setTeachers(state, action) {
            state.allTeachers = action.payload;
        },
        setTeacherDetails(state, action) {
            state.teacherDetails = action.payload;
        }
    },
});

export const { setLoading, setTeachers, setTeacherDetails } = teacherSlice.actions;
export default teacherSlice.reducer;
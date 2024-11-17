import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    teachers: [],
}

const teacherSlice = createSlice({
    name: 'teacher',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload
        },
        setTeachers(state, action) {
            state.teachers = action.payload;
        }
    }
});

export const { setTeachers, setLoading } = teacherSlice.actions;
export default teacherSlice.reducer;
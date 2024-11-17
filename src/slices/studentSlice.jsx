import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    students: [],
}

const studentSlice = createSlice({
    name: 'student',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload
        },
        setStudents(state, action) {
            state.students = action.payload;
        }
    }
});

export const { setStudents, setLoading } = studentSlice.actions;
export default studentSlice.reducer;
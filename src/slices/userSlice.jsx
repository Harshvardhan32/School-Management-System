import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    teachers: [],
    students: [],
    parents: [],
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload
        },
        setTeachers(state, action) {
            state.teachers = action.payload;
        },
        setStudents(state, action) {
            state.students = action.payload;
        },
        setParents(state, action) {
            state.parents = action.payload;
        }
    }
});

export const { setLoading, setTeachers, setStudents, setParents } = userSlice.actions;
export default userSlice.reducer;
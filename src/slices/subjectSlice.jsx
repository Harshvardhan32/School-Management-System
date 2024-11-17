import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    subjects: [],
}

const subjectSlice = createSlice({
    name: 'subject',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload
        },
        setSubjects(state, action) {
            state.subjects = action.payload;
        }
    }
});

export const { setSubjects, setLoading } = subjectSlice.actions;
export default subjectSlice.reducer;
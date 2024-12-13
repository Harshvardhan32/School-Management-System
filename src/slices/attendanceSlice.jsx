import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allAttendance: []
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAttendance(state, action) {
            state.allAttendance = action.payload;
        }
    },
});

export const { setLoading, setAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
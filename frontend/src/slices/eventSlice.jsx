import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    allEvents: [],
}

// Slice definition
const eventSlice = createSlice({
    name: 'event',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAllEvents(state, action) {
            state.allEvents = action.payload;
        }
    }
});

export const { setLoading, setAllEvents } = eventSlice.actions;
export default eventSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    allMessages: []
};

// Slice definition
const messageSlice = createSlice({
    name: 'message',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAllMessages(state, action) {
            state.allMessages = action.payload;
        },
    }
});

export const { setLoading, setAllMessages } = messageSlice.actions;
export default messageSlice.reducer;
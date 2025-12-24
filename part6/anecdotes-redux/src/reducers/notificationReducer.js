import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: "notification",
    initialState: "Anecdote app started",
    reducers: {
        setNotification(state, action) {
            return action.payload;
        },
    },
});

export const { setNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;

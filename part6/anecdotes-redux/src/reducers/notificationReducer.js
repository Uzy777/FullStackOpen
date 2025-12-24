import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: "notification",
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload;
        },
        clearNotification() {
            return null;
        },
    },
});

export const { setNotification, clearNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;

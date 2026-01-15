import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { setNotification, clearNotification } from "./notificationReducer";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
        clearUser() {
            return null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

/* ---------- THUNKS ---------- */

export const loginUser = (credentials) => {
    return async (dispatch) => {
        try {
            const user = await loginService.login(credentials);

            window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

            blogService.setToken(user.token);
            dispatch(setUser(user));
        } catch (error) {
            dispatch(
                setNotification({
                    message: "wrong username or password",
                    type: "error",
                })
            );

            setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);
        }
    };
};

export const logoutUser = () => {
    return (dispatch) => {
        window.localStorage.removeItem("loggedBlogappUser");
        blogService.setToken(null);
        dispatch(clearUser());
    };
};

export const initialiseUser = () => {
    return (dispatch) => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            blogService.setToken(user.token);
            dispatch(setUser(user));
        }
    };
};

export default userSlice.reducer;

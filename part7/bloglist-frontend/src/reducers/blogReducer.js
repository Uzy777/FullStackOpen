import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification, clearNotification } from "./notificationReducer";

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload;
        },
        appendBlog(state, action) {
            state.push(action.payload);
        },
    },
});

export const { setBlogs, appendBlog } = blogSlice.actions;

export const initialiseBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export const createBlog = (blogObject) => {
    return async (dispatch) => {
        try {
            await blogService.create(blogObject);

            // Re-fetch blogs so user is populated
            const blogs = await blogService.getAll();
            dispatch(setBlogs(blogs));

            dispatch(
                setNotification({
                    message: `a new blog "${blogObject.title}" by ${blogObject.author} added`,
                    type: "success",
                }),
            );

            setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);
        } catch (error) {
            dispatch(
                setNotification({
                    message: "could not create blog",
                    type: "error",
                }),
            );

            setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);
        }
    };
};

export const likeBlog = (blog) => {
    return async (dispatch) => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id,
        };

        await blogService.update(blog.id, updatedBlog);

        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export const deleteBlog = (id) => {
    return async (dispatch) => {
        await blogService.remove(id);

        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export default blogSlice.reducer;

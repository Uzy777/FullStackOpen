import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Blog from "../components/Blog";
import Notification from "../components/Notification";
import AddBlog from "../components/AddBlog";

import blogService from "../services/blogs";

import { initialiseBlogs, createBlog } from "../reducers/blogReducer";
import { initialiseUser, loginUser, logoutUser } from "../reducers/userReducer";
import { setNotification, clearNotification } from "../reducers/notificationReducer";

const Blogs = () => {
    const dispatch = useDispatch();

    // Redux state
    const blogs = useSelector((state) => state.blogs);
    const user = useSelector((state) => state.user);

    // Local state (UI only)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const [blogVisible, setBlogVisible] = useState(false);

    // Login handler
    const handleLogin = (event) => {
        event.preventDefault();

        dispatch(
            loginUser({
                username,
                password,
            })
        );

        setUsername("");
        setPassword("");
    };

    // Create blog
    const addBlog = (event) => {
        event.preventDefault();

        dispatch(createBlog({ title, author, url }));

        setTitle("");
        setAuthor("");
        setUrl("");
        setBlogVisible(false);
    };

    // Delete blog
    const handleDelete = async (blogToDelete) => {
        const ok = window.confirm(`Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`);
        if (!ok) return;

        try {
            await blogService.remove(blogToDelete.id);

            dispatch(
                setNotification({
                    message: `Deleted "${blogToDelete.title}"`,
                    type: "success",
                })
            );

            setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);

            dispatch(initialiseBlogs());
        } catch (error) {
            dispatch(
                setNotification({
                    message: "Failed to delete blog",
                    type: "error",
                })
            );

            setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);
        }
    };

    // If not logged in → show login form
    if (!user) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification />

                <form onSubmit={handleLogin}>
                    <div>
                        username
                        <input value={username} onChange={({ target }) => setUsername(target.value)} />
                    </div>
                    <div>
                        password
                        <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
                    </div>
                    <button type="submit">login</button>
                </form>
            </div>
        );
    }

    // Logged-in view
    return (
        <div>
            <h2>Blog App</h2>
            <Notification />

            {/* <p>
                {user.name} logged in <button onClick={() => dispatch(logoutUser())}>logout</button>
            </p> */}

            {!blogVisible && <button onClick={() => setBlogVisible(true)}>create new blog</button>}

            {blogVisible && (
                <div>
                    <AddBlog
                        addBlog={addBlog}
                        title={title}
                        author={author}
                        url={url}
                        handleTitleChange={({ target }) => setTitle(target.value)}
                        handleAuthorChange={({ target }) => setAuthor(target.value)}
                        handleUrlChange={({ target }) => setUrl(target.value)}
                    />
                    <button onClick={() => setBlogVisible(false)}>cancel</button>
                </div>
            )}

            <br />

            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} user={user} handleDelete={handleDelete} />
            ))}
        </div>
    );
};

export default Blogs;

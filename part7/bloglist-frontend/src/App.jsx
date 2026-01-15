import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlog from "./components/AddBlog";
import blogService from "./services/blogs";
import loginService from "./services/login";

import { useDispatch, useSelector } from "react-redux";
import { setNotification, clearNotification } from "./reducers/notificationReducer";
import { initialiseBlogs, createBlog } from "./reducers/blogReducer";
import { initialiseUser, loginUser, logoutUser } from "./reducers/userReducer";

const App = () => {
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blogs);
    const user = useSelector((state) => state.user);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const [blogVisible, setBlogVisible] = useState(false);

    useEffect(() => {
        dispatch(initialiseBlogs());
        dispatch(initialiseUser());
    }, [dispatch]);

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

    const addBlog = (event) => {
        event.preventDefault();

        dispatch(createBlog({ title, author, url }));

        setTitle("");
        setAuthor("");
        setUrl("");
        setBlogVisible(false);
    };

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

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification />

                <form onSubmit={handleLogin}>
                    <div>
                        username
                        <input name="username" value={username} onChange={({ target }) => setUsername(target.value)} />
                    </div>
                    <div>
                        password
                        <input name="password" value={password} type="password" onChange={({ target }) => setPassword(target.value)} />
                    </div>
                    <button type="submit">login</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification />

            <p>
                {user.name} logged in <button onClick={() => dispatch(logoutUser())}>logout</button>
            </p>

            {/* Toggle Form Visibility */}
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

export default App;

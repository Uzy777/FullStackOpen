import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlog from "./components/AddBlog";
import blogService from "./services/blogs";
import loginService from "./services/login";

import { useDispatch, useSelector } from "react-redux";
import { setNotification, clearNotification } from "./reducers/notificationReducer";
import { initialiseBlogs, createBlog } from "./reducers/blogReducer";

const App = () => {
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blogs);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const [blogVisible, setBlogVisible] = useState(false);

    useEffect(() => {
        dispatch(initialiseBlogs());
    }, [dispatch]);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
            setUser(user);
            setUsername("");
            setPassword("");
        } catch {
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
                {user.name} logged in{" "}
                <button
                    onClick={() => {
                        window.localStorage.removeItem("loggedBlogappUser");
                        setUser(null);
                    }}
                >
                    logout
                </button>
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

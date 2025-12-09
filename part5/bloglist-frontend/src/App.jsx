import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlog from "./components/AddBlog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const [blogVisible, setBlogVisible] = useState(false);

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
    }, []);

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
            setMessageType("error");
            setMessage("wrong username or password");
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const addBlog = async (event) => {
        event.preventDefault();

        try {
            const blogObject = { title, author, url };
            const returnedBlog = await blogService.create(blogObject);

            setBlogs(blogs.concat(returnedBlog));

            setMessageType("success");
            setMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`);
            setTimeout(() => setMessage(null), 5000);

            setTitle("");
            setAuthor("");
            setUrl("");

            setBlogVisible(false);
        } catch {
            setMessageType("error");
            setMessage("could not create blog");
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleDelete = async (blogToDelete) => {
        const ok = window.confirm(`Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`);
        if (!ok) return;

        try {
            await blogService.remove(blogToDelete.id);

            // Remove from state
            setBlogs(blogs.filter((b) => b.id !== blogToDelete.id));

            setMessageType("success");
            setMessage(`Deleted "${blogToDelete.title}"`);
            setTimeout(() => setMessage(null), 5000);
        } catch (error) {
            setMessageType("error");
            setMessage("Failed to delete blog");
            setTimeout(() => setMessage(null), 5000);
        }
    };

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification message={message} type={messageType} />

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
            <Notification message={message} type={messageType} />

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

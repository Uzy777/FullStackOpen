import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const [newBlog, setNewBlog] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
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
            console.log("wrong credentials");
            setTimeout(() => {
                console.log(null);
            }, 5000);
        }
    };

    const addBlog = async (event) => {
        event.preventDefault();

        const blogObject = {
            title,
            author,
            url,
        };

        const returnedBlog = await blogService.create(blogObject);
        setBlogs(blogs.concat(returnedBlog));

        // clear inputs
        setTitle("");
        setAuthor("");
        setUrl("");
    };

    const handleBlogChange = (event) => {
        setNewBlog(event.target.value);
    };

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>
                            username
                            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            password
                            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
                        </label>
                    </div>
                    <button type="submit">login</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h2>blogs</h2>
            <p>
                {user.name} logged in
                <button
                    type="submit"
                    onClick={() => {
                        window.localStorage.removeItem("loggedBlogappUser");
                    }}
                >
                    logout
                </button>
            </p>

            {/* 
            <form onSubmit={addBlog}>
                <input value={newBlog} onChange={handleBlogChange} />
                <button type="submit">save</button>
            </form> */}

            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <label>title: </label>
                <input value={title} onChange={({ target }) => setTitle(target.value)} />
                <br></br>
                <label>author: </label>
                <input value={author} onChange={({ target }) => setAuthor(target.value)} />
                <br></br>
                <label>url: </label>
                <input value={url} onChange={({ target }) => setUrl(target.value)} />
                <br></br>
                <button type="submit">create</button>
            </form>

            <br></br>

            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    );
};

export default App;

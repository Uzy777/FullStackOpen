import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Blogs from "./pages/Blogs";
import BlogView from "./pages/BlogView";
import Users from "./pages/Users";
import User from "./pages/User";

import { initialiseBlogs } from "./reducers/blogReducer";
import { initialiseUser, logoutUser } from "./reducers/userReducer";

const App = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);

    const navigate = useNavigate();

    // Initialise data once
    useEffect(() => {
        dispatch(initialiseBlogs());
        dispatch(initialiseUser());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <div>
            <nav class="nav">
                <Link to="/">blogs</Link>
                {" | "}
                <Link to="/users">users</Link>
                {user && (
                    <>
                        {" | "}
                        {user.name} logged in <button onClick={handleLogout}>logout</button>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogView />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<User />} />
            </Routes>
        </div>
    );
};

export default App;

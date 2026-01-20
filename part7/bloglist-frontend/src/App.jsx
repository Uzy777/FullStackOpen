import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import Blogs from "./pages/Blogs";
import BlogView from "./pages/BlogView";
import Users from "./pages/Users";
import User from "./pages/User";

import { initialiseBlogs } from "./reducers/blogReducer";
import { initialiseUser } from "./reducers/userReducer";

const App = () => {
    const dispatch = useDispatch();

    // Initialise data once
    useEffect(() => {
        dispatch(initialiseBlogs());
        dispatch(initialiseUser());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogView />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
        </Routes>
    );
};

export default App;

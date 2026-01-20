import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { likeBlog, deleteBlog } from "../reducers/blogReducer";
import { logoutUser } from "../reducers/userReducer";
import { useState } from "react";
import blogService from "../services/blogs";
import { initialiseBlogs } from "../reducers/blogReducer";

import { Form, Button } from "react-bootstrap";

const BlogView = () => {
    const [comment, setComment] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const blogs = useSelector((state) => state.blogs);
    const loggedInUser = useSelector((state) => state.user);

    const blog = blogs.find((b) => b.id === id);

    if (!blog || !loggedInUser) {
        return null;
    }

    const handleLike = () => {
        dispatch(likeBlog(blog));
    };

    const handleDelete = () => {
        if (window.confirm(`Remove blog "${blog.title}"?`)) {
            dispatch(deleteBlog(blog.id));
            navigate("/");
        }
    };

    const isOwner = blog.user?.username === loggedInUser.username;

    const handleAddComment = async (event) => {
        event.preventDefault();

        await blogService.addComment(blog.id, comment);

        setComment("");

        dispatch(initialiseBlogs());
    };

    return (
        <div>
            <h2>Blog App</h2>

            {/* <p>
                {loggedInUser.name} logged in{" "}
                <button
                    onClick={() => {
                        dispatch(logoutUser());
                        navigate("/");
                    }}
                >
                    logout
                </button>
            </p> */}

            <h2>{blog.title}</h2>

            <a href={blog.url}>{blog.url}</a>

            <p>
                likes {blog.likes} <Button onClick={handleLike}>like</Button>
            </p>

            <p>added by {blog.user?.name || blog.user?.username}</p>

            {isOwner && (
                <Button className="mb-3" onClick={handleDelete}>
                    remove
                </Button>
            )}

            <h3>Comments</h3>

            <Form onSubmit={handleAddComment}>
                <Form.Group className="mb-3">
                    <Form.Control value={comment} onChange={(e) => setComment(e.target.value)} className="mb-3" />
                    <Button type="submit">add comment</Button>
                </Form.Group>
            </Form>
            <ul>
                {blog.comments?.map((comment, index) => (
                    <li key={index}>{comment}</li>
                ))}
            </ul>
        </div>
    );
};

export default BlogView;

import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { likeBlog, deleteBlog } from "../reducers/blogReducer";
import { logoutUser } from "../reducers/userReducer";

const BlogView = () => {
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
                likes {blog.likes} <button onClick={handleLike}>like</button>
            </p>

            <p>added by {blog.user?.name || blog.user?.username}</p>

            {isOwner && <button onClick={handleDelete}>remove</button>}
        </div>
    );
};

export default BlogView;

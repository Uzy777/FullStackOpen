import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userReducer";

const User = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loggedInUser = useSelector((state) => state.user);
    const blogs = useSelector((state) => state.blogs);
    const { id } = useParams();

    if (!loggedInUser) {
        return null;
    }

    const userBlogs = blogs.filter((blog) => blog.user && blog.user.id === id);

    if (userBlogs.length === 0) {
        return null;
    }

    const user = userBlogs[0].user;

    return (
        <div>
            <h2>Blog App</h2>

            {/* <p>{loggedInUser.username} logged in</p>
            <button
                onClick={() => {
                    dispatch(logoutUser());
                    navigate("/");
                }}
            >
                logout
            </button> */}

            <h2>{user.name || user.username}</h2>

            <h3>added blogs</h3>
            <ul>
                {userBlogs.map((blog) => (
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default User;

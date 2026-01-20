import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userReducer";
import { Link } from "react-router-dom";

const Users = () => {
    const dispatch = useDispatch();

    const loggedInUser = useSelector((state) => state.user);

    const blogs = useSelector((state) => state.blogs);

    if (!loggedInUser) {
        return <p>No user logged in</p>;
    }

    const users = {};

    blogs.forEach((blog) => {
        const blogUser = blog.user;

        if (!blogUser) return;

        const userId = blogUser.id;

        if (!users[userId]) {
            users[userId] = {
                id: blogUser.id,
                username: blogUser.username,
                name: blogUser.name,
                blogs: 0,
            };
        }

        users[userId].blogs += 1;
    });

    const usersArray = Object.values(users);

    return (
        <div>
            <h2>Blog App</h2>

            {/* <p>{loggedInUser.username} logged in</p>
            <button onClick={() => dispatch(logoutUser())}>logout</button> */}
            <h2>Users</h2>

            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {usersArray.map((u) => (
                        <tr key={u.id}>
                            <td>
                                <Link to={`/users/${u.id}`}>{u.name || u.username}</Link>
                            </td>
                            <td>{u.blogs}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userReducer";

const Users = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const blogs = useSelector((state) => state.blogs);

    if (!user) {
        return <p>No user logged in</p>;
    }

    const users = {};

    blogs.forEach((blog) => {
        const username = blog.user?.username;

        if (!username) return;

        if (!users[username]) {
            users[username] = 0;
        }
        users[username] += 1;
    });

    const usersArray = Object.entries(users);

    return (
        <div>
            <h2>Users</h2>

            <p>{user.username} logged in</p>
            <button onClick={() => dispatch(logoutUser())}>logout</button>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {usersArray.map(([username, count]) => (
                        <tr key={username}>
                            <td>{username}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;

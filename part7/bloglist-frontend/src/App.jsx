import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Blogs from "./pages/Blogs";
import BlogView from "./pages/BlogView";
import Users from "./pages/Users";
import User from "./pages/User";

import { initialiseBlogs } from "./reducers/blogReducer";
import { initialiseUser, logoutUser } from "./reducers/userReducer";

import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

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
        <div className="container">
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand>Blog App</Navbar.Brand>

                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link>blogs</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/users">
                            <Nav.Link>users</Nav.Link>
                        </LinkContainer>
                    </Nav>

                    {user && (
                        <Navbar.Text>
                            Signed in as: <strong>{user.name}</strong>{" "}
                            <Button variant="outline-secondary" size="sm" className="ms-2" onClick={handleLogout}>
                                logout
                            </Button>
                        </Navbar.Text>
                    )}
                </Container>
            </Navbar>

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

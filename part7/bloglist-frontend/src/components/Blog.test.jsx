import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders title and author but not url or likes by default", () => {
    const blog = {
        title: "Test Blog",
        author: "Test Author",
        likes: 10,
        url: "http://example.com",
        user: { username: "tester", name: "Test User" },
    };

    const user = { username: "tester" };

    render(<Blog blog={blog} user={user} />);

    // visible by default
    expect(screen.getByText("Test Blog Test Author")).toBeDefined();

    // not visible by default
    expect(screen.queryByText("http://example.com")).toBeNull();
    expect(screen.queryByText("likes 10")).toBeNull();
});

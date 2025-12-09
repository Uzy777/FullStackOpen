import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("URL and likes are shown when view button is clicked", async () => {
    const blog = {
        title: "Test Blog",
        author: "Test Author",
        likes: 10,
        url: "http://example.com",
        user: { username: "tester", name: "Test User" },
    };

    const user = { username: "tester" };
    const mockDelete = vi.fn(); // optional, but required by props

    render(<Blog blog={blog} user={user} handleDelete={mockDelete} />);

    const userEvents = userEvent.setup();

    // click the view button
    const viewButton = screen.getByText("view");
    await userEvents.click(viewButton);

    // now URL becomes visible
    expect(screen.getByText("http://example.com")).toBeDefined();

    // now likes become visible
    expect(screen.getByText("likes 10")).toBeDefined();
});

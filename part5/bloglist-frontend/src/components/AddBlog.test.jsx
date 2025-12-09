import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBlog from "./AddBlog";
import { vi } from "vitest";

test("calls addBlog with correct details when creating a new blog", async () => {
    const user = userEvent.setup();

    const addBlog = vi.fn();
    const handleTitleChange = vi.fn();
    const handleAuthorChange = vi.fn();
    const handleUrlChange = vi.fn();

    render(
        <AddBlog
            addBlog={addBlog}
            title=""
            author=""
            url=""
            handleTitleChange={handleTitleChange}
            handleAuthorChange={handleAuthorChange}
            handleUrlChange={handleUrlChange}
        />
    );

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const authorInput = screen.getByRole("textbox", { name: /author/i });
    const urlInput = screen.getByRole("textbox", { name: /url/i });

    await user.type(titleInput, "Testing Title");
    await user.type(authorInput, "Testing Author");
    await user.type(urlInput, "http://example.com");

    const button = screen.getByRole("button", { name: /create/i });
    await user.click(button);

    expect(addBlog).toHaveBeenCalledTimes(1);
});

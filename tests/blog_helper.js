const { expect } = require("@playwright/test");

const loginWith = async (page, username, password) => {
    await page.getByRole("textbox").nth(0).fill(username); // Fill username
    await page.getByRole("textbox").nth(1).fill(password); // Fill password
    await page.getByRole("button", { name: /login/i }).click(); // Click login button

    // Wait for localStorage to be set (ensure user is logged in)
    await page.waitForFunction(() => window.localStorage.getItem("loggedBlogappUser") !== null);
    // Reload the page to ensure everything is set up correctly
    await page.reload();
};

const attemptLogin = async (page, username, password) => {
    await page.getByRole("textbox").nth(0).fill(username); // Fill username
    await page.getByRole("textbox").nth(1).fill(password); // Fill password
    await page.getByRole("button", { name: /login/i }).click(); // Click login button
};

const createBlog = async (page, { title, author, url }) => {
    // Open create blog form
    await page.getByRole("button", { name: /create new blog/i }).click();

    // Fill the blog creation form
    const inputs = await page.getByRole("textbox").all();
    await inputs[0].fill(title);
    await inputs[1].fill(author);
    await inputs[2].fill(url);

    // Submit the form to create the blog
    await page.getByRole("button", { name: /create/i }).click();
};

module.exports = { loginWith, attemptLogin, createBlog };

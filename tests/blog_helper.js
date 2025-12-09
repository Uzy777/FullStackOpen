// tests/blog_helper.js
const { expect } = require("@playwright/test");

const loginWith = async (page, username, password) => {
    await page.getByRole("textbox").nth(0).fill(username);
    await page.getByRole("textbox").nth(1).fill(password);
    await page.getByRole("button", { name: /login/i }).click();

    await page.waitForFunction(() => window.localStorage.getItem("loggedBlogappUser") !== null);

    await page.reload();
};

const attemptLogin = async (page, username, password) => {
    await page.getByRole("textbox").nth(0).fill(username);
    await page.getByRole("textbox").nth(1).fill(password);
    await page.getByRole("button", { name: /login/i }).click();
};

const createBlog = async (page, { title, author, url }) => {
    await page.getByRole("button", { name: /create new blog/i }).click();

    const inputs = await page.getByRole("textbox").all();
    await inputs[0].fill(title);
    await inputs[1].fill(author);
    await inputs[2].fill(url);

    await page.getByRole("button", { name: /create/i }).click();
};

module.exports = { loginWith, attemptLogin, createBlog };

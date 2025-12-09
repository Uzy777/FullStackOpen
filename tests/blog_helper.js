// tests/blog_helper.js
const { expect } = require("@playwright/test");

const loginWith = async (page, username, password) => {
    // Your blog login form: two inputs + login button
    await page.getByRole("textbox").nth(0).fill(username); // username
    await page.getByRole("textbox").nth(1).fill(password); // password
    await page.getByRole("button", { name: /login/i }).click();
};

module.exports = { loginWith };

// tests/blog_app.spec.js
const { test, describe, expect } = require("@playwright/test");
const { loginWith } = require("./blog_helper");

describe("Blog app", () => {
    test.beforeEach(async ({ page, request }) => {
        // reset DB
        await request.post("/api/testing/reset");

        // create user
        await request.post("/api/users", {
            data: {
                username: "testuser",
                name: "Test User",
                password: "sekret",
            },
        });

        // open app
        await page.goto("/");
    });

    test("Login form is shown", async ({ page }) => {
        await expect(page.getByText("Log in to application")).toBeVisible();
        await expect(page.getByText("username")).toBeVisible();
        await expect(page.getByText("password")).toBeVisible();
        await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    });

    describe("Login", () => {
        test("succeeds with correct credentials", async ({ page }) => {
            await loginWith(page, "testuser", "sekret");

            // assert that we're on the blogs view, not the login view
            await expect(page.getByText("blogs")).toBeVisible();
            await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
        });

        test("fails with wrong credentials", async ({ page }) => {
            await loginWith(page, "testuser", "wrong");

            const errorDiv = page.locator(".error"); // assuming Notification uses class "error"
            await expect(errorDiv).toContainText("wrong username or password");

            // still on login view
            await expect(page.getByText("Log in to application")).toBeVisible();
        });
    });
});

const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, attemptLogin, createBlog } = require("./blog_helper");

describe("Blog app", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("/api/testing/reset");
        await request.post("/api/users", {
            data: {
                name: "Matti Luukkainen",
                username: "mluukkai",
                password: "salainen",
            },
        });

        await page.goto("/");
    });

    test("Login form is shown", async ({ page }) => {
        await expect(page.getByText("Log in to application")).toBeVisible();
        await expect(page.getByText("username")).toBeVisible();
        await expect(page.getByText("password")).toBeVisible();
        await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    });

    describe("Login", () => {
        test("user can log in", async ({ page }) => {
            await loginWith(page, "mluukkai", "salainen");
            await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
        });

        test("login fails with wrong password", async ({ page }) => {
            await attemptLogin(page, "mluukkai", "wrong");

            const errorDiv = page.locator(".error");
            await expect(errorDiv).toContainText("wrong username or password");

            await expect(page.getByText("Matti Luukkainen logged in")).not.toBeVisible();

            const token = await page.evaluate(() => window.localStorage.getItem("loggedBlogappUser"));
            expect(token).toBeNull();
        });

        describe("when logged in", () => {
            beforeEach(async ({ page }) => {
                await loginWith(page, "mluukkai", "salainen");
                await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
            });
            test("a new blog can be created", async ({ page }) => {
                await createBlog(page, {
                    title: "Working with PCs",
                    author: "Playwright Tester",
                    url: "http://example.com",
                });

                await expect(page.locator(".success")).toContainText('a new blog "Working with PCs"');

                await expect(page.locator("div").filter({ hasText: "Working with PCs" }).first()).toBeVisible();
            });
        });
    });
});

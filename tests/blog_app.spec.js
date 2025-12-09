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

                const success = page.locator(".success");
                await expect(success).toContainText('a new blog "Working with PCs"');

                await expect(page.locator("div").filter({ hasText: "Working with PCs" }).first()).toBeVisible();
            });

            // test("a blog can be liked", async ({ page }) => {
            //     // Create a new blog
            //     await createBlog(page, {
            //         title: "Test Blog for Liking",
            //         author: "Playwright Tester",
            //         url: "http://playwright.test/blog",
            //     });

            //     // Locate the blog by its title
            //     const blog = page.locator("text=Test Blog for Liking").locator(".."); // Find the blog containing the title

            //     // Ensure there is only one "view" button for this blog and click it
            //     const viewBtn = blog.locator("button", { hasText: "view" }).first(); // Ensure we select the correct button
            //     await viewBtn.click();

            //     // Wait for the like button to be visible
            //     const likeBtn = blog.locator("button", { hasText: "like" });
            //     await likeBtn.waitFor({ state: "visible", timeout: 10000 });

            //     // Click the like button
            //     await likeBtn.click();

            //     // Wait for the like count to update (adding a small delay)
            //     await page.waitForTimeout(1000); // Add a small delay to allow the UI to update

            //     // Verify the number of likes has increased
            //     const likesParagraph = blog.locator("p", { hasText: "likes" });
            //     await expect(likesParagraph).toContainText("likes 1", { timeout: 5000 });
            // });
        });
    });
});

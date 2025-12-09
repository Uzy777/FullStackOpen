// tests/blog_app.spec.js
const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith } = require("./blog_helper");

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
            await loginWith(page, "mluukkai", "wrong");

            const errorDiv = page.locator(".error");
            await expect(errorDiv).toContainText("wrong username or password");
            await expect(errorDiv).toHaveCSS("border-style", "solid");
            await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

            await expect(page.getByText("Matti Luukkainen logged in")).not.toBeVisible();
        });
    });
});

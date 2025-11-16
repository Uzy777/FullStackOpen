const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
    { title: "Youtube the Start", author: "Google", url: "https://www.youtube.com", likes: 2 },
    { title: "Learning is good", author: "David Rodger", url: "https://www.fullstackopen.com", likes: 139123 },
];

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(initialBlogs[1]);
    await blogObject.save();
});

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("correct number of blogs is returned", async () => {
    const response = await api.get("/api/blogs");

    // Log to see what is actually returned
    console.log("Returned blogs:", response.body);

    // Check the number of blogs
    if (!Array.isArray(response.body)) {
        throw new Error("Response body is not an array");
    }

    if (response.body.length !== initialBlogs.length) {
        console.log("Expected:", initialBlogs.length);
        console.log("Got:", response.body.length);
    }

    // Final assertion
    assert.strictEqual(response.body.length, initialBlogs.length);
});

after(async () => {
    await mongoose.connection.close();
});

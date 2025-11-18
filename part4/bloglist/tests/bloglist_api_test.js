const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const helper = require("./test_helper");

const Blog = require("../models/blog");

const api = supertest(app);

// beforeEach(async () => {
//     await Blog.deleteMany({});
//     let blogObject = new Blog(initialBlogs[0]);
//     await blogObject.save();
//     blogObject = new Blog(initialBlogs[1]);
//     await blogObject.save();
// });

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(resultBlog.body, blogToView);
});

test("a valid blog can be added", async () => {
    const newBlog = {
        title: "New Blog Test",
        author: "Test Author",
        url: "http://example.com",
        likes: 5,
    };

    // Send POST request
    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    // Check blogs in DB
    const blogsAtEnd = await helper.blogsInDb();

    // Length increases by one
    assert.strict(blogsAtEnd.length, helper.initialBlogs.length + 1);

    // Check that the new blog is present
    const titles = blogsAtEnd.map((b) => b.title);
    assert(titles.includes("New Blog Test"));
});

test("if likes property is missing, it defaults to 0", async () => {
    const newBlog = {
        title: "Blog without likes",
        author: "Tester",
        url: "http://example.com",
        // likes is intentionally omitted
    };

    const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    // Verify default value
    assert.strictEqual(response.body.likes, 0);
});

after(async () => {
    await mongoose.connection.close();
});

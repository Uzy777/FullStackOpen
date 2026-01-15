const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const helper = require("./test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

let token;

const bcrypt = require("bcrypt");

beforeEach(async () => {
    // Clear blogs and users
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    await User.deleteMany({});

    // Hash password before saving
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();

    // Login and get token
    const loginResponse = await api.post("/api/login").send({ username: "root", password: "sekret" });

    token = loginResponse.body.token;
});

// ----------------- BLOG FETCH TESTS -----------------
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

// ----------------- BLOG ADD TESTS -----------------
test("a valid blog can be added", async () => {
    const newBlog = {
        title: "New Blog Test",
        author: "Test Author",
        url: "http://example.com",
        likes: 5,
    };

    await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(titles.includes("New Blog Test"));
});

test("if likes property is missing, it defaults to 0", async () => {
    const newBlog = {
        title: "Blog without likes",
        author: "Tester",
        url: "http://example.com",
    };

    const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
});

test("blog without title or url is not added", async () => {
    const newBlog = {
        author: "Test Author",
        likes: 5,
    };

    await api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("adding a blog fails with 401 if token is not provided", async () => {
    const newBlog = {
        title: "Unauthorized Blog",
        author: "Hacker",
        url: "http://example.com",
        likes: 0,
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);
});

// ----------------- BLOG DELETE TESTS -----------------
test("a blog can be deleted by the creator", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).set("Authorization", `Bearer ${token}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    const ids = blogsAtEnd.map((b) => b.id);
    assert(!ids.includes(blogToDelete.id));
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

// ----------------- BLOG UPDATE TEST -----------------
test("a blog can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 10,
    };

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, updatedData.likes);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, updatedData.likes);
});

// ----------------- USER VALIDATION TEST -----------------
test("username and password must be at least 3 chars", async () => {
    const newUser = {
        username: "ab",
        password: "12",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
});

after(async () => {
    await mongoose.connection.close();
});

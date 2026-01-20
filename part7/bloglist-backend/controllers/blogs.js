const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogsRouter.post("/", userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;

    if (!body.title || !body.url) {
        return response.status(400).json({ error: "title or url missing" });
    }

    const blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        user: user._id,
        likes: body.likes || 0,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
    const user = request.user; // \u2705 already available

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
        return response.status(404).json({ error: "blog not found" });
    }

    if (!blog.user) {
        return response.status(400).json({ error: "blog has no associated user" });
    }

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: "only the creator can delete this blog" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
    const { title, author, url, likes, user } = request.body;

    try {
        const blog = await Blog.findById(request.params.id);
        if (!blog) {
            return response.status(404).end();
        }

        blog.title = title;
        blog.author = author;
        blog.url = url;
        blog.likes = likes;

        if (user) {
            blog.user = user;
        }

        const updatedBlog = await blog.save();

        await updatedBlog.populate("user", { username: 1, name: 1 });

        response.json(updatedBlog);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

blogsRouter.post("/:id/comments", async (req, res) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: "comment missing" });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ error: "blog not found" });
    }

    blog.comments = blog.comments.concat(comment);
    const savedBlog = await blog.save();

    res.status(201).json(savedBlog);
});

module.exports = blogsRouter;

const Blog = require("../models/blog");

const initialBlogs = [
    { title: "Youtube the Start", author: "Google", url: "https://www.youtube.com", likes: 2 },
    { title: "Learning is good", author: "David Rodger", url: "https://www.fullstackopen.com", likes: 139123 },
];

const nonExistingId = async () => {
    const blog = new Blog({ content: "willremovethissoon" });
    await blog.save();
    await blog.deleteOne();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
};

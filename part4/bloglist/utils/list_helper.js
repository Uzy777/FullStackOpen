const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes;
    }, 0);
};

const favouriteBlog = (blogs) => {
    return blogs.reduce((currentBest, blog) => {
        if (blog.likes > currentBest.likes) {
            return blog;
        }
        return currentBest;
    }, blogs[0]);
};

const mostBlogs = (blogs) => {
    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1;
        return counts;
    }, {});

    // Find author with max blogs
    let topAuthor = null;
    let maxBlogs = 0;
    for (const [author, count] of Object.entries(authorCounts)) {
        if (count > maxBlogs) {
            topAuthor = author;
            maxBlogs = count;
        }
    }

    return { author: topAuthor, blogs: maxBlogs };
};

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
};

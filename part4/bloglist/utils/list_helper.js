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

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
};
